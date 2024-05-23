import dotenv from "dotenv";

dotenv.config();

export const development = {
  url: process.env.DATABASE_URL,
  dialect: "postgres",
};
