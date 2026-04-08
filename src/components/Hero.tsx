import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 mb-8 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
        >
          Elite Sports Club
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-12"
        >
          APEX <br />
          <span className="text-brand">ARENA</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-xl md:text-2xl font-medium text-gray-600 leading-relaxed mb-12"
        >
          The ultimate destination for elite athletes. Book professional courts, train with the best, and join a community of champions.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <a href="#courts" className="group bg-black text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-3">
            Book a Court
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#membership" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-brand hover:border-brand transition-all">
            Join the Club
          </a>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-[0.03] pointer-events-none select-none">
        <span className="text-[40vw] font-black uppercase tracking-tighter leading-none block text-center">
          CLUB
        </span>
      </div>
    </section>
  );
}
