const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Recipe = require('./models/Recipe');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moms_receipe';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Konek ke MongoDB untuk seeding...');

        await User.deleteMany({});
        await Recipe.deleteMany({});
        console.log('🗑️  Data lama dihapus.');

        const users = await User.create([
            {
                username: 'abdirabbani',
                email: 'abdi@example.com',
                password: 'rabbani',
                role: 'admin',
                created_at: new Date('2026-02-15T04:15:00Z')
            },
            {
                username: 'iburani',
                email: 'rani@example.com',
                password: 'rani123',
                role: 'user',
                created_at: new Date('2026-02-15T05:00:00Z')
            },
            {
                username: 'ibusiti',
                email: 'siti@example.com',
                password: 'siti123',
                role: 'user',
                created_at: new Date('2026-02-15T06:00:00Z')
            }
        ]);

        console.log(`👤 ${users.length} users berhasil di-seed.`);

        const recipes = await Recipe.create([
            {
                title: 'Nasi Goreng Informatika',
                description: 'Nasi goreng spesial ala anak IT, bumbu rahasia yang bikin ketagihan. Cocok dimakan sambil coding!',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: users[0]._id,
                tags: ['fast-food', 'coding-fuel'],
                ingredients: [
                    '2 piring nasi putih dingin',
                    '3 siung bawang merah',
                    '2 siung bawang putih',
                    '2 butir telur',
                    '2 sdm kecap manis',
                    '1 sdm saus tiram',
                    'Garam dan merica secukupnya',
                    'Minyak goreng'
                ],
                steps: [
                    'Iris tipis bawang merah dan bawang putih.',
                    'Panaskan minyak, tumis bawang hingga harum.',
                    'Masukkan telur, orak-arik hingga matang.',
                    'Masukkan nasi putih, aduk rata.',
                    'Tambahkan kecap manis, saus tiram, garam, dan merica.',
                    'Aduk rata dan masak hingga nasi kering dan harum.',
                    'Sajikan dengan pelengkap sesuai selera.'
                ],
                image_url: ''
            },
            {
                title: 'Rendang Sapi Klasik',
                description: 'Rendang sapi khas Minang yang empuk dan kaya rempah. Cocok untuk acara keluarga dan hari raya.',
                difficulty: 'Hard',
                cook_time: '180 mins',
                author_id: users[0]._id,
                tags: ['traditional', 'padang', 'special-occasion'],
                ingredients: [
                    '1 kg daging sapi (has dalam)',
                    '500 ml santan kental',
                    '500 ml santan encer',
                    '10 buah cabai merah',
                    '8 siung bawang merah',
                    '5 siung bawang putih',
                    '3 cm jahe',
                    '3 cm lengkuas',
                    '2 batang serai',
                    '5 lembar daun jeruk',
                    '2 lembar daun kunyit',
                    'Garam secukupnya'
                ],
                steps: [
                    'Potong daging sapi sesuai selera.',
                    'Haluskan cabai, bawang merah, bawang putih, jahe.',
                    'Tumis bumbu halus bersama serai dan lengkuas hingga harum.',
                    'Masukkan daging, aduk hingga berubah warna.',
                    'Tuang santan encer, masak dengan api sedang.',
                    'Setelah mendidih, masukkan santan kental dan daun jeruk.',
                    'Masak dengan api kecil sambil sesekali diaduk (kurang lebih 3 jam).',
                    'Masak hingga bumbu meresap dan kuah mengering.',
                    'Sajikan rendang yang sudah berwarna coklat kehitaman.'
                ],
                image_url: ''
            },
            {
                title: 'Soto Ayam Lamongan',
                description: 'Soto ayam khas Lamongan yang segar dengan kuah kuning bening. Pas untuk makan siang keluarga.',
                difficulty: 'Medium',
                cook_time: '60 mins',
                author_id: users[1]._id,
                tags: ['soup', 'traditional', 'lunch'],
                ingredients: [
                    '500 gr ayam kampung',
                    '2 liter air',
                    '5 siung bawang merah',
                    '3 siung bawang putih',
                    '3 cm kunyit',
                    '2 cm jahe',
                    '2 batang serai',
                    '3 lembar daun jeruk',
                    'Bihun secukupnya',
                    'Telur rebus',
                    'Bawang goreng',
                    'Seledri dan daun bawang'
                ],
                steps: [
                    'Rebus ayam hingga matang, suwir-suwir dagingnya.',
                    'Haluskan bawang merah, bawang putih, kunyit, dan jahe.',
                    'Tumis bumbu halus dengan serai dan daun jeruk hingga harum.',
                    'Masukkan tumisan bumbu ke dalam kaldu ayam.',
                    'Masak hingga mendidih dan bumbu meresap.',
                    'Siapkan mangkuk, isi dengan bihun dan suwiran ayam.',
                    'Siram dengan kuah soto panas.',
                    'Taburi bawang goreng, seledri, dan sajikan dengan jeruk nipis.'
                ],
                image_url: ''
            },
            {
                title: 'Es Cendol Dawet',
                description: 'Minuman tradisional segar dengan cendol pandan dan gula merah. Sempurna untuk cuaca panas!',
                difficulty: 'Easy',
                cook_time: '30 mins',
                author_id: users[2]._id,
                tags: ['drink', 'traditional', 'dessert'],
                ingredients: [
                    '100 gr tepung hunkue',
                    '50 gr tepung beras',
                    '500 ml air',
                    '1 sdt pasta pandan',
                    '200 gr gula merah',
                    '100 ml air untuk gula merah',
                    '400 ml santan',
                    'Garam sedikit',
                    'Es batu'
                ],
                steps: [
                    'Campur tepung hunkue, tepung beras, air, dan pasta pandan.',
                    'Masak sambil diaduk hingga mengental.',
                    'Cetak cendol dengan saringan ke dalam air es.',
                    'Rebus gula merah dengan air hingga larut, saring.',
                    'Siapkan santan dengan sedikit garam.',
                    'Masukkan cendol ke gelas, tuang gula merah dan santan.',
                    'Tambahkan es batu dan sajikan.'
                ],
                image_url: ''
            },
            {
                title: 'Ayam Geprek Sambal Bawang',
                description: 'Ayam geprek crispy dengan sambal bawang yang pedas nampol. Favorit anak muda!',
                difficulty: 'Medium',
                cook_time: '30 mins',
                author_id: users[0]._id,
                tags: ['fast-food', 'spicy', 'popular'],
                ingredients: [
                    '4 potong dada ayam fillet',
                    '200 gr tepung terigu',
                    '100 gr tepung maizena',
                    '1 sdt garam',
                    '1 sdt lada bubuk',
                    '1 sdt bawang putih bubuk',
                    'Air es secukupnya',
                    '15 buah cabai rawit',
                    '5 siung bawang putih',
                    'Garam dan gula secukupnya',
                    'Minyak goreng'
                ],
                steps: [
                    'Lumuri ayam fillet dengan garam dan lada.',
                    'Campur tepung terigu, maizena, garam, dan bawang putih bubuk.',
                    'Celup ayam ke air, lalu gulingkan ke tepung. Ulangi 2x.',
                    'Goreng ayam dalam minyak panas hingga golden brown.',
                    'Ulek cabai rawit dan bawang putih kasar.',
                    'Tumis sambal dengan sedikit minyak, tambahkan garam dan gula.',
                    'Geprek ayam goreng, lalu siram dengan sambal bawang.',
                    'Sajikan dengan nasi putih hangat.'
                ],
                image_url: ''
            }
        ]);

        console.log(`🍲 ${recipes.length} resep berhasil di-seed.`);
        console.log('');
        console.log('=== AKUN UNTUK LOGIN ===');
        console.log('Admin  → email: abdi@example.com | password: rabbani');
        console.log('User 1 → email: rani@example.com | password: rani123');
        console.log('User 2 → email: siti@example.com | password: siti123');
        console.log('========================');

        await mongoose.disconnect();
        console.log('✅ Seeding selesai! Koneksi ditutup.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding:', err.message);
        process.exit(1);
    }
};

seedData();
