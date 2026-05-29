import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AnimatedGradientBg from '../components/AnimatedGradientBg';
import GlassCard from '../components/GlassCard';
import GlassHeader from '../components/GlassHeader';
import CustomButton from '../components/CustomButton';
import { COLORS, FONTS, SIZES } from '../styles/theme';
import { FEATURED_PRODUCTS, getProductImage } from '../data/products';
import { getUser, setUser as setStorageUser } from '../services/storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      setUser(userData);
      if (userData) {
        setAddress(userData.address || '');
        setContact(userData.contact_number || '');
      }
    };
    loadUser();
    
    // Add listener for focus to refresh user data (e.g. after login)
    const unsubscribe = navigation.addListener('focus', loadUser);
    return unsubscribe;
  }, [navigation]);

  const handleProfileUpdate = async () => {
    if (!address && !contact) {
      setProfileMessage({ text: 'Please fill at least one field', type: 'error' });
      return;
    }

    try {
      const updatedUser = { ...user, address, contact_number: contact };
      await setStorageUser(updatedUser);
      setUser(updatedUser);
      setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      setTimeout(() => {
        setProfileModalVisible(false);
        setProfileMessage({ text: '', type: '' });
      }, 1500);
    } catch (error) {
      setProfileMessage({ text: 'Error updating profile', type: 'error' });
    }
  };

  const renderProductItem = ({ item, index }) => (
    <View style={styles.productCardContainer}>
      <GlassCard
        style={styles.productCard}
        onPress={() => navigation.navigate('Products')}
      >
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: getProductImage(item.image) }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
        </View>
      </GlassCard>
    </View>
  );

  const ProfileButton = () => (
    <TouchableOpacity
      onPress={() => user ? setProfileModalVisible(true) : navigation.navigate('Login')}
      style={styles.headerBtn}
    >
      {user ? (
        <View style={styles.profileBtnInner}>
          <Text style={styles.profileBtnText}>Profile</Text>
        </View>
      ) : (
        <View style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Login</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AnimatedGradientBg>
        <GlassHeader
          title="MEGZO"
          rightAction={<ProfileButton />}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <GlassCard style={styles.heroCard} blurIntensity={60}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Big Savings on <Text style={styles.heroTitleAccent}>Electronics</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                  Get the best deals on the latest smartphones, laptops, and accessories with our premium collection.
                </Text>
                <CustomButton
                  title="Shop Now"
                  onPress={() => navigation.navigate('Products')}
                  style={styles.shopNowBtn}
                  textStyle={styles.shopNowBtnText}
                />
              </View>
              {/* Decorative Circles (Simulated) */}
              <View style={[styles.decorativeCircle, styles.circleTopRight]} />
              <View style={[styles.decorativeCircle, styles.circleBottomLeft]} />
            </GlassCard>
          </View>

          {/* Featured Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Best of Electronics</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Products')}
                style={styles.viewAllBtn}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={FEATURED_PRODUCTS}
              renderItem={renderProductItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.columnWrapper}
            />
          </View>

          {/* Footer Placeholder */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 MEGZO Shopping Site</Text>
          </View>
        </ScrollView>

        {/* Profile Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={profileModalVisible}
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalContent} noHover blurIntensity={80}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>My Profile</Text>
                <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                  <Text style={styles.closeBtn}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={contact}
                  onChangeText={setContact}
                  placeholder="Enter contact number"
                />
              </View>

              <CustomButton
                title="Save Profile"
                onPress={handleProfileUpdate}
                style={styles.saveBtn}
              />

              {profileMessage.text ? (
                <Text style={[
                  styles.message,
                  profileMessage.type === 'success' ? styles.successMessage : styles.errorMessage
                ]}>
                  {profileMessage.text}
                </Text>
              ) : null}
            </GlassCard>
          </View>
        </Modal>
      </AnimatedGradientBg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerBtn: {
    paddingVertical: 6,
  },
  loginBtn: {
    backgroundColor: COLORS.btnYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  loginBtnText: {
    ...FONTS.bold,
    color: COLORS.black,
  },
  profileBtnInner: {
    paddingHorizontal: 12,
  },
  profileBtnText: {
    ...FONTS.medium,
    color: COLORS.gray800,
  },
  heroSection: {
    marginBottom: 40,
  },
  heroCard: {
    padding: 30,
    borderRadius: 30,
    overflow: 'hidden',
  },
  heroContent: {
    zIndex: 10,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: SIZES.title,
    ...FONTS.extraBold,
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 36,
  },
  heroTitleAccent: {
    color: COLORS.blue600,
  },
  heroSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.gray700,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  shopNowBtn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shopNowBtnText: {
    fontSize: SIZES.lg,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.2,
  },
  circleTopRight: {
    top: -40,
    right: -40,
    backgroundColor: COLORS.blue600,
  },
  circleBottomLeft: {
    bottom: -40,
    left: -40,
    backgroundColor: COLORS.red500,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: SIZES.xxl,
    ...FONTS.bold,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  viewAllBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  viewAllText: {
    color: COLORS.white,
    ...FONTS.semiBold,
    fontSize: SIZES.sm,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCardContainer: {
    width: '48%',
    marginBottom: 20,
  },
  productCard: {
    height: 220,
    padding: 10,
  },
  productImageContainer: {
    height: 120,
    width: '100%',
    backgroundColor: COLORS.gray200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: SIZES.md,
    ...FONTS.semiBold,
    color: COLORS.gray900,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.gray900,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: COLORS.gray800,
    fontSize: SIZES.sm,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: SIZES.xxl,
    ...FONTS.bold,
    color: COLORS.gray900,
  },
  closeBtn: {
    fontSize: 28,
    color: COLORS.gray600,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.sm,
    ...FONTS.medium,
    color: COLORS.gray700,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 10,
    padding: 12,
    fontSize: SIZES.md,
    color: COLORS.gray900,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: 10,
  },
  message: {
    marginTop: 15,
    textAlign: 'center',
    ...FONTS.medium,
    fontSize: SIZES.sm,
  },
  successMessage: {
    color: COLORS.green600,
  },
  errorMessage: {
    color: COLORS.red500,
  },
});
