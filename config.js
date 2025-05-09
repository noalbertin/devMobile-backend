module.exports = {
    development: {
      DB_HOST: "localhost",
      DB_PORT: 3306,
      DB_USER: "root",
      DB_PASSWORD: "",
      DB_NAME: "projet"
    },
    production: {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME
    }
  };