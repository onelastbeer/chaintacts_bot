var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(process.env.CHAINTACT_BOT_TOKEN, {polling: true});
var mongoose = require('mongoose');
var dbUrl = "mongodb://localhost/chaintactdb";

mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("I'm in!");
});

//Database
var userSchema = mongoose.Schema({
    telegramID: String,
    telegramUsername: String,
    firstName: String,
    lastName: String,
    ETHAddress: String
});

var User = mongoose.model('User', userSchema);

bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});

//BOT commands

var helpText = "Commands:\n /chaintact help - List of commands\n"
  + "/chaintact set [ETH address] - Set your ETH address to your profil\n"
  + "/chaintact get [telegram user] - Sends this user ETH address"
  + "\n/chaintact group - Sends the list of all group users ETH addresses"

//matches /start
bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = "Welcome to your ChaintactBot\n"
  message += helpText
  bot.sendMessage(fromId, message);
});

//match /chaintact [whatever]
bot.onText(/\/chaintact (.+)/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var command = match[1];
  var message;
  switch(command) {
    case "help":
      message = helpText;
      break;
    case "set":
      message = "coming soon!";
      break;
    case "get":
      message = "coming soon!";
      break;
    case "group":
      message = "coming soon!";
      break;
    default:
      message = helpText;
  }
  bot.sendMessage(fromId, message);
});

//match /chaintact
bot.onText(/\/chaintact/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = helpText
  bot.sendMessage(fromId, message);
});
