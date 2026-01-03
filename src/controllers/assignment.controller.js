import asyncHandler from "../utility/asyncHandler.js";
import ApiError from "../utility/apiError.js";
import ApiResponse from "../utility/apiResponse.js";
import Assignment from "../model/assignment.model.js";

const CreateAssignment=asyncHandler(
    async(req,res)=>{
        const {serialNumber,name}=req.body
        if(!serialNumber) throw new ApiError(400,"serial Number is required")
        if(!name?.trim()) throw new  ApiError(400,"name is required")
        const user1=await Assignment.create({serialNumber,name,subject:"subject1"});
        const user2=await Assignment.create({serialNumber,name,subject:"subject2"});
        const user3=await Assignment.create({serialNumber,name,subject:"subject3"});
        const user4=await Assignment.create({serialNumber,name,subject:"subject4"});
        const user5=await Assignment.create({serialNumber,name,subject:"subject5"});
        res.status(200)
            .json(new ApiResponse(200,user5,"assignmet successFully created"))
    }
)

const updateAssignment = asyncHandler(async (req, res) => {
  const {
    serialNumber,
    name,
    subject,
    assignment1,
    assignment2,
    assignment3,
    assignment4,
    assignment5,
  } = req.body;

  if (!serialNumber) {
    throw new ApiError(400, "serial number is required");
  }
  if(!subject?.trim()){
    throw new ApiError(400,"subject is missing")
  }

  const updatedAssignment = await Assignment.findOneAndUpdate(
    { serialNumber,subject },
    {
      $set: {
        ...(name !== undefined && { name }),
        ...(assignment1 !== undefined && { assignment1 }),
        ...(assignment2 !== undefined && { assignment2 }),
        ...(assignment3 !== undefined && { assignment3 }),
        ...(assignment4 !== undefined && { assignment4 }),
        ...(assignment5 !== undefined && { assignment5 }),
      },
    },
    { new: true }
  );

  if (!updatedAssignment) {
    throw new ApiError(404, "Assignment not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedAssignment, "Updated assignment"));
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { serialNumber } = req.body;

  if (!serialNumber) {
    throw new ApiError(400, "serial number is required");
  }

  const result = await Assignment.deleteMany({
    serialNumber,
    subject: {
      $in: ["subject1", "subject2", "subject3", "subject4", "subject5"],
    },
  });

  res.status(200).json(
    new ApiResponse(200, {}, "assignment is deleted")
  );
});


const getAllAssignment = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find().sort({ serialNumber: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, assignments, "All assignments fetched"));
});




export {CreateAssignment,updateAssignment,deleteAssignment,getAllAssignment}