// src/stores/cartStore.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
  }),
  actions: {
    addToCart(product) {
      const existingProduct = this.cartItems.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1; // Increment quantity if already in cart
      }
      else {
        this.cartItems.push({ ...product, quantity: 1 }); // Add new product to cart
      }
    },
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
    },
    clearCart() {
      this.cartItems = [];
    },
  },
  getters: {
    cartCount: state => state.cartItems.reduce((count, item) => count + item.quantity, 0),
    totalPrice: state => state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  },
});
