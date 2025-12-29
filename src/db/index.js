import mongoose from 'mongoose'

const dbConnect=async function(){
    try{
        return await mongoose.connect(process.env.DB)
    }
    catch(err){
        throw(err)
    }
}

export default dbConnect