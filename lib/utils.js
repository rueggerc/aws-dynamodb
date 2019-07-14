

module.exports.buildResponse = function(text,statusCode = 200) {
    let response = {
        statusCode: statusCode,
        headers: {"Content-Type": 'application/json'},
        body: text
    };
    return response;
};

module.exports.formatSuccessText = function(text) {
    let responseMessage = {
        "result:": text,
        "sensorID": 100
    }
    // let formattedText = `{"result": ${text}}`;
    return JSON.stringify(responseMessage);
    return formattedText;
};

module.exports.formatErrorText = function(text) {
    let formattedText = `{error: ${text}}`;
    return formattedText;
};


module.exports.getBucketInfo = function() {
    let bucketInfo = {
        "bucketName":  "sensorsBucket",
        "fileName": "sensorData/sensor1"
    };
    return bucketInfo;
};

module.exports.getPayloadForS3 = function() {
    let payload = {
        
        "sensorID":  "sensor1",
        "temperature": 78.33,
        "humidity": 92.55,
        "timestamp": 38387722
    };
    return payload;
};


module.exports.writeToS3 = async function(s3, bucketInfo, payloadForS3) {
    try {
        let fileName = bucketInfo.fileName;

        // Write To S3
        return await s3.putObject(
            {
                Bucket: bucketInfo,
                Key: fileName,
                Body: JSON.stringify(payloadForS3,null,4),
                ContentType: "application/json"
            }

        ).promise();

    } catch (err) {
        let message = err.toString();
        throw (`S3 Write Error: ${message}`);
    }
}



