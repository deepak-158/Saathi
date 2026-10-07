const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Memory = require('../models/Memory');
const Goal = require('../models/Goal');
const CheckIn = require('../models/CheckIn');

async function seed() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Check or create demo student
    let user = await User.findOne({ email: 'rahul.student@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul.student@example.com',
        passwordHash: 'student123',
        college: 'SRM Institute of Science and Technology',
        branch: 'Computer Science & Engineering',
        year: 3,
        careerGoal: 'SDE at Product Companies (Amazon, Atlassian)',
        skills: ['C++', 'Python', 'React', 'Data Structures & Algorithms'],
        onboardingComplete: true,
      });
      console.log('✅ Demo student user created: rahul.student@example.com / student123');
    } else {
      console.log('ℹ️ Demo student already exists.');
    }

    // 2. Seed initial memories if none exist
    const memCount = await Memory.countDocuments({ userId: user._id });
    if (memCount === 0) {
      await Memory.create([
        {
          userId: user._id,
          category: 'ACADEMICS',
          content: 'Preparing for 6th semester mid-terms. Cleared 2 previous backlogs in Operating Systems with B+.',
          importance: 8,
        },
        {
          userId: user._id,
          category: 'PLACEMENT',
          content: 'Targeting Amazon and Atlassian SDE intern drives in upcoming campus placements. Practicing LeetCode medium questions.',
          importance: 9,
        },
        {
          userId: user._id,
          category: 'PERSONAL',
          content: 'Feels periodic imposter syndrome and anxiety when comparing with classmates getting early referrals.',
          importance: 7,
        },
        {
          userId: user._id,
          category: 'PREFERENCES',
          content: 'Prefers explanations in C++ with step-by-step intuition and friendly Hinglish analogies.',
          importance: 6,
        },
      ]);
      console.log('✅ Seeded 4 initial memories for Rahul.');
    }

    // 3. Seed initial goal if none exist
    const goalCount = await Goal.countDocuments({ userId: user._id });
    if (goalCount === 0) {
      await Goal.create({
        userId: user._id,
        title: 'Master Binary Trees & Dynamic Programming for OAs',
        description: 'Prepare high-frequency DSA questions for product company recruitment drives',
        status: 'active',
        progress: 50,
        tasks: [
          { title: 'Solve 20 Tree traversal & LCA problems', completed: true },
          { title: 'Understand 0/1 Knapsack & unbounded knapsack patterns', completed: true },
          { title: 'Solve 10 Longest Common Subsequence variations', completed: false },
          { title: 'Participate in 2 weekly LeetCode contests', completed: false },
        ],
      });
      console.log('✅ Seeded initial placement goal for Rahul.');
    }

    // 4. Seed initial wellness check-in if none exist
    const checkinCount = await CheckIn.countDocuments({ userId: user._id });
    if (checkinCount === 0) {
      await CheckIn.create({
        userId: user._id,
        mood: 'good',
        reason: 'placement',
        note: 'Solved 2 medium DP problems today and attended afternoon classes on time.',
      });
      console.log('✅ Seeded initial check-in for Rahul.');
    }

    console.log('🎉 Seeding completed successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
