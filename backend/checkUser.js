const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'subhajyoti12@gmail.com';
        const password = 'Subha@12';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User found:', {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUser(); 