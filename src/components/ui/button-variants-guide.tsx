/**
 * GUIDE D'UTILISATION DES BOUTONS PALANTEER
 * 
 * Ce fichier documente les variants de boutons disponibles
 * et fournit des exemples d'utilisation.
 * 
 * Ne pas importer ce fichier - utiliser directement les classes CSS
 */

// ============================================
// BOUTONS PRIMAIRES (Actions principales)
// ============================================

// Bouton principal - Gradient cyan-bleu
// Usage: CTA principal, inscription, actions primaires
// <Button className="btn-primary text-lg px-10 py-6 group">

// Bouton inversé - Fond blanc sur fond coloré
// Usage: CTA sur fond coloré (bande organisations)
// <Button className="btn-inverse text-lg px-10 py-6 group">

// Bouton brand - Couleur brand Palanteer (#2d5986)
// Usage: CTA final, actions brand
// <Button className="btn-brand text-lg px-10 py-7 group">


// ============================================
// BOUTONS SECONDAIRES (Actions importantes)
// ============================================

// Bouton secondaire (fond clair)
// Usage: Liens importants sur fond clair
// <Button className="btn-secondary text-lg px-10 py-6 group">

// Bouton secondaire (fond sombre)
// Usage: Liens importants sur fond sombre (Hero)
// <Button className="btn-secondary-dark text-lg px-10 py-6 group">


// ============================================
// BOUTONS TERTIAIRES (Actions secondaires)
// ============================================

// Bouton tertiaire (fond clair)
// Usage: Liens secondaires sur fond clair
// <Button className="btn-tertiary text-lg px-10 py-6 group">

// Bouton tertiaire (fond sombre)
// Usage: Liens secondaires sur fond sombre (Hero)
// <Button className="btn-tertiary-dark text-lg px-10 py-6 group">


// ============================================
// CLASSES UTILITAIRES
// ============================================

// Animation d'icônes
// <Zap className="h-5 w-5 mr-2 btn-primary-icon" />

// Animation de flèche
// <Button className="btn-primary btn-arrow-slide group">
//   <span className="relative z-10 flex items-center">
//     Texte
//     <ArrowRight className="h-5 w-5 ml-2 arrow" />
//   </span>
// </Button>

// Overlay gradient
// <Button className="btn-primary btn-arrow-slide group">
//   <span className="relative z-10">...</span>
//   <div className="btn-overlay" aria-hidden="true" />
// </Button>


// ============================================
// EXEMPLES COMPLETS
// ============================================

export const ButtonExamples = () => {
  return (
    <>
      {/* HERO - Fond sombre */}
      <section className="bg-slate-900">
        {/* Bouton principal */}
        <button className="btn-primary text-lg px-10 py-6 group">
          Commencer gratuitement
        </button>

        {/* Bouton secondaire */}
        <button className="btn-secondary-dark text-lg px-10 py-6 group">
          Voir les compétitions
        </button>

        {/* Bouton tertiaire */}
        <button className="btn-tertiary-dark text-lg px-10 py-6 group">
          Tutoriels gratuits
        </button>
      </section>

      {/* SECTION NORMALE - Fond clair */}
      <section className="bg-white">
        {/* Bouton principal */}
        <button className="btn-primary text-lg px-10 py-6 group">
          Créer mon compte gratuit
        </button>

        {/* Bouton secondaire */}
        <button className="btn-secondary text-lg px-10 py-6 group">
          Voir toutes les compétitions
        </button>

        {/* Bouton tertiaire */}
        <button className="btn-tertiary text-lg px-10 py-6 group">
          S'abonner à la Newsletter
        </button>
      </section>

      {/* BANDE COLORÉE */}
      <section className="bg-[#2d5986]">
        {/* Bouton inversé */}
        <button className="btn-inverse text-lg px-10 py-6 group">
          Lancer une compétition
        </button>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-50">
        {/* Bouton brand */}
        <button className="btn-brand text-lg px-10 py-7 group">
          Commencer Gratuitement
        </button>

        {/* Bouton tertiaire */}
        <button className="btn-tertiary text-lg px-10 py-7 group">
          Explorer les compétitions
        </button>
      </section>
    </>
  )
}

// ============================================
// RÈGLES DE HIÉRARCHIE
// ============================================

/**
 * NIVEAU 1 - Action Primaire
 * - .btn-primary : Inscription, CTA principal
 * - .btn-inverse : CTA sur fond coloré
 * - .btn-brand : CTA avec couleur brand
 * 
 * NIVEAU 2 - Action Secondaire
 * - .btn-secondary : Liens importants (fond clair)
 * - .btn-secondary-dark : Liens importants (fond sombre)
 * 
 * NIVEAU 3 - Action Tertiaire
 * - .btn-tertiary : Liens secondaires (fond clair)
 * - .btn-tertiary-dark : Liens secondaires (fond sombre)
 */

// ============================================
// TAILLES RECOMMANDÉES
// ============================================

/**
 * HERO SECTION
 * - text-lg px-10 py-6
 * 
 * SECTIONS NORMALES
 * - text-lg px-10 py-6
 * 
 * CTA FINAL
 * - text-lg px-10 py-7 (légèrement plus grand)
 * 
 * MOBILE
 * - Conserver les mêmes tailles, Tailwind gère la responsivité
 */

export default ButtonExamples

