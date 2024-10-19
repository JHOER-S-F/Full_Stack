// Cargar variables de entorno
require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

// Definir la URL del backend según el entorno
const backendURL = process.env.NODE_ENV === 'production'
  ? 'https://api.production.com' // URL del backend en producción
  : 'http://localhost:3000'; // URL del backend en desarrollo

module.exports = {
  // Configuración de Webpack
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all', // Dividir todos los módulos
      },
    },
    plugins: [
      // Plugin para inyectar variables de entorno seguras
      new webpack.DefinePlugin({
        'process.env': {
          ...process.env, // Incluir todas las variables de entorno
          VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL), // Exponer la API_URL
        },
        __VUE_OPTIONS_API__: true, // Activa la Options API en Vue.js
        __VUE_PROD_DEVTOOLS__: false, // Desactiva las devtools de Vue en producción
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true), // Evita la advertencia de hidratación
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Alias para acceder a la carpeta src
      },
    },
  },

  // Configuración del servidor de desarrollo
  devServer: {
    port: 8080, // Puerto del servidor de desarrollo
    open: true, // Abrir el navegador automáticamente
    historyApiFallback: true, // Soporte para Single Page Applications (SPA)
    proxy: {
      '/api': {
        target: backendURL, // Utilizar la URL del backend según el entorno
        changeOrigin: true,
      },
    },
  },

  // Configuración adicional
  lintOnSave: process.env.NODE_ENV !== 'production', // Deshabilitar linter en producción
  productionSourceMap: false, // Deshabilitar source maps en producción
  outputDir: 'dist', // Carpeta de salida para el build
  assetsDir: 'static', // Carpeta para archivos estáticos
};
