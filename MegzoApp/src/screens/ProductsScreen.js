import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import AnimatedGradientBg from '../components/AnimatedGradientBg';
import GlassCard from '../components/GlassCard';
import GlassHeader from '../components/GlassHeader';
import CustomButton from '../components/CustomButton';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import { PRODUCTS, getProductImage } from '../data/products';
import { addToCartStorage, getCartCount } from '../services/storage';

export default function ProductsScreen() {
  const navigation = useNavigation();
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortMode, setSortMode] = useState('default');

  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  useEffect(() => {
    updateCartIcon();
    applyFilters();
  }, [searchQuery, selectedCategories, maxPrice, sortMode]);

  const updateCartIcon = async () => {
    const count = await getCartCount();
    setCartCount(count);
  };

  const applyFilters = () => {
    let filtered = PRODUCTS.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price <= maxPrice;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });

    if (sortMode === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddToCart = async (product) => {
    await addToCartStorage(product);
    updateCartIcon();
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <GlassCard style={styles.productCard} noHover>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: getProductImage(item.image) }}
            style={styles.productImg}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>

          <View style={styles.buttonGroup}>
            <CustomButton
              title="Add to Cart"
              onPress={() => handleAddToCart(item)}
              style={styles.actionBtn}
              textStyle={styles.actionBtnText}
            />
            <CustomButton
              title="Buy Now"
              onPress={() => Alert.alert('Buy Now', `Proceeding with ${item.name}`)}
              variant="secondary"
              style={styles.actionBtn}
              textStyle={styles.actionBtnText}
            />
          </View>
        </View>
      </GlassCard>
    </View>
  );

  const CartIcon = () => (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
      <Text style={styles.cartIconText}>🛒</Text>
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AnimatedGradientBg>
        <GlassHeader
          title="MEGZO"
          navigation={navigation}
          rightAction={<CartIcon />}
        />

        <View style={styles.content}>
          <View style={styles.searchBarContainer}>
            <View style={styles.searchInner}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.gray600}
              />
            </View>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(true)}
              style={styles.filterBtn}
            >
              <Text style={styles.filterBtnText}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Our Products</Text>
            <View style={styles.resultsBadge}>
              <Text style={styles.resultsBadgeText}>
                {filteredProducts.length} items found
              </Text>
            </View>
          </View>

          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your filters or search.</Text>
              </View>
            }
          />
        </View>

        {/* Filter Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.closeModalText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.filterScroll}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.sortOptions}>
                  {['default', 'price-low', 'price-high'].map(mode => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.sortChip, sortMode === mode && styles.chipActive]}
                      onPress={() => setSortMode(mode)}
                    >
                      <Text style={[styles.chipText, sortMode === mode && styles.chipTextActive]}>
                        {mode === 'default' ? 'Default' : mode === 'price-low' ? 'Price: Low' : 'Price: High'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterSectionTitle}>Categories</Text>
                <View style={styles.categoryOptions}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryChip, selectedCategories.includes(cat) && styles.chipActive]}
                      onPress={() => toggleCategory(cat)}
                    >
                      <Text style={[styles.chipText, selectedCategories.includes(cat) && styles.chipTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterSectionTitle}>Price Range (Up up to)</Text>
                <Text style={styles.priceValue}>₹{maxPrice.toLocaleString()}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100000}
                  step={500}
                  value={maxPrice}
                  onValueChange={setMaxPrice}
                  minimumTrackTintColor={COLORS.blue600}
                  maximumTrackTintColor={COLORS.gray300}
                />
              </ScrollView>

              <CustomButton
                title="Apply Filters"
                onPress={() => setFilterModalVisible(false)}
                style={styles.applyBtn}
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategories([]);
                  setMaxPrice(100000);
                  setSortMode('default');
                }}
                style={styles.resetBtn}
              >
                <Text style={styles.resetBtnText}>Reset All</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    paddingTop: 100,
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  searchInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: COLORS.gray900,
    ...FONTS.medium,
  },
  filterBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBtnText: {
    fontSize: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: SIZES.xxxl,
    ...FONTS.bold,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultsBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  resultsBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    ...FONTS.medium,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '49%',
    marginBottom: 15,
  },
  productCard: {
    padding: 10,
    height: 320,
  },
  imageWrapper: {
    height: 140,
    width: '100%',
    backgroundColor: COLORS.gray200,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    ...FONTS.bold,
    color: COLORS.gray800,
  },
  cardBody: {
    flex: 1,
    marginTop: 10,
  },
  productName: {
    fontSize: SIZES.md,
    ...FONTS.semiBold,
    color: COLORS.gray900,
  },
  productPrice: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.gray900,
    marginVertical: 4,
  },
  buttonGroup: {
    marginTop: 'auto',
    gap: 6,
  },
  actionBtn: {
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: SIZES.sm,
  },
  cartBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartIconText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.red500,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    ...FONTS.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    ...FONTS.bold,
    color: COLORS.white,
    marginBottom: 10,
  },
  emptySubtitle: {
    color: COLORS.white,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: SIZES.xl,
    ...FONTS.bold,
    color: COLORS.gray900,
  },
  closeModalText: {
    fontSize: 24,
    color: COLORS.gray600,
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: SIZES.md,
    ...FONTS.bold,
    color: COLORS.gray900,
    marginBottom: 12,
    marginTop: 10,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  sortChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray200,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray200,
  },
  chipActive: {
    backgroundColor: COLORS.blue600,
  },
  chipText: {
    fontSize: SIZES.sm,
    color: COLORS.gray700,
    ...FONTS.medium,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  priceValue: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.blue600,
    textAlign: 'center',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  applyBtn: {
    marginBottom: 10,
    height: 50,
    borderRadius: 12,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  resetBtnText: {
    color: COLORS.gray600,
    ...FONTS.medium,
  },
});
