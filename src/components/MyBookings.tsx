import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, Trash2, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../App";
import { api } from "../api";

interface Booking {
  id: number;
  user_uid: string;
  sport_id: string;
  sport_name: string;
  trainer_id: string | null;
  trainer_name: string | null;
  date: string;
  time: string;
  price: number;
  status: "confirmed" | "cancelled";
  created_at: string;
}

function normalizeDateOnly(value: string) {
  if (!value) return "";
  if (value.length >= 10 && value[4] === "-" && value[7] === "-") {
    return value.slice(0, 10);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        const data = await api.getBookings(user.uid);
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    // Poll for updates every 10 seconds since we don't have real-time with MySQL easily without WebSockets
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const today = new Date().toISOString().split("T")[0];
  
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = normalizeDateOnly(String(booking.date));
    if (!bookingDate) return false;

    if (filter === "upcoming") {
      return bookingDate >= today && booking.status === "confirmed";
    } else {
      return bookingDate < today || booking.status === "cancelled";
    }
  });

  const handleCancel = async (bookingId: number) => {
    try {
      await api.cancelBooking(bookingId);
      // Refresh bookings
      const data = await api.getBookings(user!.uid);
      setBookings(data);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  if (!user) return null;

  return (
    <section id="my-bookings" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Your <br />
              <span className="text-brand">Schedule</span>
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Manage your upcoming sessions and review your performance history at the Arena.
            </p>
          </div>
          
          <div className="flex bg-white p-1 border border-gray-200">
            <button 
              onClick={() => setFilter("upcoming")}
              className={cn(
                "px-8 py-3 text-xs font-black uppercase tracking-widest transition-all",
                filter === "upcoming" ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setFilter("past")}
              className={cn(
                "px-8 py-3 text-xs font-black uppercase tracking-widest transition-all",
                filter === "past" ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              History
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-black uppercase tracking-tighter text-gray-400">No {filter} bookings found</p>
            <a href="#courts" className="text-brand text-xs font-bold uppercase tracking-widest mt-4 inline-block hover:underline">Book your first session</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "p-8 bg-white border border-gray-100 relative group transition-all hover:shadow-xl",
                    booking.status === "cancelled" && "opacity-60 grayscale"
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        {booking.trainer_id ? "Private Training" : "Court Session"}
                      </p>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">
                        {booking.trainer_name || booking.sport_name}
                      </h3>
                    </div>
                    <div className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full",
                      booking.status === "confirmed" ? "bg-brand/10 text-brand" : "bg-red-100 text-red-600"
                    )}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={16} className="text-brand" />
                      <span className="text-sm font-bold uppercase tracking-widest">{normalizeDateOnly(String(booking.date))}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} className="text-brand" />
                      <span className="text-sm font-bold uppercase tracking-widest">{booking.time}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                    <span className="text-xl font-black tracking-tighter">₹{booking.price}</span>
                    {filter === "upcoming" && booking.status === "confirmed" && (
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Trash2 size={14} />
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
