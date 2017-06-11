var TelegramBot = require('node-telegram-bot-api');
var token = 'CHAINTACT_BOT_TOKEN';

var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});
