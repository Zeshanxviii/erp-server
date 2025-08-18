import express from "express";
import auth from "../middleware/auth.js";
import { 
  validate, 
  loginSchema, 
  passwordUpdateSchema,
  adminCreateSchema,
  studentCreateSchema,
  facultyCreateSchema,
  departmentCreateSchema,
  subjectCreateSchema,
  noticeCreateSchema
} from "../middleware/validation.js";
import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  createNotice,
  getNotice,
} from "../controller/adminController.js";

const router = express.Router();

// Authentication routes
router.post("/login", validate(loginSchema), adminLogin);
router.post("/updatepassword", auth, validate(passwordUpdateSchema), updatedPassword);

// Get all data routes (no validation needed for GET requests)
router.get("/getallstudent", auth, getAllStudent);
router.get("/getallfaculty", auth, getAllFaculty);
router.get("/getalldepartment", auth, getAllDepartment);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getalladmin", auth, getAllAdmin);

// Profile management
router.post("/updateprofile", auth, updateAdmin);

// Create operations with validation
router.post("/addadmin", auth, validate(adminCreateSchema), addAdmin);
router.post("/adddepartment", auth, validate(departmentCreateSchema), addDepartment);
router.post("/addfaculty", auth, validate(facultyCreateSchema), addFaculty);
router.post("/addsubject", auth, validate(subjectCreateSchema), addSubject);
router.post("/addstudent", auth, validate(studentCreateSchema), addStudent);
router.post("/createnotice", auth, validate(noticeCreateSchema), createNotice);

// Get specific data routes
router.post("/getfaculty", auth, getFaculty);
router.post("/getsubject", auth, getSubject);
router.post("/getstudent", auth, getStudent);
router.post("/getnotice", auth, getNotice);
router.post("/getadmin", auth, getAdmin);

// Delete operations
router.post("/deleteadmin", auth, deleteAdmin);
router.post("/deletefaculty", auth, deleteFaculty);
router.post("/deletestudent", auth, deleteStudent);
router.post("/deletedepartment", auth, deleteDepartment);
router.post("/deletesubject", auth, deleteSubject);

export default router;
