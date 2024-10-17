<template>
  <div class="login-container">
    <h2>INICIAR SESIÓN</h2>
    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input 
          v-model="credentials.correo" 
          type="email" 
          placeholder="CORREO" 
          id="correo" 
          required
          autocomplete="email"  
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          v-model="credentials.password" 
          type="password" 
          placeholder="CONTRASEÑA" 
          id="password" 
          required
          autocomplete="current-password"  
        />
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'; 
import jwt_decode from 'jwt-decode'; // Importación corregida

export default {
  data() {
    return {
      credentials: {
        correo: '', 
        password: ''
      },
      errorMessage: null
    };
  },
  methods: {
    ...mapActions(['login']), // Mapea la acción de login desde Vuex

    async loginUser() {
      try {
        // Llama a la acción de login del store
        await this.login(this.credentials);

        // Obtiene el token desde localStorage
        const token = localStorage.getItem('token');
        if (token) {
          const user = jwt_decode(token); // Decodifica el token
          console.log('Usuario:', user); // Muestra la información del usuario en la consola
        }

        this.$router.push('/'); // Redirige al inicio después de iniciar sesión
      } catch (error) {
        this.handleError(error); // Llama a la función de manejo de errores
      }
    },

    handleError(error) {
      // Manejo de errores más específico
      if (error.response) {
        if (error.response.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos'; // Mensaje específico para error 401
        } else if (error.response.data && error.response.data.errors) {
          this.errorMessage = error.response.data.errors; // Mensaje de error del backend
        } else {
          this.errorMessage = 'Error en el servidor. Inténtalo más tarde.'; // Mensaje para otros errores
        }
      } else {
        this.errorMessage = 'Error al procesar la solicitud. Inténtalo nuevamente más tarde.'; // Mensaje de error general
      }
      console.error('Error de inicio de sesión:', error);
    }
  }
};
</script>

<style scoped>
.login-container {
  text-align: center;
  max-width: 400px;
  margin: 50px auto; /* Espaciado superior para centrar verticalmente */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--color-blanco); /* Color de fondo usando la paleta */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--color-primario); /* Usar color primario para el título */
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  transition: border-color 0.3s; /* Transición suave para el borde */
}

input:focus {
  border-color: var(--color-secundario); /* Usar color secundario al enfocar */
  outline: none; /* Sin borde de enfoque */
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-secundario); /* Color de fondo usando la paleta */
  color: var(--color-blanco); /* Color de texto usando la paleta */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s; /* Transición suave para el fondo */
}

button:hover {
  background-color: var(--color-terciario); /* Color de fondo al pasar el ratón */
}

.error-message {
  color: #e74c3c; /* Color rojo para los mensajes de error */
  margin-bottom: 10px;
  font-weight: bold; /* Resaltar mensaje de error */
}
</style>
