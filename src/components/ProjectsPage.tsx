import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Menu as MenuIcon, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { getOptimizedImageUrl, getResponsiveImageAttrs } from "../imageUtils";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  detailImage?: string;
  size: string;
}

interface ProjectsPageProps {
  projects: Project[];
  getProjectImage: (id: number, defaultImg: string) => string;
}

const ProjectItem = React.memo(({ project, idx, getProjectImage }: any) => (
  <Link
    key={project.id}
    to={`/project/${project.id}`}
    className="group cursor-pointer block w-full"
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: idx * 0.05 }}
    >
      <div className="aspect-[4/3] overflow-hidden bg-neutral-900 mb-4 md:mb-6">
        <img
          src={getOptimizedImageUrl(project.image, 800)}
          srcSet={getResponsiveImageAttrs(project.image).srcSet}
          sizes={getResponsiveImageAttrs(project.image).sizes}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="space-y-0.5 md:space-y-1">
        <h3 className="text-[18px] md:text-[20px] font-semibold tracking-tight text-black">{project.title}</h3>
        <p className="text-[14px] md:text-[16px] text-neutral-500 font-semibold leading-tight">
          {project.description.split('/')[0].trim()}
        </p>
      </div>
    </motion.div>
  </Link>
));

const ProjectsPage = React.memo(({ projects, getProjectImage }: ProjectsPageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-100 bg-white/80 backdrop-blur-md px-6 md:px-20 h-20 md:h-[100px] flex justify-between items-center border-b border-black/5 text-black">
        <Link 
          to="/" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMenuOpen(false);
          }}
          className="text-[17px] font-bold tracking-widest hover:opacity-50 transition-opacity"
        >
          <span className="hidden md:inline">BOOxBOO . ILLUSTRATION</span>
          <span className="md:hidden">BOOxBOO</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-8 text-[17px] font-bold tracking-widest uppercase">
          <div className="hidden md:flex items-center gap-8">
            <Link to="/projects" className="hover:opacity-50 transition-opacity">
              WORK
            </Link>
            <Link to="/about" className="hover:opacity-50 transition-opacity">
              About
            </Link>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[40] bg-black pt-32 px-10 flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase text-white"
          >
            <Link 
              to="/projects" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-neutral-500 transition-colors"
            >
              WORK
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-neutral-500 transition-colors"
            >
              About
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pb-32">
        <section className="pt-[130px] md:pt-[200px] px-5 md:px-20 w-full max-w-[1600px] mx-auto">
        <div className="mb-5 md:mb-16">
          <h1 className="text-5xl md:text-7xl font-normal tracking-tight mb-4 text-black">WORK</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-20">
          {projects.map((project, idx) => (
            <ProjectItem 
              key={project.id} 
              project={project} 
              idx={idx} 
              getProjectImage={getProjectImage} 
            />
          ))}
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="mt-auto px-6 md:px-20 py-20 border-t border-neutral-200 bg-white leading-none">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-12 text-black">
          {/* Logo Section */}
          <div className="space-y-1 md:space-y-2">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[18px] font-bold tracking-tight leading-none hover:opacity-50 transition-opacity block"
            >
              BOOxBOO . ILLUSTRATION
            </Link>
            <div className="text-[18px] text-neutral-500 font-semibold">share good vibes</div>
          </div>
          
          {/* CONTACT Section */}
          <div className="space-y-4 text-[18px] font-semibold tracking-tight">
            <div className="text-neutral-500 uppercase tracking-widest text-xs md:text-sm">CONTACT</div>
            <div className="flex flex-col gap-2 items-start text-black/80">
              <a href="https://www.instagram.com/booxboo.illustration" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Instagram</a>
              <a href="https://www.threads.net/@booxboo.illustration" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Threads</a>
              <a href="mailto:boox2boox2boo@gmail.com" className="hover:text-neutral-400 transition-colors">boox2boox2boo@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default ProjectsPage;
