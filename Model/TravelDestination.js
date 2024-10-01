import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const travelDestinationSchema = new Schema({
	city: { type: String, required: true },
	country: { type: String, required: true },
	date: { type: Date, default: new Date() },
	description: { type: String, required: true },
	rating: { type: Number, min: 0, max: 5, default: 0 },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const TravelDestination = model('TravelDestination', travelDestinationSchema);

export default TravelDestination;
