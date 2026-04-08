import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import dbInstance from "./src/db";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// API Routes

// Sync User
app.post("/api/users/sync", async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  try {
    const [rows] = await dbInstance.execute(
      "INSERT INTO users (uid, email, displayName, photoURL) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = ?, displayName = ?, photoURL = ?",
      [uid, email, displayName, photoURL, email, displayName, photoURL]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// Get Available Slots
app.get("/api/bookings/available/:date/:sport", async (req, res) => {
  const { date, sport } = req.params;
  try {
    const [rows] = await dbInstance.execute(
      "SELECT time FROM bookings WHERE date = ? AND sport_id = ? AND status = 'confirmed'",
      [date, sport]
    );
    const bookedSlots = (rows as any[]).map((row) => row.time);
    res.json({ bookedSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// Create Booking
app.post("/api/bookings", async (req, res) => {
  const { user_uid, sport_id, sport_name, trainer_id, trainer_name, date, time, price } = req.body;
  try {
    // Check if slot is already booked
    const [existing] = await dbInstance.execute(
      "SELECT id FROM bookings WHERE date = ? AND time = ? AND sport_id = ? AND status = 'confirmed'",
      [date, time, sport_id]
    );
    
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ error: "This slot is already booked" });
    }

    const [result] = await dbInstance.execute(
      "INSERT INTO bookings (user_uid, sport_id, sport_name, trainer_id, trainer_name, date, time, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [user_uid, sport_id, sport_name, trainer_id, trainer_name, date, time, price]
    );
    res.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get User Bookings
app.get("/api/bookings/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const [rows] = await dbInstance.execute(
      "SELECT * FROM bookings WHERE user_uid = ? ORDER BY created_at DESC",
      [uid]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Cancel Booking
app.patch("/api/bookings/:id/cancel", async (req, res) => {
  const { id } = req.params;
  try {
    await dbInstance.execute(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Create Membership Application
app.post("/api/applications", async (req, res) => {
  const { user_uid, full_name, email, phone, sport_interest, experience } = req.body;
  try {
    const [result] = await dbInstance.execute(
      "INSERT INTO applications (user_uid, full_name, email, phone, sport_interest, experience) VALUES (?, ?, ?, ?, ?, ?)",
      [user_uid, full_name, email, phone, sport_interest, experience]
    );
    res.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
});

// Vite Middleware for Development
async function startServer() {
  console.log("Starting server...");
  const startTime = Date.now();
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log(`Vite initialized in ${Date.now() - startTime}ms`);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${Date.now() - startTime}ms`);
  });
}

startServer();
