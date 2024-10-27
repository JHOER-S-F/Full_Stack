<template>
  <div class="login-container">
    <h2>Registrarse</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input id="nombre" type="text" v-model="nombre" required autocomplete="name" />
      </div>
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input id="correo" type="email" v-model="correo" required autocomplete="email" />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input id="password" type="password" v-model="password" required minlength="6" autocomplete="new-password" />
      </div>
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      correo: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async register() {
      this.error = null; // Resetea el error
      try {
        await axios.post('http://localhost:3000/api/auth/register', {
          nombre: this.nombre,
          correo: this.correo,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.$router.push('/login'); // Redirige al login después del registro exitoso
      } catch (err) {
        // Manejo de errores más robusto
        if (err.response) {
          const message = err.response.data.errors
            ? err.response.data.errors.map(e => e.msg).join(', ')
            : 'Error inesperado. Código: ' + err.response.status;
          this.error = `Error al registrar: ${message}`;
        } else {
          this.error = 'Error en la conexión con el servidor';
        }
      }
    },
  },
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
  transition: transform 0.3s ease-in-out;
}

.login-container:hover {
  transform: translateY(-10px); /* Efecto de elevación al pasar el ratón */
}

h2 {
  color: var(--color-primario); /* Color del título usando la paleta */
  font-size: 28px;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 14px;
  color: var(--color-secundario); /* Color del texto de la etiqueta usando la paleta */
  margin-bottom: 5px;
  display: block;
  text-align: left;
}

input,
button {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
}

input {
  border: 1px solid #ddd;
  background-color: #fafafa; /* Color de fondo claro para las entradas */
}

input:focus {
  border-color: var(--color-secundario); /* Usar color secundario al enfocar */
  outline: none;
  box-shadow: 0px 0px 8px rgba(0, 128, 0, 0.2); /* Sombra al enfocar */
}

button {
  padding: 12px;
  background-color: var(--color-secundario); /* Color de fondo usando la paleta */
  color: var(--color-blanco); /* Color de texto usando la paleta */
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Transición para el fondo y tamaño */
}

button:hover {
  background-color: var(--color-terciario); /* Color de fondo al pasar el ratón */
  transform: scale(1.05); /* Efecto de aumento al pasar el ratón */
}

.error-message {
  color: #e74c3c; /* Color rojo para los mensajes de error */
  margin-top: 15px;
  font-size: 14px;
}
</style>
