import { motion, AnimatePresence } from "motion/react";
import { Instagram, ArrowRight, ArrowLeft, Share2, ExternalLink, Upload, Check, Loader2, X, Menu as MenuIcon } from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import ProjectDetail from "./components/ProjectDetail";
import ProjectsPage from "./components/ProjectsPage";
import AboutPage from "./components/AboutPage";
import { getOptimizedImageUrl, getResponsiveImageAttrs } from "./imageUtils";

const projects = [
  {
    id: 1,
    title: "Ready, Set, Run! 2026",
    description: "2026년 타임스퀘어 신년 그래픽 / DIGITAL BILLBOARD, NEW YEAR GRAPHICS.",
    image: "/project-1.jpg",
    gallery: [
      "/project-1-gallery-1.jpg",
      "https://youtu.be/p-zWisf7hGI?si=G6g2A-d_WK-ugDot",
      "/project-1-gallery-2.jpg",
      "/project-1-gallery-3.jpg",
      "/project-1-gallery-4.jpg",
      "/project-1-gallery-5.jpg",
      "/project-1-gallery-7.jpg",
      "/project-1-gallery-6.jpg",
      "/project-1-gallery-8.jpg",
      "/project-1-gallery-10.jpg",
      "/project-1-gallery-11.jpg",
      "https://youtu.be/LSLZ_uYm7Nc?si=pCNbeN1BClot0cLJ",
      "/project-1-gallery-12.jpg",
      "/project-1-gallery-13.jpg",
      "/project-1-gallery-14.jpg",
      "/project-1-gallery-15.jpg",
    ],
    size: "large",
    year: "2026",
    client: "Times Square",
    locations: "Times Square / Timestream / Timeterrace",
    projectType: "2026 New Year Graphic Illustration",
    tagline: "Capturing In our own places, with the same hope.",
    aboutEn: "In 2026, I drew people moving toward their goals from where they are. Everyone walks at a different pace and in a different direction, but it felt like each person is living today for their own reason. Through this piece, I hoped to add a small sense of hope and confidence to the beginning of the year. I hope small, shining moments continue in each of our places throughout 2026. May this year be gently filled with happiness.🍀",
    aboutKo: "2026년, 각자의 자리에서 목표를 향해 나아가는 사람들을 그렸습니다. 모두 속도도 방향도 다르지만, 각자의 이유로 오늘을 살아가고 있다는 생각이 들었습니다. 이 그림을 통해 올해를 시작하는 마음에 작은 희망과 자신감이 더해지기를 바랐습니다. 2026년에도 각자의 자리에서 반짝이는 순간들이 이어지기를 바랍니다. 행복이 자연스럽게 스며드는 한 해가 되기를.🍀",
  },
  {
    id: 2,
    title: "Busan Pop-up Store",
    description: "부산 전포동 팝업스토어 키비주얼 작업 / Poster & Window Illustration",
    image: "/project-2.jpg",
    detailImage: "/project-2-gallery-1.jpg",
    gallery: [
      "/project-2-gallery-2.jpg",
      "/project-2-gallery-3.jpg",
      "/project-2-gallery-4.mp4",
      "/project-2-gallery-5.jpg",
      "/project-2-gallery-6.jpg",
      "/project-2-gallery-7.jpg",
      "/project-2-gallery-8.jpg",
      "/project-2-gallery-9.jpg",
      "/project-2-gallery-10.jpg",
      "/project-2-gallery-12.jpg",
    ],
    size: "large",
    year: "2025",
    client: "Busan City",
    locations: "Jeonpo, Busan",
    projectType: "Key Visual & Window Illustration",
    tagline: "With dreams and passion.",
    aboutEn: "I created the key visual for the 2025 Youth-Friendly City Trial Store [Sidosi] project organized by Busanjin-gu Office. The illustration captures the journey of young entrepreneurs moving forward step by step in their own places, taking on challenges, expressed as a passionate scene filled with vibrant colors. I hope this work becomes another small source of inspiration and encouragement.",
    aboutKo: "2025년 부산진구청에서 진행한 청년친화도시 트라이얼스토어 [시도시] 프로젝트의 키 비주얼 작업을 했습니다. 각자의 자리에서 도전하며 한 걸음씩 앞으로 나아가는 청년 기업가들의 여정을, 다채로운 컬러가 어우러진 열정적인 장면으로 담아보았습니다. 이 그림이 또 하나의 작은 영감과 응원이 되기를 바랍니다.",
  },
  {
    id: 3,
    title: "High School Music Book",
    description: "고등학교 음악 교과서 / Editorial Illustration & Cover Design",
    image: "/project-3.jpg",
    detailImage: "/project-3-gallery-1.jpg",
    gallery: [
      "/project-3-gallery-2.jpg",
      "/project-3-gallery-3.jpg",
      "/project-3-gallery-4.jpg",
      "/project-3-gallery-5.jpg",
    ],
    size: "small",
    year: "2024",
    client: "Education Publishing",
    projectType: "Editorial Illustration & Cover Design",
    aboutEn: "I created the cover illustration for a high school music textbook based on the 2022 revised national curriculum. The artwork reflects the diversity of music through rhythmic and artistic visuals, with the aim of inspiring students.",
    aboutKo: "2022 개정 교육과정 고등학교 음악 교과서의 표지 일러스트를 작업했습니다. 음악의 다양성을 반영하는 리듬감 있고 예술적인 비주얼을 통해 학생들에게 영감을 주고자 했습니다.",
  },
  {
    id: 4,
    title: "Meunder x BOOxBOO",
    description: "미언더 라이프스타일 일러스트 콜라보레이션 / Meunder Lifestyle Moment Illustration Collaboration",
    image: "/project-4.jpg",
    gallery: [
      "/project-4-gallery-1.jpg",
      "/project-4-gallery-2.jpg",
      "/project-4-gallery-3.jpg",
      "/project-4-gallery-4.jpg",
      "/project-4-gallery-5.jpg",
      "/project-4-gallery-6.jpg",
    ],
    size: "small",
    year: "2025",
    client: "Meunder",
    projectType: "Illustration Collaboration",
    tagline: "Nature and Me",
    aboutEn: "Starting from Meunder’s BI, which represents Nature and Me, this illustration captures a moment of the lifestyle the brand pursues. I wanted to express an attitude of living in harmony with nature, along with the quiet awareness of understanding and respecting oneself, through a visual image. By naturally incorporating the form and meaning of the logo into the composition, the illustration reflects the brand’s eco-friendly values and the idea of a lifestyle that understands the self, allowing these elements to flow together as one. I hope the small yet meaningful moments we encounter in everyday life create a sense of calm balance, gently conveying comfort and positive energy.",
    aboutKo: "자연과 나(me)를 의미하는 Meunder의 BI에서 출발해, 브랜드가 추구하는 라이프스타일의 한 장면을 일러스트로 담았습니다. 자연과 조화를 이루며 살아가는 태도, 그리고 스스로를 이해하고 존중하는 순간의 감각을 시각적인 이미지로 표현하고자 했습니다. 로고의 형태와 의미를 화면 안에 자연스럽게 녹여내어, 브랜드가 지향하는 친환경적 가치와 ‘나를 이해하는 라이프스타일’이 하나의 흐름으로 이어지도록 구성했습니다. 일상 속에서 마주하는 작지만 의미 있는 순간들이 조용한 균형을 이루며, 그 안에서 편안함과 긍정적인 감각이 전달되기를 바랍니다.",
  },
  {
    id: 5,
    title: "Game Spectators",
    description: "관중들 / Personal Work",
    image: "/project-5.jpg",
    gallery: [
      "/project-5-gallery-1.jpg",
    ],
    size: "small",
    year: "2025",
    client: "Personal Project",
    projectType: "Poster & Postcard Collection",
    aboutEn: "An illustration capturing the vibrant energy of spectators watching a tennis match. This artwork was developed into a collection of posters and postcards, bringing the excitement of the game into everyday spaces.",
    aboutKo: "테니스 경기를 관람하는 관중들의 생동감 넘치는 에너지를 담은 일러스트레이션입니다. 이 작업은 포스터와 엽서 컬렉션으로 제작되어, 경기의 설렘을 일상 공간으로 전달하고자 기획되었습니다.",
  },
  {
    id: 6,
    title: "GQ Magazine 09.2025",
    description: "2025년 GQ 매거진 9월호 일러스트 / Magazine Editorial Illustration",
    image: "/project-6.jpg",
    detailImage: "/project-6-gallery-1.jpg",
    gallery: [
      "/project-6-gallery-2.jpg",
      "/project-6-gallery-3.jpg",
      "/project-6-gallery-4.jpg",
      "/project-6-gallery-5.jpg",
      "/project-6-gallery-6.jpg",
      "/project-6-gallery-7.jpg",
    ],
    size: "small",
    year: "2025",
    client: "GQ MAGAZINE",
    projectType: "EDITORIAL ILLUSTRATION",
    aboutEn: "I created the grooming editorial illustration for the September 2025 issue of GQ Magazine. The visual expresses the elements needed to start a refreshing day, inspired by the feeling of a heavy, sluggish morning",
    aboutKo: "2025년 GQ 매거진 9월호 그루밍 콘텐츠 일러스트를 작업했습니다. 온몸이 무겁게 느껴지는 아침, 개운한 하루를 시작하기 위해 필요한 요소들을 시각적으로 표현했습니다.",
  },
  {
    id: 7,
    title: "Pyeongchang Olympics Eco-bag",
    description: "평창올림픽 국제행사용 에코백 일러스트 / Pyeongchang Olympics Eco-bag Illustration",
    image: "/project-7.jpg",
    detailImage: "/project-7-gallery-1.jpg",
    gallery: [
      "/project-7-gallery-1.jpg",
      "/project-7-gallery-2.jpg",
      "/project-7-gallery-3.jpg",
      "/project-7-gallery-4.jpg",
    ],
    size: "small",
    year: "2025",
    client: "HodgePodge",
    projectType: "ECO-BAG ILLUSTRATION",
    aboutEn: "I designed the eco-bag illustration for an international event at the PyeongChang Olympics. The artwork captures the regional identity of PyeongChang, known for its clean air and natural beauty, creating a meaningful keepsake that introduces the charm of the area to participants.",
    aboutKo: "평창 올림픽 국제행사를 위한 에코백 일러스트레이션을 제작했습니다. 맑은 공기와 자연의 아름다움을 지닌 평창의 지역적 특색을 담아, 행사 참여자들에게 지역의 매력을 전하고 의미 있는 기념품이 되도록 디자인했습니다.",
  },
  {
    id: 8,
    title: "GQ Magazine 10.2025",
    description: "2025년 GQ 매거진 9월호 일러스트 / Magazine Editorial Illustration",
    image: "/project-8.jpg",
    detailImage: "/project-8-gallery-1.jpg",
    gallery: [
      "/project-8-gallery-2.jpg",
      "/project-8-gallery-3.jpg",
      "/project-8-gallery-4.jpg",
      "/project-8-gallery-5.jpg",
      "/project-8-gallery-6.jpg",
    ],
    size: "small",
    year: "2025",
    client: "GQ MAGAZINE",
    projectType: "EDITORIAL ILLUSTRATION",
    aboutEn: "I created the grooming editorial illustration for the October 2025 issue of GQ Magazine. Based on the content’s message that facial muscle imbalance can lead to facial asymmetry, wrinkles, and signs of aging, the illustration presents various face yoga tutorials through clear and intuitive visuals.",
    aboutKo: "2025년 GQ 매거진 10월호 그루밍 콘텐츠 일러스트를 제작했습니다. 얼굴 근육의 불균형이 안면 비대칭과 주름 등 노화로 이어질 수 있다는 콘텐츠의 메시지를 바탕으로, 다양한 페이스 요가 튜토리얼을 직관적인 비주얼로 구성했습니다.",
  },
  {
    id: 9,
    title: "Tumbler Collaboration",
    description: "폴라비 텀블러 협업 / POLAR.B Tumbler Illustration",
    image: "/project-9.jpg",
    detailImage: "/project-9.jpg",
    gallery: [
      "/project-9-gallery-1.jpg",
      "/project-9-gallery-2.jpg",
      "/project-9-gallery-3.jpg",
      "/project-9-gallery-4.jpg",
    ],
    size: "small",
    year: "2025",
    projectType: "TUMBLER COLLABORATION",
    aboutEn: "A collaboration project applying rhythmic and lively illustrations to a tumbler design, expressing a vibrant lifestyle that brings energy to everyday moments.",
    aboutKo: "경쾌하고 리듬감 있는 일러스트를 텀블러 디자인에 적용해, 일상에 활기를 더하는 라이프스타일의 분위기를 표현한 협업 프로젝트입니다.",
  },
  {
    id: 10,
    title: "Travel Guidebook Illustration",
    description: "경남 여행 가이드북 표지 일러스트레이션 / Editorial Illustration & Cover Design",
    image: "/project-10.jpg",
    detailImage: "/project-10-gallery-1.jpg",
    gallery: [
      "/project-10-gallery-2.jpg",
    ],
    size: "small",
    year: "2024",
    client: "HodgePodge",
    projectType: "EDITORIAL ILLUSTRATION",
    aboutEn: "The illustration captures the iconic landscapes and landmarks of the Busan–Ulsan–Gyeongnam region through rhythmic and lively line work, conveying the vibrant energy of the area and the joyful atmosphere of travel.",
    aboutKo: "부산·울산·경남 지역의 대표적인 풍경과 명소를 경쾌한 리듬감의 라인 일러스트로 담아, 지역의 활기와 여행의 즐거운 분위기를 표현했습니다.",
  },
  {
    id: 11,
    title: "Seoul  Illustration Fair v.19",
    description: "2025 서울일러스트페어 v.19 참가 / BOOTH DESIGN, GOODS, EXHIBITION GRAPHICS.",
    image: "/project-11.jpg",
    detailImage: "/project-11-gallery-2.jpg",
    gallery: [
      "/project-11-gallery-3.jpg",
      "/project-11-gallery-4.jpg",
      "/project-11-gallery-5.jpg",
      "/project-11-gallery-6.jpg",
      "/project-11-gallery-7.jpg",
    ],
    size: "small",
    year: "2025",
    brand: "BOOxBOO",
    event: "Seoul Illustration Fair v.19",
    projectType: "Booth Design & Goods Collection",
    aboutEn: "BOOxBOO participated in Seoul Illustration Fair v.19, presenting a collection of illustrations and goods inspired by everyday moments that bring good vibes.\n\nFrom booth design and product displays to printed goods, every element was designed to create a playful and welcoming experience where people could pause, explore, and connect through illustration.",
    aboutKo: "서울일러스트페어 v.19에서 BOOxBOO의 일러스트와 굿즈를 선보였습니다.\n부스 공간부터 굿즈 디스플레이, 인쇄물까지 하나의 브랜드 경험으로 구성하여 관람객들이 잠시 머물며 그림을 발견하고 즐길 수 있는 공간을 만들고자 했습니다.",
  },
  {
    id: 12,
    title: "Beyond the Stars",
    description: "우주를 사랑하는 아이의 시선으로 담은 꿈 / Personal Work",
    image: "/project-12.jpg",
    gallery: [
      "/project-12-gallery-1.jpg",  
      "/project-12-gallery-2.jpg", 
      "/project-12-gallery-3.jpg", 
    ],
    size: "small",
    year: "2025",
    client: "Personal Project",
    projectType: "Poster & Postcard Collection",
    aboutEn: "This project was inspired by the innocent and clear perspective of a child who deeply loves space. To a child, space is not just a distant place, but a dazzling playground that can be reached simply through imagination. I captured the child's heart, dreaming while gazing at the twinkling stars and the infinite Milky Way, using vibrant colors and rhythmical lines. I hope this illustration serves as a small passage that reminds someone of forgotten pure curiosity and infinite possibilities.",
    aboutKo: "우주를 무척이나 사랑하는 아이의 맑은 시선에서 영감을 받아 시작된 작업입니다. 아이에게 우주는 단순히 먼 곳이 아니라, 상상만으로도 닿을 수 있는 가장 가깝고도 눈부신 놀이터였습니다. 반짝이는 별과 무한한 은하수를 바라보며 꿈꾸는 아이의 마음을 다채로운 컬러와 리드미컬한 라인으로 담아보았습니다. 이 그림이 누군가에게는 잊고 지냈던 순수한 호기심과 무한한 가능성을 떠올리게 하는 작은 통로가 되기를 바랍니다.",
  },
  {
    id: 13,
    title: "Running Crew",
    description: "러닝 크루 / Personal Work",
    image: "/project-13.jpg",
    gallery: [
      "/project-13-gallery-1.mp4",
      "/project-13-gallery-2.png",
      "/project-13-gallery-3.png",
      "/project-13-gallery-4.mp4",
    ],
    size: "small",
    year: "2025",
    client: "Personal Project",
    projectType: "Poster & Postcard Collection",
    aboutEn: "There are moments when running changes the way we feel. After just a short run, the body feels lighter, and complicated thoughts become a little simpler. I wanted to capture the bright energy and living rhythm that emerge when people run together. A small movement can be enough to make a day feel better.",
    aboutKo: "러닝을 하다 보면 기분이 바뀌는 순간이 있어요. 조금 달렸을 뿐인데 몸이 가벼워지고, 복잡했던 생각은 단순해집니다. 함께 달리는 사람들에게서 느껴지는 밝은 에너지와 살아있는 리듬이 좋아서 그렸어요. 작은 움직임이 좋은 하루를 만드는 순간들을 담았습니다.",
  },
  {
    id: 14,
    title: "GQ Magazine 01.2026",
    description: "2026년 GQ 매거진 1월호 일러스트 / Magazine Editorial Illustration",
    image: "/project-14.jpg",
    detailImage: "/project-14-gallery-1.jpg",
    gallery: [
      "/project-14-gallery-2.jpg",
      "/project-14-gallery-3.jpg",
      "/project-14-gallery-4.jpg",
      "/project-14-gallery-5.jpg",
      "/project-14-gallery-6.jpg",
      "/project-14-gallery-7.jpg",
    ],
    size: "small",
    year: "2026",
    client: "GQ MAGAZINE",
    projectType: "EDITORIAL ILLUSTRATION",
    aboutEn: "From scalp care and facial treatments to full-body rituals, this illustration captures the process of seshin therapy—awakening the senses and bringing the body back to life.",
    aboutKo: "2026년 GQ 매거진 01월호 그루밍 콘텐츠 일러스트를 제작했습니다. 새해를 맞아 몸을 정돈하는 시간을 그렸습니다. 두피부터 얼굴, 보디 케어까지. 몸의 감각을 다시 깨우는 세신 테라피의 과정을 일러스트로 담았습니다.",
  },
  {
    id: 15,
    title: "Green Companions",
    description: "식물과 함께하는 삶의 조각들 / Living with Green Friends",
    image: "/project-15.jpg",
    gallery: [
      "/project-15-gallery-1.jpg",
    ],
    size: "small",
    year: "2025",
    client: "Personal Project",
    projectType: "Personal Illustration",
    aboutEn: "This work captures the small and cheerful daily lives of 'plant parents' who are silently greeted by their green companions. It aims to share the minor joys and healing found in nurturing your own small garden through a light and lighthearted perspective.",
    aboutKo: "말없이 나를 반겨주는 '식집사'들의 소소하고 유쾌한 일상을 담았습니다. 나만의 작은 정원을 가꾸며 느끼는 소소한 재미와 힐링을 가볍고 경쾌한 시선으로 나누고자 담아냈습니다.",
  },
];

function AppContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > 50;
        setIsScrolled((prev) => {
          if (prev !== scrolled) return scrolled;
          return prev;
        });
      });
    } else {
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => {
        if (prev !== scrolled) return scrolled;
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const getProjectImage = useCallback((id: number, defaultImg: string) => {
    return getOptimizedImageUrl(defaultImg);
  }, []);

  return (
    <>
      <Routes location={location}>
        <Route path="/" element={
          <Home 
            isScrolled={isScrolled} 
            getProjectImage={getProjectImage} 
          />
        } />
        <Route path="/projects" element={
          <ProjectsPage 
            projects={projects} 
            getProjectImage={getProjectImage} 
          />
        } />
        <Route path="/about" element={
          <AboutPage />
        } />
        <Route path="/project/:id" element={
          <ProjectDetail 
            projects={projects} 
            getProjectImage={getProjectImage} 
          />
        } />
      </Routes>
    </>
  );
}

const HeroCarousel = React.memo(({ projects, getProjectImage }: { projects: any[], getProjectImage: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const featuredProjects = React.useMemo(() => {
    const firstProject = projects.find(p => p.id === 1);
    const otherProjects = projects.filter(p => p.id !== 1);
    const shuffledOthers = [...otherProjects].sort(() => Math.random() - 0.5).slice(0, 5);
    return firstProject ? [firstProject, ...shuffledOthers] : shuffledOthers;
  }, [projects]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, featuredProjects.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
  }, [featuredProjects.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  }, [featuredProjects.length]);

  return (
    <section className="relative h-[600px] md:h-screen w-full overflow-hidden bg-neutral-950">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 block group">
            <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-colors pointer-events-none" />
            <img
              src={getOptimizedImageUrl(featuredProjects[currentIndex].image, 1200)}
              srcSet={getResponsiveImageAttrs(featuredProjects[currentIndex].image).srcSet}
              sizes="100vw"
              alt={featuredProjects[currentIndex].title}
              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
            />
            
            {/* Click Zones */}
            <div className="absolute inset-0 z-20 flex">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }} 
                className="w-1/3 h-full cursor-pointer" 
                title="Previous Project"
              />
              <div className="w-1/3 h-full" />
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }} 
                className="w-1/3 h-full cursor-pointer" 
                title="Next Project"
              />
            </div>
          </div>
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-5xl space-y-6 md:space-y-10 pointer-events-auto"
            >
              <div className="space-y-4 md:space-y-6">
                <Link to={`/project/${featuredProjects[currentIndex].id}`} className="block hover:opacity-80 transition-opacity">
                  {!featuredProjects[currentIndex].hideTitleOnGrid && (
                    <h1 className={`text-white text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.0] ${
                      featuredProjects[currentIndex].id === 2 ? 'max-w-none' : 
                      featuredProjects[currentIndex].id === 4 ? 'max-w-none' : 
                      'max-w-[10ch]'
                    }`}>
                      {featuredProjects[currentIndex].id === 2 ? (
                        <>
                          <span className="md:block">BUSAN</span>{" "}
                          <span className="md:block">POP-UP STORE</span>
                        </>
                      ) : featuredProjects[currentIndex].title}
                    </h1>
                  )}
                </Link>
                <p className="text-white/90 text-lg md:text-2xl font-bold tracking-normal max-w-2xl translate-x-[2px] md:translate-x-[6px]">
                  {featuredProjects[currentIndex].description.split('/')[0].trim()}
                </p>
              </div>
              
              <Link
                to={`/project/${featuredProjects[currentIndex].id}`}
                className="inline-block bg-white text-black px-8 py-3 md:px-12 md:py-4 rounded-full text-[12px] md:text-[14px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors translate-x-[1px] md:translate-x-[3px]"
              >
                Explore Work
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-6 right-6 md:left-20 md:right-auto z-30 flex gap-3 md:gap-4 md:w-auto">
        {featuredProjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="group relative h-[2px] flex-1 md:flex-none md:w-24 bg-white/20 overflow-hidden transition-all hover:h-[4px]"
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentIndex === idx ? 1 : 0 }}
              transition={{ duration: currentIndex === idx ? 5 : 0.3, ease: "linear" }}
              style={{ originX: 0 }}
            />
          </button>
        ))}
      </div>
    </section>
  );
});

