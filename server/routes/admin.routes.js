import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  getAllUsers,
  getAllTeachers,
  getUserNotes,
  getTeacherNotes
} from "../controllers/admin.controller.js";

import { isAdmin } from "../middleware/roleBase.js";

const router = express.Router();

router.use(isAuth, isAdmin);

router.get("/users", getAllUsers);
router.get("/teachers", getAllTeachers);
router.get("/users/:id/notes", getUserNotes);
router.get("/teachers/:id/notes", getTeacherNotes);

export default router;
