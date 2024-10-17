<template>
  <div class="user-profile">
    <h2>Perfil de Usuario</h2>

    <div class="profile-info">
      <div class="profile-photo">
        <img :src="userPhotoUrl" alt="Foto de perfil" v-if="userPhotoUrl" />
        <p v-else>No hay foto de perfil</p>
      </div>

      <div class="profile-details">
        <p><strong>Nombre:</strong> {{ user.nombre }}</p>
        <p><strong>Correo:</strong> {{ user.correo }}</p>
      </div>
    </div>

    <div class="update-photo">
      <h3>Actualizar Foto de Perfil</h3>
      <input type="file" @change="onFileChange" />
      <button @click="updatePhoto">Actualizar Foto</button>
    </div>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="successMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedFile: null, // Archivo seleccionado para subir
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    user() {
      return this.getUser || {};
    },
    userPhotoUrl() {
      return this.user.foto ? `http://localhost:3000/${this.user.foto}` : null; // Ajusta según la estructura del backend
    },
  },
  methods: {
    ...mapActions(['fetchUser', 'updateProfilePicture']), // Usa la acción correcta del Vuex store

    onFileChange(event) {
      this.selectedFile = event.target.files[0]; // Asigna el archivo seleccionado
    },

    async updatePhoto() {
      if (!this.selectedFile) {
        this.errorMessage = 'Por favor, selecciona una foto para subir.';
        return;
      }

      const formData = new FormData();
      formData.append('foto', this.selectedFile); // El nombre del campo debe coincidir con el backend

      try {
        await this.updateProfilePicture(formData); // Acción de Vuex para subir la foto
        this.successMessage = 'Foto de perfil actualizada correctamente.';
        this.errorMessage = '';
        await this.fetchUser(); // Actualiza la información del usuario
      } catch (error) {
        this.errorMessage = 'Error al actualizar la foto de perfil.';
        this.successMessage = '';
      }
    },
  },
  async mounted() {
    await this.fetchUser(); // Cargar la información del usuario al montar el componente
  },
};
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.profile-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-photo img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details {
  margin-left: 20px;
}

.update-photo {
  margin-top: 20px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
