import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import { loginUser } from '../services/api';
import { setUser } from '../services/storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password, role);
      await setUser(data.user);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={COLORS.authGradient} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to access your account</Text>
            </View>

            {/* Role Selector */}
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
                onPress={() => setRole('customer')}
              >
                <Text style={[styles.roleBtnText, role === 'customer' && styles.roleBtnTextActive]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'seller' && styles.roleBtnActive]}
                onPress={() => setRole('seller')}
              >
                <Text style={[styles.roleBtnText, role === 'seller' && styles.roleBtnTextActive]}>
                  Seller
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <CustomButton
                title={loading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                variant="auth"
                disabled={loading}
                fullWidth
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>New to Megzo? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.footerLink}>Create an account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 40,
    ...SHADOWS.authCard,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    ...FONTS.bold,
    color: COLORS.authPurple,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    textAlign: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#f7fafc',
    padding: 6,
    borderRadius: 12,
    marginBottom: 30,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: COLORS.authPurple,
    ...SHADOWS.small,
  },
  roleBtnText: {
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  roleBtnTextActive: {
    color: COLORS.white,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: SIZES.md,
    ...FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 10,
    fontSize: SIZES.md,
    backgroundColor: COLORS.white,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: COLORS.authPurple,
    fontSize: 13,
    ...FONTS.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  footerLink: {
    color: COLORS.authPurple,
    ...FONTS.bold,
  },
});
