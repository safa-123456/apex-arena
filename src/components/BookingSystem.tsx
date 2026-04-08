import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, Clock, Trophy, Users, ChevronRight, CheckCircle2, LogIn, User as UserIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../App";
import { signInWithGoogle } from "../firebase";
import { trainers } from "../constants/trainers";
import { api } from "../api";

const sports = [
  { id: "tennis", name: "Tennis", icon: "🎾", courts: 8, price: 1500 },
  { id: "padel", name: "Padel", icon: "🏸", courts: 6, price: 2000 },
  { id: "basketball", name: "Basketball", icon: "🏀", courts: 4, price: 2500 },
  { id: "squash", name: "Squash", icon: "🎾", courts: 5, price: 1200 },
];

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM"
];

export default function BookingSystem() {
  const { user } = useAuth();
  const [bookingType, setBookingType] = useState<"court" | "trainer">("court");
  const [selectedSport, setSelectedSport] = useState(sports[0]);
  const [selectedTrainer, setSelectedTrainer] = useState(trainers[0]);
  const [selectedDate, setSelectedDate] = useState("2026-04-06");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }).toUpperCase();
  };

  // Fetch booked slots when date or sport changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const data = await api.getAvailableSlots(selectedDate, selectedSport.id);
        setBookedSlots(data.bookedSlots || []);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, selectedSport.id]);

  const handleBooking = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    if (selectedTime) {
      setIsBooking(true);
      try {
        const bookingData = {
          user_uid: user.uid,
          sport_id: selectedSport.id,
          sport_name: selectedSport.name,
          trainer_id: bookingType === "trainer" ? selectedTrainer.id : null,
          trainer_name: bookingType === "trainer" ? selectedTrainer.name : null,
          date: selectedDate,
          time: selectedTime,
          price: bookingType === "court" ? selectedSport.price : selectedTrainer.price,
        };

        await api.createBooking(bookingData);
        
        setIsBooked(true);
        setSelectedTime(null);
        setTimeout(() => setIsBooked(false), 5000);
      } catch (error) {
        console.error("Booking error:", error);
      } finally {
        setIsBooking(false);
      }
    }
  };

  return (
    <section id="courts" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Elite <br />
              <span className="text-brand">Reservations</span>
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Book your professional court or schedule a private session with our elite trainers.
            </p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-none">
            <button 
              onClick={() => { setBookingType("court"); setSelectedTime(null); }}
              className={cn(
                "px-8 py-3 text-xs font-black uppercase tracking-widest transition-all",
                bookingType === "court" ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              Courts
            </button>
            <button 
              onClick={() => { setBookingType("trainer"); setSelectedTime(null); }}
              className={cn(
                "px-8 py-3 text-xs font-black uppercase tracking-widest transition-all",
                bookingType === "trainer" ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              Trainers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Selection Column */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Step 1: Select {bookingType === "court" ? "Sport" : "Trainer"}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {bookingType === "court" ? (
                sports.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => setSelectedSport(sport)}
                    className={cn(
                      "flex items-center justify-between p-6 border-2 transition-all text-left",
                      selectedSport.id === sport.id 
                        ? "border-brand bg-black text-white" 
                        : "border-gray-100 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{sport.icon}</span>
                      <div>
                        <p className="font-black uppercase tracking-tighter text-lg">{sport.name}</p>
                        <p className={cn("text-xs font-bold uppercase tracking-widest", selectedSport.id === sport.id ? "text-brand" : "text-gray-400")}>
                          {sport.courts} Courts Available
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className={cn(selectedSport.id === sport.id ? "text-brand" : "text-gray-300")} />
                  </button>
                ))
              ) : (
                trainers.map((trainer) => (
                  <button
                    key={trainer.id}
                    onClick={() => setSelectedTrainer(trainer)}
                    className={cn(
                      "flex items-center justify-between p-4 border-2 transition-all text-left",
                      selectedTrainer.id === trainer.id 
                        ? "border-brand bg-black text-white" 
                        : "border-gray-100 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <img src={trainer.image} alt="" className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-black uppercase tracking-tighter text-lg">{trainer.name}</p>
                        <p className={cn("text-[10px] font-bold uppercase tracking-widest", selectedTrainer.id === trainer.id ? "text-brand" : "text-gray-400")}>
                          {trainer.role}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className={cn(selectedTrainer.id === trainer.id ? "text-brand" : "text-gray-300")} />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Step 2: Choose Date & Time</h3>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Date:</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-100 focus:border-brand outline-none font-semibold text-sm hover:border-gray-300 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              <CalendarIcon size={14} />
              <span>{formatDate(selectedDate)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {isLoadingSlots ? (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <p className="text-sm font-semibold">Loading available slots...</p>
                </div>
              ) : (
                timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={isBooked}
                      className={cn(
                        "py-4 border-2 text-xs font-bold uppercase tracking-widest transition-all",
                        isBooked
                          ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-50"
                          : selectedTime === time 
                            ? "border-brand bg-brand text-black" 
                            : "border-gray-100 hover:border-gray-300 cursor-pointer"
                      )}
                      title={isBooked ? "This slot is already booked" : ""}
                    >
                      {time}
                    </button>
                  );
                })
              )}
            </div>

            {/* Booking Summary */}
            <div className="mt-12 p-8 bg-gray-50 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      {bookingType === "court" ? "Sport" : "Trainer"}
                    </p>
                    <p className="font-black uppercase tracking-tighter text-xl">
                      {bookingType === "court" ? selectedSport.name : selectedTrainer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</p>
                    <p className="font-black uppercase tracking-tighter text-xl">{formatDate(selectedDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Time</p>
                    <p className="font-black uppercase tracking-tighter text-xl">{selectedTime || "--:--"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Price</p>
                    <p className="font-black uppercase tracking-tighter text-xl">
                      ₹{bookingType === "court" ? selectedSport.price : selectedTrainer.price}
                    </p>
                  </div>
                </div>

                <button
                  disabled={!selectedTime || isBooking}
                  onClick={handleBooking}
                  className={cn(
                    "w-full md:w-auto px-12 py-5 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                    !selectedTime ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                    isBooking ? "bg-gray-800 text-white cursor-wait" :
                    "bg-black text-white hover:bg-gray-800"
                  )}
                >
                  {!user ? (
                    <>
                      <LogIn size={18} />
                      Login to Book
                    </>
                  ) : isBooked ? (
                    <>
                      <CheckCircle2 size={18} className="text-brand" />
                      Confirmed
                    </>
                  ) : isBooking ? (
                    "Processing..."
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isBooked && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-black text-white p-6 shadow-2xl border-l-4 border-brand z-50 flex items-center gap-4"
          >
            <div className="bg-brand/20 p-2 rounded-full">
              <CheckCircle2 className="text-brand" size={24} />
            </div>
            <div>
              <p className="font-black uppercase tracking-tighter">Booking Confirmed</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Reservation saved to your account.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
