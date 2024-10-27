// Importaciones de Vue Router y componentes
import { createRouter, createWebHistory } from 'vue-router';
import HomePaget from '../views/HomePaget.vue'; // Componente para la página de inicio
import UserProfile from '../views/UserProfile.vue'; // Componente para el perfil de usuario
import Register from '../components/RegisterForm.vue'; // Componente para el formulario de registro
import LoginForm from '../components/LoginForm.vue'; // Componente para el formulario de login
import FutbolCanchasForm from '../views/FutbolCanchasForm.vue'; // Componente para reservar canchas
import ContactoSection from '../views/ContactoSection.vue'; // Componente para la sección de contacto
import SobreNosotros from '../views/SobreNosotros.vue'; // Componente para la sección "Sobre Nosotros"
import store from '../store/auth'; // Importa el store para manejar el estado de autenticación


// Definición de rutas
const routes = [
  {
    path: '/', // Ruta principal
    component: HomePaget,
    name: 'home'
  },
  {
    path: '/user-profile', // Ruta para el perfil del usuario
    component: UserProfile,
    name: 'user-profile',
    // Requiere autenticación
  },
  {
    path: '/register', // Ruta para el formulario de registro
    component: Register,
    name: 'register'
  },
  {
    path: '/reservar', // Ruta para reservar cancha
    component: FutbolCanchasForm,
    name: 'reservar',
   // Requiere autenticación
  },
  {
    path: '/contacto', // Ruta para la sección de contacto
    component: ContactoSection,
    name: 'contacto'
  },
  {
    path: '/sobre-nosotros', // Ruta para la sección "Sobre Nosotros"
    component: SobreNosotros,
    name: 'sobre-nosotros'
  },
  {
    path: '/login', // Ruta para el formulario de login
    component: LoginForm,
    name: 'login'
  },
  // Ruta comodín para redireccionar a la página de inicio si no se encuentra una ruta
  {
    path: '/:catchAll(.*)', // Atrapa todas las rutas no definidas
    redirect: '/' // Redirige a la página principal
  }
];

// Creación del router
const router = createRouter({
  history: createWebHistory(), // Utiliza el historial del navegador (modo HTML5)
  routes // Define las rutas en el router
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado
    next({ name: 'login' }); // Redirigir al login
  } else {
    next(); // Continuar normalmente
  }
});


// Exportar el router para su uso en la aplicación
export default router;
