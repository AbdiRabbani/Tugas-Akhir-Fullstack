import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRecipes, fetchRecipeImage } from '../api';

const CATEGORIES = [
    { key: 'all', label: 'Semua' },
    { key: 'Easy', label: 'Mudah' },
    { key: 'Medium', label: 'Sedang' },
    { key: 'Hard', label: 'Sulit' },
];

const CARD_COLORS = [
    '#FFE8DD', '#DDEEFF', '#DDFBE8', '#FFF3D6',
    '#EDE0FF', '#FFE0EA', '#E0F5F0', '#FFF0DD',
];

const PER_PAGE = 12;

function RecipeImage({ recipe, index }) {
    const [imgUrl, setImgUrl] = useState(recipe.image_url || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!imgUrl && !loading) {
            setLoading(true);
            fetchRecipeImage(recipe._id)
                .then((res) => {
                    if (res.data.image_url) setImgUrl(res.data.image_url);
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [recipe._id]);

    if (imgUrl) {
        return (
            <div className="recipe-card-image">
                <img src={imgUrl} alt={recipe.title} loading="lazy" />
                <div className="card-overlay">
                    <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}>
                        {recipe.difficulty}
                    </span>
                    <span className="time-badge">{recipe.cook_time}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-card-image" style={{ background: CARD_COLORS[index % CARD_COLORS.length] }}>
            {loading && <div className="img-loader"></div>}
            <div className="card-overlay">
                <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}>
                    {recipe.difficulty}
                </span>
                <span className="time-badge">{recipe.cook_time}</span>
            </div>
        </div>
    );
}

function getDifficultyColor(d) {
    if (d === 'Easy') return '#22C55E';
    if (d === 'Medium') return '#F59E0B';
    if (d === 'Hard') return '#EF4444';
    return '#9CA3AF';
}

function Home() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => { fetchRecipes(); }, []);

    const fetchRecipes = async () => {
        try {
            const res = await getRecipes();
            setRecipes(res.data.data);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
            setError('Gagal memuat resep.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Filter + Sort
    const filtered = useMemo(() => {
        let result = recipes.filter((r) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = r.title.toLowerCase().includes(q) ||
                r.description?.toLowerCase().includes(q) ||
                r.tags?.some(t => t.toLowerCase().includes(q));
            const matchCat = activeCategory === 'all' || r.difficulty === activeCategory;
            return matchSearch && matchCat;
        });

        if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === 'easy-first') {
            const order = { Easy: 1, Medium: 2, Hard: 3 };
            result.sort((a, b) => (order[a.difficulty] || 4) - (order[b.difficulty] || 4));
        } else if (sortBy === 'hard-first') {
            const order = { Hard: 1, Medium: 2, Easy: 3 };
            result.sort((a, b) => (order[a.difficulty] || 4) - (order[b.difficulty] || 4));
        }

        return result;
    }, [recipes, searchQuery, activeCategory, sortBy]);

    // Reset page when filter changes
    useEffect(() => { setPage(1); }, [searchQuery, activeCategory, sortBy]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat resep...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-brand"><h2>Rahasia Dapur</h2></div>
                <div className="navbar-right">
                    <span className="navbar-user">Halo, {user.username || 'User'}</span>
                    <div className="user-avatar">
                        {(user.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Hero */}
            <div className="hero">
                <div className="hero-content">
                    <h1>Mau masak apa hari ini?</h1>
                    <p>Temukan {recipes.length} resep masakan dari ibu-ibu PKK</p>
                    <div className="search-container">
                        <span className="search-icon">&#128269;</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Cari resep, bahan, atau tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="category-chips">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            className={`chip ${activeCategory === cat.key ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Terbaru</option>
                    <option value="title">A-Z</option>
                    <option value="easy-first">Mudah dulu</option>
                    <option value="hard-first">Sulit dulu</option>
                </select>
            </div>

            {/* Content */}
            <div className="content">
                {error && <div className="alert alert-error">{error}</div>}

                <div className="section-header">
                    <h2 className="section-title">Koleksi Resep</h2>
                    <span className="section-count">{filtered.length} resep</span>
                </div>

                <div className="recipe-grid">
                    {paginated.map((recipe, index) => (
                        <Link to={`/recipe/${recipe._id}`} key={recipe._id} className="recipe-card">
                            <RecipeImage recipe={recipe} index={index + (page - 1) * PER_PAGE} />
                            <div className="recipe-card-body">
                                <h3>{recipe.title}</h3>
                                <p className="recipe-description">
                                    {recipe.description
                                        ? recipe.description.substring(0, 70) + (recipe.description.length > 70 ? '...' : '')
                                        : 'Tidak ada deskripsi.'}
                                </p>
                                <div className="recipe-footer">
                                    <span className="recipe-author">
                                        {recipe.author_id?.username || 'Ibu PKK'}
                                    </span>
                                    <div className="recipe-tags">
                                        {recipe.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={page === 1}
                            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                        >
                            &laquo; Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                className={`page-btn ${page === p ? 'active' : ''}`}
                                onClick={() => { setPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            className="page-btn"
                            disabled={page === totalPages}
                            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                        >
                            Next &raquo;
                        </button>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <p>
                            {searchQuery || activeCategory !== 'all'
                                ? 'Resep tidak ditemukan. Coba kata kunci lain.'
                                : 'Belum ada resep.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
