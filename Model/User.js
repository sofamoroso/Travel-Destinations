import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
	username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username must be at most 30 characters long'],
        validate: [
            {
                validator: function (v) {
                    // Prevent spaces in the username
                    return !/\s/.test(v);
                },
                message: props => 'Username should not contain spaces',
            },
            {
                validator: function (v) {
                    // Allow only alphanumeric characters and underscores
                    return /^[a-zA-Z0-9_]+$/.test(v);
                },
                message: props => 'Username should contain only letters, numbers, and underscores',
            }
        ]    
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters long'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
});

const User = model('User', userSchema);

export default User;
