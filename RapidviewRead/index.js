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
    const sprints = await jira.getAllSprints(
      rapidViewId,
      config.startAt,
      config.maxResults,
      'closed'
    )
    .then(function (sprints) {
      return sprints
    })
    .catch(function (err) {
        console.error(err);
    });

    // flatten the sprint results and only 2 attributes
    var map = {
      list : 'values',
      item: {
          id: "id",
          name: "name",
      }
    }
    var dataTransform = DataTransform(sprints, map);
    var result = dataTransform.transform();
      
    // Create a request object and post it to power bi
    const buffer = Buffer.from(typeof result === 'string' ? 'result' : JSON.stringify(result));
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
  }
};
