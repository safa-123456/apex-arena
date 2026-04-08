// API Service for MySQL Backend

export const api = {
  async syncUser(user: { uid: string; email: string; displayName: string | null; photoURL: string | null }) {
    const response = await fetch("/api/users/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  async createBooking(booking: {
    user_uid: string;
    sport_id: string;
    sport_name: string;
    trainer_id: string | null;
    trainer_name: string | null;
    date: string;
    time: string;
    price: number;
  }) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    return response.json();
  },

  async getBookings(uid: string) {
    const response = await fetch(`/api/bookings/${uid}`);
    return response.json();
  },

  async getAvailableSlots(date: string, sportId: string) {
    const response = await fetch(`/api/bookings/available/${date}/${sportId}`);
    return response.json();
  },

  async cancelBooking(id: number) {
    const response = await fetch(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
    });
    return response.json();
  },

  async createApplication(application: {
    user_uid: string;
    full_name: string;
    email: string;
    phone: string;
    sport_interest: string;
    experience: string;
  }) {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });
    return response.json();
  },
};
