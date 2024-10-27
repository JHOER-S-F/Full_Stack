<template>
  <nav class="navbar">
    <ul class="nav-list">
      
      <h1><a href="/">SoccerBook</a></h1>


      <!-- Enlaces visibles para todos -->
      <li><router-link to="/contacto" class="nav-link">Contacto</router-link></li>
      <li><router-link to="/sobre-nosotros" class="nav-link">Sobre Nosotros</router-link></li>

      <!-- Enlaces visibles solo si el usuario está autenticado -->
      <li v-if="isLoggedIn">
        <router-link to="/reservar" class="nav-link">Reservar</router-link>
      </li>

      <!-- Enlaces visibles solo si el usuario no está autenticado -->
      <li v-if="!isLoggedIn">
        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link></li>
      <li v-if="!isLoggedIn">
        <router-link to="/register" class="nav-link">Registrarse</router-link></li>

      <!-- Botón de cerrar sesión visible solo si el usuario está autenticado -->
      <li v-if="isLoggedIn">
        <button @click="handleLogout" class="logout-button">Cerrar Sesión</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    // Obtener el estado de autenticación desde Vuex
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    // Mapeo de acciones de Vuex
    ...mapActions(['logout']),
    
    // Método para manejar el cierre de sesión
    handleLogout() {
      this.logout()
        .then(() => {
          // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
          this.$router.push('/login');
        })
        .catch((err) => {
          console.error('Error al cerrar sesión:', err);
        });
    },
  },
};
</script>

<style scoped>
/* Estilos generales para la barra de navegación */
.navbar {
  padding: 1rem; /* Espaciado interno */
  display: flex; /* Usar flexbox para la disposición */
  justify-content: center; /* Centrar los elementos en el eje horizontal */
  background-color: var(--color-primario); /* Color de fondo de la barra de navegación */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para un efecto de elevación */
}

/* Lista de navegación */
.nav-list {
  list-style-type: none; /* Eliminar el estilo de lista por defecto */
  margin: 0; /* Eliminar márgenes */
  padding: 0; /* Eliminar relleno */
  display: flex; /* Disposición en fila */
  gap: 1.5rem; /* Espacio entre elementos */
}

/* Estilo para los enlaces de la barra de navegación */
.nav-link {
  color: var(--color-blanco); /* Color de texto de los enlaces */
  text-decoration: none; /* Sin subrayado */
  display: block; /* Convertir en bloque para el relleno */
  font-size: 1rem; /* Tamaño de fuente */
  padding: 0.5rem 1rem; /* Espaciado interno */
  border-radius: 5px; /* Bordes redondeados */
  transition: background-color 0.3s ease, color 0.3s ease; /* Efecto de transición */
}

.nav-link:hover {
  background-color: var(--color-secundario); /* Color de fondo al pasar el ratón */
  color: var(--color-blanco); /* Color de texto al pasar el ratón */
}

/* Botón de cerrar sesión */
.logout-button {
  background-color: var(--color-secundario); /* Color de fondo del botón */
  color: var(--color-blanco); /* Color de texto del botón */
  border: none; /* Sin borde */
  padding: 0.5rem 1rem; /* Espaciado interno */
  font-size: 1rem; /* Tamaño de fuente */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambiar cursor al pasar sobre el botón */
  transition: background-color 0.3s ease; /* Efecto de transición */
}

.logout-button:hover {
  background-color: #d35400; /* Color de fondo al pasar el ratón */
}

/* Estilos responsivos para pantallas pequeñas */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column; /* Cambiar a columna en pantallas pequeñas */
    align-items: center; /* Centrar los elementos */
  }

  .nav-link,
  .logout-button {
    width: 100%; /* Hacer que ocupen todo el ancho */
    text-align: center; /* Centrar el texto */
    margin-bottom: 0.5rem; /* Espacio entre elementos */
  }
}
</style>
