import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AnimatedGradientBg from '../components/AnimatedGradientBg';
import GlassCard from '../components/GlassCard';
import GlassHeader from '../components/GlassHeader';
import CustomButton from '../components/CustomButton';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import { getProductImage } from '../data/products';
import { getCart, removeFromCartStorage, clearCart } from '../services/storage';

export default function CartScreen() {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const items = await getCart();
    setCartItems(items);
    calculateTotals(items);
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.05; // 5% Tax
    const total = subtotal + tax;
    setTotals({ subtotal, tax, total });
  };

  const handleRemoveItem = async (index) => {
    const updatedCart = await removeFromCartStorage(index);
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty!');
      return;
    }

    Alert.alert(
      'Success',
      'Order Placed Successfully! Redirecting to home...',
      [
        {
          text: 'OK',
          onPress: async () => {
            await clearCart();
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item, index }) => (
    <GlassCard style={styles.cartItemCard} blurIntensity={60}>
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: getProductImage(item.image) }}
          style={styles.itemImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
        </View>
        <Text style={styles.itemCategory}>{item.category}</Text>
        
        <View style={styles.itemFooter}>
          <Text style={styles.itemQty}>Qty: 1</Text>
          <TouchableOpacity onPress={() => handleRemoveItem(index)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <AnimatedGradientBg>
        <GlassHeader
          title="My Cart"
          navigation={navigation}
          rightAction={
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.headerRightText}>Shop</Text>
            </TouchableOpacity>
          }
        />

        <View style={styles.content}>
          <Text style={styles.pageTitle}>Shopping Cart</Text>

          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <GlassCard style={styles.emptyCard} noHover>
                  <Text style={styles.emptyTitle}>Your cart is empty</Text>
                  <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
                  <CustomButton
                    title="Start Shopping"
                    onPress={() => navigation.navigate('Products')}
                    style={styles.startShoppingBtn}
                  />
                </GlassCard>
              </View>
            }
          />
        </View>

        {/* Summary Footer */}
        {cartItems.length > 0 && (
          <View style={styles.summaryContainer}>
            <GlassCard style={styles.summaryCard} noHover blurIntensity={80}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{totals.subtotal.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (5%)</Text>
                <Text style={styles.summaryValue}>₹{totals.tax.toLocaleString()}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{totals.total.toLocaleString()}</Text>
              </View>

              <CustomButton
                title="PLACE ORDER"
                onPress={handleCheckout}
                style={styles.checkoutBtn}
                textStyle={styles.checkoutBtnText}
              />
            </GlassCard>
          </View>
        )}
      </AnimatedGradientBg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100,
  },
  pageTitle: {
    fontSize: SIZES.title,
    ...FONTS.bold,
    color: COLORS.white,
    paddingHorizontal: 20,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cartItemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 5,
    marginRight: 15,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.gray900,
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: SIZES.md,
    ...FONTS.semiBold,
    color: COLORS.gray900,
  },
  itemCategory: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    ...FONTS.medium,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  itemQty: {
    fontSize: SIZES.sm,
    color: COLORS.gray700,
  },
  removeText: {
    fontSize: SIZES.sm,
    color: COLORS.red500,
    ...FONTS.bold,
  },
  headerRightText: {
    fontSize: SIZES.md,
    ...FONTS.bold,
    color: COLORS.gray900,
  },
  emptyContainer: {
    paddingTop: 40,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: SIZES.xxl,
    ...FONTS.bold,
    color: COLORS.gray900,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: SIZES.md,
    color: COLORS.gray700,
    textAlign: 'center',
    marginBottom: 25,
  },
  startShoppingBtn: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.blue600,
  },
  summaryContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  summaryTitle: {
    fontSize: SIZES.xl,
    ...FONTS.bold,
    color: COLORS.gray900,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    paddingBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: SIZES.md,
    color: COLORS.gray700,
  },
  summaryValue: {
    fontSize: SIZES.md,
    ...FONTS.bold,
    color: COLORS.gray900,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray300,
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.gray900,
  },
  totalValue: {
    fontSize: SIZES.xxl,
    ...FONTS.extraBold,
    color: COLORS.blue600,
  },
  checkoutBtn: {
    height: 55,
    borderRadius: 12,
    backgroundColor: COLORS.btnYellow,
    ...SHADOWS.medium,
  },
  checkoutBtnText: {
    fontSize: SIZES.lg,
  },
});
