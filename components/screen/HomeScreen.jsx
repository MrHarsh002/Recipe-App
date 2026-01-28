import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { categories } from '../../assets/data/categories';

const HomeScreen = () => {
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
                <FlatList
                
                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})