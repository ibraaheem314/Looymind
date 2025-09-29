import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        available: false, 
        error: 'Email invalide' 
      }, { status: 400 })
    }

    // TEMPORAIRE : Désactiver la vérification pour éviter les boucles
    // La vérification sera faite côté Supabase Auth directement
    return NextResponse.json({ 
      available: true, 
      message: 'Email disponible' 
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      available: false, 
      error: 'Erreur serveur' 
    }, { status: 500 })
  }
}
