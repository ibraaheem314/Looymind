import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      email,
      full_name,
      first_name,
      last_name,
      display_name,
      bio,
      github_url,
      linkedin_url,
      website_url,
      phone,
      location,
      current_position,
      company,
      experience_level,
      skills,
      interests,
      role
    } = body

    // Créer le client Supabase avec Service Role (contourne RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Insérer le profil
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user_id,
        email,
        full_name,
        first_name,
        last_name,
        display_name,
        bio,
        github_url,
        linkedin_url,
        website_url,
        phone,
        location,
        current_position,
        company,
        experience_level,
        skills,
        interests,
        role
      })
      .select()

    if (error) {
      console.error('🚨 PROFILE CREATION ERROR:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('✅ PROFILE CREATED SUCCESSFULLY:', data)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('🚨 API ERROR:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
