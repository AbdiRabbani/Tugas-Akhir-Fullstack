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
                role: 'admin'
            }
        ]);

        const admin = users[0];
        console.log(`👤 ${users.length} user berhasil di-seed.`);

        const recipes = await Recipe.create([
            {
                title: 'Soto Ayam Lamongan',
                description: 'Soto ayam khas Lamongan dengan kuah kuning segar dan koya gurih.',
                difficulty: 'Medium',
                cook_time: '45 mins',
                author_id: admin._id,
                tags: ['indonesian', 'soup'],
                ingredients: ['1/2 ekor ayam', '2 batang serai', '3 lembar daun jeruk', '100g soun', 'Koya secukupnya'],
                steps: ['Rebus ayam bersama bumbu halus hingga empuk.', 'Suwir-suwir daging ayam yang sudah matang.', 'Siapkan mangkuk, tata soun dan ayam suwir.', 'Siram dengan kuah panas dan taburkan koya.'],
                image_url: ''
            },
            {
                title: 'Gado-Gado Siram',
                description: 'Sayuran rebus segar dengan siraman saus kacang kental yang legit.',
                difficulty: 'Easy',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['vegetarian', 'healthy'],
                ingredients: ['Kacang panjang', 'Toge', 'Tahu goreng', '200g kacang tanah sangrai', 'Gula merah'],
                steps: ['Rebus semua sayuran hingga matang lalu tiriskan.', 'Haluskan kacang tanah, cabai, dan gula merah.', 'Tata sayuran dan tahu di piring saji.', 'Siram dengan bumbu kacang dan sajikan dengan kerupuk.'],
                image_url: ''
            },
            {
                title: 'Ayam Bakar Taliwang',
                description: 'Ayam bakar pedas khas Lombok dengan aroma rempah yang kuat.',
                difficulty: 'Medium',
                cook_time: '40 mins',
                author_id: admin._id,
                tags: ['spicy', 'grilled'],
                ingredients: ['1 ekor ayam kampung', '10 buah cabai merah', '5 siung bawang putih', '1 sdt terasi bakar'],
                steps: ['Tumis bumbu halus hingga harum.', 'Lumuri ayam dengan bumbu lalu ungkep sebentar.', 'Bakar ayam di atas arang sambil dioles sisa bumbu.', 'Sajikan dengan plecing kangkung.'],
                image_url: ''
            },
            {
                title: 'Sate Lilit Ikan',
                description: 'Sate khas Bali dari daging ikan cincang dan kelapa parut.',
                difficulty: 'Medium',
                cook_time: '30 mins',
                author_id: admin._id,
                tags: ['traditional', 'seafood'],
                ingredients: ['300g fillet ikan tenggiri', '100g kelapa parut', 'Batang serai untuk tusukan', 'Bumbu base genep'],
                steps: ['Haluskan daging ikan lalu campur dengan kelapa dan bumbu.', 'Ambil sedikit adonan, lilitkan pada batang serai.', 'Panggang di atas grill pan hingga matang merata.', 'Sajikan dengan sambal matah.'],
                image_url: ''
            },
            {
                title: 'Tumis Kangkung Belacan',
                description: 'Sayur kangkung renyah dengan rasa terasi yang gurih meresap.',
                difficulty: 'Easy',
                cook_time: '10 mins',
                author_id: admin._id,
                tags: ['vegetable', 'daily-meal'],
                ingredients: ['2 ikat kangkung', '3 siung bawang merah', '2 siung bawang putih', '1 sdt terasi'],
                steps: ['Tumis bawang dan terasi hingga harum.', 'Masukkan kangkung yang sudah dicuci bersih.', 'Tambahkan sedikit air, garam, dan gula.', 'Masak cepat dengan api besar agar tetap hijau.'],
                image_url: ''
            },
            {
                title: 'Rendang Daging Sapi',
                description: 'Masakan daging sapi legendaris dengan bumbu rempah yang meresap sempurna.',
                difficulty: 'Hard',
                cook_time: '180 mins',
                author_id: admin._id,
                tags: ['traditional', 'slow-cook'],
                ingredients: ['500g daging sapi', '1 liter santan kental', '2 lembar daun kunyit', 'Bumbu rendang lengkap'],
                steps: ['Masak santan bersama bumbu halus hingga berminyak.', 'Masukkan daging sapi, aduk perlahan.', 'Masak dengan api kecil selama berjam-jam.', 'Aduk terus hingga bumbu mengering dan berwarna cokelat gelap.'],
                image_url: ''
            },
            {
                title: 'Capcay Kuah Kental',
                description: 'Aneka sayuran sehat dengan kuah gurih yang menghangatkan.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['healthy', 'chinese-food'],
                ingredients: ['Wortel', 'Kembang kol', 'Sawi hijau', 'Bakso sapi', 'Maizena'],
                steps: ['Tumis bawang putih hingga harum.', 'Masukkan bakso dan sayuran keras seperti wortel.', 'Tambahkan air, saus tiram, dan bumbu.', 'Tuangkan larutan maizena untuk mengentalkan kuah.'],
                image_url: ''
            },
            {
                title: 'Pepes Tahu Kemangi',
                description: 'Tahu lembut kukus dengan aroma kemangi yang sangat harum.',
                difficulty: 'Easy',
                cook_time: '25 mins',
                author_id: admin._id,
                tags: ['steamed', 'vegan'],
                ingredients: ['4 kotak tahu putih', '1 ikat kemangi', '1 butir telur', 'Daun pisang untuk membungkus'],
                steps: ['Hancurkan tahu lalu campur dengan telur dan bumbu halus.', 'Tambahkan daun kemangi, aduk rata.', 'Bungkus adonan dengan daun pisang.', 'Kukus selama 20 menit hingga matang.'],
                image_url: ''
            },
            {
                title: 'Sambal Goreng Ati',
                description: 'Hidangan pelengkap khas pesta dengan perpaduan rasa pedas dan gurih.',
                difficulty: 'Medium',
                cook_time: '30 mins',
                author_id: admin._id,
                tags: ['side-dish', 'traditional'],
                ingredients: ['250g ati ampela rebus', '2 buah kentang potong dadu', 'Santan', 'Bumbu balado'],
                steps: ['Goreng kentang dan ati ampela hingga setengah kering.', 'Tumis bumbu balado hingga matang.', 'Masukkan kentang, ati, dan sedikit santan.', 'Masak hingga bumbu meresap dan mengering.'],
                image_url: ''
            },
            {
                title: 'Ikan Nila Bakar Madu',
                description: 'Ikan nila bakar dengan olesan madu yang manis dan gurih meresap.',
                difficulty: 'Medium',
                cook_time: '30 mins',
                author_id: admin._id,
                tags: ['grilled', 'seafood'],
                ingredients: ['2 ekor ikan nila', '3 sdm madu', '2 sdm kecap manis', 'Bawang putih'],
                steps: ['Bersihkan ikan lalu lumuri dengan jeruk nipis.', 'Campur madu, kecap, dan bawang putih untuk olesan.', 'Bakar ikan sambil dioles bumbu madu berulang kali.', 'Angkat setelah ikan matang dan kecokelatan.'],
                image_url: ''
            },
            {
                title: 'Opor Ayam Kuning',
                description: 'Hidangan khas lebaran dengan kuah santan kuning yang kaya rempah.',
                difficulty: 'Medium',
                cook_time: '45 mins',
                author_id: admin._id,
                tags: ['traditional', 'chicken'],
                ingredients: ['1/2 ekor ayam', '500ml santan', 'Kunyit', 'Ketumbar', 'Lengkuas'],
                steps: ['Tumis bumbu halus kuning hingga wangi.', 'Masukkan ayam, aduk hingga berubah warna.', 'Tuangkan santan, masak dengan api sedang.', 'Sajikan dengan taburan bawang goreng.'],
                image_url: ''
            },
            {
                title: 'Perkedel Kentang Kornet',
                description: 'Olahan kentang goreng lembut dengan campuran kornet sapi.',
                difficulty: 'Easy',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['side-dish', 'homey'],
                ingredients: ['500g kentang', '1 kaleng kecil kornet', '2 batang seledri', '1 butir telur'],
                steps: ['Goreng kentang lalu tumbuk hingga halus.', 'Campur kentang dengan kornet dan irisan seledri.', 'Bentuk bulat pipih sesuai selera.', 'Celupkan ke kocokan telur lalu goreng hingga emas.'],
                image_url: ''
            },
            {
                title: 'Tahu Gejrot Cirebon',
                description: 'Cemilan tahu pong dengan kuah asam pedas yang segar.',
                difficulty: 'Easy',
                cook_time: '10 mins',
                author_id: admin._id,
                tags: ['snack', 'street-food'],
                ingredients: ['10 buah tahu pong', 'Gula merah', 'Asam jawa', 'Cabai rawit', 'Bawang merah'],
                steps: ['Rebus gula merah dan asam jawa hingga larut.', 'Ulek kasar cabai rawit dan bawang merah.', 'Potong-potong tahu pong di atas piring.', 'Siram dengan air gula merah dan bumbu ulek.'],
                image_url: ''
            },
            {
                title: 'Mie Goreng Jawa',
                description: 'Mie goreng tradisional dengan cita rasa manis gurih dan aroma kemiri.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['noodle', 'indonesian'],
                ingredients: ['1 bungkus mie telur', '3 butir kemiri', 'Kecap manis', 'Sawi hijau', 'Ayam suwir'],
                steps: ['Rebus mie hingga setengah matang lalu tiriskan.', 'Tumis bumbu halus kemiri dan bawang.', 'Masukkan sayuran, ayam, dan mie.', 'Tambahkan kecap manis, aduk rata hingga matang.'],
                image_url: ''
            },
            {
                title: 'Bakwan Sayur Krispi',
                description: 'Gorengan sayur yang renyah di luar dan lembut di dalam.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['snack', 'fried'],
                ingredients: ['Wortel iris korek', 'Kol iris halus', 'Tepung terigu', 'Tepung beras'],
                steps: ['Campur tepung terigu, tepung beras, dan air.', 'Masukkan sayuran ke dalam adonan tepung.', 'Ambil satu sendok adonan, goreng di minyak panas.', 'Goreng hingga berwarna kuning keemasan.'],
                image_url: ''
            },
            {
                title: 'Udang Saus Tiram',
                description: 'Udang segar dimasak cepat dengan saus tiram yang gurih pekat.',
                difficulty: 'Easy',
                cook_time: '10 mins',
                author_id: admin._id,
                tags: ['seafood', 'quick-cook'],
                ingredients: ['300g udang', '1 buah bawang bombay', '2 sdm saus tiram', 'Jahe geprek'],
                steps: ['Tumis bawang bombay dan jahe hingga harum.', 'Masukkan udang, masak hingga berubah warna.', 'Tambahkan saus tiram dan sedikit air.', 'Masak sebentar agar udang tetap kenyal.'],
                image_url: ''
            },
            {
                title: 'Sayur Asem Segar',
                description: 'Sayuran rebus dengan kuah asam yang sangat menyegarkan di siang hari.',
                difficulty: 'Easy',
                cook_time: '25 mins',
                author_id: admin._id,
                tags: ['healthy', 'soup'],
                ingredients: ['Labu siam', 'Jagung manis', 'Kacang panjang', 'Melinjo', 'Asam jawa'],
                steps: ['Rebus air bersama bumbu sayur asem dan asam jawa.', 'Masukkan jagung dan kacang tanah terlebih dahulu.', 'Tambahkan sayuran lainnya setelah jagung lunak.', 'Koreksi rasa manis dan asamnya.'],
                image_url: ''
            },
            {
                title: 'Tempe Mendoan',
                description: 'Tempe goreng khas Banyumas dengan tepung yang masih lembek dan gurih.',
                difficulty: 'Easy',
                cook_time: '10 mins',
                author_id: admin._id,
                tags: ['snack', 'traditional'],
                ingredients: ['Tempe khusus mendoan', 'Tepung terigu', 'Daun bawang', 'Kunyit bubuk'],
                steps: ['Campur tepung dengan air dan bumbu halus.', 'Masukkan irisan daun bawang yang banyak ke adonan.', 'Celupkan tempe lalu goreng sebentar di minyak panas.', 'Sajikan selagi hangat dengan sambal kecap.'],
                image_url: ''
            },
            {
                title: 'Pecel Lele Goreng',
                description: 'Ikan lele goreng krispi disajikan dengan sambal tomat terasi.',
                difficulty: 'Medium',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['fried', 'seafood'],
                ingredients: ['2 ekor lele', 'Ketumbar', 'Bawang putih', 'Sambal tomat'],
                steps: ['Lumuri lele dengan bumbu bawang dan ketumbar.', 'Goreng dalam minyak panas hingga sangat garing.', 'Ulek bahan sambal tomat dan terasi.', 'Sajikan lele dengan sambal dan lalapan segar.'],
                image_url: ''
            },
            {
                title: 'Ayam Kecap Mentega',
                description: 'Potongan ayam goreng yang dibalut saus mentega dan kecap manis.',
                difficulty: 'Easy',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['chicken', 'daily-meal'],
                ingredients: ['1/2 ekor ayam', '2 sdm mentega', '3 sdm kecap manis', 'Bawang bombay'],
                steps: ['Goreng ayam hingga setengah matang.', 'Tumis bawang bombay dengan mentega hingga layu.', 'Masukkan kecap manis, saus inggris, dan ayam.', 'Aduk rata hingga saus meresap ke dalam ayam.'],
                image_url: ''
            },
            {
                title: 'Rawon Daging Sapi',
                description: 'Sup daging hitam khas Jawa Timur dengan aroma kluwek yang autentik.',
                difficulty: 'Hard',
                cook_time: '90 mins',
                author_id: admin._id,
                tags: ['traditional', 'beef'],
                ingredients: ['500g daging sapi', '4 buah kluwek', '2 batang serai', 'Daun jeruk', 'Tauge pendek'],
                steps: ['Tumis bumbu halus kluwek hingga harum.', 'Rebus daging bersama bumbu hingga empuk.', 'Sajikan dengan tauge pendek dan sambal terasi.', 'Tambahkan telur asin sebagai pelengkap.'],
                image_url: ''
            },
            {
                title: 'Sambal Terong Balado',
                description: 'Terong ungu goreng yang dimasak dengan bumbu balado pedas manis.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['vegetable', 'spicy'],
                ingredients: ['2 buah terong ungu', '10 buah cabai merah', '5 siung bawang merah', 'Garam dan gula'],
                steps: ['Potong terong lalu goreng hingga layu.', 'Haluskan cabai dan bawang, lalu tumis hingga matang.', 'Masukkan terong ke dalam tumisan bumbu.', 'Aduk rata dan sajikan.'],
                image_url: ''
            },
            {
                title: 'Ayam Rica-Rica',
                description: 'Ayam bumbu pedas khas Manado dengan aroma daun kemangi dan jeruk.',
                difficulty: 'Medium',
                cook_time: '40 mins',
                author_id: admin._id,
                tags: ['spicy', 'manado'],
                ingredients: ['1/2 ekor ayam', 'Daun kemangi', 'Cabai rawit melimpah', 'Daun pandan', 'Serai'],
                steps: ['Goreng ayam setengah matang.', 'Tumis bumbu rica yang sudah diulek kasar.', 'Masukkan ayam dan air sedikit, masak hingga meresap.', 'Tambahkan kemangi sesaat sebelum diangkat.'],
                image_url: ''
            },
            {
                title: 'Lontong Sayur Labu',
                description: 'Sayur kuah santan labu siam yang cocok untuk sarapan.',
                difficulty: 'Medium',
                cook_time: '30 mins',
                author_id: admin._id,
                tags: ['breakfast', 'soup'],
                ingredients: ['Labu siam iris korek', 'Santan', 'Ebi kering', 'Tahu putih', 'Lontong'],
                steps: ['Tumis bumbu halus dan ebi hingga harum.', 'Tuang santan dan masukkan labu siam serta tahu.', 'Masak hingga labu lunak dan santan mendidih.', 'Sajikan dengan potongan lontong dan kerupuk merah.'],
                image_url: ''
            },
            {
                title: 'Cah Kangkung Bawang Putih',
                description: 'Menu simpel, cepat, dan sehat dengan aroma bawang putih yang kuat.',
                difficulty: 'Easy',
                cook_time: '5 mins',
                author_id: admin._id,
                tags: ['vegetable', 'quick-cook'],
                ingredients: ['1 ikat kangkung', '4 siung bawang putih cincang', 'Saus tiram', 'Cabai merah'],
                steps: ['Tumis bawang putih cincang hingga kecokelatan.', 'Masukkan kangkung dengan api sangat besar.', 'Tambahkan saus tiram dan sedikit air.', 'Masak sebentar saja agar tetap renyah.'],
                image_url: ''
            },
            {
                title: 'Telur Balado Pedas',
                description: 'Telur rebus goreng dengan balutan sambal merah yang menggugah selera.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['egg', 'daily-meal'],
                ingredients: ['4 butir telur rebus', 'Bumbu dasar merah', 'Daun jeruk', 'Gula merah'],
                steps: ['Goreng telur rebus hingga permukaannya berkulit.', 'Tumis bumbu merah dan daun jeruk sampai matang.', 'Masukkan telur, aduk rata dengan bumbu.', 'Masak sebentar hingga bumbu meresap.'],
                image_url: ''
            },
            {
                title: 'Sayur Lodeh Jawa',
                description: 'Sayur santan gurih dengan isian komplit khas masakan rumah.',
                difficulty: 'Easy',
                cook_time: '25 mins',
                author_id: admin._id,
                tags: ['soup', 'traditional'],
                ingredients: ['Terong', 'Kacang panjang', 'Melinjo', 'Santan', 'Labu siam'],
                steps: ['Rebus air dan bumbu iris hingga mendidih.', 'Masukkan sayuran dari yang paling keras.', 'Tuang santan, aduk perlahan agar tidak pecah.', 'Masak hingga semua sayuran matang.'],
                image_url: ''
            },
            {
                title: 'Cumi Goreng Tepung',
                description: 'Cumi krispi yang renyah di luar namun tetap lembut di dalam.',
                difficulty: 'Medium',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['seafood', 'snack'],
                ingredients: ['300g cumi ring', 'Tepung terigu', 'Tepung maizena', 'Bawang putih bubuk', 'Lada hitam'],
                steps: ['Bumbui cumi dengan bawang putih dan lada.', 'Balur cumi ke campuran tepung kering.', 'Goreng dalam minyak panas melimpah (deep fry).', 'Angkat saat warna sudah keemasan.'],
                image_url: ''
            },
            {
                title: 'Tumis Buncis Daging Giling',
                description: 'Perpaduan sayur buncis segar dengan gurihnya daging sapi giling.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['vegetable', 'protein'],
                ingredients: ['200g buncis', '100g daging sapi giling', 'Bawang putih', 'Kecap asin'],
                steps: ['Tumis bawang putih dan daging giling hingga matang.', 'Masukkan buncis yang sudah dipotong.', 'Tambahkan kecap asin dan lada.', 'Masak cepat hingga buncis agak layu tapi tetap garing.'],
                image_url: ''
            },
            {
                title: 'Ikan Patin Pindang',
                description: 'Sup ikan patin asam segar khas Palembang dengan potongan nanas.',
                difficulty: 'Medium',
                cook_time: '35 mins',
                author_id: admin._id,
                tags: ['seafood', 'soup'],
                ingredients: ['1 ekor ikan patin', 'Nanas potong', 'Daun kemangi', 'Asam jawa', 'Cabai merah'],
                steps: ['Didihkan air dengan bumbu pindang.', 'Masukkan ikan patin, masak hingga matang.', 'Tambahkan nanas dan kemangi di akhir.', 'Koreksi rasa asam dan pedasnya.'],
                image_url: ''
            },
            {
                title: 'Nasi Gila Mentega',
                description: 'Tumisan bakso, sosis, dan telur yang melimpah di atas nasi hangat.',
                difficulty: 'Easy',
                cook_time: '10 mins',
                author_id: admin._id,
                tags: ['fast-food', 'street-food'],
                ingredients: ['Bakso sapi', 'Sosis', '2 butir telur', 'Kecap manis', 'Saus tiram'],
                steps: ['Tumis bawang merah putih dengan mentega.', 'Masukkan telur, orak-arik.', 'Masukkan bakso dan sosis, beri saus-sausan.', 'Sajikan tumisan di atas nasi putih panas.'],
                image_url: ''
            },
            {
                title: 'Fu Yung Hai',
                description: 'Omelet tebal ala Chinese food dengan siraman saus asam manis.',
                difficulty: 'Medium',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['chinese-food', 'egg'],
                ingredients: ['3 butir telur', 'Kepiting atau udang cincang', 'Kol iris', 'Saus tomat', 'Kacang polong'],
                steps: ['Campur telur, kol, dan udang lalu goreng tebal.', 'Buat saus dari saus tomat, air, dan sedikit maizena.', 'Tambahkan kacang polong ke dalam saus.', 'Siram saus di atas omelet yang sudah matang.'],
                image_url: ''
            },
            {
                title: 'Sambal Cumi Asin',
                description: 'Cumi asin kecil yang dimasak dengan sambal ijo atau merah pedas.',
                difficulty: 'Easy',
                cook_time: '20 mins',
                author_id: admin._id,
                tags: ['spicy', 'seafood'],
                ingredients: ['150g cumi asin', '15 buah cabai hijau', '5 siung bawang merah', 'Daun jeruk'],
                steps: ['Rendam cumi asin dengan air panas agar tidak terlalu asin.', 'Goreng cumi sebentar saja.', 'Tumis sambal ijo kasar dan daun jeruk.', 'Masukkan cumi, aduk rata dan masak hingga meresap.'],
                image_url: ''
            },
            {
                title: 'Kolak Pisang Kepok',
                description: 'Cemilan manis hangat dengan kuah santan dan gula merah.',
                difficulty: 'Easy',
                cook_time: '25 mins',
                author_id: admin._id,
                tags: ['dessert', 'sweet'],
                ingredients: ['5 buah pisang kepok', 'Gula merah', 'Santan', 'Daun pandan', 'Sedikit garam'],
                steps: ['Rebus air, gula merah, dan pandan hingga larut.', 'Masukkan potongan pisang, masak hingga empuk.', 'Tuangkan santan, aduk perlahan agar tidak pecah.', 'Sajikan hangat atau dingin dengan es batu.'],
                image_url: ''
            },
            {
                title: 'Bistik Jawa Daging',
                description: 'Daging sapi masak kecap dengan kuah encer gurih ala kolonial.',
                difficulty: 'Medium',
                cook_time: '50 mins',
                author_id: admin._id,
                tags: ['beef', 'traditional'],
                ingredients: ['300g daging sapi iris', 'Kecap manis', 'Pala bubuk', 'Bawang bombay', 'Kentang goreng'],
                steps: ['Tumis bawang bombay hingga harum.', 'Masukkan daging, masak hingga berubah warna.', 'Tambahkan kecap, pala, garam, dan air.', 'Masak hingga daging empuk dan sajikan dengan kentang goreng.'],
                image_url: ''
            },
            {
                title: 'Sawi Putih Tumis Telur',
                description: 'Menu akhir bulan yang sehat, murah, dan sangat praktis.',
                difficulty: 'Easy',
                cook_time: '8 mins',
                author_id: admin._id,
                tags: ['vegetable', 'cheap-eat'],
                ingredients: ['1 bonggol sawi putih', '1 butir telur', 'Bawang putih', 'Cabai iris'],
                steps: ['Orak-arik telur lalu sisihkan.', 'Tumis bawang putih dan cabai hingga wangi.', 'Masukkan sawi putih, beri sedikit air.', 'Masukkan telur kembali, beri garam lada, sajikan.'],
                image_url: ''
            },
            {
                title: 'Sambal Bajak Joss',
                description: 'Sambal matang yang tahan lama dengan rasa terasi yang kuat.',
                difficulty: 'Easy',
                cook_time: '15 mins',
                author_id: admin._id,
                tags: ['spicy', 'condiment'],
                ingredients: ['Cabai merah', 'Cabai rawit', 'Terasi bakar', 'Tomat', 'Gula merah'],
                steps: ['Goreng semua bahan sambal hingga layu.', 'Ulek kasar bersama terasi, garam, dan gula.', 'Tumis kembali sambal dengan sedikit minyak hingga berminyak.', 'Simpan di wadah kedap udara.'],
                image_url: ''
            },
            {
                title: 'Garang Asem Ayam',
                description: 'Ayam kukus santan dengan rasa asam segar dari belimbing wuluh.',
                difficulty: 'Medium',
                cook_time: '45 mins',
                author_id: admin._id,
                tags: ['traditional', 'chicken'],
                ingredients: ['1/2 ekor ayam potong kecil', 'Belimbing wuluh', 'Santan encer', 'Daun pisang', 'Cabai rawit utuh'],
                steps: ['Campur ayam dengan bumbu iris dan santan.', 'Siapkan daun pisang, masukkan ayam dan belimbing.', 'Bungkus rapat dengan lidi.', 'Kukus selama 40 menit hingga sari ayam keluar.'],
                image_url: ''
            },
            {
                title: 'Kwetiau Goreng Sapi',
                description: 'Kwetiau kenyal dimasak dengan irisan daging sapi dan tauge.',
                difficulty: 'Easy',
                cook_time: '12 mins',
                author_id: admin._id,
                tags: ['noodle', 'fast-food'],
                ingredients: ['Kwetiau basah', '100g daging sapi', 'Tauge', 'Kecap manis', 'Saus tiram'],
                steps: ['Tumis bawang putih dan daging sapi hingga matang.', 'Masukkan kwetiau dan bumbu-bumbu.', 'Tambahkan tauge dan daun bawang di akhir.', 'Aduk cepat dengan api besar agar aroma smokey keluar.'],
                image_url: ''
            },
            {
                title: 'Martabak Telur Kulit Pangsit',
                description: 'Versi ekonomis martabak telur yang praktis menggunakan kulit pangsit.',
                difficulty: 'Easy',
                cook_time: '10 mins',
                author_id: admin._id,
                tags: ['snack', 'cheap-eat'],
                ingredients: ['Kulit pangsit', '2 butir telur', 'Daun bawang iris banyak', 'Daging cincang/kornet'],
                steps: ['Kocok telur bersama daun bawang dan kornet.', 'Siapkan kulit pangsit, beri isian telur di tengah.', 'Lipat kotak dan rekatkan pinggirnya.', 'Goreng hingga kecokelatan dan renyah.'],
                image_url: ''
            }
        ]);

        console.log(`🍲 ${recipes.length} resep berhasil di-seed.`);
        console.log('');
        console.log('=== AKUN UNTUK LOGIN ===');
        console.log('Admin → email: abdi@example.com | password: rabbani');
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
