const express = require('express');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET all recipes
router.get('/', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author_id', 'username email')
            .sort({ created_at: -1 });

        res.json({
            message: 'Berhasil ambil data resep.',
            count: recipes.length,
            data: recipes
        });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
    }
});

// GET single recipe
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author_id', 'username email');

        if (!recipe) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }

        res.json({
            message: 'Berhasil ambil detail resep.',
            data: recipe
        });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
    }
});

// PATCH — fetch & cache image from Unsplash
router.patch('/:id/image', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }

        // Already have an image cached — return it immediately
        if (recipe.image_url) {
            return res.json({ image_url: recipe.image_url });
        }

        // Fetch from Unsplash
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        if (!accessKey || accessKey === 'YOUR_UNSPLASH_KEY_HERE') {
            return res.json({ image_url: '' });
        }

        const searchQuery = recipe.title.replace(/[^a-zA-Z\s]/g, '').trim();
        const unsplashRes = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: `${searchQuery} food`,
                per_page: 1,
                orientation: 'landscape',
            },
            headers: {
                Authorization: `Client-ID ${accessKey}`,
            },
        });

        let imageUrl = '';
        if (unsplashRes.data.results && unsplashRes.data.results.length > 0) {
            // Use "small" size (400px wide) for cards, fast loading
            imageUrl = unsplashRes.data.results[0].urls.small;
        }

        // Save to database (cache permanently)
        recipe.image_url = imageUrl;
        await recipe.save();

        res.json({ image_url: imageUrl });
    } catch (err) {
        console.error('Unsplash fetch error:', err.message);
        res.json({ image_url: '' });
    }
});

module.exports = router;
