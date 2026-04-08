import { motion } from "motion/react";
import { Users, Globe, Star, Zap, Shield, Trophy } from "lucide-react";

const benefits = [
  {
    icon: <Trophy size={32} />,
    title: "Pro Courts",
    description: "Professional grade surfaces for Tennis, Padel, Basketball, and Squash. Maintained daily."
  },
  {
    icon: <Users size={32} />,
    title: "Elite Trainers",
    description: "Access to world-class coaching from former professional athletes and certified specialists."
  },
  {
    icon: <Zap size={32} />,
    title: "High Performance",
    description: "State-of-the-art gym equipment and recovery zones including cryotherapy and massage."
  },
  {
    icon: <Star size={32} />,
    title: "Private Lounge",
    description: "Exclusive members-only lounge with premium dining, workspaces, and networking areas."
  },
  {
    icon: <Shield size={32} />,
    title: "Secure Access",
    description: "Biometric entry and 24/7 security to ensure a safe and private environment for all members."
  },
  {
    icon: <Globe size={32} />,
    title: "Global Network",
    description: "Reciprocal access to partner elite sports clubs in major cities around the world."
  }
];

export default function Benefits() {
  return (
    <section id="facilities" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Club <br />
              <span className="text-brand">Facilities</span>
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              We provide our members with the tools, connections, and access they need to excel at the highest levels of their respective sports.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-[10vw] font-black text-gray-200 leading-none select-none">01</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 bg-white border border-gray-100 hover:border-brand transition-all hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="mb-6 text-black group-hover:text-brand transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
