import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import axios from 'axios';


const token = '6775402976:AAEOtmphu7k4gsFzsHgX8vMMTB5ohACsNO4';
const bot = new TelegramBot(token, { polling: true });

let subscribers: number[] = [];

const phrasesToStickers: { [key: string]: string } = {
    'привет': 'CAACAgIAAxkBAAErL4dmM7QTbzwEupon2XWGlSEDHiAAAYYAAwwAAhk7WEqzQO9WY2S6TTQE',
    'hello': 'CAACAgIAAxkBAAErL4tmM7Qu9kmPH4a_1CAbVFnUKOBx-gACIhMAAjGVQUnDun6DQKPWQTQE',
    'yo': 'CAACAgIAAxkBAAErL5FmM7Rq3RQU6zaI10hmuzqp6FMERgAC-z0AAiNDwUvvqtPBSqpFGzQE',
    'pipa': 'CAACAgIAAxkBAAErL5VmM7TEWz3Mjk5ag1AqRuaSfXAkDQACRB0AAjAWiUtVbWLrMeibbzQE',
    'popa': 'CAACAgIAAxkBAAErL5NmM7SiuV7AsRJDPZ1hKk_KUeGB1QACCz8AAk3owEoYLT-AVGnB9TQE',
    'писяпопа': 'CAACAgIAAxkBAAErL5tmM7UQ_P39up1SeQAB3o_-zbybUugAAgkKAAIqBtBJHKtPda_6TJk0BA',
};



// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg: TelegramBot.Message, match: RegExpExecArray | null) => {

    const chatId = msg.chat.id;
    if (match) {
        const resp = match[1];
        bot.sendMessage(chatId, resp);
    } else {
        bot.sendMessage(chatId, "😭");
    }
});


bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (!subscribers.includes(chatId)) {
        subscribers.push(chatId);
        bot.sendMessage(chatId, "You have been subscribed to daily facts!");
    } else {
        bot.sendMessage(chatId, "You are already subscribed.");
    }
});

bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    const index = subscribers.indexOf(chatId);
    if (index > -1) {
        subscribers.splice(index, 1);
        bot.sendMessage(chatId, "You have been unsubscribed from daily facts.");
    } else {
        bot.sendMessage(chatId, "You are not subscribed.");
    }
});

cron.schedule('0 0 * * *', () => {
    subscribers.forEach(chatId => {
        sendDailyFact(chatId);
    });
});

async function sendDailyFact(chatId: number) {
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/today');
        const randomFact = response.data.text;
        bot.sendMessage(chatId, randomFact);
    } catch (error) {
        console.error('Error fetching random fact:', error);
        bot.sendMessage(chatId, 'Sorry, I couldn\'t fetch a random fact at this time.');
    }
}

bot.onText(/\/fact/, (msg) => {
    const chatId = msg.chat.id;
    sendRandomFact(chatId);
});

async function sendRandomFact(chatId: number) {
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const randomFact = response.data.text;
        bot.sendMessage(chatId, randomFact);
    } catch (error) {
        console.error('Error fetching random fact:', error);
        bot.sendMessage(chatId, 'Sorry, I couldn\'t fetch a random fact at this time.');
    }
}



bot.onText(/\/help/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
/help - Отображает список доступных команд бота.
/subscribe - Подписывает пользователя на ежедневную рассылку случайного факта.
/unsubscribe - Отписывает пользователя от ежедневной рассылки случайных фактов.
/weather [город] - Предоставляет информацию о погоде в указанном городе.
/joke - Отправляет пользователю случайную шутку.
/cat - Отправляет пользователю случайное изображение кота.
/fact - Отправляет пользователю случайный факт.`)
})

// 3
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.toLowerCase();

    for (const phrase in phrasesToStickers) {
        if (text?.includes(phrase)) {
            const stickerFileId = phrasesToStickers[phrase];
            bot.sendSticker(chatId, stickerFileId);
            break;
        }
    }
});

// 4

bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (match) {
        const city = match[1];
        const apiKey = 'cc653bc922b90ea72af41ddf22540c12'; // Replace with your API key
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

        try {
            const response = await axios.get(url);
            const weatherData = response.data;
            const weatherInfo = `Температура: ${weatherData.main.temp}°C, Влажность: ${weatherData.main.humidity}%, Давление: ${weatherData.main.pressure} hPa, Ветер: ${weatherData.wind.speed} м/c`;
            bot.sendMessage(chatId, weatherInfo);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            bot.sendMessage(chatId, 'Извините, я не смог получить данные о погоде.');
        }
    } else {
        bot.sendMessage(chatId, 'Неверная команда. Пожалуйста, используйте формат /weather [город].');
    }
});


bot.onText(/\/joke/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
        const joke = response.data.joke;
        bot.sendMessage(chatId, joke);
    } catch (error) {
        console.error('Error fetching joke:', error);
        bot.sendMessage(chatId, 'Sorry, I couldn\'t fetch a joke at this time.');
    }
});

bot.onText(/\/cat/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catImageUrl = response.data[0].url;
        bot.sendPhoto(chatId, catImageUrl);
    } catch (error) {
        console.error('Error fetching cat image:', error);
        bot.sendMessage(chatId, 'Sorry, I couldn\'t fetch a cat image at this time.');
    }
});
