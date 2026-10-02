export interface AcademicDegree {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
  skillsAcquired: string[];
  field: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  duration?: string;
  location: string;
  type: 'freelance' | 'stage' | 'cdd' | 'cdi';
  missions: string[];
  technologies: string[];
  highlights?: string[];
}

export interface SkillItem {
  name: string;
  level: string; // e.g., 'Avancé', 'Opérationnel', 'Notions solides'
  percentage: number;
  description: string;
  iconName?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  period: string;
  clientOrContext: string;
  description: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: 'Terminé' | 'En cours' | 'Déployé';
}

export interface ProfileInfo {
  fullName: string;
  firstName: string;
  lastName: string;
  title: string;
  subtitle: string;
  birthDate: string;
  email: string;
  phones: string[];
  githubUrl: string;
  portfolioUrl?: string;
  location: string;
  availability: string;
  bio: string;
  softSkills: string[];
}
