import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true   //optimize searching
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String, //cloudinary url
            required : true
        },
        coverImage : {
            type : String, //cloudinary url
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String,
            required : [true,"password is required"]
        },
        refreshToken : {
            type : String
        }
    },
    {
        timestamps : true
    }
)

// data database mai store hone se pehle hash karne ka middleware 
userSchema.pre("save", async function(next){ //middlewre so next pass kiya hai
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password,10)
    next()
})

// custom method
// .methods ek object
userSchema.methods.isPasswordCorrect = async function(password){
    // return boolean
    return await bcrypt.compare(password,this.password)

}

// create a access token
userSchema.methods.generateAccessToken = function (){
    jwt.sign(
        // payload
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullName
        },
        // secretOrPrivateKey
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY 

        }
    )
}

// create a refresh token
userSchema.methods.generateRefreshToken = function (){
    jwt.sign(
        // payload
        {
            _id : this._id,
        },
        // secretOrPrivateKey
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY 

        }
    )
}


export const User = mongoose.model("User",userSchema)