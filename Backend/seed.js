import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import Seat from "./models/Seat.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing events and seats
    await Event.deleteMany({});
    await Seat.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create sample events
    const events = [
      {
        name: "Marvel Concert 2024",
        date: new Date("2024-12-20"),
        time: "19:00",
        venue: "Madison Square Garden, New York",
        totalSeats: 100,
        seatsPerRow: 10,
      },
      {
        name: "Tech Conference 2025",
        date: new Date("2025-01-15"),
        time: "09:00",
        venue: "Convention Center, San Francisco",
        totalSeats: 200,
        seatsPerRow: 20,
      },
      {
        name: "Sports Championship",
        date: new Date("2024-12-25"),
        time: "20:00",
        venue: "Staples Center, Los Angeles",
        totalSeats: 150,
        seatsPerRow: 15,
      },
      {
        name: "Music Festival 2024",
        date: new Date("2024-12-28"),
        time: "18:00",
        venue: "Central Park, New York",
        totalSeats: 300,
        seatsPerRow: 20,
      },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} events`);

    // Create seats for each event
    let totalSeatsCreated = 0;
    for (const event of createdEvents) {
      const seats = [];
      const seatsPerRow = event.seatsPerRow;
      const totalRows = Math.ceil(event.totalSeats / seatsPerRow);

      for (let row = 0; row < totalRows; row++) {
        const rowLabel = String.fromCharCode(65 + row); // A, B, C, etc.
        for (let col = 1; col <= seatsPerRow; col++) {
          if (seats.length < event.totalSeats) {
            seats.push({
              eventId: event._id,
              seatNumber: `${rowLabel}${col}`,
              status: "available",
              row: rowLabel,
              column: col,
            });
          }
        }
      }

      await Seat.insertMany(seats);
      totalSeatsCreated += seats.length;
      console.log(`✅ Created ${seats.length} seats for "${event.name}"`);
    }

    console.log(`✅ Total seats created: ${totalSeatsCreated}`);
    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
