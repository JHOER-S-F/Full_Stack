import { createApp } from 'vue'; 
import App from './App.vue';
import router from './router';
import store from './store/auth';
import axios from 'axios';
import './styles/global.css'; // Importar estilos globales
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Advent+Pro:ital,wght@0,100..900;1,100..900&family=Agdasima:wght@400;700&family=Concert+One&family=Poppins&family=Rajdhani&display=swap" rel="stylesheet"></link>

// FontAwesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Establecer la URL base de axios
axios.defaults.baseURL = 'http://localhost:3000';

// Agregar los iconos a la biblioteca
library.add(faFacebook, faTwitter, faInstagram);

const app = createApp(App); // Crear la aplicación con createApp

// Usar el router y el store de manera separada
app.use(router);
app.use(store);

// Registrar el componente FontAwesome de forma global
app.component('font-awesome-icon', FontAwesomeIcon);

// Montar la aplicación
app.mount('#app');

