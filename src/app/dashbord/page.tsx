'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  Users, BookOpen, GraduationCap, 
  PieChart, Settings, Search, Menu, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Geist, Geist_Mono } from 'next/font/google';
import debounce from 'lodash/debounce';

// Définir les polices Geist
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Interfaces
interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  progress: number;
}

interface UserData {
  formationChoisie: string;
  coursInscrits: string[];
}

interface StatsData {
  totalFormations: number;
  totalCourses: number;
  enrolledCourses: number;
  enrollmentRate: number;
  unexploredFormations: number;
}

interface CourseDistributionData {
  name: string;
  value: number;
}

interface SettingsData {
  username: string;
  email: string;
  password: string;
  theme: 'light' | 'dark';
  notifications: boolean;
}

// Données pour la page Cours et Formations
const formations = [
  'Développement Web',
  'Analyse de Données',
  'Sécurité Informatique',
  'Intelligence Artificielle',
  'DevOps & Cloud Computing',
  'Design UX/UI',
  'Développement Mobile',
  'Blockchain & Cryptomonnaies',
  'Marketing Digital',
];

const coursDisponibles = [
  'HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'Vue.js', 'PHP & MySQL',
  'Python', 'Machine Learning', 'Data Visualization', 'SQL & NoSQL', 'R Programming',
  'Cryptographie', 'Pentesting', 'Sécurité Réseau', 'Forensics', 'Analyse de Vulnérabilités',
  'Deep Learning', 'Computer Vision', 'NLP', 'Algorithmes Génétiques', 'Systèmes Experts',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Terraform',
  'Figma', 'Adobe XD', 'Principes UX', 'Design Systems', 'Prototypage',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Progressive Web Apps',
  'Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'NFTs',
  'SEO', 'Content Marketing', 'Analytics', 'Social Media', 'Email Marketing',
];

