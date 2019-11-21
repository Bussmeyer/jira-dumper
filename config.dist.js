var config = {
  debug: true,
  jiraHost: 'host.to.jira.without.https://',
  jiraUsername: 'user',
  jiraPassword: 'password',
  powerbiAPI: 'https://',
  outputFile: {
    sprints: 'data/jira-sprints',
    sprintIssues: 'data/issues/jira-sprint-issues',
    merged: 'data/jira-merged',
  },
  startAt: 0,
  maxResults: 50,
};

module.exports = config;
