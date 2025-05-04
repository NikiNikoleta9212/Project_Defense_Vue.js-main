<script setup>
import { useCartStore } from '@/stores/cartStore';
import { computed } from 'vue';
import { useToast } from 'vue-toast-notification'; // Import useToast

const toast = useToast(); // Initialize toast plugin

const cartStore = useCartStore();
const cartItems = computed(() => cartStore.cartItems);
const totalPrice = computed(() => cartStore.totalPrice);

// Handle Buy Button and Clear Cart
function handleBuy() {
  cartStore.clearCart(); // Clear cart items
  toast.success('Payment Successful! Your cart has been cleared.', {
    position: 'top-right', // Position on the screen
    duration: 3000,
    dismissible: true, // Allow user to dismiss the toast
    icon: '🛍️', // Duration of the toast
  }); // Show success toast
}
</script>

<template>
  <div class="cart">
    <h1>Your Cart</h1>
    <div v-if="cartItems.length === 0">
      <p>Your cart is empty.</p>
    </div>
    <ul v-else>
      <li v-for="item in cartItems" :key="item.id" class="cart-item">
        <div class="cart-item-details">
          <img :src="item.image" :alt="item.title" class="cart-item-image">
          <div class="cart-item-info">
            <h3>{{ item.title }}</h3>
            <p>Price: ${{ item.price }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <button @click="cartStore.removeFromCart(item.id)">
              Remove
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="cartItems.length > 0" class="cart-summary">
      <p>Total: ${{ totalPrice }}</p>
      <button @click="handleBuy">
        Buy
      </button>
    </div>
  </div>
</template>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.cart h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
}

.cart-item-details {
  display: flex;
  gap: 20px;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h3 {
  font-size: 1.2rem;
}

.cart-item-info p {
  margin: 5px 0;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cart-summary button {
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cart-summary button:hover {
  background-color: #c82333;
}

/* Buy Button styling */
.cart-summary button:nth-child(3) {
  background-color: #28a745;
  font-size: 1rem;
}

.cart-summary button:nth-child(3):hover {
  background-color: #218838;
}
</style>
