var config = {
  debug: true,
  jiraHost: 'host.to.jira.without.https://',
  jiraUsername: 'user',
  jiraPassword: 'password',
  outputFile: {
    sprints: 'data/jira-sprints',
    sprintIssues: 'data/issues/jira-sprint-issues',
    merged: 'data/jira-merged',
  },
  rapidViewId: 1234,
  startAt: 0,
  maxResults: 50,
  state: 'closed',

};

module.exports = config;
