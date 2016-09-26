'use strict';

var tape = require('tape');
var sqlGen = require('../lib/sql_gen.js');

var schema = {
  table_name: 'user_data',
  fields: {
    email: {
      type: 'string',
      email: true
    },
    username: {
      type: 'string',
      min: 3,
      max: 20
    },
    dob: {
      type: 'date'
    }
  }
};

tape('::init should throw on empty or invalid input', function (t) {
  t.throws(function () {
    sqlGen.init();
  });
  t.end();
});

tape('::init should generate SQL to create a table if none exists', function (t) {
  var query = sqlGen.init(schema);

  t.equal(
    query,
    'CREATE TABLE IF NOT EXISTS "user_data" ('
    + 'email VARCHAR(80), '
    + 'username VARCHAR(20), '
    + 'dob DATE'
    + ')',
    'Create table query generation from config object'
  );
  t.end();
});

// tape('::update should generate empty string on invalid input', function () {});

tape('::insert should generate SQL to insert a column into a table', function (t) {
  var query = sqlGen.insert(schema, {email: 'me@poop.com'});

  t.equal(query[0], 'INSERT INTO "user_data" (email) VALUES ($1)', 'Generate parameterised query');
  t.deepEqual(query[1], ['me@poop.com'], 'Generate values for parameterised query');
  t.end();
});

tape('::update should generate SQL to update a column in a table', function (t) {
  var query = sqlGen.update(schema, {email: 'me@poop.com'});

  t.equal(query[0], 'UPDATE "user_data" SET email=$1', 'Generate parameterised query');
  t.deepEqual(query[1], ['me@poop.com'], 'Generate values for parameterised query');
  t.end();
});