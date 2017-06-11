var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(process.env.CHAINTACT_BOT_TOKEN, {polling: true});


bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});

//matches /start
bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = "Welcome to your ChaintactBot\n"
  message += "Commands:"
  message += "/chaintact help - List of commands"
  message += "/chaintact set [ETH address] - Set your ETH address to your profil"
  message += "/chaintact get [telegram user] - Sends this user ETH address"
  message += "/chaintact group - Sends the list of all group users ETH addresses"
  bot.sendMessage(fromId, message);
});

//match /weather [whatever]
bot.onText(/\/chaintact (.+)/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var postcode = match[1];
  var message = "Coming soon"
  bot.sendMessage(fromId, message);
});
