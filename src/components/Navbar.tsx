import { motion } from "motion/react";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../App";
import { signInWithGoogle, logout, setToastCallback } from "../firebase";
import { useToast } from "./Toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setToastCallback(showToast);
  }, [showToast]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black tracking-tighter uppercase">
              APEX <span className="text-brand">ARENA</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#facilities" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors">Facilities</a>
            <a href="#courts" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors">Courts</a>
            <a href="#trainers" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors">Trainers</a>
            <a href="#membership" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors">Membership</a>
            {user && (
              <a href="#my-bookings" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors">My Schedule</a>
            )}
            
            {loading ? (
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={16} className="text-gray-400" />
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-black transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4"
        >
          <a href="#facilities" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2">Facilities</a>
          <a href="#courts" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2">Courts</a>
          <a href="#trainers" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2">Trainers</a>
          <a href="#membership" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2">Membership</a>
          {user && (
            <a href="#my-bookings" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2">My Schedule</a>
          )}
          
          {user ? (
            <button 
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full bg-gray-100 text-black px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <button 
              onClick={() => { signInWithGoogle(); setIsOpen(false); }}
              className="w-full bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}
