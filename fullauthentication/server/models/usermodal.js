import mongoose from "mongoose";

const createSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
       
    },
    VerifyOtp:{
        type:String,
        default:" "
    },
    verifyotpExprieAT:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOtp:{
        type:String,
        default:""
    },
    resetotpExpireAT:
    {
    type:Number,
    default:0
   }

}) 
const UserModel = mongoose.model("User", createSchema)
  export default UserModel