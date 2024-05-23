import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface WeatherAttributes {
  id: number;
  city: string;
  country: string;
  weather: string;
  time: Date;
  longitude: number;
  latitude: number;
}

interface WeatherCreationAttributes extends Optional<WeatherAttributes, "id"> {}

class Weather
  extends Model<WeatherAttributes, WeatherCreationAttributes>
  implements WeatherAttributes
{
  public id!: number;
  public city!: string;
  public country!: string;
  public weather!: string;
  public time!: Date;
  public longitude!: number;
  public latitude!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Weather.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weather: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Weather",
    }
  );

  return Weather;
};
