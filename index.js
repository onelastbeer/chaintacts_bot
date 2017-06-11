var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(process.env.CHAINTACT_BOT_TOKEN, {polling: true});
var mongoose = require('mongoose');
var dbUrl = "mongodb://localhost:27017/chaintactdb";

mongoose.connect(dbUrl);

//Database
var peopleSchema = mongoose.Schema({
    telegramID: String,
    telegramUsername: String,
    firstName: String,
    lastName: String,
    ETHAddress: String
});

bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});

//BOT commands
//matches /start
bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = "Welcome to your ChaintactBot\n"
  message += "Commands:\n"
  message += "/chaintact help - List of commands\n"
  message += "/chaintact set [ETH address] - Set your ETH address to your profil\n"
  message += "/chaintact get [telegram user] - Sends this user ETH address\n"
  message += "/chaintact group - Sends the list of all group users ETH addresses"
  bot.sendMessage(fromId, message);
});

//match /weather [whatever]
bot.onText(/\/chaintact (.+)/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var command = match[1];

  switch(command) {

  }
  bot.sendMessage(fromId, message);
});
