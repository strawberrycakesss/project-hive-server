import "dotenv/config";
import mongoose from "mongoose";

import {
  User,
  Cinema,
  Showtime,
  Merchandise,
  Character,
  Submission,
  Prediction,
} from "../models/index.js";

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MongoDB connection string is missing. Check MONGO_URI or MONGODB_URI in your .env file."
      );
    }

    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Cinema.deleteMany({}),
      Showtime.deleteMany({}),
      Merchandise.deleteMany({}),
      Character.deleteMany({}),
      Submission.deleteMany({}),
      Prediction.deleteMany({}),
    ]);

    console.log("Existing data cleared");

    // -----------------------------------
    // USERS
    // -----------------------------------

    const [u1, u2] = await User.create([
      {
        name: "DoomFan",
        email: "doomfan@example.com",
        role: "fan",
      },
      {
        name: "Site Admin",
        email: "admin@example.com",
        role: "admin",
      },
    ]);

    console.log("Users created");

    // -----------------------------------
    // CINEMAS
    // -----------------------------------

    const cinemas = await Cinema.create([
      {
        name: "SM Cinema",
        branch: "Angeles",
        city: "Angeles City",
        address: "Sample Cinema Branch",
        capacity: 180,
      },
      {
        name: "Ayala Malls Cinema",
        branch: "Clark",
        city: "Clark",
        address: "Sample Cinema Branch",
        capacity: 150,
      },
      {
        name: "Robinsons Movieworld",
        branch: "San Fernando",
        city: "San Fernando",
        address: "Sample Cinema Branch",
        capacity: 120,
      },
    ]);

    console.log("Cinemas created");

    // -----------------------------------
    // SHOWTIMES
    // -----------------------------------

    const showtimes = cinemas.map((cinema, index) => ({
      cinemaId: cinema._id,
      movieTitle: "Avengers: Doomsday",

      date: new Date(
        Date.now() + (7 + index) * 24 * 60 * 60 * 1000
      ),

      time: ["14:30", "17:30", "20:30"][index],

      capacity: cinema.capacity,

      ticketPrice: 320 + index * 30,
    }));

    await Showtime.create(showtimes);

    console.log("Showtimes created");

    // -----------------------------------
    // MERCHANDISE
    // -----------------------------------

    await Merchandise.create([
      {
        name: "Doomsday Hoodie",
        category: "Apparel",
        price: 1200,
        stock: 25,
        discountPercent: 15,
        discountExpiresAt: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ),
      },
      {
        name: "Avengers Poster",
        category: "Collectibles",
        price: 300,
        stock: 60,
        discountPercent: 10,
        discountExpiresAt: new Date(
          Date.now() + 10 * 24 * 60 * 60 * 1000
        ),
      },
      {
        name: "Doom Character Pin",
        category: "Collectibles",
        price: 150,
        stock: 100,
        discountPercent: 5,
        discountExpiresAt: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ),
      },
      {
        name: "Avengers Cap",
        category: "Apparel",
        price: 550,
        stock: 30,
        discountPercent: 0,
      },
    ]);

    console.log("Merchandise created");

    // -----------------------------------
    // CHARACTERS
    // -----------------------------------

    const characters = await Character.create([
      {
        name: "Doctor Doom",
        comicRole: "Major antagonist",
        description: "Community prediction subject.",
      },
      {
        name: "Captain America",
        comicRole: "Avenger",
        description: "Community prediction subject.",
      },
      {
        name: "Thor",
        comicRole: "Avenger",
        description: "Community prediction subject.",
      },
      {
        name: "Doctor Strange",
        comicRole: "Mystic hero",
        description: "Community prediction subject.",
      },
      {
        name: "Spider-Man",
        comicRole: "Hero",
        description: "Community prediction subject.",
      },
    ]);

    console.log("Characters created");

    // -----------------------------------
    // PREDICTIONS
    // -----------------------------------

    const predictions = characters.map((character, index) => ({
      userId: u1._id,
      characterId: character._id,
      predictedScreenTime: 43 - index * 5,
      storyline: "Secret Wars",
    }));

    await Prediction.create(predictions);

    console.log("Predictions created");

    // -----------------------------------
    // FAN SUBMISSIONS
    // -----------------------------------

    await Submission.create([
      {
        userId: u1._id,
        title: "Secret Wars could shape the movie",
        content:
          "A fan theory connecting the movie to a major comic storyline.",
        category: "comic-possibility",
        status: "approved",
        votes: 42,
      },
      {
        userId: u1._id,
        title: "Doctor Doom may lead the screen-time ranking",
        content:
          "Community prediction for the character with the most important scenes.",
        category: "screen-time",
        status: "pending",
        votes: 18,
      },
    ]);

    console.log("Submissions created");

    // -----------------------------------
    // COMPLETE
    // -----------------------------------

    console.log("Seed complete");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    // Always disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase();