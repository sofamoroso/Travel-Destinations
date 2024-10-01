import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	email: { type: String, unique: true, required: true },
});

const User = model('User', userSchema);

export default User;
