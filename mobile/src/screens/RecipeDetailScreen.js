import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    ActivityIndicator, Alert, StatusBar, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecipeById, fetchRecipeImage } from '../api';

export default function RecipeDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
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
                fetchRecipeImage(id)
                    .then((imgRes) => {
                        if (imgRes.data.image_url) setImageUrl(imgRes.data.image_url);
                    })
                    .catch(() => { });
            }
        } catch (err) {
            if (err.response?.status === 401) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                navigation.replace('Login');
            } else {
                Alert.alert('Error', 'Gagal memuat detail resep.');
            }
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
                <ActivityIndicator size="large" color="#F05A28" />
                <Text style={styles.loadingText}>Memuat detail resep...</Text>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
                <Text style={styles.loadingText}>Resep tidak ditemukan.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F05A28" />

            {/* Header with optional image */}
            <View style={styles.heroHeader}>
                {imageUrl ? (
                    <>
                        <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
                        <View style={styles.heroOverlay} />
                    </>
                ) : null}
                <View style={styles.heroContent}>
                    <View style={styles.heroNav}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Text style={styles.backBtnText}>← Kembali</Text>
                        </TouchableOpacity>
                        <View style={{ width: 80 }} />
                    </View>
                    <Text style={styles.heroTitle}>{recipe.title}</Text>
                    <View style={styles.heroBadges}>
                        <View style={styles.heroBadge}>
                            <Text style={styles.heroBadgeText}>{getDifficultyLabel(recipe.difficulty)}</Text>
                        </View>
                        <View style={styles.heroBadge}>
                            <Text style={styles.heroBadgeText}>{recipe.cook_time}</Text>
                        </View>
                        <View style={styles.heroBadge}>
                            <Text style={styles.heroBadgeText}>{recipe.author_id?.username || 'Ibu PKK'}</Text>
                        </View>
                    </View>
                    {recipe.tags?.length > 0 && (
                        <View style={styles.heroTags}>
                            {recipe.tags.map((tag, i) => (
                                <View key={i} style={styles.heroTag}>
                                    <Text style={styles.heroTagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {recipe.description ? (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Deskripsi</Text>
                        <Text style={styles.cardText}>{recipe.description}</Text>
                    </View>
                ) : null}

                {recipe.ingredients?.length > 0 ? (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Bahan-bahan</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{recipe.ingredients.length} bahan</Text>
                            </View>
                        </View>
                        {recipe.ingredients.map((item, i) => (
                            <View key={i} style={styles.ingredientItem}>
                                <View style={styles.dot} />
                                <Text style={styles.ingredientText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {recipe.steps?.length > 0 ? (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Langkah Memasak</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{recipe.steps.length} langkah</Text>
                            </View>
                        </View>
                        {recipe.steps.map((step, i) => (
                            <View key={i} style={styles.stepItem}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
    loadingText: { marginTop: 12, color: '#9CA3AF', fontSize: 14 },
    heroHeader: {
        backgroundColor: '#F05A28', paddingBottom: 24,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
        overflow: 'hidden', position: 'relative',
    },
    heroImage: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        width: '100%', height: '100%',
    },
    heroOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    heroContent: { position: 'relative', zIndex: 2 },
    heroNav: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 50, paddingBottom: 10,
    },
    backBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    },
    backBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', paddingHorizontal: 20, marginBottom: 12 },
    heroBadges: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8, marginBottom: 8 },
    heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    heroBadgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    heroTags: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 6, marginTop: 2 },
    heroTag: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
    heroTagText: { color: 'rgba(255,255,255,0.9)', fontSize: 11 },
    scrollView: { flex: 1, paddingTop: 14 },
    card: {
        backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginBottom: 10,
        padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
    countBadge: { backgroundColor: '#FFF4F0', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 12 },
    countText: { fontSize: 11, color: '#F05A28', fontWeight: '600' },
    cardText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
    ingredientItem: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F7F8FA', borderRadius: 8, padding: 12, marginBottom: 6,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F05A28', marginRight: 12 },
    ingredientText: { flex: 1, fontSize: 14, color: '#1A1A2E' },
    stepItem: {
        flexDirection: 'row', backgroundColor: '#F7F8FA', borderRadius: 10,
        padding: 14, marginBottom: 8, alignItems: 'flex-start',
    },
    stepNumber: {
        width: 26, height: 26, borderRadius: 13, backgroundColor: '#F05A28',
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    stepNumberText: { color: '#fff', fontSize: 12, fontWeight: '800' },
    stepText: { flex: 1, fontSize: 14, color: '#1A1A2E', lineHeight: 21 },
});
