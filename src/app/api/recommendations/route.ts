import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

type RecommendationItem = {
  id: string
  title: string
  url: string
  description: string | null
  level: string | null
  domains: string[]
  duration_minutes: number | null
  lang: string | null
  published_at: string | null
  quality_score: number
  source: string | null
  why: string
}

/**
 * GET /api/recommendations
 * 
 * Retourne des recommandations rule-based pour un utilisateur
 * Query params:
 *  - user_id (optionnel): UUID de l'utilisateur
 *  - limit (optionnel): nombre de résultats (défaut: 10)
 * 
 * Si user_id fourni: utilise profil (level, goals, langs, time_per_week)
 * Sinon: retourne top ressources par qualité/récence
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const supabase = createClient()

    // 1) Récupérer le profil utilisateur si user_id fourni
    let userProfile: any = null
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('level, goals, langs, time_per_week')
        .eq('id', userId)
        .single()
      
      userProfile = profile
    }

    // 2) Construire la requête de base
    let query = supabase
      .from('resources')
      .select('id, title, url, description, level, domains, duration_minutes, lang, published_at, quality_score, source')
      .order('quality_score', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit * 3) // Récupérer plus pour filtrer ensuite

    // 3) Appliquer filtres si profil disponible
    if (userProfile) {
      const { level, langs, time_per_week } = userProfile

      // Filtre langue
      if (langs && langs.length > 0) {
        // Accepter FR, EN ou Both
        const langFilter = [...langs, 'Both']
        query = query.in('lang', langFilter)
      }

      // Filtre niveau (accepter niveau -1, égal, +1)
      if (level) {
        const levelMap: Record<string, string[]> = {
          'Beginner': ['Beginner', 'Intermediate'],
          'Intermediate': ['Beginner', 'Intermediate', 'Advanced'],
          'Advanced': ['Intermediate', 'Advanced']
        }
        const acceptedLevels = levelMap[level] || ['Beginner', 'Intermediate', 'Advanced']
        query = query.in('level', acceptedLevels)
      }

      // Filtre durée (heuristique simple)
      if (time_per_week && time_per_week < 5) {
        // Si peu de temps, privilégier contenus courts
        query = query.lte('duration_minutes', 180) // ≤ 3h
      }
    }

    // 4) Exécuter la requête
    const { data: resources, error } = await query

    if (error) {
      console.error('Error fetching recommendations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      )
    }

    if (!resources || resources.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // 5) Scoring & rerank
    const scored = resources.map((resource: any) => {
      let score = 0
      let reasons: string[] = []

      // Qualité de base (35%)
      score += (resource.quality_score || 0) * 0.35

      // Récence (20%)
      const monthsOld = resource.published_at
        ? Math.floor((Date.now() - new Date(resource.published_at).getTime()) / (1000 * 60 * 60 * 24 * 30))
        : 999
      let recencyScore = 0
      if (monthsOld < 6) {
        recencyScore = 1.0
        reasons.push('récent (< 6 mois)')
      } else if (monthsOld < 18) {
        recencyScore = 0.5
        reasons.push('assez récent')
      } else {
        recencyScore = 0.2
      }
      score += recencyScore * 0.20

      // Alignement niveau (15%)
      if (userProfile?.level && resource.level) {
        if (userProfile.level === resource.level) {
          score += 0.15
          reasons.push(`niveau ${resource.level}`)
        } else if (
          (userProfile.level === 'Beginner' && resource.level === 'Intermediate') ||
          (userProfile.level === 'Intermediate' && ['Beginner', 'Advanced'].includes(resource.level)) ||
          (userProfile.level === 'Advanced' && resource.level === 'Intermediate')
        ) {
          score += 0.10
        } else {
          score += 0.03
        }
      }

      // Alignement domaines/goals (20%)
      if (userProfile?.goals && resource.domains) {
        const intersection = resource.domains.filter((d: string) =>
          userProfile.goals.some((g: string) => g.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(g.toLowerCase()))
        )
        if (intersection.length > 0) {
          score += 0.20
          reasons.push(`aligné avec ${intersection.slice(0, 2).join(', ')}`)
        }
      }

      // Langue préférée (10%)
      if (userProfile?.langs && resource.lang) {
        if (userProfile.langs.includes(resource.lang) || resource.lang === 'Both') {
          score += 0.10
          reasons.push(resource.lang === 'FR' ? 'en français' : 'en anglais')
        }
      }

      // Construire le "why"
      const why = reasons.length > 0
        ? `Recommandé car: ${reasons.join(', ')}.`
        : 'Ressource de qualité, récente et pertinente.'

      return {
        ...resource,
        _score: score,
        why
      }
    })

    // 6) Tri final par score
    scored.sort((a, b) => b._score - a._score)

    // 7) Appliquer diversité simple (MMR léger)
    const final: RecommendationItem[] = []
    const selectedDomains = new Set<string>()

    for (const item of scored) {
      if (final.length >= limit) break

      // Si les domaines sont déjà bien représentés, passer
      const itemDomains = item.domains || []
      const alreadyHas = itemDomains.some(d => selectedDomains.has(d))
      
      if (final.length < 3 || !alreadyHas || final.length >= limit - 2) {
        final.push({
          id: item.id,
          title: item.title,
          url: item.url,
          description: item.description,
          level: item.level,
          domains: item.domains || [],
          duration_minutes: item.duration_minutes,
          lang: item.lang,
          published_at: item.published_at,
          quality_score: item.quality_score || 0,
          source: item.source,
          why: item.why
        })

        // Marquer domaines utilisés
        itemDomains.forEach((d: string) => selectedDomains.add(d))
      }
    }

    return NextResponse.json({ items: final })

  } catch (error: any) {
    console.error('Recommendations API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

