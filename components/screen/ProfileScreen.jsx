import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

const API_BASE_URL = 'http://10.0.2.2:5001';

const ProfileScreen = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    bio: '',
  });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Login failed');
      }
      setUser(json.data);
      setToken(json.data.token);
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          username: form.username.trim(),
          bio: form.bio.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Signup failed');
      }
      setUser(json.data);
      setToken(json.data.token);
    } catch (e) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      username: '',
      bio: '',
    });
    setError(null);
  };

  if (!user) {
    return (
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.authTitle}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
        <Text style={styles.authSubtitle}>
          {mode === 'login'
            ? 'Sign in to manage your profile and favorites.'
            : 'Create an account to save your recipes.'}
        </Text>

        {mode === 'signup' && (
          <>
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={form.firstName}
              onChangeText={(t) => handleChange('firstName', t)}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={form.lastName}
              onChangeText={(t) => handleChange('lastName', t)}
            />
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={form.username}
              onChangeText={(t) => handleChange('username', t)}
            />
          </>
        )}

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={form.email}
          onChangeText={(t) => handleChange('email', t)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={form.password}
          onChangeText={(t) => handleChange('password', t)}
        />

        {mode === 'signup' && (
          <TextInput
            placeholder="Short bio (optional)"
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={form.bio}
            onChangeText={(t) => handleChange('bio', t)}
            multiline
          />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={mode === 'login' ? handleLogin : handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
          style={styles.switchMode}
        >
          <Text style={styles.switchModeText}>
            {mode === 'login'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Logged-in profile view
  return (
    <ScrollView contentContainerStyle={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: 'https://img.freepik.com/premium-vector/stylish-sophisticated-elegant-man-with-unique-hairstyle-design-fashionable-clothing_1120558-50407.jpg',
          }}
          style={styles.avatarLarge}
        />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.username}>@{user.username}</Text>
        {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
      </View>

      <Text style={styles.sectionHeading}>Account details</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRowLine}>
          <Text style={styles.infoLabel}>Full name</Text>
          <Text style={styles.infoValue}>
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <View style={styles.infoRowLine}>
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>@{user.username}</Text>
        </View>
        <View style={styles.infoRowLine}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRowLine}>
          <Text style={styles.infoLabel}>Member since</Text>
          <Text style={styles.infoValue}>
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
        <Text style={styles.secondaryButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen

const styles = StyleSheet.create({
  authContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fb6114',
    backgroundColor: '#fff',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#fb6114',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchMode: {
    marginTop: 12,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#fb6114',
    fontWeight: '500',
  },
  profileContainer: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#fb6114',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  bio: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#777',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    color: '#222',
  },
  infoRowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fb6114',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fb6114',
    fontWeight: 'bold',
  },
})