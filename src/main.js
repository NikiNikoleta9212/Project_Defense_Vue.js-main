import { createPinia } from 'pinia';
import { createApp } from 'vue';
import ToastPlugin from 'vue-toast-notification'; // Import Toast Plugin
import App from './App.vue';
import router from './config/router';
import 'vue-toast-notification/dist/theme-default.css'; // Import Toast CSS
import './styles/reset.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ToastPlugin); // Use the Toast plugin

app.mount('#app');
