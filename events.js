const days = require('./constants');

const events = [
  {
    message:
      "The work of today is the history of tomorrow, and we are its makers - Juliette Gordon Low.",
    days: days.ALL_DAYS,
    hours: 23,
    minutes: 0,
    seconds: 0,
  },
  {
    message: "Every strike brings me closer to the next home run. - Babe Ruth",
    days: days.WEEKEND_DAYS,
    hours: 16,
    minutes: 0,
    seconds: 0,
  },
  {
    message: "Every strike brings me closer to the next home run. - Babe Ruth",
    days: days.ALL_DAYS,
    hours: 16,
    minutes: 0,
    seconds: 0,
  },
  {
    message: "Every strike brings me closer to the next home run. - Babe Ruth",
    days: [days.MONDAY, days.WEDNESDAY, days.FRIDAY],
    hours: 16,
    minutes: 0,
    seconds: 0,
  },
];

module.exports = events;
