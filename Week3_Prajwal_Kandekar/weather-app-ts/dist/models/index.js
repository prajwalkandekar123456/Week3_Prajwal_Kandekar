"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = exports.sequelize = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const weather_1 = __importDefault(require("./weather"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
});
exports.sequelize = sequelize;
const Weather = (0, weather_1.default)(sequelize);
exports.Weather = Weather;
const db = {
    sequelize,
    Sequelize: sequelize_1.Sequelize,
    Weather,
};
exports.db = db;
