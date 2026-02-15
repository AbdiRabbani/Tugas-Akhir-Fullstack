import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TextInput,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecipes, fetchRecipeImage } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const CATEGORIES = [
    { key: 'all', label: 'Semua' },
    { key: 'Easy', label: 'Mudah' },
    { key: 'Medium', label: 'Sedang' },
    { key: 'Hard', label: 'Sulit' },
];

const CARD_COLORS = ['#FFE8DD', '#DDEEFF', '#DDFBE8', '#FFF3D6', '#EDE0FF', '#FFE0EA', '#E0F5F0', '#FFF0DD'];
const PER_PAGE = 10;

function RecipeCard({ item, index, navigation }) {
    const [imgUrl, setImgUrl] = useState(item.image_url || '');

    useEffect(() => {
        if (!imgUrl) {
            fetchRecipeImage(item._id)
                .then((res) => {
                    if (res.data.image_url) setImgUrl(res.data.image_url);
                })
                .catch(() => { });
        }
    }, [item._id]);

    const getDifficultyColor = (d) => {
        if (d === 'Easy') return '#22C55E';
        if (d === 'Medium') return '#F59E0B';
        if (d === 'Hard') return '#EF4444';
        return '#9CA3AF';
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RecipeDetail', { id: item._id })}
            activeOpacity={0.7}
        >
            <View style={[styles.cardImage, !imgUrl && { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] }]}>
                {imgUrl ? (
                    <Image source={{ uri: imgUrl }} style={styles.cardImg} resizeMode="cover" />
                ) : (
                    <ActivityIndicator size="small" color="#F05A28" />
                )}
                <View style={styles.cardOverlay}>
                    <View style={[styles.diffBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                        <Text style={styles.diffBadgeText}>{item.difficulty}</Text>
                    </View>
                    <View style={styles.timeBadge}>
                        <Text style={styles.timeBadgeText}>{item.cook_time}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description || 'Tidak ada deskripsi.'}
                </Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.authorText}>{item.author_id?.username || 'Ibu PKK'}</Text>
                    <View style={styles.tagsRow}>
                        {item.tags?.slice(0, 2).map((tag, i) => (
                            <View key={i} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function HomeScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [displayCount, setDisplayCount] = useState(PER_PAGE);

    useFocusEffect(
        useCallback(() => {
            loadUser();
            fetchRecipesData();
        }, [])
    );

    const loadUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUsername(JSON.parse(userData).username);
    };

    const fetchRecipesData = async () => {
        try {
            const res = await getRecipes();
            setRecipes(res.data.data);
        } catch (err) {
            if (err.response?.status === 401) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                navigation.replace('Login');
            } else {
                Alert.alert('Error', 'Gagal memuat resep.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');
    };

    const filtered = useMemo(() => {
        return recipes.filter((r) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = r.title.toLowerCase().includes(q) ||
                r.description?.toLowerCase().includes(q) ||
                r.tags?.some(t => t.toLowerCase().includes(q));
            const matchCat = activeCategory === 'all' || r.difficulty === activeCategory;
            return matchSearch && matchCat;
        });
    }, [recipes, searchQuery, activeCategory]);

    useEffect(() => { setDisplayCount(PER_PAGE); }, [searchQuery, activeCategory]);

    const displayed = filtered.slice(0, displayCount);
    const hasMore = displayCount < filtered.length;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
                <ActivityIndicator size="large" color="#F05A28" />
                <Text style={styles.loadingText}>Memuat resep...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F05A28" />

            <View style={styles.navbar}>
                <Text style={styles.navTitle}>Rahasia Dapur</Text>
                <View style={styles.navRight}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{(username || 'U').charAt(0).toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Mau masak apa hari ini?</Text>
                <Text style={styles.heroSub}>{recipes.length} resep tersedia</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari resep, bahan, atau tag..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.chipSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[styles.chip, activeCategory === cat.key && styles.chipActive]}
                            onPress={() => setActiveCategory(cat.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.chipText, activeCategory === cat.key && styles.chipTextActive]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Koleksi Resep</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{filtered.length} resep</Text>
                    </View>
                </View>
                <FlatList
                    data={displayed}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <RecipeCard item={item} index={index} navigation={navigation} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListFooterComponent={hasMore ? (
                        <TouchableOpacity
                            style={styles.loadMoreBtn}
                            onPress={() => setDisplayCount(c => c + PER_PAGE)}
                        >
                            <Text style={styles.loadMoreText}>
                                Tampilkan lebih banyak ({filtered.length - displayCount} lagi)
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                {searchQuery || activeCategory !== 'all'
                                    ? 'Resep tidak ditemukan'
                                    : 'Belum ada resep'}
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
    loadingText: { marginTop: 12, color: '#9CA3AF', fontSize: 14 },
    navbar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#F05A28', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 12,
    },
    navTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
    navRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
    logoutText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    hero: {
        backgroundColor: '#F05A28', paddingHorizontal: 20, paddingBottom: 24,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    },
    heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 2 },
    heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 14 },
    searchContainer: {
        backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
    },
    searchInput: { paddingVertical: 12, fontSize: 14, color: '#1A1A2E' },
    chipSection: { marginTop: 14, marginBottom: 4 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24,
        borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#fff', marginRight: 8,
    },
    chipActive: { backgroundColor: '#F05A28', borderColor: '#F05A28' },
    chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
    chipTextActive: { color: '#fff' },
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
    countBadge: { backgroundColor: '#FFF4F0', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
    countText: { fontSize: 12, color: '#F05A28', fontWeight: '600' },
    card: {
        backgroundColor: '#fff', borderRadius: 12, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
        overflow: 'hidden',
    },
    cardImage: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    cardImg: { width: '100%', height: '100%' },
    cardOverlay: {
        position: 'absolute', top: 8, left: 10, right: 10,
        flexDirection: 'row', justifyContent: 'space-between',
    },
    diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    diffBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    timeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)' },
    timeBadgeText: { fontSize: 10, fontWeight: '600', color: '#1A1A2E' },
    cardBody: { padding: 12 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
    cardDesc: { fontSize: 12, color: '#6B7280', lineHeight: 17, marginBottom: 8 },
    cardFooter: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB',
    },
    authorText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
    tagsRow: { flexDirection: 'row', gap: 4 },
    tag: { backgroundColor: '#FFF4F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
    tagText: { fontSize: 10, color: '#F05A28', fontWeight: '600' },
    loadMoreBtn: {
        backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center',
        borderWidth: 1.5, borderColor: '#F05A28', marginTop: 4,
    },
    loadMoreText: { color: '#F05A28', fontWeight: '600', fontSize: 13 },
    emptyState: { alignItems: 'center', paddingVertical: 50 },
    emptyText: { fontSize: 14, color: '#9CA3AF' },
});
