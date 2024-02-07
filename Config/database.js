import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const Model = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: false
}
);
try {
    await Model.authenticate();
    //console.log('Connection  established successfully.');

} catch (err) {
    //console.error('Unable to connect to the database:', err);
}
export { Sequelize, Model }