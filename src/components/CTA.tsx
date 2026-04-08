import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../App";
import { api } from "../api";

export default function CTA() {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    sport_interest: "General"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await api.createApplication({
        user_uid: user.uid,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        sport_interest: formData.sport_interest,
        experience: formData.experience
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Application error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="membership" className="py-32 px-4 sm:px-6 lg:px-8 bg-black text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <AnimatePresence mode="wait">
          {!isApplying && !isSubmitted ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
                Join the <br />
                <span className="text-brand">Arena</span>
              </h2>
              
              <p className="max-w-2xl text-xl md:text-2xl font-medium text-gray-400 leading-relaxed mb-16">
                Membership is by application only. We are looking for individuals who are actively shaping the future of sports and performance.
              </p>
              
              <button 
                onClick={() => {
                  if (!user) {
                    import("../firebase").then(m => m.signInWithGoogle());
                  } else {
                    setIsApplying(true);
                  }
                }}
                className="group bg-brand text-black px-12 py-6 text-sm font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3"
              >
                {!user ? "Login to Apply" : "Apply for Membership"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-20"
            >
              <div className="bg-brand/20 p-6 rounded-full mb-8">
                <CheckCircle2 size={64} className="text-brand" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Application Received</h2>
              <p className="text-xl text-gray-400 max-w-lg">Our membership committee will review your profile and contact you within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto text-left"
            >
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center">Membership Application</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-brand outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-brand outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-brand outline-none transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sports Experience / Goals</label>
                  <textarea 
                    rows={4}
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-brand outline-none transition-colors resize-none"
                    placeholder="Tell us about your athletic background..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="flex-1 border border-white/10 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Submit Application"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-[0.05] pointer-events-none select-none">
        <span className="text-[60vw] font-black uppercase tracking-tighter leading-none block text-center">
          APPLY
        </span>
      </div>
    </section>
  );
}
