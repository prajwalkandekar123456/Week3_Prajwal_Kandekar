import axios from "axios";
import { Request, Response } from "express";
import { Weather } from "../models";
import { Sequelize, Op } from "sequelize";
import nodemailer from "nodemailer";

const saveWeatherMapping = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const locations = req.body;
    const weatherApiKey = process.env.WEATHER_API_KEY;

    for (const location of locations) {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location.city},${location.country}&appid=${weatherApiKey}`
      );

      console.log("GeoCoding API Response:", geoResponse.data);

      const { lat, lon } = geoResponse.data.coord;
      const weatherData = geoResponse.data.weather[0].description;
      const time = new Date();

      await Weather.create({
        city: location.city,
        country: location.country,
        weather: weatherData,
        time: time,
        longitude: lon,
        latitude: lat,
      });
    }
    res.status(201).send("Weather data saved successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving weather data.");
  }
};

const getWeatherDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { city } = req.query;

    if (typeof city === "string") {
      const weatherData = await Weather.findAll({ where: { city } });
      res.json(weatherData);
    } else {
      const latestWeatherData = await Weather.findAll({
        attributes: [
          "city",
          "country",
          "weather",
          "time",
          "longitude",
          "latitude",
        ],
        order: [["time", "DESC"]],
        group: ["city", "country", "weather", "time", "longitude", "latitude"],
        where: Sequelize.literal(`
            (city, country, time) IN (
              SELECT city, country, MAX(time) as time
              FROM "Weather"
              GROUP BY city, country
            )
          `),
      });

      res.json(latestWeatherData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching weather data.");
  }
};

const mailWeatherData = async (req: Request, res: Response): Promise<void> => {
  try {
    const locations = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "prajwaldummy123456@gmail.com",
        pass: "dfhh exwg lgpo jdhb",
      },
    });

    let htmlContent =
      "<table><tr><th>City</th><th>Country</th><th>Weather</th><th>Time</th><th>Longitude</th><th>Latitude</th></tr>";

    for (const location of locations) {
      const weatherData = await Weather.findOne({
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
      to: "prajwalkandekar123456@gmail.com",
      subject: "Weather Data",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error sending email.");
      } else {
        res.send("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing email request.");
  }
};

export { saveWeatherMapping, getWeatherDashboard, mailWeatherData };
