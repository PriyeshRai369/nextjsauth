import mongoose from "mongoose";

export async function connect(){
    try {
        await mongoose.connect(process.env.DATABASE_URI!)
        const connection = mongoose.connection
        connection.on('connected',()=>console.log("DataBase is connected"))
        connection.on('error',(err)=>{
            console.log("DataBase is not connected",err)
            process.exit()
        })
    } catch (error) {
        console.log("Something Went wrong",error);
    }
}