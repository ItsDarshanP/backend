import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
       `MongoDB connected successfully! Database: ${connectionInstance.connection.name}, Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("connection ERROR :", error);
    process.exit(1); // Exit with failure
  }
};

export default connectDb;
