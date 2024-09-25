import mongoose from "mongoose";
const { Schema, model } = mongoose;

const travelDestinationSchema = new Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
});

const TravelDestination = model("TravelDestination", travelDestinationSchema);

export default TravelDestination;

