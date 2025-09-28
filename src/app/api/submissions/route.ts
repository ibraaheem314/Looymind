import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const challengeId = formData.get('challengeId') as string

    if (!file || !challengeId) {
      return NextResponse.json({ error: 'Fichier et ID du défi requis' }, { status: 400 })
    }

    // Valider le fichier
    if (file.type !== 'text/csv') {
      return NextResponse.json({ error: 'Seuls les fichiers CSV sont acceptés' }, { status: 400 })
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB max
      return NextResponse.json({ error: 'Fichier trop volumineux (max 20MB)' }, { status: 400 })
    }

    // Vérifier que le défi existe et est actif
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id, status, ends_at')
      .eq('id', challengeId)
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'Défi non trouvé' }, { status: 404 })
    }

    if (challenge.status !== 'en_cours') {
      return NextResponse.json({ error: 'Ce défi n\'est pas actif' }, { status: 400 })
    }

    if (new Date(challenge.ends_at) < new Date()) {
      return NextResponse.json({ error: 'Ce défi est terminé' }, { status: 400 })
    }

    // Vérifier le rate limiting (5 soumissions par jour)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: recentSubmissions, error: countError } = await supabase
      .from('submissions')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .gte('created_at', yesterday.toISOString())

    if (countError) {
      console.error('Error checking submissions count:', countError)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    if (recentSubmissions && recentSubmissions.length >= 5) {
      return NextResponse.json({ 
        error: 'Limite de 5 soumissions par jour atteinte' 
      }, { status: 429 })
    }

    // Upload du fichier vers Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `submissions/${challengeId}/${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(filePath, file, {
        contentType: 'text/csv',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
    }

    // Créer l'entrée en base de données
    const { data: submission, error: dbError } = await supabase
      .from('submissions')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        file_url: filePath,
        status: 'pending'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Supprimer le fichier uploadé en cas d'erreur DB
      await supabase.storage.from('submissions').remove([filePath])
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      submission: {
        id: submission.id,
        status: submission.status,
        created_at: submission.created_at
      }
    })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const challengeId = searchParams.get('challengeId')

    let query = supabase
      .from('submissions')
      .select(`
        *,
        challenges (
          title,
          slug
        ),
        profiles (
          display_name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (challengeId) {
      query = query.eq('challenge_id', challengeId)
    }

    const { data: submissions, error } = await query

    if (error) {
      console.error('Error fetching submissions:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
    }

    return NextResponse.json({ submissions })

  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
