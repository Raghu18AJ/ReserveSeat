const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ReserveSeat",
  password: "postgresql18@j",
  port: 5432,
});

// Get all seats
app.get("/seats", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats ORDER BY row_number, seat_number");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Reserve seats
app.post("/reserve", async (req, res) => {
  const { numSeats } = req.body;

  try {
    // Find available seats
    const availableSeats = await pool.query(
      "SELECT * FROM seats WHERE is_booked = FALSE ORDER BY row_number, seat_number LIMIT $1",
      [numSeats]
    );

    if (availableSeats.rows.length < numSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Reserve seats
    const seatIds = availableSeats.rows.map((seat) => seat.seat_id);
    await pool.query("UPDATE seats SET is_booked = TRUE WHERE seat_id = ANY($1)", [seatIds]);

    res.json({
      message: "Seats reserved successfully",
      seats: availableSeats.rows.map((seat) => `Row ${seat.row_number}, Seat ${seat.seat_number}`),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
