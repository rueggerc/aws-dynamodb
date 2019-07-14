"use strict";
const PostgresUno = require('postgres-uno');

module.exports.doDatabaseStuff = async function(payLoad) {

    console.log("DO DATABASE STUFF BEGIN");
    let dbConfig = builddbConfig();
   
    // let result = await getSensorData(dbConfig);
    // let rows = result.rows;
    // for (let i = 0; i < rows.length; i++) {
    //     let reading = rows[i];
    //     console.log(JSON.stringify(reading));
    // }

    // Do Insert
    if (payLoad) {
        await insertSensorData(dbConfig,payLoad);
    }   

    console.log("DO DATABASE STUFF END");
}

async function getSensorData(dbConfig) {
    try {

        console.log("getSensorData BEGIN");
        let db = new PostgresUno();
        // console.log("DBConfig=\n" + JSON.stringify(dbConfig,null,2));

        console.log("CONNECT BEGIN");
        await db.connect(dbConfig);
        console.log("CONNECT END");

        // Query
        let dbQuery = "select * from dht22_readings limit 10";
        let result = await db.query(dbQuery);
        let rows = result.rows;

    
        // Disconnect
        await db.disconnect();

        return result;

    } catch (err) {
        console.log("ERROR=" + err);
        throw new Error(err);
    }
}

async function insertSensorData(dbConfig,payLoad) {

    let db = new PostgresUno();
    try {

        console.log("insertSensorData BEGIN");
        console.log("PAYLOAD=\n" + JSON.stringify(payLoad,null,2));

        // console.log("DBConfig=\n" + JSON.stringify(dbConfig,null,2));

        console.log("CONNECT BEGIN");
        await db.connect(dbConfig);
        console.log("CONNECT END");

        // INSERT String   
        let readingTime = Math.floor(payLoad.timestamp/1000);
        let dbQuery = `
          insert into dht22_readings
          (sensor_id, notes, reading_time, temperature, humidity)
          VALUES ('${payLoad.sensorID}', '${payLoad.notes}', to_timestamp(${readingTime}), ${payLoad.temperature}, ${payLoad.humidity}) 
          RETURNING id`;
        let result = await db.query(dbQuery);
        let id = result.rows[0].id;
        console.log("ID=" + id);

        // Disconnect
        await db.disconnect();

        console.log("insertSensorData END");

    } catch (err) {
        console.log("INSIDE TRY BLOCK");
        await db.disconnect();
        console.log("ERROR=" + err);
        throw new Error(err);
    }
}

function builddbConfig() {
    let db_host = process.env.DB_HOST || throwError("Not Set: DB_HOST");
    let db_user = process.env.DB_USER || throwError("Not Set: DB_USER");
    let db_password = process.env.DB_PASSWORD || throwError("Not Set: DB_PASSWORD");
    let db_port = process.env.DB_PORT || throwError("Not Set: DB_PORT");
    let db_database = process.env.DB_DATABASE || throwError("Not Set: DB_DATABASE");

    let dbConfig = {
        host: db_host,
        user: db_user,
        password: db_password,
        port: db_port,
        database: db_database
    };
    return dbConfig;

}