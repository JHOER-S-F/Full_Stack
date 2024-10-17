import { createStore } from 'vuex';
import axios from 'axios';
import  jwt_decode  from 'jwt-decode'; // Importar correctamente jwt_decode

// Estado inicial
const state = {
  authToken: localStorage.getItem('token') || null, // Cargar el token desde localStorage si existe
  tokenExpiration: localStorage.getItem('tokenExpiration') || null, // Cargar la expiración del token desde localStorage
  user: null, // Información del usuario autenticado
  profilePicture: null, // Ruta de la foto de perfil del usuario
};

// Mutaciones
const mutations = {
  SET_AUTH_TOKEN(state, { token, expiration }) {
    state.authToken = token;
    state.tokenExpiration = expiration;
  },
  CLEAR_AUTH_TOKEN(state) {
    state.authToken = null;
    state.tokenExpiration = null;
    state.user = null; // Limpiar información del usuario
    state.profilePicture = null; // Limpiar la foto de perfil
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_PROFILE_PICTURE(state, picturePath) {
    state.profilePicture = picturePath;
  },
};

// Acciones
const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      // Realiza la solicitud para autenticar al usuario
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
      const { token } = response.data;

      // Decodificar el token para obtener la expiración
      const decodedToken = jwt_decode(token);
      const expirationTime = decodedToken.exp * 1000; // Convertir segundos en milisegundos

      // Almacenar token y su expiración en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationTime);

      // Mutar el estado del token y la expiración
      commit('SET_AUTH_TOKEN', { token, expiration: expirationTime });

      // Decodificar el token para obtener la información del usuario
      const user = jwt_decode(token);
      commit('SET_USER', user);

      // Obtener información adicional del usuario desde la API
      await dispatch('fetchUser');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Lanza el error para que pueda ser manejado en el componente
    }
  },

  async logout({ commit }) {
    try {
      // Llamada a la API para cerrar sesión
      await axios.post('http://localhost:3000/api/auth/logout');

      // Limpiar el token y el usuario después de un logout exitoso
      commit('CLEAR_AUTH_TOKEN');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    } catch (error) {
      console.error('Error en el logout:', error);
      throw error;
    }
  },

  checkAuth({ commit }) {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const currentTime = Date.now();

    // Verificar si el token es válido y no ha expirado
    if (token && tokenExpiration && currentTime < parseInt(tokenExpiration, 10)) {
      commit('SET_AUTH_TOKEN', { token, expiration: tokenExpiration });
      const user = jwt_decode(token); // Decodificar el token
      commit('SET_USER', user); // Mutar el estado del usuario
    } else {
      commit('CLEAR_AUTH_TOKEN'); // Si el token no es válido o ha expirado, limpiarlo
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    }
  },

  async fetchUser({ commit }) {
    try {
      // Obtener información adicional del usuario
      const response = await axios.get('http://localhost:3000/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      commit('SET_USER', response.data); // Almacenar la información del usuario

      // Almacenar la foto de perfil del usuario si existe
      if (response.data.foto) {
        commit('SET_PROFILE_PICTURE', response.data.foto);
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      if (error.response && error.response.status === 401) {
        commit('CLEAR_AUTH_TOKEN'); // Limpiar el estado si el token ha expirado
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
      }
    }
  },

  async updateProfilePicture({ commit }, formData) {
    try {
      // Llamada a la API para actualizar la foto de perfil
      const response = await axios.post('http://localhost:3000/api/auth/user/update-photo', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar la foto de perfil en el estado
      commit('SET_PROFILE_PICTURE', response.data.foto);
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      throw error;
    }
  },
};

// Getters
const getters = {
  isLoggedIn: (state) => !!state.authToken && Date.now() < parseInt(state.tokenExpiration, 10), // Verifica si el usuario está autenticado y si el token es válido
  getUser: (state) => state.user, // Obtiene la información del usuario
  getProfilePicture: (state) => state.profilePicture, // Obtiene la foto de perfil del usuario
};

// Crear el store
const store = createStore({
  state,
  mutations,
  actions,
  getters,
});

export default store;
