'use strict';

var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var outputFile = process.argv[2] || path.resolve(__dirname, 'teambot.db');
var db = new sqlite3.Database(outputFile);

db.serialize();
db.run('CREATE TABLE IF NOT EXISTS hackatoners (name TEXT PRIMARY KEY, skills TEXT DEFAULT NULL, found_team INTEGER DEFAULT 0)');
db.run('CREATE TABLE IF NOT EXISTS info (name TEXT PRIMARY KEY, val TEXT DEFAULT NULL)');
db.close();
