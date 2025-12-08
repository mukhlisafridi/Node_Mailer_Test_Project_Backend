import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/sendMail.js";
// step # 1
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email Already Registered" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendVerificationEmail(email, token);
    res.json({ message: "Registration Successfull" });
  } catch (err) {
    console.log(err);
  }
};
// step # 3
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid link" });

    user.isVerified = true;
    await user.save();
    res.json({ message: "Email Verified Successfull" });
  } catch (err) {
    console.log(err);
  }
};

//step # 4
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "Email not exist" });

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ message: "Incorrect Password" });

    if (!user.isVerified)
      res.status(400).json({ message: "Please verify your email" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ name: user.name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(0),
      })
      .status(200)
      .json({
        message: "Successfully Logout..!",
        success: true,
      });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};