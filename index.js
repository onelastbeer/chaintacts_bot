var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(process.env.CHAINTACT_BOT_TOKEN, {polling: true});
var mongoose = require('mongoose');
var dbUrl = "mongodb://chaintact_db/chaintactdb";

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

var helpText = "Commands for /chaintact :\n"
  + "    help - List of commands\n"
  + "    set [ETH address] - Set your ETH address to your profil\n"
  + "    get [telegram user] - Sends this user ETH address\n"
  + "    group - Sends the list of all group users ETH addresses"

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
  var fromUsername = "";
  var fromLastName = "";
  var fromFirstName = "";
  if(msg.from.username != null) fromUsername = msg.from.username
  if(msg.from.first_name != null) fromFirstName = msg.from.username
  if(msg.from.last_name != null) fromLastName = msg.from.username
  var command = match[1];
  var commandArr = command.split(" ");
  var message;

  if(commandArr.length < 1) {
    message = helpText;
    bot.sendMessage(fromId, message);
    return;
  }

  switch(commandArr[0]) {
    case "help":
      message = helpText;
      break;
    case "set":

      if(commandArr[1] == null) {
        message = "Please enter an ETH address!";
        break;
      }

      User.findOne({telegramID: fromId}, function(err, user) {
        if(user == null) {
          var newUser = new User({telegramID:fromId, telegramUsername:fromUsername, firstName:fromFirstName, lastName:fromLastName, ETHAddress:match[2]});
          newUser.save(function (err) {
            if (err) return handleError(err);
            console.log("User " + fromId + "created with address " + commandArr[1]);
            message = "You have been added to the database with address :\n"
            message += commandArr[1]
            bot.sendMessage(fromId, message);
          })
        } else {
          user.telegramUsername = fromUsername
          user.firstName = fromFirstName
          user.lastName = fromLastName
          user.ETHAddress = match[2]
          user.save(function (err) {
            if (err) return handleError(err, user);
            console.log("User " + fromId + "updated with address " + commandArr[1]);
            console.log(user)
            message = "Your address has been updated to :\n"
            message += commandArr[1]
            bot.sendMessage(fromId, message);
          })
        }
      })
      break;
    case "get":
      message = "Coming soon!";
      break;
    case "group":
      message = "Coming soon!";
      break;
    default:
      message = helpText;
  }
  if(message != null) bot.sendMessage(fromId, message);
});
