import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Globe,
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  ArrowUpRight,
  PhoneCall
} from 'lucide-react';
import { profileData } from '../data/portfolioData';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-800/50">
            Échangeons Ensemble
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            Contact & Prise de Rendez-Vous
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Vous avez un projet web, une opportunité de poste, ou souhaitez échanger autour de mes compétences ? 
            Je suis à votre écoute et réactive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct coordinates */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Main Contact Card */}
            <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Coordonnées Directes</h3>
                  <p className="text-xs text-slate-400">Joignable par email ou téléphone</p>
                </div>
              </div>

              {/* Email item */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900/60 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-medium text-slate-400 block">Adresse Email</span>
                    <a 
                      href={`mailto:${profileData.email}`} 
                      className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
                    >
                      {profileData.email}
                    </a>
                  </div>
                </div>

                <motion.button
                  onClick={handleCopyEmail}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0"
                  title="Copier l'email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </motion.div>

              {/* Phone item 1 */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-900/60 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-medium text-slate-400 block">Téléphone Principal</span>
                    <a 
                      href="tel:+237651887722" 
                      className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors block"
                    >
                      (+237) 651 88 77 22
                    </a>
                  </div>
                </div>

                <motion.a
                  href="tel:+237651887722"
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0"
                  title="Appeler directement"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                </motion.a>
              </motion.div>

              {/* Phone item 2 */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-teal-950 text-teal-400 border border-teal-900/60 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-medium text-slate-400 block">Téléphone Secondaire</span>
                    <a 
                      href="tel:+237697204431" 
                      className="text-sm font-semibold text-white hover:text-teal-400 transition-colors block"
                    >
                      (+237) 697 20 44 31
                    </a>
                  </div>
                </div>

                <motion.a
                  href="tel:+237697204431"
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0"
                  title="Appeler directement"
                >
                  <PhoneCall className="w-4 h-4 text-teal-400" />
                </motion.a>
              </motion.div>

              {/* GitHub Link */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 shrink-0">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Dépôts & Code Source</span>
                    <span className="text-sm font-semibold text-white">github.com/florewang03-sys</span>
                  </div>
                </div>

                <motion.a
                  href={profileData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-white border border-slate-800 transition-colors shrink-0"
                  title="Ouvrir GitHub"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </motion.div>

              {/* Portfolio Link */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-950 text-teal-300 border border-indigo-900/60 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Site Portfolio</span>
                    <span className="text-sm font-semibold text-white">folio-alpha-gilt.vercel.app</span>
                  </div>
                </div>

                <motion.a
                  href={profileData.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 hover:text-white border border-slate-800 transition-colors shrink-0"
                  title="Ouvrir le Portfolio"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </motion.div>

              {/* Location badge */}
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Résidente à Douala, Cameroun &bull; Mobilité pour opportunités pro</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Interactive Message Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">
                Envoyer un Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Remplissez ce formulaire et je vous répondrai dans les plus brefs délais.
              </p>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-6 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Message bien reçu !</h4>
                    <p className="text-sm text-slate-300">
                      Merci <strong className="text-white">{formData.name}</strong>. Une copie de votre demande est prête. Vous pouvez également m'écrire directement à <strong className="text-indigo-400">{profileData.email}</strong>.
                    </p>
                    <div className="pt-2">
                      <motion.button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', subject: '', message: '' });
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                      >
                        Envoyer un autre message
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Votre Nom & Prénom *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Jean Dupont"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Votre Adresse Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Ex: contact@entreprise.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Objet de la demande
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Ex: Opportunité d'emploi / Projet Freelance / Échange technique"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Votre Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Décrivez brièvement votre projet ou votre proposition..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmettre le message</span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
