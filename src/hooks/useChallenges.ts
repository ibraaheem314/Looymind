'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  status: 'en_cours' | 'termine' | 'bientot'
  prize_xof: number
  participants: number
  deadline: string
  created_at: string
  updated_at: string
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const supabase = createClient()
        
        // Pour l'instant, on utilise des données mockées
        // TODO: Remplacer par une vraie requête Supabase
        const mockChallenges: Challenge[] = [
          {
            id: '1',
            title: 'Classification d\'Images Agricoles',
            description: 'Développez un modèle de classification pour identifier les maladies des cultures au Sénégal.',
            difficulty: 'intermediaire',
            status: 'en_cours',
            prize_xof: 500000,
            participants: 45,
            deadline: '2024-03-15',
            created_at: '2024-01-15',
            updated_at: '2024-01-15'
          },
          {
            id: '2',
            title: 'Prédiction des Prix Agricoles',
            description: 'Créez un modèle prédictif pour les prix des produits agricoles sénégalais.',
            difficulty: 'avance',
            status: 'en_cours',
            prize_xof: 750000,
            participants: 32,
            deadline: '2024-04-20',
            created_at: '2024-01-10',
            updated_at: '2024-01-10'
          },
          {
            id: '3',
            title: 'Analyse de Sentiment en Wolof',
            description: 'Développez un modèle NLP pour analyser les sentiments dans des textes en wolof.',
            difficulty: 'debutant',
            status: 'bientot',
            prize_xof: 300000,
            participants: 0,
            deadline: '2024-05-01',
            created_at: '2024-01-20',
            updated_at: '2024-01-20'
          }
        ]

        setChallenges(mockChallenges)
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des défis')
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  return { challenges, loading, error }
}