const config = require('../config');
const loggy = require('../lib/loggy');
const jira = require('../lib/jira');
var DataTransform = require("node-json-transform").DataTransform;
var rp = require('request-promise');


module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const rapidViewId = req.params.id;

  if (rapidViewId) {
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

    var map = {
      list : 'values',
      item: {
          id: "id",
          name: "name",
      }
    }  
    
    var dataTransform = DataTransform(sprints, map);
    var result = dataTransform.transform();
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
  else {
    context.res = {
      status: 400,
      body: "Please pass a rapidViewId on the query string"
    };
  }
};