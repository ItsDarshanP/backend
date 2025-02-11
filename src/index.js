import "dotenv/config";

// import dotenv from 'dotenv'
// "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
import connectDb from "./db/index.js";
import { app } from "./app.js";

// dotenv.config({
//     path : './env'
// })
const PORT = process.env.PORT || 8000;
connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRR : ", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed", error);
  });

/*
import 'dotenv/config'
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

import express from 'express'
const app = express()

// IIFE (Immediately Invoked Function Expression)
;(async ()=>{
    try {
     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERRR : ",error)
        throw error
       })
       console.log( `\n MongoDB connected !! DB host: ${connectionInstance.connection.host}`)
       app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
       })
        
    } catch (error) {
        console.error("ERROR : ",error)
        throw error
    }

})();
*/
