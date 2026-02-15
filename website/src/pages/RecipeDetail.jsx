import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById, fetchRecipeImage } from '../api';

function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => { fetchRecipe(); }, [id]);

    const fetchRecipe = async () => {
        try {
            const res = await getRecipeById(id);
            setRecipe(res.data.data);
            const imgUrl = res.data.data.image_url;
            if (imgUrl) {
                setImageUrl(imgUrl);
            } else {
                // Fetch from Unsplash and cache
                fetchRecipeImage(id)
                    .then((imgRes) => {
                        if (imgRes.data.image_url) setImageUrl(imgRes.data.image_url);
                    })
                    .catch(() => { });
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
            setError('Gagal memuat detail resep.');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyLabel = (d) => {
        if (d === 'Easy') return 'Mudah';
        if (d === 'Medium') return 'Sedang';
        if (d === 'Hard') return 'Sulit';
        return d;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat detail resep...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <nav className="navbar">
                    <div className="navbar-brand"><Link to="/"><h2>Rahasia Dapur</h2></Link></div>
                    <div className="navbar-right">
                        <div className="user-avatar">{(user.username || 'U').charAt(0).toUpperCase()}</div>
                        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                    </div>
                </nav>
                <div className="content" style={{ paddingTop: '24px' }}>
                    <div className="alert alert-error">{error}</div>
                    <Link to="/" className="btn btn-back">← Kembali</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="navbar-brand"><Link to="/"><h2>Rahasia Dapur</h2></Link></div>
                <div className="navbar-right">
                    <span className="navbar-user">Halo, {user.username || 'User'}</span>
                    <div className="user-avatar">{(user.username || 'U').charAt(0).toUpperCase()}</div>
                    <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Hero with image */}
            <div className="detail-hero" style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {imageUrl && <div className="detail-hero-overlay"></div>}
                <div className="detail-hero-content">
                    <Link to="/" className="btn btn-back" style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        border: 'none',
                        marginBottom: '16px',
                        backdropFilter: 'blur(4px)',
                    }}>← Kembali</Link>
                    <h1>{recipe.title}</h1>
                    <div className="detail-hero-meta">
                        <span className="detail-hero-badge">{getDifficultyLabel(recipe.difficulty)}</span>
                        <span className="detail-hero-badge">{recipe.cook_time}</span>
                        <span className="detail-hero-badge">{recipe.author_id?.username || 'Ibu PKK'}</span>
                    </div>
                    {recipe.tags?.length > 0 && (
                        <div className="detail-tags" style={{ marginTop: '12px' }}>
                            {recipe.tags.map((tag, i) => (
                                <span key={i} className="tag" style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white'
                                }}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="detail-container">
                {recipe.description && (
                    <div className="detail-card">
                        <h2 className="detail-section-title">Deskripsi</h2>
                        <p className="detail-description">{recipe.description}</p>
                    </div>
                )}

                {recipe.ingredients?.length > 0 && (
                    <div className="detail-card">
                        <h2 className="detail-section-title">
                            Bahan-bahan
                            <span className="section-count" style={{ marginLeft: 'auto' }}>
                                {recipe.ingredients.length} bahan
                            </span>
                        </h2>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {recipe.steps?.length > 0 && (
                    <div className="detail-card">
                        <h2 className="detail-section-title">
                            Langkah Memasak
                            <span className="section-count" style={{ marginLeft: 'auto' }}>
                                {recipe.steps.length} langkah
                            </span>
                        </h2>
                        <ol className="steps-list">
                            {recipe.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeDetail;
