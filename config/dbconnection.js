const mongoose = require("mongoose");

const connection = async()=>{//function h 
    try {
        const connect = await mongoose.connect('mongodb+srv://austinmartin2503:QhlcUYRGjdULrShX@cluster2.4zpgzsu.mongodb.net/');
        console.log(
          "database connected: ",
          connect.connection.host,
          connect.connection.name
        );
      } catch(err) {
        console.log(err);
        process.exit(1);
      }
};
module.exports = connection;
