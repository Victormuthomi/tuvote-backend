import dotenv from "dotenv";
dotenv.config();

const config = {
  mongoURI: process.env.MONGO_URI,
};

export default config;
