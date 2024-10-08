import Router from 'express';

const router = Router();

import User from '../Model/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Get all users
router.get('/api/users', async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// Register
router.post('/api/register', async (req, res) => {
	// Our register logic starts here
	try {
		// Get user input
		const { username, password, email } = req.body;

		// Validate user input
		if (!(username && email && password)) {
			return res.status(400).json({ error: 'All inputs are required'});
		}

		// Check if username already exists
		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(409).json({ error: 'This username is already taken, please use another one' });
		}

		// Check if email already exists
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(409).json({ error: 'Another account is using this email' });
		}

		//Encrypt user password
		const encryptedUserPassword = await bcrypt.hash(password, 10);

		// Create user in our database
		const user = await User.create({
			username: username.toLowerCase(), // sanitize
			email: email.toLowerCase(), // sanitize
			password: encryptedUserPassword,
		});

		// return new user
		return res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

// Login
router.post('/api/login', async (req, res) => {
	try {
		// Get user input
		const { username, password } = req.body;

		// Validate user input
		if (!(username && password)) {
			return res.status(400).json({ error: 'All inputs are required'});
		}
		// Validate if user exist in our database
		const user = await User.findOne({ username });

		if (user && (await bcrypt.compare(password, user.password))) {
			// Create token
			const token = jwt.sign(
				{
					userId: user._id,
					username: user.username,
					email: user.email,
				},
				process.env.SECRET_KEY,
				{ expiresIn: '5h' }
			);

			const { password, ...userWithoutPassword } = user._doc;
			return res.status(200).json({ ...userWithoutPassword, token });
		}
		return res.status(400).json({ error: 'Invalid Credentials' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

// Create a new user
router.post('/api/users', async (req, res) => {
	try {
		let { username, password, email } = req.body;

		// Check if the user already exists by email or username
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});
		if (existingUser) {
			return res.status(400).json({ error: 'Username or email already exists' });
		}

		const user = new User({
			username,
			password,
			email,
		});

		const savedUser = await user.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//Delete user - deleting own account
router.delete('/api/users/account', async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header
		if (!token) return res.status(401).send('Unauthorized');

		const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
		const userId = decoded.userId;

		// Find and delete the user
		const user = await User.findByIdAndDelete(userId);
		if (!user) return res.status(404).send('User not found');

		return res.status(200).send('User deleted successfully');
	} catch (error) {
		return res.status(500).send('Internal Server Error');
	}
});

//Delete user - admin
router.delete('/api/users/:id', async (req, res) => {
	//extract the id from the url
	const { id } = req.params;

	try {
		console.log('ID to be deleted: ', id);

		//deleting the user
		const deleteUser = await User.findByIdAndDelete(id);

		//if e.g. an user doesnt exist with this id
		if (!deleteUser) {
			return res.status(404).json({ message: 'user not found' });
		}

		//then display status code info
		res.status(200).json({ message: 'user deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
