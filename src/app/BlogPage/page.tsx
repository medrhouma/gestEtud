'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';

// Définir les polices (cohérent avec votre HomePage)
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Données d'exemple pour les articles de blog
const BLOG_POSTS = [
  {
    id: 1,
    title: "Les tendances de l'éducation en ligne en 2025",
    excerpt: "Découvrez comment l'intelligence artificielle, la réalité virtuelle et l'apprentissage personnalisé transforment l'éducation en ligne.",
    image: "/a.webp",
    category: "Tendances",
    author: "Marie Laurent",
    authorAvatar: "/bbbb.jpeg",
    date: "15 avril 2025",
    readTime: "6 min",
    featured: true,
    content: `
      <p>L'éducation en ligne continue d'évoluer à un rythme rapide, intégrant des technologies de pointe et des méthodologies d'apprentissage innovantes. Dans cet article, nous explorons les tendances qui façonnent le paysage éducatif numérique en 2025.</p>
      
      <h2>L'intelligence artificielle personnalise l'apprentissage</h2>
      <p>Les systèmes d'IA adaptative analysent désormais les performances, les préférences et les styles d'apprentissage des étudiants pour créer des parcours véritablement personnalisés. Ces systèmes peuvent identifier les lacunes dans les connaissances et ajuster le contenu en temps réel pour maximiser l'engagement et la rétention.</p>
      
      <h2>La réalité virtuelle et augmentée transforme l'expérience d'apprentissage</h2>
      <p>Les technologies immersives sont devenues plus accessibles et plus répandues dans les plateformes éducatives. Les étudiants peuvent maintenant explorer des environnements 3D, manipuler des objets virtuels et participer à des simulations réalistes qui renforcent la compréhension des concepts complexes.</p>
      
      <h2>L'apprentissage basé sur les compétences gagne du terrain</h2>
      <p>Les programmes éducatifs se concentrent de plus en plus sur l'acquisition de compétences plutôt que sur l'accumulation de connaissances théoriques. Cette approche permet aux étudiants de démontrer leur maîtrise de compétences spécifiques et de progresser à leur propre rythme.</p>
      
      <h2>Les micro-certifications offrent une flexibilité accrue</h2>
      <p>Les apprenants cherchent des formations plus courtes et plus ciblées qui peuvent être complétées en quelques semaines plutôt qu'en années. Ces micro-certifications permettent une acquisition rapide de compétences pertinentes pour le marché du travail en constante évolution.</p>
      
      <h2>Conclusion</h2>
      <p>L'avenir de l'éducation en ligne est prometteur, avec des innovations technologiques qui continuent d'améliorer l'expérience d'apprentissage et de rendre l'éducation plus accessible et plus efficace. En restant informé de ces tendances, les apprenants peuvent tirer le meilleur parti des opportunités éducatives disponibles.</p>
    `
  },
  {
    id: 2,
    title: "5 conseils pour réussir un cours en ligne",
    excerpt: "Maximisez votre apprentissage avec ces stratégies efficaces pour suivre et compléter vos formations à distance.",
    image: "/aa.jpeg",
    category: "Conseils",
    author: "Thomas Dubois",
    authorAvatar: "/b.jpeg",
    date: "10 avril 2025",
    readTime: "4 min",
    featured: false,
    content: "Contenu détaillé de l'article..."
  },
  {
    id: 3,
    title: "Comment se préparer aux certifications IT en 3 mois",
    excerpt: "Un guide étape par étape pour obtenir vos certifications techniques dans un délai serré mais réaliste.",
    image: "/aaa.jpeg",
    category: "Certifications",
    author: "Sophie Martin",
    authorAvatar: "/bb.jpeg",
    date: "5 avril 2025",
    readTime: "8 min",
    featured: false,
    content: "Contenu détaillé de l'article..."
  },
  {
    id: 4,
    title: "Les compétences les plus recherchées par les recruteurs en 2025",
    excerpt: "Découvrez quelles sont les compétences techniques et humaines qui font la différence sur le marché du travail actuel.",
    image: "/aaaa.png",
    category: "Carrière",
    author: "Lucas Moreau",
    authorAvatar: "/bbb.jpeg",
    date: "1 avril 2025",
    readTime: "5 min",
    featured: false,
    content: "Contenu détaillé de l'article..."
  }
];

