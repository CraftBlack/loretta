require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const Discord = require("discord.js");
const client = new Discord.Client();
const events = require("./events");

let invervalsId = [];

const cleanExecutedInternal = () => {
  let timer = invervalsId.shift();
  clearInterval(timer);
};

const afterSendMessage = ([hours, minutes, message]) => {
  cleanExecutedInternal();
  setTimerToSendMessageAt(hours, minutes, message);
};

const getChannel = () => {
  return client.channels.get(process.env.CHANNEL_ID);
};

const sendMessageTo = (args) => {
  const [, , message] = args;
  getChannel().send(message);
  afterSendMessage(args);
};

const getDateTimeForNextMessage = ([today, hours, minutes]) => {
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
    hours,
    minutes,
    0,
    0
  );
};

const getCurrentDateTime = () => new Date();

// 👆🏼 fix from here up

const isSameDay = (date, day) => date.getDay() === day;
const monthDay = (date) => date.getDate();
const isTheHourUp = (date, hours) => date.getHours() > hours;
const getRemainingMilliseconds = (next, today) => next - today;
const sendMessage = () => console.log("Message sent");
const isNegative = (number) => Math.sign(number) === -1;

const buildDate = ({ day, hours, minutes, current }) => {
  console.log(day);
  return new Date(
    current.getFullYear(),
    current.getMonth(),
    day,
    hours,
    minutes,
    0
  );
};

const setTimerPlusSevenDays = (current, config, day) => {
  const futureDate = buildDate({
    day: current.getDate() + 7,
    ...config,
    current,
  });
  console.log(getRemainingMilliseconds(futureDate, current))
  setInterval(
    () => sendMessage(),
    getRemainingMilliseconds(futureDate, current)
  );
};

const setTimerForToday = (current, config) => {
  const futureDate = buildDate({ day: current.getDate(), ...config, current });
  console.log(getRemainingMilliseconds(futureDate, current))
  setInterval(
    () => sendMessage(),
    getRemainingMilliseconds(futureDate, current)
  );
};

const setTimerForNextDay = (current, config, day) => {
  const nextDay = day - current.getDay();
  if (isNegative(nextDay)) {
    const futureDate = buildDate({
      day: current.getDate() + (nextDay + 7),
      ...config,
      current,
    });
    console.log(getRemainingMilliseconds(futureDate, current))
    setInterval(
      () => sendMessage(),
      getRemainingMilliseconds(futureDate, current)
    );
  } else {
    const futureDate = buildDate({
      day: current.getDate() + nextDay,
      ...config,
      current,
    });
  }
};

const analizeAndSetTimer = (config, day) => {
  const current = new Date();
  if (isSameDay(current, day)) {
    if (isTheHourUp(current, config.hours)) {
      setTimerPlusSevenDays(current, config, day);
    } else {
      setTimerForToday(current, config);
    }
  } else {
    setTimerForNextDay(current, config, day);
  }
};

const setTimers = () => {
  events.forEach((config) => {
    config.days.forEach((day) => {
      analizeAndSetTimer(config, day);
    });
  });
};

const setSelfCalling = () => {
  setInterval(() => http.get(process.env.DEPLOY_ENDPOINT), 180000);
};

server.listen(process.env.PORT, () => {
  console.log(`Server up 🙌🏼 and running at 👉🏼 ${process.env.PORT} port. 👽`);
  client.on("ready", () => {
    console.log(
      `Hi, my name is Loretta, and this 👉🏽 (${client.user.tag}) is an awkward id.`
    );
    getChannel().send(`Hola, estaré recordandote algunos eventos. 😃`);
    setSelfCalling();
    setTimers();
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

client.login(process.env.TOKEN);
