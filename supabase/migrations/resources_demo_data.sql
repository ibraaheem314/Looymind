-- ============================================================================
-- LOOYMIND - RESSOURCES DE DÉMO (Contenu curé)
-- ============================================================================
-- Ressources externes de qualité pour démarrer la plateforme
-- Exécuter après resources_hybrid_schema.sql
-- ============================================================================

-- Vider les données existantes (si besoin)
-- DELETE FROM public.resources;

-- ============================================================================
-- RESSOURCES EXTERNES CURÉES - Machine Learning & IA
-- ============================================================================

INSERT INTO public.resources (
  title, slug, description, type, url, source, is_local,
  language, category, difficulty, is_free, has_certificate,
  duration_hours, tags, curator_notes, featured, thumbnail_url
) VALUES 

-- 1. Machine Learning Specialization (Andrew Ng)
(
  'Machine Learning Specialization',
  'ml-specialization-coursera-andrew-ng',
  'Cours de référence en Machine Learning par Andrew Ng (Stanford). Couvre les fondamentaux : régression linéaire, régression logistique, réseaux de neurones, arbres de décision. Parfait pour débuter en ML avec une approche mathématique solide et des exercices pratiques en Python.',
  'external_course',
  'https://www.coursera.org/specializations/machine-learning-introduction',
  'Coursera',
  false,
  'en',
  'machine-learning',
  'beginner',
  true,
  true,
  60,
  ARRAY['Python', 'ML', 'Andrew Ng', 'Stanford', 'Regression', 'Classification'],
  '⭐ LE meilleur cours pour débuter en ML. Très pédagogique avec des maths accessibles. Même si en anglais, les concepts sont expliqués simplement.',
  true,
  'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/images/machine-learning.png'
),

-- 2. Fast.ai - Practical Deep Learning
(
  'Practical Deep Learning for Coders',
  'fastai-practical-deep-learning',
  'Formation pratique en Deep Learning par Jeremy Howard. Approche top-down : vous construisez des modèles state-of-the-art dès le premier cours (classification d''images, NLP, etc.). Utilise PyTorch et la bibliothèque Fast.ai. Idéal pour les développeurs qui veulent passer rapidement à la pratique.',
  'external_course',
  'https://course.fast.ai/',
  'Fast.ai',
  false,
  'en',
  'deep-learning',
  'intermediate',
  true,
  false,
  40,
  ARRAY['PyTorch', 'Deep Learning', 'Computer Vision', 'NLP', 'Fast.ai'],
  '🚀 Approche très pratique et moderne. Recommandé après avoir fait du ML de base. Vous construirez de vrais projets dès le début.',
  true,
  'https://course.fast.ai/images/fast-ai-logo.png'
),

-- 3. Kaggle Learn (Micro-courses)
(
  'Kaggle Learn - Micro-Courses IA',
  'kaggle-learn-micro-courses',
  'Collection de micro-cours gratuits et pratiques sur Kaggle. Chaque cours dure 3-5h et couvre un sujet précis : Python, Pandas, ML, Deep Learning, NLP, Computer Vision, etc. Parfait pour apprendre rapidement des compétences spécifiques avec des notebooks interactifs.',
  'external_course',
  'https://www.kaggle.com/learn',
  'Kaggle',
  false,
  'en',
  'machine-learning',
  'beginner',
  true,
  true,
  20,
  ARRAY['Python', 'Pandas', 'ML', 'Kaggle', 'Notebooks', 'Pratique'],
  '💡 Idéal pour apprendre vite avec des exemples concrets. Chaque cours = 1 compétence. Certificats gratuits !',
  true,
  'https://www.kaggle.com/static/images/education/homepage-hero.png'
),

-- 4. StatQuest (Mathématiques pour ML)
(
  'StatQuest - Statistiques et ML Expliqués',
  'statquest-statistics-ml-youtube',
  'Chaîne YouTube de Josh Starmer qui explique les concepts statistiques et ML de manière visuelle et intuitive. Couvre : régression, p-values, hypothèses, arbres de décision, réseaux de neurones, etc. Parfait pour comprendre les MATHS derrière le ML sans se noyer dans les formules.',
  'video',
  'https://www.youtube.com/c/joshstarmer',
  'YouTube - StatQuest',
  false,
  'en',
  'mathematics',
  'beginner',
  true,
  false,
  50,
  ARRAY['Statistiques', 'Mathématiques', 'ML', 'Pédagogie', 'YouTube'],
  '🎓 Les meilleures explications visuelles pour comprendre les stats et ML. Même les concepts complexes deviennent simples !',
  true,
  'https://yt3.googleusercontent.com/ytc/AIdro_kWEjqEw3LQsNPj9vLt0l4q9gEz2h6xL5Q9VFGtjQ=s176-c-k-c0x00ffffff-no-rj'
),

-- ============================================================================
-- RESSOURCES - NLP & Traitement du Langage
-- ============================================================================

(
  'Hugging Face NLP Course',
  'huggingface-nlp-course',
  'Cours complet et gratuit sur le NLP moderne avec Transformers. Couvre BERT, GPT, T5, et comment les utiliser pour la classification, traduction, génération de texte, Q&A, etc. Utilise la bibliothèque Transformers de Hugging Face (la référence en NLP).',
  'external_course',
  'https://huggingface.co/learn/nlp-course',
  'Hugging Face',
  false,
  'en',
  'nlp',
  'intermediate',
  true,
  false,
  30,
  ARRAY['NLP', 'Transformers', 'BERT', 'GPT', 'Hugging Face', 'PyTorch'],
  '🤗 LA référence pour le NLP moderne. Gratuit, à jour, et très pratique. Parfait pour travailler sur des langues africaines aussi.',
  true,
  'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/course/en/chapter1/section1/thumbnail.png'
),

