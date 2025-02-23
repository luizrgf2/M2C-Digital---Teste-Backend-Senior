import mongoose from "mongoose";


export async function connectDb() {
    try{
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("Monogodb connected")
    }catch(e){
        console.error("Mongodb error to connect",e )
    }
}
