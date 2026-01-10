import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import UserModel from '../models/usermodal.js';
import transporter from '../config/nodemailer.js';
export const register = async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email ||!password){
        return res.status(400).json({
            success:false,
            message:"missing details"
        })
    }

try {
    const existingUser = await UserModel.findOne({email})
    if(existingUser){
        return  res.json({
    success:false,
    message:"user already exist"
})
}
    const hashpassword=await bcrypt.hash(password,10);

    const user= new UserModel({name,email,password:hashpassword});

    await user.save();

    const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
     res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV=='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
       maxAge: 7 * 24 * 60 * 60 * 1000

     })
     
    //  sending email
     const mailOptions ={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"welcome to my website",
        text:`welcome to my website , your account 
        has been created with email ${email}`
     }

     await transporter.sendMail(mailOptions);
     return res.json({success:true});

} catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
}

}


export const login =async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({
            success:false,
            message:" email and password are required!!"

        })
    }
    try {
        const user=await UserModel.findOne({email});
        if(!user) {
            return res.json({
                success:false,
                message:"invalid email"
            })
        }

    const ismatch =await bcrypt.compare(password,user.password)
    if(!ismatch){
        return res.json({
            success:false,
            message:"invalid password"
        })
     }

    const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
     res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV=='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
       maxAge: 7 * 24 * 60 * 60 * 1000

     })

   res.json({
    success:true,
   })

        
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

export const logout = async (req,res)=>{
 try {
    res.clearCookie('token',{
        httpOnly:true,
        secure:process.env.NODE_ENV=='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    })
    return res.json({success:true,message:"logged Out"})

 } catch (error) {
    return res.json({
        success:false,
        message:error.message
    });
 }
}

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req;

    const user = await UserModel.findById(userId);

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified"
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    
    user.VerifyOtp=otp;
    user.verifyotpExprieAT = Date.now() + 5 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOption);

    res.json({
      success: true,
      message: "Verification OTP sent on email"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const verifyEmail =async (req,res)=>{
const {otp} = req.body;
const userId=req.userId;
if(!userId || !otp){
    return res.json({
        success:false,
        message:"missing otp or id"
    })
}
try {

    const user = await UserModel.findById(userId);
    if(!user){
        return res.json({success:false,
        message:"user not found"
    })}

    if(user.VerifyOtp===''||user.VerifyOtp!==otp){
        return res.json({
            success:false,
            message:"Invalid OTP"
        })
    }
    if(user.verifyotpExprieAT<Date.now()){
        return res.json({
            success:false,
            message:'OTP Expired'
        })
   }
    user.isAccountVerified=true;

    user.VerifyOtp='',
    user.verifyotpExprieAT=0;

    await user.save();

    return res.json({
        success:true,
        message:"Email verifiied successfully"
    })
} catch (error) {
    return res.json({success:false,
        message:error.message
    })
}
}


// Check if user is authenticated
export const isAuthenticated = async (req,res)=>{
try {

    return res.json({success:true})
} catch (error) {
    res.json({success:false,message:error.message})
}}

// Send password Reset OTP
export const sendResetOtp=async (req,res)=>{
   const {email} =req.body;
   if(!email){
    return res.json({
        success:false,
        message:'Email is Required'
    })}
    try {
        
        const user=await UserModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:'user no found'
            });
        }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    
    user.resetOtp=otp;
    user.resetotpExpireAT = Date.now() + 5 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "password reset  OTP",
      text: `Your OTP for resetting ypor passwordis  ${otp}.use this otp
       to proceed with resetting yoy password
       It will be  expire in 5 minutes.`
    };

    await transporter.sendMail(mailOption);

    return res.json({
        success:true,
        message:"OTP sent to your email"
    })

    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

// Reset User Password 
export const resetPassword = async (req,res)=>{
    const {email,otp,newpassword}=req.body;
      
    if(!email || !otp || !newpassword){
        return res.json(
        {
            success:false,
            message:'Email Otp and newpassword are required'
        })
    }
    try {
        
        const user = await UserModel.findOne({email});
        if(!user){
           return res.json({ success:false,
            message:"user not found"
        })}

    if (!user.resetOtp || user.resetOtp !== otp) {   return res.json({ success:false,
            message:"Invalid OTP"
        })}

        if(user.resetotpExpireAT< Date.now()){
             return res.json({ success:false,
            message:"Expried OTP"
        }) }

        const hashedPassword = await bcrypt.hash(newpassword,10);
        user.password=hashedPassword;
        user.resetOtp="";
        user.resetotpExpireAT=0,
        await user.save();

        return res.json({
            success:true,
            message:"password has been reset successfully"
        })

    } catch (error) {
       return res.json({
            success:false,
            message:error.message
        }) 
    }
}