const coursParFormation: { [key: string]: string[] } = {
  'Développement Web': ['HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'Vue.js', 'PHP & MySQL'],
  'Analyse de Données': ['Python', 'Machine Learning', 'Data Visualization', 'SQL & NoSQL', 'R Programming'],
  'Sécurité Informatique': ['Cryptographie', 'Pentesting', 'Sécurité Réseau', 'Forensics', 'Analyse de Vulnérabilités'],
  'Intelligence Artificielle': ['Deep Learning', 'Computer Vision', 'NLP', 'Algorithmes Génétiques', 'Systèmes Experts'],
  'DevOps & Cloud Computing': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Terraform'],
  'Design UX/UI': ['Figma', 'Adobe XD', 'Principes UX', 'Design Systems', 'Prototypage'],
  'Développement Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Progressive Web Apps'],
  'Blockchain & Cryptomonnaies': ['Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'NFTs'],
  'Marketing Digital': ['SEO', 'Content Marketing', 'Analytics', 'Social Media', 'Email Marketing'],
};

// Composants extraits
const StatCard = ({ icon: Icon, value, label, color }: { icon: React.ComponentType<{ size: number }>; value: number | string; label: string; color: string }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        <Icon size={20} />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  </div>
);

const StudentRow = ({ student }: { student: Student }) => (
  <tr key={student.id}>
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          {student.name.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{student.name}</p>
          <p className="text-xs text-gray-500">{student.email}</p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            student.progress > 75 ? 'bg-green-500' : 
            student.progress > 50 ? 'bg-blue-500' : 
            student.progress > 25 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${student.progress}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 mt-1 block">{student.progress}%</span>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-sm">
      <div className="flex space-x-2">
        <button 
          aria-label={`Modifier l'étudiant ${student.name}`} 
          className="text-blue-600 hover:text-blue-800"
        >
          Modifier
        </button>
        <button 
          aria-label={`Supprimer l'étudiant ${student.name}`} 
          className="text-red-600 hover:text-red-800"
        >
          Supprimer
        </button>
      </div>
    </td>
  </tr>
);

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen 
}: { 
  activeTab: string; 
  setActiveTab: React.Dispatch<React.SetStateAction<'overview' | 'students' | 'courses_formations' | 'settings'>>; 
  sidebarOpen: boolean 
}) => {
  const navItems: { id: 'overview' | 'students' | 'courses_formations' | 'settings'; icon: React.ComponentType<{ size: number }>; label: string }[] = [
    { id: 'overview', icon: PieChart, label: 'Aperçu' },
    { id: 'students', icon: Users, label: 'Étudiants' },
    { id: 'courses_formations', icon: BookOpen, label: 'Cours et Formations' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static w-64 h-full transition-transform bg-indigo-700 text-white overflow-y-auto z-40`}>
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center">
          <GraduationCap className="mr-2" />
          EduGestion
        </h1>
      </div>
      <nav className="px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === item.id ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                <span className="mr-3">
                  <item.icon size={18} />
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const OverviewTab = ({ 
  statsData, 
  studentsData, 
  courseDistributionData, 
  user 
}: { 
  statsData: StatsData; 
  studentsData: Student[]; 
  courseDistributionData: CourseDistributionData[]; 
  user: UserData 
}) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      <StatCard icon={BookOpen} value={statsData.totalFormations} label="Formations" color="indigo" />
      <StatCard icon={BookOpen} value={statsData.totalCourses} label="Cours" color="green" />
      <StatCard icon={Users} value={statsData.enrolledCourses} label="Cours Inscrits" color="blue" />
      <StatCard icon={PieChart} value={`${statsData.enrollmentRate}%`} label="Taux d'inscription" color="yellow" />
      <StatCard icon={BookOpen} value={statsData.unexploredFormations} label="Formations non explorées" color="purple" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Répartition des cours par formation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseDistributionData} aria-label="Graphique de répartition des cours par formation">
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Résumé utilisateur</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Formation choisie :</p>
              <p className="text-md font-medium">{user.formationChoisie || 'Aucune'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cours inscrits :</p>
              {user.coursInscrits.length > 0 ? (
                <ul className="list-disc pl-5">
                  {user.coursInscrits.slice(0, 4).map((cours) => (
                    <li key={cours} className="text-sm">{cours}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucun cours inscrit</p>
              )}
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Gérer les cours
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StudentsTab = ({ studentsData }: { studentsData: Student[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 border-b">
        <h3 className="text-lg font-semibold">Liste des étudiants</h3>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
          + Ajouter un étudiant
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Rechercher un étudiant"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm">
              Filtrer
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm">
              Exporter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Liste des étudiants">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progrès</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedStudents.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Affichage de {(currentPage - 1) * studentsPerPage + 1} à{' '}
            {Math.min(currentPage * studentsPerPage, filteredStudents.length)} sur {filteredStudents.length} étudiants
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
              aria-label="Page précédente"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesFormationsTab = () => {
  const [user, setUser] = useState<UserData>({
    formationChoisie: '',
    coursInscrits: [],
  });
  const [coursFiltrés, setCoursFiltrés] = useState<string[]>(coursDisponibles);
  const [afficherTousCours, setAfficherTousCours] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const coursPerPage = 10;

  // Charger les données utilisateur depuis localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser({
        formationChoisie: storedUser.formationChoisie || '',
        coursInscrits: storedUser.coursInscrits || [],
      });
      setIsLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données utilisateur');
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour les cours filtrés
  useEffect(() => {
    let baseList = afficherTousCours
      ? coursDisponibles
      : user.formationChoisie
      ? coursParFormation[user.formationChoisie] || []
      : [];
    if (searchTerm) {
      baseList = baseList.filter((cours) => cours.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setCoursFiltrés(baseList);
    setCurrentPage(1); // Réinitialiser la page lors du changement de filtre
  }, [user.formationChoisie, afficherTousCours, searchTerm]);

  // Débounce pour la recherche
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const inscrireFormation = (formation: string) => {
    if (user.formationChoisie !== formation) {
      const updatedUser = { ...user, formationChoisie: formation };
      setUser(updatedUser);
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        setError('Erreur lors de la sauvegarde de la formation');
      }
    }
  };

  const inscrireCours = (cours: string) => {
    if (!user.coursInscrits.includes(cours)) {
      const updatedUser = { ...user, coursInscrits: [...user.coursInscrits, cours] };
      setUser(updatedUser);
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        setError('Erreur lors de l’inscription au cours');
      }
    }
  };

  const desinscriptionCours = (cours: string) => {
    const updatedCourses = user.coursInscrits.filter((c) => c !== cours);
    const updatedUser = { ...user, coursInscrits: updatedCourses };
    setUser(updatedUser);
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError('Erreur lors de la désinscription du cours');
    }
  };

  const paginatedCours = coursFiltrés.slice(
    (currentPage - 1) * coursPerPage,
    currentPage * coursPerPage
  );
  const totalPages = Math.ceil(coursFiltrés.length / coursPerPage);

  if (isLoading) return <div className="p-6 text-center">Chargement...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">Cours et Formations</h3>
      <div className="space-y-6">
        {/* Affichage des cours inscrits */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-medium mb-3">Cours Inscrits</h4>
          {user.coursInscrits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.coursInscrits.map((cours) => (
                <span
                  key={cours}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
                >
                  {cours}
                  <button
                    onClick={() => desinscriptionCours(cours)}
                    className="ml-1 text-indigo-800 hover:text-red-700"
                    aria-label={`Désinscrire du cours ${cours}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun cours sélectionné</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection de la formation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">Choisir une Formation</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formations.map((formation) => (
                <button
                  key={formation}
                  onClick={() => inscrireFormation(formation)}
                  className={`flex items-center justify-between w-full py-2 px-3 rounded-md transition-colors ${
                    user.formationChoisie === formation
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-500'
                      : 'bg-white border hover:bg-indigo-50 text-gray-800'
                  }`}
                  aria-label={`Choisir la formation ${formation}`}
                >
                  <span>{formation}</span>
                  {user.formationChoisie === formation && (
                    <span className="text-indigo-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection des cours */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">S'inscrire aux Cours</h4>
            <div className="mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!afficherTousCours}
                  onChange={() => setAfficherTousCours(!afficherTousCours)}
                  className="sr-only peer"
                  aria-label="Filtrer par formation"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {afficherTousCours ? 'Afficher tous les cours' : 'Filtrer par formation sélectionnée'}
                </span>
              </label>
            </div>
            <input
              type="text"
              placeholder="Rechercher un cours..."
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => debouncedSearch(e.target.value)}
              aria-label="Rechercher un cours"
            />
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {paginatedCours.length > 0 ? (
                paginatedCours.map((cours) => (
                  <button
                    key={cours}
                    onClick={() => inscrireCours(cours)}
                    disabled={user.coursInscrits.includes(cours)}
                    className={`flex items-center justify-between w-full py-2 px-3 rounded-md transition-colors ${
                      user.coursInscrits.includes(cours)
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-500 cursor-not-allowed'
                        : 'bg-white border hover:bg-indigo-50 text-gray-800'
                    }`}
                    aria-label={`S'inscrire au cours ${cours}`}
                  >
                    <span>{cours}</span>
                    {user.coursInscrits.includes(cours) && (
                      <span className="text-indigo-600">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun cours trouvé</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Affichage de {(currentPage - 1) * coursPerPage + 1} à{' '}
                {Math.min(currentPage * coursPerPage, coursFiltrés.length)} sur {coursFiltrés.length} cours
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
                  aria-label="Page précédente"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
                  aria-label="Page suivante"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const [settings, setSettings] = useState<SettingsData>({
    username: 'Admin',
    email: 'admin@example.com',
    password: '',
    theme: 'light',
    notifications: true,
  });
  const [errors, setErrors] = useState<Partial<SettingsData>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    try {
      const storedSettings = JSON.parse(localStorage.getItem('settings') || '{}');
      setSettings({
        username: storedSettings.username || 'Admin',
        email: storedSettings.email || 'admin@example.com',
        password: '',
        theme: storedSettings.theme || 'light',
        notifications: storedSettings.notifications !== undefined ? storedSettings.notifications : true,
      });
      setIsLoading(false);
    } catch (err) {
      setErrors({ email: 'Erreur lors du chargement des paramètres' });
      setIsLoading(false);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Partial<SettingsData> = {};
    if (!settings.username) newErrors.username = 'Le nom d’utilisateur est requis';
    if (!settings.email || !/\S+@\S+\.\S+/.test(settings.email)) newErrors.email = 'Email invalide';
    if (settings.password && settings.password.length < 8) newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      try {
        localStorage.setItem('settings', JSON.stringify(settings));
        setSuccess('Paramètres enregistrés avec succès');
        setErrors({});
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setErrors({ email: 'Erreur lors de la sauvegarde des paramètres' });
      }
    }
  };

  const handleReset = () => {
    const defaultSettings: SettingsData = {
      username: 'Admin',
      email: 'admin@example.com',
      password: '',
      theme: 'light',
      notifications: true,
    };
    setSettings(defaultSettings);
    try {
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
      setSuccess('Paramètres réinitialisés avec succès');
      setErrors({});
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setErrors({ email: 'Erreur lors de la réinitialisation des paramètres' });
    }
  };

  if (isLoading) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">Paramètres</h3>
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <div className="space-y-6">
        {/* Profil utilisateur */}
        <div>
          <h4 className="text-md font-medium mb-4">Profil utilisateur</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Nom d’utilisateur"
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Adresse email"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={settings.password}
                onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Mot de passe"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>
        </div>

        {/* Préférences */}
        <div>
          <h4 className="text-md font-medium mb-4">Préférences</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thème</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Thème de l’interface"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Activer les notifications"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Activer les notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses_formations' | 'settings'>('overview');
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [user, setUser] = useState<UserData>({
    formationChoisie: '',
    coursInscrits: [],
  });
  const [statsData, setStatsData] = useState<StatsData>({
    totalFormations: 0,
    totalCourses: 0,
    enrolledCourses: 0,
    enrollmentRate: 0,
    unexploredFormations: 0
  });
  const [courseDistributionData, setCourseDistributionData] = useState<CourseDistributionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données utilisateur et calculer les statistiques
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userData: UserData = {
        formationChoisie: storedUser.formationChoisie || '',
        coursInscrits: storedUser.coursInscrits || [],
      };
      setUser(userData);

      // Calculer les statistiques
      const totalFormations = formations.length;
      const totalCourses = coursDisponibles.length;
      const enrolledCourses = userData.coursInscrits.length;
      const enrollmentRate = userData.formationChoisie
        ? Math.round((enrolledCourses / (coursParFormation[userData.formationChoisie]?.length || 1)) * 100)
        : 0;
      const unexploredFormations = totalFormations - (userData.formationChoisie ? 1 : 0);

      setStatsData({
        totalFormations,
        totalCourses,
        enrolledCourses,
        enrollmentRate,
        unexploredFormations
      });

      // Données pour le graphique
      setCourseDistributionData(
        formations.map((formation) => ({
          name: formation,
          value: coursParFormation[formation]?.length || 0,
        }))
      );

      // Données étudiants (simulation)
      setStudentsData([
        { id: 1, name: 'Marie Dubois', email: 'marie.dubois@example.com', course: 'Développement Web', progress: 75 },
        { id: 2, name: 'Thomas Martin', email: 'thomas.martin@example.com', course: 'Intelligence Artificielle', progress: 45 },
        { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@example.com', course: 'Design UX/UI', progress: 90 },
        { id: 4, name: 'Lucas Petit', email: 'lucas.petit@example.com', course: 'Data Science', progress: 60 },
        { id: 5, name: 'Emma Laurent', email: 'emma.laurent@example.com', course: 'Sécurité Informatique', progress: 80 },
        { id: 6, name: 'Noah Dubois', email: 'noah.dubois@example.com', course: 'DevOps & Cloud Computing', progress: 55 },
        { id: 7, name: 'Chloe Moreau', email: 'chloe.moreau@example.com', course: 'Développement Mobile', progress: 70 },
        { id: 8, name: 'Liam Roux', email: 'liam.roux@example.com', course: 'Blockchain & Cryptomonnaies', progress: 65 },
        { id: 9, name: 'Ava Girard', email: 'ava.girard@example.com', course: 'Marketing Digital', progress: 85 },
        { id: 10, name: 'Hugo Lemoine', email: 'hugo.lemoine@example.com', course: 'Analyse de Données', progress: 50 },
      ]);

      setIsLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      setIsLoading(false);
    }
  }, []);

  const tabComponents = {
    overview: <OverviewTab 
                statsData={statsData} 
                studentsData={studentsData} 
                courseDistributionData={courseDistributionData} 
                user={user}
              />,
    students: <StudentsTab studentsData={studentsData} />,
    courses_formations: <CoursesFormationsTab />,
    settings: <SettingsTab />,
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <div className={`flex h-screen bg-gray-50 ${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* Sidebar mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow"
          aria-label="Ouvrir/Fermer le menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 py-3 lg:px-8">
            <h2 className="text-xl font-semibold text-gray-800">
              {{
                overview: 'Aperçu',
                students: 'Gestion des étudiants',
                courses_formations: 'Cours et Formations',
                settings: 'Paramètres'
              }[activeTab]}
            </h2>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Recherche globale"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              <div className="relative">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2">
                    AD
                  </div>
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-8">
          {tabComponents[activeTab]}
        </main>
      </div>
    </div>
  );
}