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
  + "  -- help - List of commands\n"
  + "  -- set [ETH address] - Set your ETH address to your profil\n"
  + "  -- get [telegram user] - Sends this user ETH address\n"
  + "  -- group - Sends the list of all group users ETH addresses"

//matches /start
bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var chatId = msg.chat.id;
  var message = "Welcome to your ChaintactBot\n"
  message += helpText
  bot.sendMessage(chatId, message);
});

// Inline querying the bot
/*bot.on('inline_query', function(msg, match) {
  var commands = match[1].split(" ");
  var username = commands[0];
  if (username == null) {
    var message = "Please input a username !\n" + helpText
    bot.sendMessage(msg.chat.id, message);
  }
  if (username[0] == "@") username = username.substring(1);
  User.findOne({ telegramUsername: username }, function(err, user) {
    if (user == null) {
      message = "No match found for username " + username
      bot.sendMessage(msg.chat.id, message);
    } else if (user.ETHAddress == null) {
      if (user.firstName != null) {
        message = user.firstName + " (@" + user.telegramUsername + ")"
      } else message = user.telegramUsername
      message += " : not set yet"
      bot.sendMessage(msg.chat.id, message);
    } else {
      if (user.firstName != null) {
        message = user.firstName + " (@" + user.telegramUsername + ")"
      } else message = user.telegramUsername
      message += " : " + user.ETHAddress
      bot.sendMessage(msg.chat.id, message);
    }
  })

});*/
bot.on("inline_query", (query) => {
  var username = query.query;
  var address;
  if (username) {
    if (username[0] == "@") username = username.substring(1);
    User.findOne({telegramUsername: username}, function(err, user) {
      if (user.ETHAddress) {
        address = user.ETHAddress;
      } else {
        address = "has no address"
      }
    });
  } else {
    address = "not Found"
  }
  bot.answerInlineQuery(query.id, [
    {
      type: "article",
      id: "channel",
      title: "Channel Addresses",
      input_message_content: {
        message_text: "TODO : group's addresses"
      }
    },
    {
      type: "article",
      id: "query",
      title: "User " + query.query,
      input_message_content: {
        message_text: address
      }
    }
  ]);
});

//match /chaintact [whatever]
bot.onText(/\/chaintact (.+)/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var chatId = msg.chat.id;
  var fromUsername = "";
  var fromLastName = "";
  var fromFirstName = "";
  if(msg.from.username != null) fromUsername = msg.from.username
  if(msg.from.first_name != null) fromFirstName = msg.from.first_name
  if(msg.from.last_name != null) fromLastName = msg.from.last_name
  var command = match[1];
  var commandArr = command.split(" ");
  var message;

  if(commandArr.length < 1) {
    message = helpText;
    bot.sendMessage(chatId, message);
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
          var newUser = new User({telegramID:fromId, telegramUsername:fromUsername, firstName:fromFirstName, lastName:fromLastName, ETHAddress:commandArr[1]});
          newUser.save(function (err) {
            if (err) return handleError(err);
            console.log("User " + fromId + " created with address " + commandArr[1]);
            message = "You have been added to the database with address :\n"
            message += commandArr[1]
            bot.sendMessage(chatId, message);
          })
        } else {
          user.telegramUsername = fromUsername
          user.firstName = fromFirstName
          user.lastName = fromLastName
          user.ETHAddress = commandArr[1]
          user.save(function (err) {
            if (err) return handleError(err, user);
            console.log("User " + fromId + " updated with address " + commandArr[1]);
            message = "Your address has been updated to :\n"
            message += commandArr[1]
            bot.sendMessage(chatId, message);
          })
        }
      })
      break;
    case "get":
      if(commandArr[1] == null) {
        message = "Please input a username !\n" + helpText
      }
      User.findOne({telegramUsername: commandArr[1]}, function(err, user) {
        if(user == null) {
          message = "No match found for username " + fromUsername
          bot.sendMessage(chatId, message);
        } else if(user.ETHAddress == null) {
          if(user.firstName != null) {
            message = user.firstName + " (@" + user.telegramUsername +")"
          } else message = user.telegramUsername
          message += " : unavailable"
          bot.sendMessage(chatId, message);
        } else {
          if(user.firstName != null) {
            message = user.firstName + " (@" + user.telegramUsername +")"
          }
          else message = user.telegramUsername
          message += " : " + user.ETHAddress
          bot.sendMessage(chatId, message);
        }
      })
      break;
    case "group":
      message = "Coming soon!";
      break;
    default:
      message = helpText;
  }
  if(message != null) bot.sendMessage(chatId, message);
});

function printUser(user) {

}
