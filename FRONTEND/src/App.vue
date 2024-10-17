<template>
  <div id="app">
    <!-- Barra de navegación -->
    <NavBarComponent />

    <!-- Mostrar perfil de usuario (opcional) -->
    <UserProfile v-if="isLoggedIn" />

    <!-- Router View para cargar las vistas basadas en las rutas -->
    <router-view />

    <!-- Pie de página -->
    <FooterSection />
  </div>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';
import FooterSection from './components/FooterSection.vue';
import UserProfile from './views/UserProfile.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    NavBarComponent,
    FooterSection,
    UserProfile,
  },
  computed: {
    ...mapGetters(['isLoggedIn']), // Verificar si el usuario está autenticado
  },
  methods: {
    ...mapActions(['checkAuth']), // Verifica la autenticación al cargar la app
  },
  created() {
    // Al cargar la aplicación, verificar si el token es válido
    this.checkAuth();
  }
};
</script>

