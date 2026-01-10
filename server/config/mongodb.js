import mongoose from "mongoose"

export const mongoDB= async ()=>{
   try {
      await mongoose.connect(`${process.env.MONGO_URI}`);
      console.log("mongodb connect");
   } catch (error) {
      console.log(error);
   }
}

