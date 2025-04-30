const User = require("../model/userModel");
const Message = require("../model/messageModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const JWT_SECRET = "12345678901234567890";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register User
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.status(400).json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });


    return res.status(201).json({ status: true, user: { _id: user._id, username, email }, token });
  } catch (ex) {
    next(ex);
  }
};

// Login User
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Incorrect Username or Password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ msg: "Incorrect Username or Password", status: false });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });



    return res.json({ status: true, user: { _id: user._id, username, email: user.email }, token });
  } catch (ex) {
    next(ex);
  }
};

//Get All Users 
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "contacts.contactId",
        select: "email avatarImage username",
      });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const enrichedContacts = await Promise.all(
      user.contacts.map(async (contact) => {
        const contactUser = contact.contactId;

        const lastMsg = await Message.findOne({
          users: {
            $all: [req.params.id.toString(), contactUser._id.toString()],
          },
        })
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          contactId: contactUser._id,
          contactName: contact.contactName,
          username: contactUser.username,
          email: contactUser.email,
          avatarImage: contactUser.avatarImage,
          lastMessage: lastMsg?.message?.text
            || (lastMsg?.file ? `${lastMsg.file.type.startsWith("image/") ? "Image" : "File"}` : null),
          lastMessageAt: lastMsg?.createdAt || null,
        };

      })
    );

    // Sort by latest message timestamp (descending)
    enrichedContacts.sort((a, b) => {
      const aTime = new Date(a.lastMessageAt || 0).getTime();
      const bTime = new Date(b.lastMessageAt || 0).getTime();
      return bTime - aTime;
    });

    res.json({
      ...user._doc,
      contacts: enrichedContacts,
    });
  } catch (err) {
    console.error("Error in getUserById:", err.message);
    next(err);
  }
};


// Profile Picture Setup

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const imageUrl = `/uploads/${file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage: imageUrl,
      },
      { new: true }
    );

    res.status(200).json({
      isSet: updatedUser.isAvatarImageSet,
      image: updatedUser.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};


module.exports.AddContact = async (req, res, next) => {
  try {
    const { email, contactName } = req.body;
    const userId = req.user.userId;

    // 1. Find user with that email (contactUser)
    const contactUser = await User.findOne({ email });
    if (!contactUser) {
      return res.status(404).json({ msg: "No user found with this email" });
    }

    if (contactUser._id.toString() === userId) {
      return res.status(400).json({ msg: "Cannot add yourself as a contact" });

    }

    const user = await User.findById(userId);
    console.log("The user object:", user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const alreadyExists = user.contacts && user.contacts.some(
      (contact) => contact.contactId.toString() === contactUser._id.toString()
    );

    if (alreadyExists) {
      return res.status(400).json({ msg: "Contact already added" });
    }
    user.contacts.push({
      contactId: contactUser._id,
      contactName,
    });

    await user.save();

    // Respond with the success message and the added contact's details
    return res.status(200).json({
      msg: "Contact added successfully",
      contact: {
        userId: contactUser._id,
        contactName,
        email: contactUser.email,
      },
    });
  } catch (error) {
    console.error("Error adding contact:", error);
    next(error);
  }
};




// Export Multer Middleware 
module.exports.uploadMiddleware = upload.single("avatar");
