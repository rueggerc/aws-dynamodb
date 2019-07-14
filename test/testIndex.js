"use strict";

let assert = require('assert');
const AWS = require("aws-sdk");

describe ('Dynamo DB', function() {

  before(function() {
    AWS.config.update({
      region: "us-east-1",
      endpoint: "http://localhost:8000"
    });
  });

  // before(function() {
  //   AWS.config.update({
  //     region: "us-east-1",
  //     endpoint: "https://dynamodb.us-east-1.amazonaws.com"
  //   });
  // });

  after(function() {
  });

  

  xit('Create Movie Item', function() {
    let docClient = new AWS.DynamoDB.DocumentClient();
    let table = "Movies";
    let year = 2015;
    let title = "The Big New Movie";
    let params = {
      TableName: table,
      Item: {
        "year": year,
        "title": title,
        "info": {
          "plot": "Nothing happens at all.",
          "rating": 0
        }
      }
    }

    console.log("Adding New Item");
    docClient.put(params, function(err,data) {
      if (err) {
          console.log("Error Adding Item:\n" + JSON.stringify(err,null,2));
      } else {
          console.log("Added Item:\n" + JSON.stringify(data,null,2));
      }
    });

  });

  xit('Read Movie Item', function() {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let table = "Movies";
    let year = 2015;
    let title = "The Big New Movie";
    
    let params = {
        TableName: table,
        Key:{
            "year": year,
            "title": title
        }
    };
    
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });

  });

  xit('Update Movie Item', function() {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let table = "Movies";
    let year = 2015;
    let title = "The Big New Movie";
    
    // Update the item, unconditionally,
    let params = {
        TableName:table,
        Key:{
            "year": year,
            "title": title
        },
        UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
        ExpressionAttributeValues:{
            ":r":5.5,
            ":p":"Everything happens all at once.",
            ":a":["Larry", "Moe", "Curly"]
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });

  });

  xit('Delete Movie Item', function() {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let table = "Movies";
    let year = 2015;
    let title = "The Big New Movie";
    let params = {
        TableName:table,
        Key:{
            "year": year,
            "title": title
        },
        ConditionExpression:"info.rating <= :val",
        ExpressionAttributeValues: {
            ":val": 5.0
        }
    };
    
    console.log("Attempting a conditional delete...");
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });

  });

  xit('Select Movies By Year', function() {
    let docClient = new AWS.DynamoDB.DocumentClient();
   
    console.log("Querying for movies from 1985.");

    let params = {
        TableName : "Movies",
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames:{
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":yyyy": 1985
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.year + ": " + item.title);
            });
        }
    });


  });

  it('Select All Sensors', function() {
    let docClient = new AWS.DynamoDB.DocumentClient();
   
    console.log("Select All Sensors");

    let params = {
        TableName : "SensorData",
        KeyConditionExpression: "#id = :sensorid",
        ExpressionAttributeNames:{
          "#id": "sensorID"
      },
      ExpressionAttributeValues: {
          ":sensorid": "sensor2"
      }
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.sensorID + ": " + item.sensorType);
            });
        }
    });


  });

  xit('SCAN Movie Table', function() {

    let docClient = new AWS.DynamoDB.DocumentClient();
   
    let params = {
        TableName: "Movies",
        ProjectionExpression: "#yr, title, info.rating",
        FilterExpression: "#yr between :start_yr and :end_yr",
        ExpressionAttributeNames: {
            "#yr": "year",
        },
        ExpressionAttributeValues: {
             ":start_yr": 1950,
             ":end_yr": 1959 
        }
    };
    
    console.log("Scanning Mtable.");
    docClient.scan(params, onScan);
    
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            data.Items.forEach(function(movie) {
               console.log(
                    movie.year + ": ",
                    movie.title, "- rating:", movie.info.rating);
            });
    
            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }
  
  });

  it('SCAN Sensor Table', function() {

    let docClient = new AWS.DynamoDB.DocumentClient();
   
    let params = {
        TableName: "SensorData",
        ProjectionExpression: "#sensorid, sensorType, info.temperature",
        FilterExpression: "#sensorid between :start_id and :end_id",
        ExpressionAttributeNames: {
            "#sensorid": "sensorID",
        },
        ExpressionAttributeValues: {
             ":start_id": 'sensor0',
             ":end_id": 'sensor4'
        }
    };
    
    console.log("Scanning SensorData.");
    docClient.scan(params, onScan);
    
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            data.Items.forEach(function(sensor) {
               console.log(JSON.stringify(sensor,null,2));
               // console.log(sensor.sensorID + ": " + sensor.sensorType + " " + sensor.info.temperature);
            });
    
            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }
  
  });

});