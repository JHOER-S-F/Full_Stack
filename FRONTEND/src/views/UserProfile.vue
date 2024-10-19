<template>
  <div class="perfil-container">
    <div class="perfil-dropdown">
      <div class="perfil-circle" @click="toggleDropdown">
        <img src="https://via.placeholder.com/50" alt="Perfil" />
      </div>
      <div v-if="isDropdownOpen" class="perfil-dropdown-menu">
        <div class="perfil-content">
          <div class="perfil-circle">
            <img src="https://via.placeholder.com/50" alt="Perfil" />
          </div>
          <p><strong>BIENVENIDO</strong> {{ user.nombre }}</p>
          <p><strong>CORREO</strong> {{ user.correo }}</p>
          <button class="logout-button" @click="handleLogout">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      isDropdownOpen: false, // Estado para manejar la visibilidad del menú desplegable
    };
  },
  computed: {
    ...mapGetters({
      user: 'getUser', // Getter que obtiene la información del usuario desde Vuex
    }),
  },
  methods: {
    ...mapActions({
      logout: 'logout', // Acción para cerrar sesión desde Vuex
    }),

    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.$store.commit('SET_USER', response.data); // Guardar usuario en Vuex
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login'); // Redirigir al login si no está autorizado
        }
      }
    },

    async handleLogout() {
      try {
        await this.logout(); // Acción para cerrar sesión
        localStorage.removeItem('token'); // Eliminar token del almacenamiento local
        this.$router.push('/login'); // Redirigir al login
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen; // Alternar el menú desplegable
    },
  },
  mounted() {
    this.fetchUser(); // Obtener información del usuario cuando el componente se monta
  },
};
</script>

<style scoped>
.perfil-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.perfil-dropdown {
  position: relative;
}

.perfil-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.perfil-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.perfil-dropdown-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra el contenido verticalmente */
}

.perfil-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logout-button {
  background-color: #ff4d4f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
}

.logout-button:hover {
  background-color: #ff7875;
}
</style>
