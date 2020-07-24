require("dotenv").config();
const http = require("http");
const express = require("express");
const { initialize } = require("./src/discord");
const Bot = require("./src/bot/bot");
const events = require("./src/bot/events");

const app = express();
const server = http.createServer(app);
app.get("/", (req, res) => res.send("Hello World!"));

const setSelfCalling = () =>
  setInterval(() => http.get(process.env.DEPLOY_ENDPOINT), 1500000);

server.listen(process.env.PORT, () => {
  console.log(`Server running. 🚀`);
  setSelfCalling();
  const client = initialize();
  new Bot(client).setTimers(events);
});
