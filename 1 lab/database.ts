import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("db", 'user', 'pass', {

    pool: {
        acquire: 1000,
        min: 0,
        idle: 200000,
        max: 2,
    },
    dialect: "sqlite",
    logging: false,
    host: "./Turtles.sqlite",
});

export default sequelize;