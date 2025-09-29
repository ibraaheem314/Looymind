'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Brain, ChevronDown, User, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const { user, profile, isAuthenticated, signOut } = useAuth()

  const navigation = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Défis', 
      href: '/challenges',
      submenu: [
        { name: 'Tous les défis', href: '/challenges' },
        { name: 'Défis actifs', href: '/challenges?status=active' },
        { name: 'Mes participations', href: '/challenges?my=participations' },
      ]
    },
    { 
      name: 'Communauté', 
      href: '/talents',
      submenu: [
        { name: 'Talents', href: '/talents' },
        { name: 'Projets', href: '/projects' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Articles', href: '/articles' },
      ]
    },
    { 
      name: 'Ressources', 
      href: '/resources',
      submenu: [
        { name: 'Toutes les ressources', href: '/resources' },
        { name: 'Formations', href: '/resources?type=course' },
        { name: 'Outils', href: '/resources?type=tool' },
        { name: 'Datasets', href: '/resources?type=dataset' },
      ]
    },
    { 
      name: 'Opportunités', 
      href: '/opportunities',
      submenu: [
        { name: 'Toutes les opportunités', href: '/opportunities' },
        { name: 'Emplois', href: '/opportunities?type=job' },
        { name: 'Stages', href: '/opportunities?type=internship' },
        { name: 'Formations', href: '/opportunities?type=training' },
      ]
    },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="w-16 h-16 group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/Logo.png" 
                alt="Looymind Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeout) {
                        clearTimeout(dropdownTimeout)
                        setDropdownTimeout(null)
                      }
                      setActiveDropdown(item.name)
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => {
                        setActiveDropdown(null)
                      }, 150)
                      setDropdownTimeout(timeout)
                    }}
                  >
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 h-8">
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    
                    {activeDropdown === item.name && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-[100]"
                        onMouseEnter={() => {
                          if (dropdownTimeout) {
                            clearTimeout(dropdownTimeout)
                            setDropdownTimeout(null)
                          }
                          setActiveDropdown(item.name)
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => {
                            setActiveDropdown(null)
                          }, 150)
                          setDropdownTimeout(timeout)
                        }}
                      >
                        <div className="py-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 h-8"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {profile?.display_name || user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-8" asChild>
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
                {(profile?.role === 'admin' || profile?.role === 'moderator') && (
                  <Button variant="ghost" size="sm" className="h-8" asChild>
                    <Link href="/admin/moderation">
                      <Shield className="mr-2 h-4 w-4" />
                      Modération
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-8" asChild>
                  <Link href="/login">
                    Connexion
                  </Link>
                </Button>
                <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white shadow-md h-8" asChild>
                  <Link href="/register">
                    S'inscrire
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block px-3 py-1 text-sm rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-100">
                <div className="flex items-center px-3 space-x-3">
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <Link href="/login">
                      Connexion
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white shadow-md" asChild>
                    <Link href="/register">
                      S'inscrire
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}