"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Weather extends sequelize_1.Model {
}
exports.default = (sequelize) => {
    Weather.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        city: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        weather: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        longitude: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        latitude: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Weather",
    });
    return Weather;
};
