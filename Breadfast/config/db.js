const mongoose = require("mongoose");
require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../models/Product");
const User = require("../models/User");

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.set("strictQuery", false);

let inMemoryServer = null;

const sampleProducts = [
  {
    name: "Fresh Milk",
    category: "Dairy",
    price: 35,
    quantity: 40,
    description: "Fresh full-fat milk.",
    imageUrl: "/img/upload/fresh_milk_1780911412565.png",
  },
  {
    name: "Butter Croissant",
    category: "Bakeries & Pastries",
    price: 25,
    quantity: 50,
    description: "Buttery and flaky croissant.",
    imageUrl: "/img/upload/butter_croissant_1780912005195.png",
  },
  {
    name: "Bananas",
    category: "Fruits and Veggies",
    price: 18,
    quantity: 100,
    description: "Fresh ripe bananas.",
    imageUrl: "/img/upload/fresh_bananas_1780912018722.png",
  },
  {
    name: "Potato Chips",
    category: "Snacks",
    price: 20,
    quantity: 75,
    description: "Classic salted chips.",
    imageUrl: "/img/upload/potato_chips_1780911435778.png",
  },
  {
    name: "Fresh Baked Bread",
    category: "Bakeries & Pastries",
    price: 45,
    quantity: 30,
    description: "A beautiful loaf of freshly baked bread.",
    imageUrl: "/img/upload/fresh_bread_1780911374837.png",
  },
  {
    name: "Red Apples",
    category: "Fruits and Veggies",
    price: 25,
    quantity: 100,
    description: "Basket of fresh red apples.",
    imageUrl: "/img/upload/fresh_apples_1780911422641.png",
  },
  {
    name: "Orange Juice",
    category: "Beverages",
    price: 30,
    quantity: 60,
    description: "100% pure squeezed orange juice.",
    imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451b02?w=500&q=80",
  },
  {
    name: "Cheddar Cheese Block",
    category: "Dairy",
    price: 55,
    quantity: 20,
    description: "Rich and sharp cheddar cheese.",
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80",
  },
  {
    name: "Fresh Tomatoes",
    category: "Fruits and Veggies",
    price: 15,
    quantity: 150,
    description: "Juicy vine-ripened tomatoes.",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80",
  },
  {
    name: "Moisturizing Shampoo",
    category: "Beauty Essentials",
    price: 80,
    quantity: 40,
    description: "Nourishing shampoo for daily use.",
    imageUrl: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=500&q=80",
  },
];

async function seedDataIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log("Seeded sample products.");
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.create([
      {
        firstName: "Admin",
        lastName: "Account",
        email: "admin@breadfast.com",
        password: "password123",
        role: "admin",
      },
      {
        firstName: "Normal",
        lastName: "User",
        email: "user@breadfast.com",
        password: "password123",
        role: "user",
      }
    ]);
    console.log("Seeded default users (admin@breadfast.com, user@breadfast.com) with password: password123");
  }
}

async function startInMemoryServer() {
  try {
    inMemoryServer = await MongoMemoryServer.create();
    const uri = inMemoryServer.getUri();
    const opts = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(uri, opts);
    console.log("Connected to in-memory MongoDB for local demo.");
    await seedDataIfEmpty();
  } catch (err) {
    console.error("Failed to start in-memory MongoDB:", err.message);
  }
}

async function connectDB() {
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (!MONGO_URI || MONGO_URI.trim() === "") {
    console.log("No MONGO_URI set — starting in-memory MongoDB.");
    await startInMemoryServer();
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, options);
    console.log("mongodb connection success!");
    await seedDataIfEmpty();
  } catch (err) {
    console.error("mongodb connection failed!", err.message);
    console.warn("Falling back to in-memory MongoDB for local demo.");
    await startInMemoryServer();
  }
}

module.exports = connectDB;
