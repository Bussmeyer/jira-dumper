const config = require('../config');
const loggy = require('../lib/loggy');
const jira = require('../lib/jira');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const rapidViewId = req.params.id;

    if (rapidViewId) {
      const sprints = await jira.getAllSprints(
          rapidViewId,
          config.startAt,
          config.maxResults,
          config.state
        )
        .then(function(sprints) {
          loggy(sprints);
        
          const fields = [
            {
              label: 'id',
              value: 'values.id',
            },
            {
              label: 'url',
              value: 'values.self'
            },
            {
              label: 'state',
              value: 'values.state'
            },
            {
              label: 'name',
              value: 'values.name'
            },
            {
              label: 'startDate',
              value: 'values.startDate'
            },
            {
              label: 'endDate',
              value: 'values.endDate'
            },
            {
              label: 'completeDate',
              value: 'values.completeDate'
            },
            {
              label: 'originBoardId',
              value: 'values.originBoardId'
            },
          ];
        
          return sprints
        })
        .catch(function(err) {
          console.error(err);
        });
      context.res = {
        body: sprints
      };
    }
    else {
      context.res = {
        status: 400,
        body: "Please pass a rapidViewId on the query string"
      };
    }
};