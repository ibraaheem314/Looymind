import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

type EventType = 'view' | 'click' | 'like' | 'bookmark' | 'complete' | 'rating' | 'bounce'

/**
 * POST /api/events
 * 
 * Enregistre un événement utilisateur (interaction avec une ressource)
 * 
 * Body:
 * {
 *   user_id: string (UUID)
 *   resource_id: string (UUID)
 *   event: 'view' | 'click' | 'like' | 'bookmark' | 'complete' | 'rating' | 'bounce'
 *   value?: number (optionnel: dwell_time en sec, rating 1-5, etc.)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, resource_id, event, value } = body

    // Validation
    if (!user_id || !resource_id || !event) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, resource_id, event' },
        { status: 400 }
      )
    }

    const validEvents: EventType[] = ['view', 'click', 'like', 'bookmark', 'complete', 'rating', 'bounce']
    if (!validEvents.includes(event)) {
      return NextResponse.json(
        { error: `Invalid event type. Must be one of: ${validEvents.join(', ')}` },
        { status: 400 }
      )
    }

    // Validation spécifique rating
    if (event === 'rating' && (value === undefined || value < 1 || value > 5)) {
      return NextResponse.json(
        { error: 'Rating event requires value between 1 and 5' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Vérifier que l'utilisateur authentifié correspond
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== user_id) {
      return NextResponse.json(
        { error: 'Unauthorized: user_id mismatch' },
        { status: 401 }
      )
    }

    // Insérer l'événement
    const { data, error } = await supabase
      .from('interactions')
      .insert({
        user_id,
        resource_id,
        event,
        value: value || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting interaction:', error)
      return NextResponse.json(
        { error: 'Failed to record event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, interaction: data }, { status: 201 })

  } catch (error: any) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


/**
 * GET /api/events
 * 
 * Récupère les événements d'un utilisateur (pour historique/stats)
 * Query params:
 *  - user_id (optionnel): UUID
 *  - resource_id (optionnel): UUID
 *  - event (optionnel): type d'événement
 *  - limit (optionnel): nombre de résultats (défaut: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const resourceId = searchParams.get('resource_id')
    const eventType = searchParams.get('event')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const supabase = createClient()

    // Vérifier authentification
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur ne demande que ses propres données (sauf admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    if (userId && userId !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: cannot access other users data' },
        { status: 403 }
      )
    }

    // Construire la requête
    let query = supabase
      .from('interactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filtres
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      // Par défaut, ses propres interactions
      query = query.eq('user_id', user.id)
    }

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    if (eventType) {
      query = query.eq('event', eventType)
    }

    const { data: interactions, error } = await query

    if (error) {
      console.error('Error fetching interactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events: interactions || [] })

  } catch (error: any) {
    console.error('Events GET API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

