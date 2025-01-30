import 'dotenv/config'

// import dotenv from 'dotenv'
// "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
import connectDb from "./db/index.js";

// dotenv.config({
//     path : './env'
// })

connectDb()


/*

import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import express from 'express'
const app = express()

// IIFE (Immediately Invoked Function Expression)
;(async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERRR : ",error)
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
       })
        
    } catch (error) {
        console.error("ERROR : ",error)
        throw error
    }

})();
*/