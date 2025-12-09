import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/sendMail.js";

// step # 1 - REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
   
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email Already Registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    try {
      await sendVerificationEmail(email, token);
      res.json({ message: "Registration Successful. Check your email to verify." });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      
      res.json({ 
        message: "Registration successful! However, verification email could not be sent. Please contact support.",
      });
    }

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// step # 3 - VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    if (user.isVerified) {
      return res.json({ message: "Email already verified. You can login now." });
    }

    user.isVerified = true;
    await user.save();
    
    res.json({ message: "Email Verified Successfully" });
  } catch (err) {
    console.error("Verification error:", err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: "Invalid verification link" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Verification link expired. Please register again." });
    }
    
    res.status(500).json({ message: "Verification failed" });
  }
};

// step # 4 - LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", 
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        
      sameSite: "none",   
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      message: "Login successful",
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
};

// CHECK AUTH
export const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not Logged In" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Auth check error:", err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    
    return res.status(401).json({ message: "Authentication failed" });
  }
};