// Composant pour les catégories du blog
const BlogCategories = ({ categories, activeCategory, setActiveCategory }: { categories: string[]; activeCategory: string; setActiveCategory: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Catégories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === "Tous" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveCategory("Tous")}
        >
          Tous
        </button>
        {categories.map((category: string) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// Composant pour un article en vedette
const FeaturedPost = ({ post }: { post: BlogPost }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-xl overflow-hidden mb-12">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium mb-4">
            {post.category}
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
          <p className="text-gray-600 mb-6">{post.excerpt}</p>
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-gray-800 font-medium">{post.author}</p>
              <p className="text-gray-500 text-sm">{post.date} · {post.readTime} de lecture</p>
            </div>
          </div>
          <Link href={`/blog/${post.id}`}>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Lire l'article
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Composant pour un article de blog standard
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  featured: boolean;
  content: string;
}

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-700 text-sm">{post.author}</p>
          </div>
          <div className="text-gray-500 text-sm">{post.readTime} de lecture</div>
        </div>
        <Link href={`/blog/${post.id}`}>
          <button className="w-full px-4 py-2 bg-gray-100 text-blue-600 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
            Lire la suite
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

// Composant pour la recherche
const SearchBar = ({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="Rechercher un article..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="absolute left-4 top-3.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

// Composant pour la newsletter
const Newsletter = () => {
  return (
    <div className="bg-blue-50 p-8 rounded-xl shadow-md mb-8">
      <h3 className="text-xl font-bold text-blue-800 mb-4">Restez informé</h3>
      <p className="text-gray-600 mb-6">
        Abonnez-vous à notre newsletter pour recevoir les derniers articles et conseils directement dans votre boîte mail.
      </p>
      <form className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Votre adresse email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
        >
          S'abonner
        </button>
      </form>
    </div>
  );
};

// Composant pour les articles populaires
interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
}

const PopularPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Articles populaires</h3>
      <div className="space-y-4">
        {posts.map(post => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <div className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded transition-colors">
              <img
                src={post.image}
                alt={post.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h4 className="text-gray-800 font-medium line-clamp-2">{post.title}</h4>
                <p className="text-gray-500 text-sm">{post.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Composant principal de la page de blog
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<typeof BLOG_POSTS>([]);
  
  // Extraire les catégories uniques
  const categories = [...new Set(BLOG_POSTS.map(post => post.category))];
  
  // Filtrer les posts en fonction de la catégorie et de la recherche
  useEffect(() => {
    let result = BLOG_POSTS;
    
    if (activeCategory !== "Tous") {
      result = result.filter(post => post.category === activeCategory);
    }
    
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPosts(result);
  }, [activeCategory, searchTerm]);
  
  // Séparer l'article en vedette des autres articles
  const featuredPost = BLOG_POSTS.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  
  return (
    <div className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
      {/* Hero section */}
      <div className="relative w-full bg-gradient-to-r from-blue-900 to-blue-700 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Notre Blog</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Découvrez nos derniers articles, conseils et actualités sur l'éducation en ligne et le développement professionnel.
          </p>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="md:flex md:gap-12">
          {/* Section principale */}
          <div className="md:w-2/3">
            {/* Filtre pour mobile */}
            <div className="md:hidden mb-8">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <BlogCategories 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
            
            {/* Article en vedette */}
            {featuredPost && !searchTerm && activeCategory === "Tous" && <FeaturedPost post={featuredPost} />}
            
            {/* Liste des articles filtrés */}
            {regularPosts.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {searchTerm ? "Résultats de recherche" : activeCategory !== "Tous" ? `Articles sur ${activeCategory}` : "Articles récents"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {regularPosts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600">Aucun article ne correspond à vos critères de recherche.</p>
              </div>
            )}
            
            {/* Pagination */}
            {regularPosts.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                    Précédent
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3 mt-12 md:mt-0">
            {/* Recherche (desktop) */}
            <div className="hidden md:block">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            
            {/* Catégories (desktop) */}
            <div className="hidden md:block">
              <BlogCategories 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
            
            {/* Newsletter */}
            <Newsletter />
            
            {/* Articles populaires */}
            <PopularPosts posts={BLOG_POSTS.slice(0, 3)} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Plateforme Éducative</h3>
              <p className="text-gray-400">Votre partenaire de confiance pour le développement de compétences et l'apprentissage continu.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Cours</Link></li>
                <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profil</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Connexion</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Ressources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tutor" className="text-gray-400 hover:text-white transition-colors">Tutoriels</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Plateforme Éducative. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}