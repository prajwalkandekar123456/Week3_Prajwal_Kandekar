"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weatherController_1 = require("../controllers/weatherController");
const router = express_1.default.Router();
router.post("/SaveWeatherMapping", weatherController_1.saveWeatherMapping);
router.get("/weatherDashboard", weatherController_1.getWeatherDashboard);
router.post("/mailWeatherData", weatherController_1.mailWeatherData);
exports.default = router;
