import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, TouchableOpacity, Image } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import HomeScreen from "../../components/screen/HomeScreen";
import CartScreen from "../../components/screen/CartScreen";
import ProfileScreen from "../../components/screen/ProfileScreen";
import { CartProvider } from "../../context/CartContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fb6114",
          height: 70,
          borderRadius: 50,
          paddingTop: 14,
          paddingBottom: 10,
          position: 'absolute',
          marginHorizontal: 10,
          marginBottom: 5,
          
        },
        tabBarActiveTintColor: 'rgb(162, 52, 15)',
        tabBarInactiveTintColor: '#ffffffff',
        tabBarLabelStyle: {
          fontWeight: '800',
          fontSize: 12,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                width: 80,
                height: 67,
                borderRadius: 20,
                // borderTopLeftRadius: 30,
                backgroundColor: focused ? '#ffab62' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Feather
                name="home"
                size={28}
                color={color}
              />
            </View>
          ),
          tabBarShowLabel: true,
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                width: 80,
                height: 65,
                borderRadius: 15,
                backgroundColor: focused ? '#ffab62' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcons name="add-shopping-cart" size={28} color={color} />
            </View>
          ),
          tabBarShowLabel: true,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                width: 80,
                height: 67,
                borderRadius: 20,
                // borderTopRightRadius: 34,
                backgroundColor: focused ? '#ffab62' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome5 name="user" size={28} color={color} />
            </View>
          ),
          tabBarShowLabel: true,
        }}
      />

    </Tab.Navigator>
  );
}

export default function Index() {
  return (
    <CartProvider>
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: '#ff9b69',
          paddingTop: 20,
        },
        drawerActiveTintColor: 'rgb(135, 44, 13)',
        drawerInactiveTintColor: '#ffffff',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        headerShown: true,
        headerStyle: { backgroundColor: '#fb6114' },
        headerTintColor: '#fff',
        headerTitle: 'Foodie',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: 'bold' },
        swipeEnabled: true,
        drawerType: 'front',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ paddingHorizontal: 16 }}
          >
            <Feather name="menu" size={24} color="#ffffff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 16 }}>
            <Image
                        style={{ width: 40, height: 40, borderRadius: 50, marginLeft: 130, marginTop: 5 }}
                        source={{ uri: "https://img.freepik.com/premium-vector/stylish-sophisticated-elegant-man-with-unique-hairstyle-design-fashionable-clothing_1120558-50407.jpg" }}
                    />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
    </CartProvider>
  );
}
