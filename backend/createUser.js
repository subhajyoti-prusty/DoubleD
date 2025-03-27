const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userData = {
            username: 'Subhajyoti',
            email: 'Subhajyoti12@gmail.com',
            password: 'Subha@12',
            role: 'admin',
            profile: {
                name: 'Subhajyoti',
                phone: '',
                address: '',
                organization: '',
                skills: [],
                availability: true,
                verificationStatus: 'verified'
            }
        };

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            console.log('User already exists');
            return;
        }

        const user = await User.create(userData);
        console.log('User created successfully:', user);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
    }
};

createUser(); 