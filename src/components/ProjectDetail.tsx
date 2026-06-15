import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Share2, Heart, X, ArrowRight, Play, Menu as MenuIcon } from "lucide-react";
import { getOptimizedImageUrl, getResponsiveImageAttrs } from "../imageUtils";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  detailImage?: string;
  gallery?: string[];
  size: string;
  year?: string;
  client?: string;
  locations?: string;
  projectType?: string;
  tagline?: string;
  aboutEn?: string;
  aboutKo?: string;
}

interface ProjectDetailProps {
  projects: Project[];
  getProjectImage: (id: number, defaultImg: string) => string;
}

const ProjectDetail = React.memo(({ projects, getProjectImage }: ProjectDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));
  
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleVideo = (url: string) => {
    setPlayingVideos(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load liked state from localStorage
    const savedLiked = localStorage.getItem(`liked_project_${id}`) === 'true';
    setIsLiked(savedLiked);
    
    // Initialize likes (start from 0, or 1 if already liked)
    // If the user wants it to start from 0 every time, we could ignore localStorage
    // but usually "start from 0" means the base is 0.
    setLikes(savedLiked ? 1 : 0);
  }, [id]);

  const handleLike = useCallback(() => {
    setLikes(l => l + 1);
    setIsLiked(true);
    localStorage.setItem(`liked_project_${id}`, 'true');
  }, [id]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-light mb-8">Project not found</h1>
        <Link to="/" className="text-neutral-500 hover:text-black transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  const imageUrl = getProjectImage(project.id, project.detailImage || project.image);
  const gallery = project.gallery || [imageUrl, imageUrl, imageUrl, imageUrl];

    // Group gallery items into rows (1, 2, or 4 items per row)
    const galleryRows: string[][] = [];
    console.log('Gallery Items:', gallery);

    if (project.id === 14) {
      // Custom gallery layout for Project 14:
      // - project-14-gallery-2, project-14-gallery-3, project-14-gallery-4 in a 3-column row
      // - Others in individual 1-column rows
      const triple: string[] = [];
      const singles: string[] = [];

      gallery.forEach((item) => {
        if (
          item.toLowerCase().includes('gallery-2') ||
          item.toLowerCase().includes('gallery-3') ||
          item.toLowerCase().includes('gallery-4')
        ) {
          triple.push(item);
        } else {
          singles.push(item);
        }
      });

      if (triple.length > 0) {
        galleryRows.push(triple);
      }
      singles.forEach((item) => {
        galleryRows.push([item]);
      });
    } else {
      for (let i = 0; i < gallery.length; i++) {
        const current = gallery[i];
        const next = gallery[i + 1];
        
        // Check for 1/4 layout (4 items)
        const isQuadStart = current && (current.toLowerCase().includes('gallery-11') || current.toLowerCase().includes('gallery11')) && project.id !== 1;
        if (isQuadStart && i + 3 < gallery.length) {
          galleryRows.push([gallery[i], gallery[i+1], gallery[i+2], gallery[i+3]]);
          i += 3;
          continue;
        }

        // Check for 1/3 layout (3 items) for Project 1, Project 6, and Project 8
        const isTripleStart = (project.id === 1 && current && current.toLowerCase().includes('gallery-13')) ||
                              (project.id === 6 && current && current.toLowerCase().includes('gallery-2')) ||
                              (project.id === 8 && current && current.toLowerCase().includes('gallery-2'));
        if (isTripleStart && i + 2 < gallery.length) {
          galleryRows.push([gallery[i], gallery[i+1], gallery[i+2]]);
          i += 2;
          continue;
        }

        // Check if current and next should be in 1/2 layout
        let isPairStart = false;
        let isPairEnd = false;

        if (project.id === 1) {
          // Project 1 specific pairing: 3-4, 7-6 (swapped), 10-11
          isPairStart = current && (
            current.toLowerCase().includes('gallery-3') || 
            current.toLowerCase().includes('gallery-7') ||
            current.toLowerCase().includes('gallery-10')
          );
          isPairEnd = next && (
            next.toLowerCase().includes('gallery-4') || 
            next.toLowerCase().includes('gallery-6') ||
            next.toLowerCase().includes('gallery-11')
          );
        } else if (project.id === 2) {
          // Project 2 specific pairing: 4-5, 6-7
          isPairStart = current && (
            current.toLowerCase().includes('gallery-4') || 
            current.toLowerCase().includes('gallery-6')
          );
          isPairEnd = next && (
            next.toLowerCase().includes('gallery-5') || 
            next.toLowerCase().includes('gallery-7')
          );
        } else if (project.id === 3) {
          // Project 3 specific pairing: 4-5
          isPairStart = current && (
            current.toLowerCase().includes('gallery-4')
          );
          isPairEnd = next && (
            next.toLowerCase().includes('gallery-5')
          );
        } else if (project.id === 7) {
          // Project 7 specific pairing: 1-2
          isPairStart = current && (
            current.toLowerCase().includes('gallery-1')
          );
          isPairEnd = next && (
            next.toLowerCase().includes('gallery-2')
          );
        } else if (project.id === 12) {
          // Project 12 specific pairing: 2-3
          isPairStart = current && current.toLowerCase().includes('gallery-2');
          isPairEnd = next && next.toLowerCase().includes('gallery-3');
        } else {
          // Default pairing for other projects (excluding Project 6)
          isPairStart = project.id !== 6 && current && (
            current.toLowerCase().includes('gallery-6')
          );
          isPairEnd = project.id !== 6 && next && (
            next.toLowerCase().includes('gallery-7')
          );
        }

        console.log(`Checking pair: ${current} & ${next} | isPairStart: ${isPairStart}, isPairEnd: ${isPairEnd}`);

        if (isPairStart && isPairEnd) {
          console.log('Grouping 1/2 layout pair');
          galleryRows.push([current, next]);
          i++; // Skip next
        } else {
          galleryRows.push([current]);
        }
      }
    }
    console.log('Gallery Rows:', galleryRows);

  const isVideo = (url: string) => {
    return url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.mov');
  };

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  };

  const renderMedia = (url: string, alt: string, className: string, loading: "lazy" | "eager" = "lazy") => {
    let mediaUrl = url;
    let thumbnailUrl = '';
    let isVideoThumbnail = false;

    if (url.startsWith('video:')) {
      const parts = url.substring(6).split('|');
      mediaUrl = parts[0];
      thumbnailUrl = parts[1];
      isVideoThumbnail = true;
    }

    if (isVideoThumbnail && !playingVideos.has(mediaUrl)) {
      return (
        <div className="relative group cursor-pointer w-full" onClick={() => toggleVideo(mediaUrl)}>
          <img 
            src={getOptimizedImageUrl(thumbnailUrl, 800)} 
            srcSet={getResponsiveImageAttrs(thumbnailUrl).srcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
            alt={alt} 
            className={className} 
            loading={loading} 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-black fill-black ml-1" />
            </motion.div>
          </div>
        </div>
      );
    }

    if (isYouTube(mediaUrl)) {
      return (
        <div className={`relative w-full pt-[56.25%] ${className}`}>
          <iframe
            src={getYouTubeEmbedUrl(mediaUrl)}
            title={alt}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    if (isVideo(mediaUrl)) {
      return (
        <video 
          src={mediaUrl} 
          className={className}
          autoPlay 
          loop 
          muted 
          playsInline
        />
      );
    }
    return (
      <img 
        src={getOptimizedImageUrl(mediaUrl, 1200)} 
        srcSet={getResponsiveImageAttrs(mediaUrl).srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 100vw"
        alt={alt} 
        className={className}
        referrerPolicy="no-referrer"
        loading={loading}
        decoding="async"
      />
    );
  };

  return (
    <div className="bg-white text-black min-h-screen relative font-sans flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-100 bg-white/80 backdrop-blur-md px-6 md:px-20 h-20 md:h-[100px] flex justify-between items-center border-b border-black/5">
        <Link 
          to="/" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMenuOpen(false);
          }}
          className="text-sm md:text-[17px] font-bold tracking-widest text-black hover:opacity-50 transition-opacity whitespace-nowrap"
        >
          <span className="hidden md:inline">BOOxBOO . ILLUSTRATION</span>
          <span className="md:hidden">BOOxBOO</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-8 text-xs md:text-[17px] font-bold tracking-widest uppercase text-black">
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
            className="fixed inset-0 z-[90] bg-white pt-32 px-10 flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase text-black"
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
        {/* Header Section (White) */}
        <section className="bg-white pt-32 md:pt-64 pb-5 md:pb-32 px-6 md:px-20 max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 md:space-y-12"
        >
          <h1 className="text-black text-3xl md:text-[80px] font-bold tracking-tighter leading-none font-sans mt-[10px]">
            {project.title}
          </h1>
          <div className="space-y-2 hidden md:block">
            <p className="text-black/60 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Project Focus</p>
            <p className="text-black text-xs md:text-sm font-bold tracking-widest uppercase">
              {project.description}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Main Hero Image */}
      <section className="w-full px-6 md:px-20 bg-white/80 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="overflow-hidden"
        >
          {renderMedia(
            imageUrl, 
            project.title, 
            project.id === 7 
              ? "max-h-[1000px] w-auto max-w-full mx-auto object-contain block" 
              : "w-full h-auto block", 
            "eager"
          )}
        </motion.div>
      </section>

      {/* Content Section (Light) */}
      <section className="py-16 md:py-32 px-6 md:px-20 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
          {/* Left Column */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-12 md:space-y-40 font-sans hidden md:block">
            <div className="space-y-6 md:space-y-8 md:pr-20">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.2] text-neutral-900 font-sans">
                {project.title}{project.tagline ? ` ㅡ ${project.tagline}` : ""}
              </h2>
              <div className="space-y-1 text-[10px] md:text-xs font-bold tracking-widest uppercase text-neutral-400">
                {project.year && <p>Year — {project.year}</p>}
                {project.client && <p>Client — {project.client}</p>}
                {project.locations && <p>Locations — {project.locations}</p>}
                {project.projectType && <p>Project — {project.projectType}</p>}
                {!project.year && !project.client && (
                  <>
                    <p>YEAR — 2026</p>
                    <p>CATEGORY — BRAND IDENTITY</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12 md:space-y-20 font-sans">
            <div className="space-y-6 md:space-y-8 md:pr-[10px]">
              <h3 className="text-sm md:text-[18px] font-black tracking-[0.2em] uppercase text-neutral-900 font-sans translate-y-0 md:translate-y-[3px]">About the WORK</h3>
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6 text-base md:text-[18px] text-neutral-700 leading-relaxed font-semibold">
                  <p>
                    {project.aboutEn || "Project description coming soon."}
                  </p>
                </div>
                <div className="space-y-4 md:space-y-6 text-sm md:text-[16px] text-neutral-500 leading-relaxed font-semibold border-t border-neutral-200 pt-6 md:pt-8 font-apple">
                  <p>
                    {project.aboutKo || "프로젝트 설명이 곧 업데이트될 예정입니다."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-16 md:mt-40 space-y-4 md:space-y-[60px]">
          {galleryRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={
                row.length === 4 ? (project.id === 1 ? "grid grid-cols-1 md:grid-cols-3 gap-[20px]" : "grid grid-cols-2 md:grid-cols-4 gap-[20px]") : 
                row.length === 3 ? "grid grid-cols-1 md:grid-cols-3 gap-[25px]" : 
                row.length === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-[30px]" : 
                "w-full"
              }
            >
              {row.map((item, itemIndex) => (
                <div key={itemIndex} className="w-full">
                  <div className="relative group min-h-[100px] bg-gray-100 flex items-center justify-center">
                    {renderMedia(item, `Detail ${rowIndex}-${itemIndex}`, "w-full h-auto", "lazy")}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Project Info Footer */}
        <div className="mt-20 md:mt-40 pt-10 md:pt-20 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © 2026 BOOxBOO. All rights reserved.
          </div>
          <div className="flex items-center gap-4 relative">
            <AnimatePresence>
              {showCopyToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap"
                >
                  Link Copied!
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={handleShare}
              className="px-8 py-3 md:px-10 md:py-4 border border-neutral-200 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all flex items-center gap-2 text-black group relative"
              title="Copy Link"
            >
              <Share2 size={14} className="group-hover:scale-110 transition-transform" />
              Copy Link
            </button>
          </div>
        </div>

        {/* More Projects Section */}
        <div className="mt-20 md:mt-40 pt-10 md:pt-20 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight">MORE WORKS</h2>
            <Link
              to="/projects"
              className="flex items-center gap-2 text-base md:text-[18px] font-semibold hover:gap-4 transition-all"
            >
              All Works <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-16">
            {(() => {
              const currentIndex = projects.findIndex(p => p.id === project.id);
              const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
              const nextIndex = (currentIndex + 1) % projects.length;
              const nextNextIndex = (currentIndex + 2) % projects.length;
              
              const moreProjects = [
                projects[prevIndex],
                projects[nextIndex],
                projects[nextNextIndex]
              ];

              return moreProjects.map((p, idx) => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="group cursor-pointer block w-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-900 mb-4 md:mb-6">
                      <img
                        src={getProjectImage(p.id, p.image)}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="text-[18px] md:text-[20px] font-semibold tracking-tight text-black">{p.title}</h3>
                      <p className="text-[16px] md:text-[18px] text-neutral-500 font-semibold leading-tight">
                        {p.description.split('/')[0].trim()}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ));
            })()}
          </div>
        </div>
      </section>
    </main>

      {/* Footer */}
      <footer id="contact" className="mt-auto px-6 md:px-20 py-20 border-t border-neutral-200 bg-white leading-none">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-12 text-black">
          {/* Logo Section */}
          <div className="space-y-2">
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

export default ProjectDetail;
