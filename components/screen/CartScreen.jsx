import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { useCart } from '../../context/CartContext';

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

  const totalItems = useMemo(
    () => cartItems.reduce((sum, entry) => sum + (entry.quantity || 1), 0),
    [cartItems]
  );

  if (!cartItems.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart ({totalItems})</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(entry, index) => {
          const recipe = entry.item || entry;
          return (recipe._id || `item-${index}`) + '-' + index;
        }}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item: entry }) => {
          const recipe = entry.item || entry;
          const quantity = entry.quantity || 1;

          if (!recipe) return null;

          return (
            <View style={styles.cartItem}>
              <Image source={{ uri: recipe.image }} style={styles.cartImage} />
              <View style={styles.cartInfo}>
                <Text style={styles.cartName} numberOfLines={1}>{recipe.name}</Text>
                <Text style={styles.cartSubtitle} numberOfLines={1}>{recipe.cuisine}</Text>
                <Text style={styles.cartMeta}>⭐ {typeof recipe.rating === 'number' ? recipe.rating.toFixed(1) : '0.0'}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => recipe._id && removeFromCart(recipe._id)}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => addToCart(recipe)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                  {recipe._id && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => {
                        for (let i = 0; i < quantity; i++) {
                          removeFromCart(recipe._id);
                        }
                      }}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.clearButton]}
          onPress={clearCart}
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.buyButton]}
          onPress={() => {
            console.log('Proceed to buy', cartItems);
          }}
        >
          <Text style={styles.buyButtonText}>Buy ({totalItems})</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartSubtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  cartMeta: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fb6114',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    color: '#fb6114',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ffe1e1',
  },
  removeButtonText: {
    fontSize: 11,
    color: '#b02424',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    marginTop: 8,
    gap: 10,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f2f2f2',
  },
  buyButton: {
    backgroundColor: '#fb6114',
  },
  clearButtonText: {
    color: '#444',
    fontWeight: '600',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
})