<template>
  <section id="contacto" class="contact-container">
    <h2>Contacto</h2>
    <p>
      Si tienes alguna pregunta, no dudes en 
      <a href="mailto:info@reservas.com" class="contact-link">contactarnos</a>.
    </p>
    <div class="contact-info">
      <h3>Información de Contacto</h3>
      <p><strong>Email:</strong> <a href="mailto:info@reservas.com">info@reservas.com</a></p>
      <p><strong>Teléfono:</strong> +57 3204401062</p>
      <p><strong>Dirección:</strong> Calle Ficticia 123, Ciudad, País</p>
    </div>
    <form @submit.prevent="sendMessage" class="contact-form">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input id="name" type="text" v-model="name" required placeholder="Tu nombre" />
      </div>
      <div class="form-group">
        <label for="email">Correo:</label>
        <input id="email" type="email" v-model="email" required placeholder="Tu correo" />
      </div>
      <div class="form-group">
        <label for="message">Mensaje:</label>
        <textarea id="message" v-model="message" required placeholder="Tu mensaje" rows="4"></textarea>
      </div>
      <button type="submit">Enviar Mensaje</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="success" class="success-message">{{ success }}</p> <!-- Mostrar el mensaje de éxito -->
  </section>
</template>

<script>
import axios from 'axios'; // Importar axios para hacer solicitudes HTTP

export default {
  name: 'ContactoSection',
  data() {
    return {
      name: '',
      email: '',
      message: '',
      error: null,
      success: null,
    };
  },
  methods: {
    async sendMessage() {
      this.error = null; 
      this.success = null; 

      // Validación básica
      if (!this.name || !this.email || !this.message) {
        this.error = 'Todos los campos son obligatorios.';
        return;
      }

      try {
        // Enviar el mensaje al backend
        const response = await axios.post('http://localhost:3000/api/cam/contact', {
          name: this.name,
          email: this.email,
          message: this.message,
        });

        // Procesar la respuesta del servidor
        if (response.data.success) {
          this.success = response.data.success; // Asegúrate de que tu backend retorne 'success' correctamente
          this.name = '';
          this.email = '';
          this.message = '';
        }
      } catch (error) {
        // Manejo de errores
        if (error.response && error.response.data && error.response.data.error) {
          this.error = error.response.data.error; // Mostrar el mensaje de error específico del backend
        } else {
          this.error = 'Error al enviar el mensaje. Intenta de nuevo más tarde.'; // Mensaje genérico
        }
      }
    },
  },
};
</script>

<style scoped>
.contact-container {
  max-width: 600px; 
  margin: 50px auto; 
  padding: 30px;
  border-radius: 12px; /* Bordes más redondeados */
  background-color: var(--color-blanco);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); /* Sombra más profunda */
  transition: transform 0.3s; /* Transición suave al mover */
}

.contact-container:hover {
  transform: translateY(-5px); /* Efecto de elevación al pasar el ratón */
}

h2 {
  color: var(--color-primario); 
  font-size: 30px; /* Aumentar tamaño de fuente */
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  text-align: center; /* Centrado del título */
}

p {
  color: #555; /* Color más suave */
  line-height: 1.8; 
}

.contact-link {
  color: var(--color-secundario); 
  text-decoration: none; 
  font-weight: bold; /* Hacer que el enlace sea más destacado */
}

.contact-link:hover {
  text-decoration: underline; 
}

.contact-info {
  margin-top: 25px; 
  padding: 20px;
  background-color: #f9f9f9; /* Fondo más claro */
  border-radius: 8px; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* Sombra suave */
}

.contact-info h3 {
  color: var(--color-terciario); 
}

.form-group {
  margin-bottom: 20px; /* Más espacio entre campos */
}

label {
  font-size: 16px; /* Aumentar tamaño de fuente */
  color: var(--color-secundario);
  margin-bottom: 5px;
  display: block;
  font-weight: 600; /* Negrita para etiquetas */
}

input,
textarea {
  width: 100%;
  padding: 12px; /* Mayor espacio en el interior */
  border: 1px solid #ccc; 
  border-radius: 6px; /* Bordes más redondeados */
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Transición para enfoque */
}

input:focus,
textarea:focus {
  border-color: var(--color-secundario); 
  outline: none; 
  box-shadow: 0 0 5px rgba(66, 183, 131, 0.5); /* Sombra al enfocar */
}

button {
  padding: 15px; /* Mayor espacio en el botón */
  background-color: var(--color-secundario); 
  color: var(--color-blanco); 
  border: none; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 18px; /* Aumentar tamaño de fuente */
  font-weight: bold; /* Hacer texto en el botón más destacado */
  transition: background-color 0.3s ease, transform 0.3s ease; 
}

button:hover {
  background-color: var(--color-terciario); 
  transform: scale(1.05); /* Efecto de aumento al pasar el ratón */
}

.error-message {
  color: #e74c3c; 
  margin-top: 15px; 
  font-weight: bold; /* Mensaje de error más destacado */
}

.success-message {
  color: #28a745; 
  margin-top: 15px; 
  font-weight: bold; /* Mensaje de éxito más destacado */
}
</style>
