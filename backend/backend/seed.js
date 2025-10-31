import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from './models/team.model.js';
import User from './models/user.model.js';
import Match from './models/match.model.js';
import Summary from './models/summary.model.js';
import { generateSquad, calculateTeamRating } from './helpers/rating-generator.js';

dotenv.config();

const MOCK_COUNTRIES = ['Senegal', 'Morocco', 'Nigeria', 'Egypt', 'Cameroon', 'Ghana', 'Tunisia'];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Team.deleteMany({});
    await User.deleteMany({});
    await Match.deleteMany({});
    await Summary.deleteMany({});
    console.log('Cleared old teams, users, matches, and summaries.');

    // --- 1. Creation of Admin User  ---
    await User.create({
      name: 'Admin User', 
      email: 'admin@anl.com',
      password: 'adminpassword123',
      role: 'admin'
    });
    console.log('Created Admin: admin@anl.com (pass: adminpassword123)');

    // --- 2. Creation of Rep User  ---
    const rep = await User.create({
        name: 'Rep User',  
        email: 'rep@anl.com',
        password: 'reppassword123',
        role: 'representative'
      });
    console.log('Created Rep: rep@anl.com (pass: reppassword123)');

    // --- 3. Creation of 7 Mock Teams ---
    for (const country of MOCK_COUNTRIES) {
      const squad = generateSquad(); 
      const rating = calculateTeamRating(squad);
      
      await Team.create({
        country: country,
        manager: 'Mock Manager',
        representative: rep._id, 
        squad: squad,
        rating: rating,
      });
      console.log(`Created team: ${country}`);
    }

    console.log('Database seeding complete!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();