var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'API_KEY',
    name: 'teambot'
};
var bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToChannel('borderlessblockparty', 'Hello channel!');
    bot.postMessageToUser('vogelito', 'hello bro!');
    //bot.postMessageToGroup('some-private-group', 'hello group chat!');
});
