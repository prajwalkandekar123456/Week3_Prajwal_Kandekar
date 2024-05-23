"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailWeatherData = exports.getWeatherDashboard = exports.saveWeatherMapping = void 0;
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const nodemailer_1 = __importDefault(require("nodemailer"));
const saveWeatherMapping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = req.body;
        const geoCodingApiKey = process.env.GEOCODING_API_KEY;
        const weatherApiKey = process.env.WEATHER_API_KEY;
        for (const location of locations) {
            const geoResponse = yield axios_1.default.get(`https://api.api-ninjas.com/v1/geocoding?city=${location.city}&country=${location.country}`, {
                headers: { "X-Api-Key": geoCodingApiKey },
            });
            console.log("GeoCoding API Response:", geoResponse.data);
            const { latitude, longitude } = geoResponse.data[0];
            const weatherResponse = yield axios_1.default.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`, {
                headers: { "X-RapidAPI-Key": weatherApiKey },
            });
            console.log("Weather API Response:", weatherResponse.data);
            const weatherData = weatherResponse.data.current.condition.text;
            const time = new Date();
            yield models_1.Weather.create({
                city: location.city,
                country: location.country,
                weather: weatherData,
                time: time,
                longitude: longitude,
                latitude: latitude,
            });
        }
        res.status(201).send("Weather data saved successfully.");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error saving weather data.");
    }
});
exports.saveWeatherMapping = saveWeatherMapping;
const getWeatherDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city } = req.query;
        if (typeof city === "string") {
            const weatherData = yield models_1.Weather.findAll({ where: { city } });
            res.json(weatherData);
        }
        else {
            const weatherData = yield models_1.Weather.findAll({
                attributes: [
                    "city",
                    "country",
                    [sequelize_1.Sequelize.fn("MAX", sequelize_1.Sequelize.col("time")), "time"],
                    "weather",
                ],
                group: ["city", "country"],
                order: [[sequelize_1.Sequelize.fn("MAX", sequelize_1.Sequelize.col("time")), "DESC"]],
            });
            res.json(weatherData);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data.");
    }
});
exports.getWeatherDashboard = getWeatherDashboard;
const mailWeatherData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = req.body;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "prajwaldummy123456@gmail.com",
                pass: "Swami@123",
            },
        });
        let htmlContent = "<table><tr><th>City</th><th>Country</th><th>Weather</th><th>Time</th><th>Longitude</th><th>Latitude</th></tr>";
        for (const location of locations) {
            const weatherData = yield models_1.Weather.findOne({
                where: { city: location.city, country: location.country },
                order: [["time", "DESC"]],
            });
            if (weatherData) {
                htmlContent += `<tr><td>${weatherData.city}</td><td>${weatherData.country}</td><td>${weatherData.weather}</td><td>${weatherData.time}</td><td>${weatherData.longitude}</td><td>${weatherData.latitude}</td></tr>`;
            }
        }
        htmlContent += "</table>";
        const mailOptions = {
            from: "prajwaldummy123456@gmail.com",
            to: "prajwalkandekar@gmail.com",
            subject: "Weather Data",
            html: htmlContent,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send("Error sending email.");
            }
            else {
                res.send("Email sent: " + info.response);
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error processing email request.");
    }
});
exports.mailWeatherData = mailWeatherData;
