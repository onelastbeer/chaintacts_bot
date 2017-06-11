const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram('CHAINTACT_BOT_TOKEN')
var express = require('express');
var app = express();

class GreetingController extends TelegramBaseController {
    greetingHandler($) {
        $.sendMessage('Hey, how are you?')
    }
get routes() {
        return {
            'hey': 'greetingHandler',
            'hi': 'greetingHandler',
            'hello': 'greetingHandler',
        }
    }
}


app.set('port', (process.env.PORT || 5000));
app.get('/', function(request, response) {

});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

tg.router
  .when(['hey', 'hi', 'hello'], new GreetingController())
