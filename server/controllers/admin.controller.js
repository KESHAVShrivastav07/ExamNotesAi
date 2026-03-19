import UserModel from "../models/user.model.js";
import Teacher from "../models/teacher.model.js";
import Notes from "../models/notes.model.js";

const requireAdmin = (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return null;
};

export const getAllUsers = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const users = await UserModel.find().select("name email credits role notes createdAt").lean();
    const usersWithNoteCount = users.map((user) => ({
      ...user,
      noteCount: Array.isArray(user.notes) ? user.notes.length : 0
    }));

    return res.status(200).json({ users: usersWithNoteCount });
  } catch (error) {
    console.error("getAllUsers error", error);
    return res.status(500).json({ message: "Could not fetch users" });
  }
};

export const getAllTeachers = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const teachers = await Teacher.find().select("name email role notes createdAt").lean();
    const teachersWithNoteCount = teachers.map((teacher) => ({
      ...teacher,
      noteCount: Array.isArray(teacher.notes) ? teacher.notes.length : 0
    }));

    return res.status(200).json({ teachers: teachersWithNoteCount });
  } catch (error) {
    console.error("getAllTeachers error", error);
    return res.status(500).json({ message: "Could not fetch teachers" });
  }
};

export const getUserNotes = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const userId = req.params.id;
    const notes = await Notes.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ notes });
  } catch (error) {
    console.error("getUserNotes error", error);
    return res.status(500).json({ message: "Could not fetch user notes" });
  }
};

export const getTeacherNotes = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const teacherId = req.params.id;
    const notes = await Notes.find({ user: teacherId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ notes });
  } catch (error) {
    console.error("getTeacherNotes error", error);
    return res.status(500).json({ message: "Could not fetch teacher notes" });
  }
};
