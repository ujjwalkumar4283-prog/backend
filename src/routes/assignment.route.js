import { Router } from "express";
import { CreateAssignment, deleteAssignment, getAllAssignment, updateAssignment } from "../controllers/assignment.controller.js";

const router=Router()

router.route('/create').post(CreateAssignment)
router.route('/update').post(updateAssignment)
router.route('/delete').post(deleteAssignment)
router.route('/get-all-assignment/:subject').get(getAllAssignment)
export default router