const ProjectCard = React.memo(({ project, idx, getProjectImage }: any) => (
  <Link
    to={`/project/${project.id}`}
    className="group cursor-pointer"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="aspect-[4/3] overflow-hidden bg-neutral-900 mb-4 md:mb-6">
        <img
          src={getOptimizedImageUrl(project.image, 800)}
          srcSet={getResponsiveImageAttrs(project.image).srcSet}
          sizes={getResponsiveImageAttrs(project.image).sizes}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="space-y-0.5 md:space-y-1">
        {!project.hideTitleOnGrid && (
          <h3 className="text-[18px] md:text-[20px] font-semibold tracking-tight flex items-center gap-2 text-white">
            {project.title}
          </h3>
        )}
        <p className="text-[14px] md:text-[16px] text-neutral-500 font-semibold leading-tight">
          {project.description.split('/')[0].trim()}
        </p>
      </div>
    </motion.div>
  </Link>
));

const Home = React.memo(({ isScrolled, getProjectImage }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const { hash } = location;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const homeProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => a.id - b.id);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 px-6 md:px-20 h-20 md:h-[100px] flex justify-between items-center ${
          isScrolled || isMenuOpen ? "bg-black/95 shadow-lg" : "bg-transparent"
        }`}
      >
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
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-[17px] font-bold tracking-widest uppercase">
            <Link to="/projects" className="hover:opacity-50 transition-opacity">
              WORK
            </Link>
            <Link to="/about" className="hover:opacity-50 transition-opacity">
              About
            </Link>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
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
            className="fixed inset-0 z-[40] bg-black pt-32 px-10 flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase"
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
        {/* Hero Carousel */}
      <HeroCarousel projects={projects} getProjectImage={getProjectImage} />

      {/* About Section 1 */}
      <section id="about" className="px-6 py-20 md:py-48 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4 md:space-y-6"
        >
          <p className="text-[22px] sm:text-2xl md:text-[32px] font-normal leading-[1.25] md:leading-[1.2] tracking-[-0.02em]">
            <span className="font-semibold">BOOxBOO</span> is a line illustrator
          </p>
          <p className="text-[22px] sm:text-2xl md:text-[32px] font-normal leading-[1.25] md:leading-[1.2] tracking-[-0.02em]">
            capturing small moments of everyday life.
          </p>
          <p className="text-[22px] sm:text-2xl md:text-[32px] font-normal leading-[1.25] md:leading-[1.2] tracking-[-0.02em]">
            Guided by rhythm and harmony, we express the vibrant
          </p>
          <p className="text-[22px] sm:text-2xl md:text-[32px] font-normal leading-[1.25] md:leading-[1.2] tracking-[-0.02em]">
            energy within the ordinary. Through these small moments,
          </p>
          <p className="text-[22px] sm:text-2xl md:text-[32px] font-normal leading-[1.25] md:leading-[1.2] tracking-[-0.02em]">
            we share warmth and a gentle sense of positivity.
          </p>
        </motion.div>
      </section>

      {/* Project Section */}
      <section id="project" className="px-6 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-5xl font-normal tracking-tight">WORK</h2>
            <Link
              to="/projects"
              className="flex items-center gap-2 text-[18px] font-semibold hover:gap-4 transition-all"
            >
              More Works <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-16">
            {homeProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                idx={idx} 
                getProjectImage={getProjectImage} 
              />
            ))}
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-20 py-20 border-t border-white/10 bg-black leading-none">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-12 text-white">
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
            <div className="flex flex-col gap-2 items-start text-white/90">
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

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
