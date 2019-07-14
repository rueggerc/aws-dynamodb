
"use strict";
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});

let dynamoDB = new AWS.DynamoDB();

let params = {
    TableName: "Movies",
    KeySchema: [
        {AttributeName: "year", KeyType: "HASH"},
        {AttributeName: "title", KeyType: "RANGE"},
    ],
    AttributeDefinitions: [
        {AttributeName: "year", AttributeType: "N"},
        {AttributeName: "title", AttributeType: "S"}
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

