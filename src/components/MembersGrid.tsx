import { motion } from "motion/react";
import { trainers } from "../constants/trainers";

export default function MembersGrid() {
  return (
    <section id="trainers" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Elite <br />
              <span className="text-brand">Trainers</span>
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Train with the best in the business. Our coaches are former professionals and certified specialists.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-[10vw] font-black text-gray-200 leading-none select-none">02</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trainers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-[4/5] overflow-hidden bg-gray-100"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h3 className="text-white text-lg font-black uppercase tracking-tighter mb-1">
                  {member.name}
                </h3>
                <p className="text-brand text-xs font-bold uppercase tracking-widest leading-tight">
                  {member.role}
                </p>
              </div>
              
              {/* Overlay for non-hover state names */}
              <div className="absolute bottom-4 left-4 group-hover:opacity-0 transition-opacity duration-300">
                <h3 className="text-white text-sm font-black uppercase tracking-tighter bg-black/50 px-2 py-1 backdrop-blur-sm">
                  {member.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
