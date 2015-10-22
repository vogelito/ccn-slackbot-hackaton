'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var TeamBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'teambot';
  this.dbPath = settings.dbPath || path.resolve(__dirname, '..', 'data', 'teambot.db');

  this.user = null;
  this.db = null;
};

util.inherits(TeamBot, Bot);

TeamBot.prototype.run = function () {
  TeamBot.super_.call(this, this.settings);
  this.on('start', this._onStart);
  this.on('message', this._onMessage);
};

TeamBot.prototype._onStart = function () {
  this._loadBotUser();
  this._connectDb();
  this._firstRunCheck();
};

TeamBot.prototype._loadBotUser = function () {
  var self = this;
  this.user = this.users.filter(function (user) {
    return user.name === self.name;
  })[0];
};

TeamBot.prototype._connectDb = function () {
  if (!fs.existsSync(this.dbPath)) {
    console.error('Problem reading database: ' + this.dbPath);
    process.exit(1);
  }

  this.db = new SQLite.Database(this.dbPath);
};

TeamBot.prototype._firstRunCheck = function () {
  var self = this;
  self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
    if (err) {
      return console.error('DATABASE ERROR:', err);
    }

    var currentTime = (new Date()).toJSON();

    // this is a first run
    if (!record) {
      self._welcomeMessage();
      return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
    }

    // updates with new last running time
    self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
  });
};

// TODO: this needs some thought
TeamBot.prototype._welcomeMessage = function () {
  // You might want to send the message on all channels....
  for(var i=0; i<this.channels.length; i++) {
    //console.log(this.channels[i].name);
  }
  this.postMessageToChannel("bot-test", 'Hi guys, I\'m still pretty dumb' +
    '\n Just say `Help!` or `' + this.name + '` to invoke me!');
};

TeamBot.prototype._onMessage = function (message) {
  // TODO: Here you need to decide what logic to do...
  if (this._isChatMessage(message) && this._isChannelConversation(message) &&
  !this._isFromTeamBot(message) && this._isMentioningTeamBot(message)) {
    this._replyWithSomeMessage(message);
  }
};

TeamBot.prototype._isChatMessage = function (message) {
  return message.type === 'message' && Boolean(message.text);
};

TeamBot.prototype._isChannelConversation = function (message) {
  return typeof message.channel === 'string' &&
    message.channel[0] === 'C';
};

TeamBot.prototype._isFromTeamBot = function (message) {
  return message.user === this.user.id;
};

TeamBot.prototype._isMentioningTeamBot = function (message) {
  return message.text.toLowerCase().indexOf('team bot') > -1 ||
    message.text.toLowerCase().indexOf(this.name) > -1;
};

TeamBot.prototype._replyWithSomeMessage = function (originalMessage) {

  // TODO: here you have to put stuff into the database, or pull it out depending on what you're trying to do...
  var self = this;
  console.log(originalMessage.user);
  self.db.get('SELECT name, skills, found_team FROM hackatoners WHERE name = ?', originalMessage.user, function (err, record) {
    if (err) {
      return console.error('DATABASE ERROR:', err);
    }
    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, "test");
  });
};

TeamBot.prototype._getChannelById = function (channelId) {
  return this.channels.filter(function (item) {
    return item.id === channelId;
  })[0];
};

module.exports = TeamBot;
