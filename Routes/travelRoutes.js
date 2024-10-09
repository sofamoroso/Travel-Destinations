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

// Update a travel destination
router.put('/api/travel-destinations/:id', async (req, res) => {
	const { id } = req.params;
	const updates = req.body;

	try {
		const updatedDestination = await TravelDestination.findByIdAndUpdate(id, updates, { new: true });
		if (!updatedDestination) {
			return res.status(404).json({ message: 'Destination not found' });
		}
		res.status(200).json({
			message: 'Destination updated successfully',
			updatedDestination,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete('/api/travel-destinations/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const deletedDestination = await TravelDestination.findByIdAndDelete(id);
		if (!deletedDestination) {
			return res.status(404).json({ message: 'Destination not found' });
		}
		res.status(200).json({ message: 'Destination deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/api/top-countries', async (req, res) => {
    try {
        const topCountries = await TravelDestination.aggregate([
            {
                $group: {
                    _id: '$country',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.json(topCountries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/top-users', async (req, res) => {
    try {
        const topUsers = await TravelDestination.aggregate([
            {
                $group: {
                    _id: '$userId',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users', // The name of the User collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    count: 1,
                    username: '$user.username'
                }
            }
        ]);
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
