
require("dotenv").config()

const mongoose = require("mongoose");

async function connectDB() {


    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database connected successfully.");
        

    }catch(err){
        console.log("Database connection failed.");
        console.log(err);
    }
    
}


module.exports = connectDB;