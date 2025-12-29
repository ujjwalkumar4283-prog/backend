import mongoose from "mongoose";

const assignmentSchema=new mongoose.Schema({
    serialNumber:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    assignment1:{type: Boolean,default:false},
    assignment2:{type: Boolean,default:false},
    assignment3:{type: Boolean,default:false},
    assignment4:{type: Boolean,default:false},
    assignment5:{type: Boolean,default:false},
})

const Assignment=mongoose.model('Assignment',assignmentSchema)

export default Assignment