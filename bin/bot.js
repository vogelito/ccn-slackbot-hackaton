#!/usr/bin/env node

'use strict';

var TeamBot = require('../lib/teambot');

var token = process.env.BOT_API_KEY || require('../token');
var dbPath = process.env.BOT_DB_PATH;
var name = "teambot"

var teambot = new TeamBot({
    token: token,
    dbPath: dbPath,
    name: name
});

teambot.run();
