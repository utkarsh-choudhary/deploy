import { User } from "../models/User.js";


// Controller to register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.comparePassword(password); // Assuming a `comparePassword` method exists in the User model
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = user.generateAuthToken(); // Assuming a `generateAuthToken` method exists in the User model
    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to fetch user profile data
const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Assuming user is authenticated and the user ID is available in the request

  try {
    // Find the user by their ID
    const user = await User.findById(userId).select('-password'); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to update user profile information
const updateUserProfile = async (req, res) => {
  const userId = req.user.id; // Assuming user is authenticated and the user ID is available in the request
  const { name, email } = req.body;

  try {
    // Find the user and update their profile
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
