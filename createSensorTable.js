
"use strict";
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});



let dynamoDB = new AWS.DynamoDB();
let params = {
    TableName: "SensorData",
    KeySchema: [
        {AttributeName: "sensorID", KeyType: "HASH"},
        {AttributeName: "sensorType", KeyType: "RANGE"},
    ],
    AttributeDefinitions: [
        {AttributeName: "sensorID", AttributeType: "S"},
        {AttributeName: "sensorType", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamoDB.createTable(params, function(err,data) {
    if (err) {
        console.log("Error Creating Table:\n" + JSON.stringify(err,null,2));
    } else {
        console.log("Created Table:\n" + JSON.stringify(data,null,2));
    }
});

