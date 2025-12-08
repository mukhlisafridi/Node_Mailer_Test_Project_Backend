import mongoose from "mongoose"

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MONGO DB Is Connected`);
        
    } catch (error) {
        console.log(`Error In DB ${error}`);
        
    }
}
