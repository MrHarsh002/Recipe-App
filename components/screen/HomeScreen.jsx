import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { categories } from '../../assets/data/categories';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';

const API_BASE_URL = 'http://10.0.2.2:5001';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { addToCart } = useCart();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/api/recipes?limit=10&sortBy=-rating`);
            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Failed to fetch recipes');
            }

            setRecipes(json.data?.recipes || []);
        } catch (err) {
            console.log('Error fetching recipes:', err);
            setError(err.message || 'Network request failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 5, paddingLeft: 12, paddingRight: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#f5f5f5', elevation: 4 }}>
                    <Feather name="search" size={24} color="orange" />
                    <TextInput placeholder="Search any recipe..." style={{ marginLeft: 8, flex: 1 }} />
                </View>
                <View style={{backgroundColor: '#fff', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', elevation: 4}}>
                    <TouchableOpacity>
                    <MaterialCommunityIcons name="filter-menu-outline" size={33} color="orange" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Categories</Text>
            </View>
            <View>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ alignItems: 'center', marginHorizontal: 10 }}>
                            <View style={{ backgroundColor: '#f5f5f5', padding: 10, borderRadius: 50, elevation: 4 }}>
                                <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                            </View>
                            <Text style={{ marginTop: 6 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Popular Recipes</Text>
            </View>
            <View>
                {loading && (
                    <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="orange" />
                    </View>
                )}

                {error && !loading && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                        <Text style={{ color: 'red' }}>{error}</Text>
                    </View>
                )}

                {!loading && !error && (
                    <FlatList
                        data={recipes}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.card}
                                onPress={() => setSelectedRecipe(item)}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.cardImage}
                                />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                                        {item.cuisine}
                                    </Text>
                                    <Text style={styles.cardMeta}>
                                        ⭐ {typeof item.rating === 'number' ? item.rating.toFixed(1) : '0.0'}
                                    </Text>
                                    <View style={styles.cardActionsRow}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.addToCartButton]}
                                            onPress={() => {
                                                addToCart(item);
                                                navigation.navigate('Cart');
                                            }}
                                        >
                                            <Text style={styles.addToCartText}>Add</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.buyNowButton]}
                                            onPress={() => {
                                                setSelectedRecipe(item);
                                            }}
                                        >
                                            <Text style={styles.buyNowText}>Buy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
            </ScrollView>

            {/* Detail modal */}
            <Modal
                visible={!!selectedRecipe}
                animationType="slide"
                transparent
                onRequestClose={() => setSelectedRecipe(null)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        {selectedRecipe && (
                            <>
                                <Image
                                    source={{ uri: selectedRecipe.image }}
                                    style={styles.modalImage}
                                />
                                <ScrollView contentContainerStyle={styles.modalContent}>
                                    <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                                    <Text style={styles.modalSubtitle}>
                                        {selectedRecipe.cuisine} {selectedRecipe.mealType && selectedRecipe.mealType.length > 0 ? `• ${selectedRecipe.mealType[0]}` : ''}
                                    </Text>
                                    <Text style={styles.modalMeta}>
                                        ⭐ {typeof selectedRecipe.rating === 'number' ? selectedRecipe.rating.toFixed(1) : '0.0'} · {selectedRecipe.reviewCount || 0} reviews
                                    </Text>
                                    <Text style={styles.modalMeta}>
                                        Prep {selectedRecipe.prepTimeMinutes} min · Cook {selectedRecipe.cookTimeMinutes} min · {selectedRecipe.servings} servings
                                    </Text>

                                    {Array.isArray(selectedRecipe.tags) && selectedRecipe.tags.length > 0 && (
                                        <View style={styles.tagsRow}>
                                            {selectedRecipe.tags.slice(0, 4).map((tag) => (
                                                <View key={tag} style={styles.tagChip}>
                                                    <Text style={styles.tagText}>{tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    {Array.isArray(selectedRecipe.ingredients) && (
                                        <View style={{ marginTop: 12 }}>
                                            <Text style={styles.sectionTitle}>Ingredients</Text>
                                            {selectedRecipe.ingredients.slice(0, 5).map((ing, idx) => (
                                                <Text key={idx} style={styles.sectionText}>• {ing}</Text>
                                            ))}
                                            {selectedRecipe.ingredients.length > 5 && (
                                                <Text style={styles.sectionMore}>+ more ingredients</Text>
                                            )}
                                        </View>
                                    )}

                                    {Array.isArray(selectedRecipe.instructions) && (
                                        <View style={{ marginTop: 12 }}>
                                            <Text style={styles.sectionTitle}>Instructions</Text>
                                            {selectedRecipe.instructions.slice(0, 3).map((step, idx) => (
                                                <Text key={idx} style={styles.sectionText}>{idx + 1}. {step}</Text>
                                            ))}
                                            {selectedRecipe.instructions.length > 3 && (
                                                <Text style={styles.sectionMore}>+ more steps</Text>
                                            )}
                                        </View>
                                    )}
                                </ScrollView>

                                <View style={styles.modalActionsRow}>
                                    <Pressable
                                        style={[styles.modalButton, styles.modalSecondaryButton]}
                                        onPress={() => setSelectedRecipe(null)}
                                    >
                                        <Text style={styles.modalSecondaryText}>Close</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.modalButton, styles.modalPrimaryButton]}
                                        onPress={() => {
                                            addToCart(selectedRecipe);
                                            setSelectedRecipe(null);
                                            navigation.navigate('Cart');
                                        }}
                                    >
                                        <Text style={styles.modalPrimaryText}>Buy Now</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 4,
    },
    cardImage: {
        width: '100%',
        height: 110,
    },
    cardContent: {
        flex: 1,
        padding: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        marginTop: 2,
        color: '#555',
        fontSize: 12,
    },
    cardMeta: {
        marginTop: 2,
        color: '#777',
        fontSize: 12,
    },
    cardActionsRow: {
        flexDirection: 'row',
        marginTop: 6,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'orange',
    },
    buyNowButton: {
        backgroundColor: 'orange',
    },
    addToCartText: {
        color: 'orange',
        fontWeight: '600',
        fontSize: 12,
    },
    buyNowText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
    },
    modalImage: {
        width: '100%',
        height: 180,
    },
    modalContent: {
        padding: 16,
        paddingBottom: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    modalMeta: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 6,
    },
    tagChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#ffe1c7',
        borderRadius: 12,
    },
    tagText: {
        fontSize: 11,
        color: '#a13e07',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
    },
    sectionMore: {
        fontSize: 12,
        color: '#fb6114',
        marginTop: 2,
    },
    modalActionsRow: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eee',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalSecondaryButton: {
        backgroundColor: '#f2f2f2',
    },
    modalPrimaryButton: {
        backgroundColor: '#fb6114',
    },
    modalSecondaryText: {
        color: '#444',
        fontWeight: '600',
    },
    modalPrimaryText: {
        color: '#fff',
        fontWeight: '700',
    },
})