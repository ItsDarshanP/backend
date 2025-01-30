import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstace = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB host: ${connectionInstace.connection.host}`
    );
  } catch (error) {
    console.error("connection ERROR :", error);
    process.exit(1); // Exit with failure
  }
};

export default connectDb;
