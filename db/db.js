import "dotenv/config";
import { Sequelize } from "sequelize";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const DB_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  logging: false,
  sync: { force: false },
});

export default sequelize;
