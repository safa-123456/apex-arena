import { Instagram, Twitter, Linkedin, Youtube, ArrowUp } from "lucide-react";
import { useAuth } from "../App";

export default function Footer() {
  const { user } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-sm">
            <span className="text-3xl font-black tracking-tighter uppercase mb-6 block">
              APEX <span className="text-brand">ARENA</span>
            </span>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              APEX ARENA is the ultimate destination for elite athletes and performance enthusiasts.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-brand transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-6">Club</h4>
              <ul className="space-y-4">
                <li><a href="#facilities" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Facilities</a></li>
                <li><a href="#courts" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Courts</a></li>
                <li><a href="#trainers" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Trainers</a></li>
                <li><a href="#membership" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Membership</a></li>
                {user && (
                  <li><a href="#my-bookings" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">My Schedule</a></li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            © 2026 APEX ARENA. All Rights Reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            Back to top
            <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
