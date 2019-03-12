const pg = require("pg");
const users = require("./Models/users");
const flights = require("./Models/flights");

if (process.env.DATABASE_URL) {
  //we need to take apart the url so we can set the appropriate configs

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(":");

  //make the configs object
  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split("/")[1],
    ssl: true
  };
} else {
  const configs = {
    user: "Serene",
    host: "127.0.0.1",
    database: "flights",
    port: 5432
  };
}

const pool = new pg.Pool(configs);

pool.on("error", function(err) {
  console.log("idle client error", err.message, err.stack);
});

module.exports = {
  // get a reference to end the connection pool at server end, parse database into model
  users: users(pool),
  flights: flights(pool),
  pool: pool
};
