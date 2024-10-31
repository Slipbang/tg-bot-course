const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const token = '7549638739:AAEuAWtQq9w7q5EWR_quberO14qD2EBNcrk';

const bot = new TelegramApi(token, {polling: true});

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать.');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай.', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Получить информацию о профиле'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/1.webp')
            return  bot.sendMessage(chatId, 'Бот готов к работе.')
        }

        if (text === '/info') {
            await  bot.sendMessage(chatId, `Тебя зовут ${message.from.first_name} ${message.from.last_name || ''}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Такая команда отсутствует.')
    })

    bot.on('callback_query', async message => {
        console.log(message)
        const data = +message.data;
        const chatId = message.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздраляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start();