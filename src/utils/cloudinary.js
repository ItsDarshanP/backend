import {v2 as cloudinary} from "cloudinary"
import { error } from "console";
import fs from "fs"


 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

  // Upload an image
  const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return error("localfile path error")
            //upload the file on cloudinary
       const respone = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is uploaded on cloudinary",respone.url)
        // console.log(respone)
        fs.unlinkSync(localFilePath)
        return respone
        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null 
    }
  }
  export {uploadOnCloudinary}