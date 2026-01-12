import { Request, Response } from "express";
import { users, User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret123";

interface AuthRequestBody {
  username: string;
  password: string;
}

export const register = async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  try {
    const { username, password } = req.body;

    const existing = users.find(u => u.username === username);
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser: User = { id: Date.now().toString(), username, password: hashed };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
