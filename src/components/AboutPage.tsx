import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-20">
      <div className="max-w-[1600px] mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[17px] font-bold tracking-widest uppercase hover:opacity-50 transition-opacity mb-20"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <section className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-[17px] sm:text-3xl md:text-[40px] font-normal leading-tight md:leading-[38px] tracking-[-0.03em]">
              <span className="font-semibold">BOOxBOO</span> is a line illustrator
            </p>
            <p className="text-[17px] sm:text-3xl md:text-[40px] font-normal leading-tight md:leading-[38px] tracking-[-0.03em]">
              capturing small moments of everyday life.
            </p>
            <p className="text-[17px] sm:text-3xl md:text-[40px] font-normal leading-tight md:leading-[38px] tracking-[-0.03em]">
              Guided by rhythm and harmony, we express the vibrant
            </p>
            <p className="text-[17px] sm:text-3xl md:text-[40px] font-normal leading-tight md:leading-[38px] tracking-[-0.03em]">
              energy within the ordinary. Through these small moments,
            </p>
            <p className="text-[17px] sm:text-3xl md:text-[40px] font-normal leading-tight md:leading-[38px] tracking-[-0.03em]">
              we share warmth and a gentle sense of positivity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-20"
          >
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-neutral-500 uppercase tracking-widest text-xs md:text-sm font-bold">Biography</h2>
                <div className="text-[17px] md:text-[20px] font-semibold leading-relaxed text-neutral-300">
                  <p>Based in Seoul, South Korea.</p>
                  <p>Focusing on minimalist yet expressive line work that captures the essence of human connection and natural rhythm.</p>
                </div>
              </div>

               <div className="space-y-4">
                <h2 className="text-neutral-500 uppercase tracking-widest text-xs md:text-sm font-bold">Clients & Collaborations</h2>
                <div className="text-[17px] md:text-[20px] font-semibold leading-relaxed text-neutral-300">
                   <p>Times Square Seoul, Busan City, GQ Magazine, Meunder, and more.</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-neutral-500 uppercase tracking-widest text-xs md:text-sm font-bold">Contact</h2>
                <div className="text-[17px] md:text-[20px] font-semibold leading-relaxed text-neutral-300">
                  <p>boox2boox2boo@gmail.com</p>
                  <p className="mt-2">
                    <a 
                      href="https://www.instagram.com/booxboo.illustration" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors border-b border-neutral-700"
                    >
                      @booxboo.illustration
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
