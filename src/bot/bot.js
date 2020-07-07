const {
  isSameDay,
  isNegative,
  isTimeUp,
  getRemainingMilliseconds,
  buildDate,
  buildNewSettings,
  generateId,
} = require("./utils");

class Bot {
  constructor(client) {
    this.client = client || null;
    this.intervals = [];
  }

  setTimers(events) {
    events.forEach((config) => {
      config.days.forEach((day) => {
        const newConfig = buildNewSettings(config, generateId(), day);
        this.analizeAndSetTimer(newConfig, day);
      });
    });
  }

  analizeAndSetTimer(config, day) {
    const current = new Date();
    if (isSameDay(current, day)) {
      if (isTimeUp(current, config)) {
        console.log("for seven");
        this.setTimerPlusSevenDays(current, config);
      } else {
        console.log("for today");
        this.setTimerForToday(current, config);
      }
    } else {
      console.log("for next");
      this.setTimerForNextDay(current, config, day);
    }
  }

  setTimerForToday(current, config) {
    const futureDate = buildDate({
      day: current.getDate(),
      ...config,
      current,
    });
    this.setTimer({ config, futureDate, current });
  }

  setTimerForNextDay(current, config, day) {
    const nextDay = day - current.getDay();
    if (isNegative(nextDay)) {
      const futureDate = buildDate({
        day: current.getDate() + (nextDay + 7),
        ...config,
        current,
      });
      this.setTimer({ config, futureDate, current });
      return;
    }

    const futureDate = buildDate({
      day: current.getDate() + nextDay,
      ...config,
      current,
    });
    this.setTimer({ config, futureDate, current });
  }

  setTimerPlusSevenDays(current, config) {
    const futureDate = buildDate({
      day: current.getDate() + 7,
      ...config,
      current,
    });
    this.setTimer({ config, futureDate, current });
  }

  setTimer({ config, futureDate, current }) {
    const interval = setInterval(
      () => this.sendMessage(config),
      getRemainingMilliseconds(futureDate, current)
    );
    this.intervals.push({ interval, config });
  }

  sendMessage(config) {
    this.getChannel().send(config.message);
    this.afterSendMessage(config.id);
  }

  getChannel() {
    return this.client.channels.get(process.env.CHANNEL_ID);
  }

  afterSendMessage(intervalId) {
    const config = this.cleanExecutedInternal(intervalId);
    this.setTimerAgain(config);
  }

  setTimerAgain(config) {
    this.setTimers([config]);
  }

  cleanExecutedInternal(intervalId) {
    const found = this.intervals.find((interval) => interval.config.id === intervalId);
    if (found) {
      const { interval, config } = found;
      clearInterval(interval);
      return config;
    }
  }
}

module.exports = Bot;
