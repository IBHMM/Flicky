import { User } from "../../../model/User/index.mjs";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary'; 

export const blockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const unblockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  const picture = req.files ? req.files.picture : null;

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let thumbnail;
    if (picture) {
      const pictureUploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image', folder: 'CloudinaryDemo/images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(picture[0].buffer); 
      });

      thumbnail = pictureUploadResult?.secure_url;
    }

    Object.assign(user, updates);
    if (thumbnail) {
      user.thumbnail = thumbnail;
    }
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await User.findOneAndDelete({id: userId})

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addUser = async (req, res) => {
  const { email, password, role, username, name, surname, age } = req.body;
  const picture = req.files ? req.files.picture : null;

  try {
    if (!email || !password || !role || !username || !name || !surname || !age) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    let thumbnail;
    if (picture) {
      const pictureUploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image', folder: 'CloudinaryDemo/images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(picture[0].buffer); 
      });

      thumbnail = pictureUploadResult?.secure_url;
    }

    const isAdmin = role === "admin";
    const newUser = new User({
      email,
      password,
      isAdmin,
      age,
      surname,
      name,
      username,
      id: uuidv4(),
      thumbnail
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const addSubscription = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSubscribed = true; 
    await user.save();

    res.status(200).json({ message: "Subscription added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeSubscription = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.subscriptions = false;
    await user.save();

    res.status(200).json({ message: "Subscription removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({users: users});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const SoftDelete = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const restoreUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({id: userId})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = false;
    await user.save();

    res.status(200).json({ message: "User restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};