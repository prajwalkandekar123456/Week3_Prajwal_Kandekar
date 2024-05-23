import express from "express";
import {
  saveWeatherMapping,
  getWeatherDashboard,
  mailWeatherData,
} from "../controllers/weatherController";

const router = express.Router();

router.post("/SaveWeatherMapping", saveWeatherMapping);
router.get("/weatherDashboard", getWeatherDashboard);
router.post("/mailWeatherData", mailWeatherData);

export default router;
