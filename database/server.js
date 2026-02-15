const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Rahasia Dapur 🍳' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moms_receipe';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Berhasil konek ke MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server jalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal konek ke MongoDB:', err.message);
  });
