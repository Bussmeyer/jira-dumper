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
    console.log(sprints);
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
