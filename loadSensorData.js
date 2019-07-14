const AWS = require("aws-sdk");
const fs = require('fs');

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});

// AWS.config.update({
//     region: "us-east-1"
// });

let docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing Sensor Data into DynamoDB. Please wait.");

let allSensors = JSON.parse(fs.readFileSync('./data/sensorData.json', 'utf8'));
allSensors.forEach(function(sensor) {
    let params = {
        TableName: "SensorData",
        Item: {
            "sensorID":  sensor.sensorID,
            "sensorType": sensor.sensorType,
            "info":  sensor.info
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add sensor", sensor.sensorID, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", sensor.sensorID);
       }
    });
});