-- ============================================================================
-- RESSOURCES - Data Science & Python
-- ============================================================================

(
  'Python for Data Science (freeCodeCamp)',
  'python-data-science-freecodecamp',
  'Cours complet de 12 heures sur Python pour la Data Science. Couvre NumPy, Pandas, Matplotlib, Seaborn, et introduction au ML avec Scikit-learn. Format vidéo YouTube avec exercices pratiques. Parfait pour débutants complets.',
  'video',
  'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
  'YouTube - freeCodeCamp',
  false,
  'en',
  'python',
  'beginner',
  true,
  false,
  12,
  ARRAY['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Data Science'],
  '📊 Cours complet et gratuit pour maîtriser Python pour la data. Parfait si vous débutez en programmation.',
  false,
  'https://i.ytimg.com/vi/LHBE6Q9XlzI/maxresdefault.jpg'
),

(
  'Kaggle - Intro to Programming',
  'kaggle-intro-programming',
  'Micro-cours interactif pour apprendre les bases de Python. Couvre : variables, fonctions, listes, boucles, dictionnaires. Parfait si vous n''avez jamais programmé. Exercices dans des notebooks Kaggle.',
  'external_course',
  'https://www.kaggle.com/learn/intro-to-programming',
  'Kaggle',
  false,
  'en',
  'python',
  'beginner',
  true,
  true,
  5,
  ARRAY['Python', 'Débutant', 'Programmation', 'Kaggle'],
  '🐍 Si vous n''avez jamais codé, commencez ici ! 5 heures pour apprendre Python de zéro.',
  false,
  null
),

-- ============================================================================
-- RESSOURCES - Computer Vision
-- ============================================================================

(
  'CS231n: Convolutional Neural Networks (Stanford)',
  'cs231n-stanford-cnn',
  'Cours légendaire de Stanford sur les réseaux de neurones convolutifs (CNN) pour la vision par ordinateur. Couvre : convolution, pooling, architectures (ResNet, VGG), détection d''objets, segmentation. Notes de cours + vidéos + assignments en Python.',
  'external_course',
  'http://cs231n.stanford.edu/',
  'Stanford University',
  false,
  'en',
  'computer-vision',
  'advanced',
  true,
  false,
  40,
  ARRAY['CNN', 'Computer Vision', 'Deep Learning', 'Stanford', 'PyTorch'],
  '🎓 Cours académique de très haut niveau. Pour ceux qui veulent vraiment comprendre les CNN en profondeur.',
  false,
  'http://cs231n.stanford.edu/assets/img/logo.png'
),

-- ============================================================================
-- RESSOURCES - Outils & Documentation
-- ============================================================================

(
  'Scikit-learn Documentation',
  'scikit-learn-documentation',
  'Documentation officielle de Scikit-learn, LA bibliothèque Python pour le Machine Learning classique. Tutoriels, guides, API reference. Indispensable pour tout data scientist. Très bien organisée avec des exemples de code.',
  'documentation',
  'https://scikit-learn.org/stable/',
  'Scikit-learn',
  false,
  'en',
  'machine-learning',
  'intermediate',
  true,
  false,
  null,
  ARRAY['Scikit-learn', 'Python', 'ML', 'Documentation', 'API'],
  '📚 Documentation de référence pour le ML en Python. À garder sous la main !',
  false,
  'https://scikit-learn.org/stable/_static/scikit-learn-logo-small.png'
),

(
  'PyTorch Tutorials',
  'pytorch-tutorials-official',
  'Tutoriels officiels de PyTorch pour le Deep Learning. Couvre : tensors, autograd, CNN, RNN, Transformers, deployment. Format notebooks + explications détaillées. Parfait pour apprendre PyTorch de zéro ou approfondir.',
  'tutorial',
  'https://pytorch.org/tutorials/',
  'PyTorch',
  false,
  'en',
  'deep-learning',
  'intermediate',
  true,
  false,
  20,
  ARRAY['PyTorch', 'Deep Learning', 'Tutoriels', 'Python'],
  '🔥 Pour maîtriser PyTorch, framework le plus utilisé en recherche IA.',
  false,
  'https://pytorch.org/assets/images/pytorch-logo.png'
),

-- ============================================================================
-- RESSOURCES - Big Data & Cloud
-- ============================================================================

(
  'Google Cloud Skills Boost (IA & ML)',
  'google-cloud-skills-boost-ml',
  'Formations gratuites de Google Cloud sur le ML et l''IA en production. Couvre : BigQuery ML, Vertex AI, AutoML, TensorFlow sur GCP. Inclut labs pratiques avec crédits gratuits. Idéal pour déployer vos modèles ML en production.',
  'external_course',
  'https://www.cloudskillsboost.google/paths',
  'Google Cloud',
  false,
  'en',
  'cloud',
  'intermediate',
  true,
  true,
  15,
  ARRAY['Cloud', 'GCP', 'ML en prod', 'BigQuery', 'Vertex AI'],
  '☁️ Pour passer du notebook au vrai déploiement ML en production.',
  false,
  null
);

-- ============================================================================
-- FIN DES DONNÉES DE DÉMO
-- ============================================================================

-- Vérifier les ressources ajoutées
-- SELECT title, source, is_local, category, difficulty FROM public.resources ORDER BY created_at DESC;

