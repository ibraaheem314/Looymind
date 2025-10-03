'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Brain, ChevronDown, User, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const { user, profile, isAuthenticated, signOut } = useAuth()
  const displayName = profile?.display_name || user?.email || 'Compte utilisateur'
  const initials = (profile?.display_name || user?.email || 'Utilisateur')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)

  const navigation = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Compétitions', 
      href: '/competitions'
    },
    { 
      name: 'Communauté', 
      href: '/talents',
      submenu: [
        { name: 'Talents', href: '/talents' },
        { name: 'Projets', href: '/projects' },
        { name: 'Articles', href: '/articles' },
      ]
    },
    { 
      name: 'Ressources', 
      href: '/resources'
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="w-14 h-14 transition-all duration-200 group-hover:scale-105">
              <img 
                src="/Logo.png" 
                alt="LooyMind Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block tracking-tight">
              LooyMind
            </span>
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
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors duration-200">
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    
                    {activeDropdown === item.name && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-[100]"
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
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors cursor-pointer"
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
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors duration-200"
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  className="flex items-center gap-3 px-3 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-sm font-medium text-white">
                    {initials.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-700 leading-tight">
                    {displayName}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-xl z-[120] overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Brain className="h-4 w-4" />
                        Dashboard
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link
                          href="/admin/moderation"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4" />
                          Modération
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false)
                          await signOut()
                          window.location.href = '/'
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
               <Link href="/login">
                 Sign in
               </Link>
             </Button>
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-md" asChild>
               <Link href="/register">
                 Join
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
          <div className="md:hidden border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                <Link
                  href={item.href}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 block px-3 py-2 text-base font-medium rounded-md"
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
                          className="text-slate-500 hover:text-cyan-600 hover:bg-slate-50 block px-3 py-1 text-sm rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-3 border-t border-slate-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="px-3">
                      <p className="text-sm font-semibold text-slate-700">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="flex flex-col space-y-2 px-3">
                      <Button variant="outline" size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                        <Link href="/profile">Profil</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      {profile?.role === 'admin' && (
                        <Button variant="outline" size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                          <Link href="/admin/moderation">Modération</Link>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          setIsMenuOpen(false)
                          await signOut()
                          window.location.href = '/'
                        }}
                      >
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                ) : (
                   <div className="flex items-center px-3 space-x-3">
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                       <Link href="/login">
                         Sign in
                       </Link>
                     </Button>
                    <Button size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white shadow-md" asChild>
                       <Link href="/register">
                         Join
                       </Link>
                     </Button>
                   </div>
                )}
                 </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
