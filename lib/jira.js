const config = require('../config');
var JiraApi = require('jira-client');

var jira = new JiraApi({
  protocol: 'https',
  host: config.jiraHost,
  username: config.jiraUsername,
  password: config.jiraPassword,
  apiVersion: '2',
});

module.exports = jira;
