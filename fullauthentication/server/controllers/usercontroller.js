import UserModel from "../models/usermodal.js";

export const getuserdata=async(req,res)=>{
    try {
        const userId=req.userId;

        const user=await UserModel.findById(userId);
        if(!user){
     return res.json({success:false,message:"user is not found"})
}
res.json({
    success:true,
    userData:{
        name:user.name,
        isAccountVerified:user.isAccountVerified
    }
});

    } catch (error) {
        return res.json({success:true,message:error.message})
    }
}
