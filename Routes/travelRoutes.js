import Router from 'express';

const router = Router();

import TravelDestination from '../Model/TravelDestination.js';

// Get all destinations
router.get('/api/travel-destinations', async (req, res) => {
	try {
		const destinations = await TravelDestination.find();
		res.status(200).json(destinations);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// Get all destinations for a specific user and country
router.get('/api/travel-destinations/:userId/:country', async (req, res) => {
	const { userId, country } = req.params;
	try {
		const destinations = await TravelDestination.find({ userId, country });
		res.status(200).json(destinations);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// Create a new travel destination
router.post('/api/travel-destinations', async (req, res) => {
	const { userId, country, city, date, description, rating } = req.body;
	const newDestination = new TravelDestination({
		userId,
		country,
		city,
		date,
		description,
		rating,
	});
	try {
		await newDestination.save();
		res.status(201).json({
			message: 'Travel destination created successfully',
		});
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
});

export default router;
