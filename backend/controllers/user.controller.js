import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import { profile } from "console";

const convertUserDataToPDF = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
      const filePath = `uploads/${outputPath}`;
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Add profile picture if exists
      let profilePicPath = `uploads/default.jpg`;
      if (
        userData.userId.profilePicture &&
        fs.existsSync(`uploads/${userData.userId.profilePicture}`)
      ) {
        profilePicPath = `uploads/${userData.userId.profilePicture}`;
      }

      doc.image(profilePicPath, {
        fit: [100, 100],
        align: "center",
        valign: "center",
      });

      doc.fontSize(20).text(`Name: ${userData.userId.name}`);
      doc.fontSize(20).text(`Username: ${userData.userId.username}`);
      doc.fontSize(20).text(`Email: ${userData.userId.email}`);
      doc.fontSize(20).text(`Bio: ${userData.bio || "N/A"}`);
      doc
        .fontSize(20)
        .text(`Current Position: ${userData.currentPosition || "N/A"}`);

      doc.fontSize(20).text("Past Work");
      (userData.pastWork || []).forEach((work) => {
        doc.fontSize(15).text(`Company Name:  ${work.companyName || "N/A"}`);
        doc.fontSize(15).text(`Position:  ${work.position || "N/A"}`);
        doc.fontSize(15).text(`Years:  ${work.years || "N/A"}`);
      });

      doc.end();

      stream.on("finish", () => {
        resolve(outputPath); // ✅ only return once file is done
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const register = async (req, res, next) => {
  try {
    //fetch data
    const { name, username, email, password } = req.body;

    //validate data
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    //check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash password and create user if user doesn't exist
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    // create profile for user
    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" || error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate data
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    //check if user exists
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token: token });

    return res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    // Find user by token
    const user = await User.findOne({ token: token });
    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user's profile picture
    user.profilePicture = req.file.filename;
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    // Find user by token
    const user = await User.findOne({ token: token });
    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "User already exists!" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by token
    const user = await User.findOne({ token: token });
    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    const profileData = userProfile || {
      userId: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: "default.jpg",
      },
      bio: "",
      pastWork: [],
      currentPosition: "",
    };

    return res.status(200).json({ user: profileData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    // Find user by token
    const user = await User.findOne({ token: token });
    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({ userId: user._id });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    console.log("Incoming ID:", user_id);

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    let outputPath = await convertUserDataToPDF(userProfile);

    const filePath = `uploads/${outputPath}`;
    if (fs.existsSync(filePath)) {
      return res.download(filePath, "resume.pdf");
    } else {
      return res.status(404).json({ message: "PDF not found" });
    }
  } catch (error) {
    console.error("Error in downloadProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, targetUserId } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: targetUserId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: targetUserId,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const newConnectionRequest = new ConnectionRequest({
      userId: user._id,
      connectionId: targetUserId,
    });

    await newConnectionRequest.save();

    res.status(200).json({ message: "Connection request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.status(200).json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const MyConnectionRequests = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const respondToConnectionRequest = async (req, res) => {
  const { token, connectionId, action_type } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({
      _id: connectionId,
      connectionId: user._id,
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === true) {
      connection.status_accepted = true;
      await connection.save();
      return res.status(200).json({ message: "Connection request accepted" });
    } else if (action_type === false) {
      connection.status_accepted = false;
      await connection.save();
      await ConnectionRequest.deleteOne({ _id: connectionId });
      return res.status(200).json({ message: "Connection request rejected" });
    } else {
      return res.status(400).json({ message: "Invalid action type" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
