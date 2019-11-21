const config = require('../config');
const jira = require('../lib/jira');
var DataTransform = require("node-json-transform").DataTransform;
var rp = require('request-promise');


module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const rapidViewId = req.params.id;
  if (!rapidViewId) {
    // fail early :-)
    context.res = {
      status: 400,
      body: "Please pass a rapidViewId on the query string"
    };
  } else {
    // Get all sprints of a given rapidView
    const sprints = await getAllSprints(rapidViewId);
    
    await Promise.all(
      sprints.map(async (sprint) => {
        const sprintWithVelocity = await jira.getSprintIssues(rapidViewId, sprint.id)
        .then(function(sprintIssues) {
          var sprintWithVelocity = new Object();
          sprintWithVelocity.id = sprintIssues.sprint.id;
          sprintWithVelocity.name = sprintIssues.sprint.name;
          sprintWithVelocity.committed = sprintIssues.contents.issuesNotCompletedInitialEstimateSum.value + sprintIssues.contents.completedIssuesInitialEstimateSum.value;
          sprintWithVelocity.completed = sprintIssues.contents.completedIssuesEstimateSum.value;
          return sprintWithVelocity;
        });
        return sprintWithVelocity;
      })
    )
    .then(function(sprintsWithVelocity) {
      console.log(sprintsWithVelocity);
      console.log("Fertig");

      // Create a request object and post it to power bi
      const buffer = Buffer.from(typeof sprintsWithVelocity === 'string' ? 'sprintsWithVelocity' : JSON.stringify(sprintsWithVelocity));
      var options = {
        method: 'POST',
        uri: config.powerbiAPI,
        body: buffer,
      };

      rp(options)
        .then(function (parsedBody) {
          console.log('Hello Request to Power BI, yes');

        })
        .catch(function (err) {
          console.log(err);
        });
    });
  } 
};

async function getAllSprints(rapidViewId) {
  // flatten the sprint results and only 2 attributes
  var map = {
    list : 'values',
    item: {
        id: "id",
        name: "name",
    }
  }

  return await jira.getAllSprints(rapidViewId, 0, 50, 'closed')
    .then(function (sprints) {
      var dataTransform = DataTransform(sprints, map);
      var sprintsCore = dataTransform.transform();

      return sprintsCore;
    })
    .catch(function (err) {
      console.error(err);
    });
};
