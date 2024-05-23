import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import WeatherModel from "./weather";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
});

const Weather = WeatherModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Weather,
};

export { db, sequelize, Weather };
