require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const events = require('./events');

const getRemainingMilliseconds = (next, today) => next - today;

const sendMessage = ([hours, minutes, message]) => {
    const channel = client.channels.get(process.env.CHANNEL_ID);
    channel.send(message);
    setTimerToSendMessageAt(hours, minutes,  message);
}

const getDateTimeForNextMessage = ([today, hours, minutes]) => {
    return new Date(
        today.getFullYear(), today.getMonth(), today.getDate() + 1,
        hours, minutes, 0, 0
    );
};

const getCurrentDateTime = () => new Date();

const setTimerToSendMessageAt = (...args) => {
    const today = getCurrentDateTime();
    const next = getDateTimeForNextMessage([today, ...args]);
    setInterval(() => sendMessage(args), getRemainingMilliseconds(next, today));
};

const setTimers = () => {
    events.forEach(element => {
        const { hours, minutes, message } = element;
        setTimerToSendMessageAt(hours, minutes, message);    
    });
};

client.on('ready', () => {
    console.log(`Hi, my name is Loretta, and this 👉🏽 (${client.user.tag}) is an awkward id.`);
    setTimers();
});

client.login(process.env.TOKEN);
