<script setup>
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cartStore'; // Import cart store
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 4;
const isLoading = ref(false);

// Store usage
const authStore = useAuthStore();
const detailsStore = useDetailsStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore(); // Access the cart store
const router = useRouter();

// Pagination
const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});

// Product actions
async function fetchProducts() {
  isLoading.value = true;
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    products.value = response.data;
  }
  catch (error) {
    console.error('Failed to fetch products:', error);
  }
  finally {
    isLoading.value = false;
  }
}

function toggleFavorite(product) {
  favoriteStore.toggleFavorite(product);
}

const isFavorite = product => favoriteStore.isFavorite(product);

function removeFavorite(product) {
  favoriteStore.removeFavorite(product);
}

function viewDetails(product) {
  detailsStore.setProduct(product);
  router.push(`/details/${product.id}`);
}

// ✅ Add to Cart action
function addProduct(product) {
  cartStore.addToCart(product); // Add the product to the cart store
}

// Pagination controls
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToTop();
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop();
  }
}

// Lifecycle
onMounted(fetchProducts);

// Auth
const isLoggedIn = computed(() => authStore.isLoggedIn);
</script>

<template>
  <progress v-if="isLoading" class="loader-line" />

  <div class="products">
    <h1>Products</h1>
    <ul class="product-list">
      <li v-for="product in paginatedProducts" :key="product.id" class="product-item">
        <article class="product-card">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.title" class="product-image">
          </div>
          <div class="product-details">
            <h2 class="product-name">
              {{ product.title }}
            </h2>
          </div>
          <p class="product-price">
            $ {{ product.price }}
          </p>
          <div class="btn">
            <button
              v-if="isLoggedIn"
              class="favorite-button"
              :class="{ 'favorite-active': isFavorite(product) }"
              type="button"
              @click="isFavorite(product) ? removeFavorite(product) : toggleFavorite(product)"
            >
              <i :class="isFavorite(product) ? 'bi bi-x-circle' : 'bi bi-star'" />
              {{ isFavorite(product) ? 'Remove' : 'Favorite' }}
            </button>

            <button
              v-else
              class="details-button"
              type="button"
              @click="viewDetails(product)"
            >
              <i class="bi bi-info-circle" />
              Details
            </button>

            <!-- ✅ New Add to Cart Button -->
            <button
              class="add-button"
              type="button"
              @click="addProduct(product)"
            >
              <i class="bi bi-cart-plus" />
              Add
            </button>
          </div>
        </article>
      </li>
    </ul>
  </div>

  <footer v-if="!isLoading && totalPages > 1" class="pagination-container">
    <button class="pagination-button" :disabled="currentPage === 1" @click="previousPage">
      Previous
    </button>
    <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
    <button class="pagination-button" :disabled="currentPage === totalPages" @click="nextPage">
      Next
    </button>
  </footer>
</template>

<style scoped>
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 120px;
  padding-bottom: 20px;
  color: #333;
}

.product-list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-item {
  display: flex;
  justify-content: center;
}

.product-card {
  width: 100%;
  max-width: 280px;
  min-height: 480px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  background-color: #f9f9f9;
  padding: 10px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-details {
  padding: 10px;
  text-align: left;
  flex-grow: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
  margin: 5px 0;
  color: #333;
  text-align: center;
}

.product-price {
  font-size: 1rem;
  font-weight: bold;
  color: #007BFF;
  text-align: center;
  margin-top: auto;
  padding-bottom: 10px;
}

.btn {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.favorite-button {
  background-color: #ddd;
  color: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.favorite-button.favorite-active {
  background-color: #ffcc00;
  color: #fff;
}

.details-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.details-button:hover {
  background-color: #0056b3;
}

.favorite-button i,
.details-button i,
.add-button i {
  margin-right: 5px;
}

.add-button {
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #138496;
}

.add-product-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-product-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-product-button:hover {
  background-color: #218838;
}

.add-product-button i {
  margin-right: 8px;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
}
.pagination-button {
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.pagination-button:disabled {
  cursor: not-allowed;
  color: #aaa;
  border-color: #ddd;
}
.pagination-button:not(:disabled):hover {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
.pagination-info {
  font-size: 14px;
  color: #555;
}

@media (max-width: 1024px) {
.product-list {
grid-template-columns: repeat(3, 1fr);
}
}

@media (max-width: 768px) {
.product-list {
grid-template-columns: repeat(2, 1fr);
}
}

@media (max-width: 480px) {
.product-list {
grid-template-columns: 1fr;
}
}
</style>
