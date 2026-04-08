/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase";
import { api } from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookingSystem from "./components/BookingSystem";
import MyBookings from "./components/MyBookings";
import Benefits from "./components/Benefits";
import MembersGrid from "./components/MembersGrid";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/Toast";

// Auth Context
interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      if (firebaseUser) {
        try {
          // Sync user in the background
          api.syncUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          }).catch(err => console.error("Background sync failed:", err));
        } catch (error) {
          console.error("Failed to sync user with MySQL:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ToastProvider>
      <AuthContext.Provider value={{ user, loading }}>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Hero />
            <BookingSystem />
            <MyBookings />
            <Benefits />
            <MembersGrid />
            <CTA />
          </main>
          <Footer />
        </div>
      </AuthContext.Provider>
    </ToastProvider>
  );
}
