import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";
import Election from "./models/Election.js";
import Candidate from "./models/Candidate.js";

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tuvote";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// 🔥 **Clear Database**
const clearDatabase = async () => {
  await User.deleteMany({});
  await Election.deleteMany({});
  await Candidate.deleteMany({});
  console.log("🗑️ Cleared old data");
};

// 🔹 **Create Users**
const createUsers = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
    {
      name: "John Doe",
      email: "user@example.com",
      password: hashedPassword,
      role: "voter",
    },
  ]);

  console.log("✅ Users Created:", users);
};

// 🗳️ **Create Elections, Seats, and Candidates**
const createElections = async () => {
  const electionsData = [
    {
      name: "National Elections",
      description: "General elections for leadership",
    },
    { name: "Local Elections", description: "Elections for local governance" },
  ];

  const elections = await Election.insertMany(electionsData);
  console.log("✅ Elections Created:", elections);

  const election1Seats = ["President", "Vice President", "Speaker"];
  const election2Seats = ["Mayor", "Council Member", "Chief Officer"];

  const candidateNames = {
    President: [
      {
        name: "Barack Obama",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        name: "Nelson Mandela",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        name: "Wangari Maathai",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    ],
    "Vice President": [
      {
        name: "Joe Biden",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        name: "Kofi Annan",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      {
        name: "Margaret Thatcher",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    ],
    Speaker: [
      {
        name: "Nancy Pelosi",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      {
        name: "John Bercow",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      {
        name: "Justin Trudeau",
        avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      },
    ],
    Mayor: [
      {
        name: "Eric Adams",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      },
      {
        name: "Lori Lightfoot",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      {
        name: "Sadiq Khan",
        avatar: "https://randomuser.me/api/portraits/men/8.jpg",
      },
    ],
    "Council Member": [
      {
        name: "AOC",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      {
        name: "Ilhan Omar",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      },
      {
        name: "Cory Booker",
        avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      },
    ],
    "Chief Officer": [
      {
        name: "Kamala Harris",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      },
      {
        name: "Pete Buttigieg",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg",
      },
      {
        name: "Gavin Newsom",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      },
    ],
  };

  let candidatesData = [];

  // Assign unique seats to each election
  elections.forEach((election, index) => {
    const seats = index === 0 ? election1Seats : election2Seats;

    seats.forEach((seat) => {
      candidateNames[seat].forEach(({ name, avatar }) => {
        candidatesData.push({
          name,
          election: election._id,
          seat,
          avatar,
          votes: 0,
        });
      });
    });
  });

  const candidates = await Candidate.insertMany(candidatesData);
  console.log("✅ Candidates Created:", candidates);
};

// 🚀 **Seed Database**
const seedDatabase = async () => {
  try {
    await clearDatabase();
    await createUsers();
    await createElections();
    console.log("🎉 Database Seeded Successfully!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
