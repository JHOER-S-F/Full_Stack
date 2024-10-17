<template>
  <div>
    <h1>RESERVA TU CANCHA IDEAL</h1>

    <!-- Selección de cliente -->
    <div>
      <label for="clienteSelect">SELECCIONA UN CLIENTE</label>
      <select v-model="clienteSeleccionado" @change="getCanchas" id="clienteSelect">
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nombre }}
        </option>
      </select>
    </div>

    <!-- Lista de canchas disponibles -->
    <div v-if="clienteSeleccionado">
      <h2>CANCHAS DISPONIBLES</h2>
      <ul v-if="canchas.length > 0">
        <li v-for="cancha in canchas" :key="cancha.id">
          {{ cancha.nombre }} - {{ cancha.direccion }}
          <button @click="seleccionarCancha(cancha)">Reservar</button>
        </li>
      </ul>
      <p v-else>NO HAY DISPONIBILIDAD</p>
    </div>

    <!-- Formulario de reserva -->
    <div v-if="canchaSeleccionada">
      <h3>RESERVAR CANCHA {{ canchaSeleccionada.nombre }}</h3>
      <form @submit.prevent="reservarCancha">
        <div>
          <label for="fecha">FECHA DE LA RESERVA</label>
          <input type="date" v-model="fecha" id="fecha" required />
        </div>

        <div>
          <label for="horaInicio">INGRESO</label>
          <input type="time" v-model="horaInicio" id="horaInicio" required />
        </div>

        <div>
          <label for="horaFin">SALIDA</label>
          <input type="time" v-model="horaFin" id="horaFin" required />
        </div>

        <div>
          <label for="nombreCliente">SU NOMBRE</label>
          <input type="text" v-model="nombreCliente" placeholder="Escribe tu nombre" id="nombreCliente" required />
        </div>

        <button type="submit">REALIZAR RESERVA</button>
      </form>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="reservaExito">
      <p>¡RESERVA EXITOSA! <br> LA CANCHA HA SIDO RESERVADA CORRECTAMENTE</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      clientes: [],            // Lista de clientes
      canchas: [],             // Lista de canchas filtradas
      clienteSeleccionado: null, // Cliente seleccionado
      canchaSeleccionada: null, // Cancha seleccionada para reservar
      fecha: '',               // Fecha de la reserva
      horaInicio: '',          // Hora de inicio de la reserva
      horaFin: '',             // Hora de fin de la reserva
      nombreCliente: '',       // Nombre del cliente
      reservaExito: false      // Estado de éxito de la reserva
    };
  },
  created() {
    this.getClientes(); // Obtener clientes al crear el componente
  },
  methods: {
    // Obtener la lista de clientes desde el servidor
    async getClientes() {
      const token = localStorage.getItem('token'); // Obtener el token de localStorage
      try {
        const response = await axios.get('http://localhost:3000/api/reservas/getClientes', { // Corregido
          headers: {
            Authorization: `Bearer ${token}` // Enviar el token en el encabezado
          }
        });
        this.clientes = response.data;
        // Selecciona el primer cliente si existe
        if (this.clientes.length > 0) {
          this.clienteSeleccionado = this.clientes[0].id;
          this.getCanchas();
        }
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    },
    // Obtener las canchas según el cliente seleccionado
    async getCanchas() {
      const token = localStorage.getItem('token'); // Obtener el token de localStorage
      try {
        const response = await axios.get(`http://localhost:3000/api/reservas/getCanchas?getClientes_id=${this.clienteSeleccionado}`, { // Corregido
          headers: {
            Authorization: `Bearer ${token}` // Enviar el token en el encabezado
          }
        });
        this.canchas = response.data;
      } catch (error) {
        console.error('Error al obtener las canchas:', error);
      }
    },
    // Seleccionar una cancha para realizar la reserva
    seleccionarCancha(cancha) {
      this.canchaSeleccionada = cancha;
      this.reservaExito = false; // Resetear el mensaje de éxito
    },
    // Realizar la reserva de la cancha seleccionada
    async reservarCancha() {
      const token = localStorage.getItem('token'); // Obtener el token de localStorage
      const reserva = {
        cancha_id: this.canchaSeleccionada.id,
        fecha: this.fecha,
        hora_inicio: this.horaInicio,
        hora_fin: this.horaFin,
        nombre_cliente: this.nombreCliente
      };

      try {
        await axios.post('http://localhost:3000/api/reservas/makeReserva', reserva, {
          headers: {
            Authorization: `Bearer ${token}` // Enviar el token en el encabezado
          }
        });
        this.reservaExito = true; // Mostrar mensaje de éxito
        this.resetForm(); // Resetear el formulario
      } catch (error) {
        console.error('Error al realizar la reserva:', error);
      }
    },
    // Resetear el formulario de reserva
    resetForm() {
      this.fecha = '';
      this.horaInicio = '';
      this.horaFin = '';
      this.nombreCliente = '';
      this.canchaSeleccionada = null; // Resetear la cancha seleccionada
    }
  }
};
</script>

<style scoped>
/* Centrar todos los elementos */
div {
  text-align: center;
  font-family: 'Arial', sans-serif;
}

/* Títulos */
h1, h2, h3 {
  margin-bottom: 15px;
  color: #2c3e50; /* Un azul oscuro para los títulos */
}

/* Estilos del formulario */
form {
  margin-top: 20px;
  padding: 30px; /* Aumentar el padding para más espacio */
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada */
  display: inline-block;
  text-align: left;
  width: 100%;
  max-width: 400px; /* Limitar el ancho máximo del formulario */
}

/* Estilo de los elementos del formulario */
form div {
  margin-bottom: 25px; /* Aumentar el margen inferior */
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #34495e; /* Un gris oscuro para las etiquetas */
}

input, select {
  padding: 12px; /* Aumentar el padding para mejor interacción */
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 5px;
  font-size: 16px;
  transition: border-color 0.3s; /* Transición para el borde */
}

/* Efecto en el input al enfocar */
input:focus, select:focus {
  border-color: #007bff; /* Color de borde azul al enfocar */
  outline: none; /* Eliminar el contorno por defecto */
}

button {
  padding: 12px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s; /* Añadir efecto de transform */
}

button:hover {
  background-color: #218838;
  transform: scale(1.05); /* Efecto de escalado al pasar el mouse */
}

/* Estilos para la lista de canchas */
ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0; /* Añadir margen superior e inferior */
}

li {
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #e1e1e1; /* Añadir borde a cada item */
  border-radius: 5px;
  background-color: #f9f9f9; /* Fondo ligero */
  transition: background-color 0.3s; /* Transición de fondo */
}

li:hover {
  background-color: #f0f8ff; /* Color de fondo al pasar el mouse */
}

li button {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #007bff; /* Cambiar el color del botón a azul */
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

li button:hover {
  background-color: #0056b3;
}

p {
  color: #28a745; /* Color verde para el mensaje de éxito */
  font-weight: bold;
  font-size: 18px;
}

/* Mejorar el diseño de la selección */
select {
  appearance: none;
  background: url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjEycHgiIHdpZHRoPSIxMnB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01IDBMMCA1LjAwMUwxMCAxMEwxNSAwWiIvPjwvc3ZnPg==') no-repeat right 10px center;
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

/* Estilos para inputs de fecha y hora */
input[type="date"], input[type="time"] {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
}
</style>

