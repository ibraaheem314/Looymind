'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'archived'
  github_url?: string
  demo_url?: string
  tags: string[]
  contributors_count: number
  stars_count: number
  forks_count: number
  created_at: string
  updated_at: string
  author: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        
        // Données mockées en attendant la création des tables Supabase
        const mockProjects: Project[] = [
          {
            id: '1',
            title: 'AgriPredict - IA pour l\'Agriculture',
            description: 'Plateforme d\'IA pour prédire les rendements agricoles et optimiser les cultures au Sénégal.',
            category: 'IA & Machine Learning',
            status: 'active',
            github_url: 'https://github.com/agripredict/senegal',
            demo_url: 'https://agripredict.sn',
            tags: ['Python', 'TensorFlow', 'Agriculture', 'OpenCV'],
            contributors_count: 8,
            stars_count: 45,
            forks_count: 12,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-20T14:30:00Z',
            author: {
              id: 'user1',
              display_name: 'Dr. Aminata Diallo',
              avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150'
            }
          },
          {
            id: '2',
            title: 'WolofNLP - Traitement du Langage Naturel',
            description: 'Bibliothèque Python pour le traitement automatique du langage wolof.',
            category: 'Data Science',
            status: 'active',
            github_url: 'https://github.com/wolofnlp/core',
            tags: ['Python', 'NLP', 'Wolof', 'spaCy'],
            contributors_count: 5,
            stars_count: 23,
            forks_count: 7,
            created_at: '2024-01-10T09:15:00Z',
            updated_at: '2024-01-18T11:20:00Z',
            author: {
              id: 'user2',
              display_name: 'Prof. Moussa Ndiaye',
              avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
            }
          },
          {
            id: '3',
            title: 'DakarTraffic - Optimisation du Trafic',
            description: 'Application mobile pour optimiser les déplacements dans Dakar avec l\'IA.',
            category: 'Mobile Development',
            status: 'active',
            github_url: 'https://github.com/dakartraffic/app',
            demo_url: 'https://dakartraffic.sn',
            tags: ['React Native', 'Node.js', 'MongoDB', 'IA'],
            contributors_count: 12,
            stars_count: 67,
            forks_count: 18,
            created_at: '2024-01-05T16:45:00Z',
            updated_at: '2024-01-22T08:10:00Z',
            author: {
              id: 'user3',
              display_name: 'Fatou Sall',
              avatar_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150'
            }
          },
          {
            id: '4',
            title: 'SenegalData - Open Data Platform',
            description: 'Plateforme open source pour centraliser les données publiques du Sénégal.',
            category: 'Web Development',
            status: 'active',
            github_url: 'https://github.com/senegaldataportal/platform',
            demo_url: 'https://data.senegal.gov.sn',
            tags: ['Next.js', 'PostgreSQL', 'D3.js', 'Open Data'],
            contributors_count: 15,
            stars_count: 89,
            forks_count: 25,
            created_at: '2024-01-01T12:00:00Z',
            updated_at: '2024-01-25T10:15:00Z',
            author: {
              id: 'user4',
              display_name: 'Cheikh Anta Diop',
              avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
            }
          },
          {
            id: '5',
            title: 'MedAI - Diagnostic Médical Assisté',
            description: 'Système d\'IA pour assister les médecins dans le diagnostic de maladies tropicales.',
            category: 'IA & Machine Learning',
            status: 'active',
            github_url: 'https://github.com/medai-senegal/diagnostic',
            tags: ['Python', 'PyTorch', 'Medical AI', 'Computer Vision'],
            contributors_count: 6,
            stars_count: 34,
            forks_count: 9,
            created_at: '2023-12-28T14:20:00Z',
            updated_at: '2024-01-19T16:45:00Z',
            author: {
              id: 'user5',
              display_name: 'Dr. Khadija Ba',
              avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150'
            }
          }
        ]

        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setProjects(mockProjects)
      } catch (err) {
        setError('Erreur lors du chargement des projets')
        console.error('Error loading projects:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return { projects, loading, error }
}