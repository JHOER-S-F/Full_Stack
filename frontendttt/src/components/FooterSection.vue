<template>
  <footer>
    <div class="footer-content">
      <p>&copy; 2024 Reservas de Canchas. Todos los derechos reservados.</p>
      <ul class="footer-links">
        <li><a href="/reservas">Reservar</a></li>
        <li><a href="/contacto">Contacto</a></li>
        <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
      </ul>
      <ul class="social-media">
        <li><a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a></li>
        <li><a href="https://twitter.com" target="_blank" aria-label="Twitter">
          <font-awesome-icon :icon="['fab', 'twitter']" />
        </a></li>
        <li><a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <font-awesome-icon :icon="['fab', 'instagram']" />
        </a></li>
      </ul>
      <div class="footer-extra">
        <p>Horario de atención: Lunes a Viernes 9am - 6pm</p>
        <p>Teléfono: +57 3204401061</p>
      </div>
      <button class="back-to-top" @click="scrollToTop">Volver arriba</button>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>


<style scoped>
/* Estilos generales del pie de página */
footer {
  background: linear-gradient(135deg, #1a1e23 0%, #2c3e50 100%);
  color: white;
  padding: 3rem 1rem;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s ease-in-out; /* Animación de entrada */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enlaces del pie de página */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.footer-links li {
  display: inline-block;
  margin: 0 15px;
}

.footer-links a {
  color: #61dafb;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s, transform 0.3s;
}

.footer-links a:hover {
  color: #2ecc71; /* Verde bonito */
  transform: translateY(-3px); /* Animación al pasar el mouse */
  text-decoration: underline;
}

/* Redes sociales */
.social-media {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.social-media li {
  display: inline-block;
  margin: 0 10px;
}

.social-media a {
  color: white;
  font-size: 1.8rem;
  transition: color 0.3s, transform 0.3s;
}

.social-media a:hover {
  color: #2ecc71; /* Verde bonito */
  transform: scale(1.2); /* Agrandar el icono al pasar el mouse */
}

/* Información adicional del footer */
.footer-extra {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #b0b0b0;
}

/* Botón para volver arriba */
.back-to-top {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  margin-top: 2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.back-to-top:hover {
  background-color: #27ae60;
  transform: translateY(-5px);
}

/* Adaptabilidad para dispositivos móviles */
@media (max-width: 768px) {
  .footer-links li {
    display: block;
    margin: 10px 0;
  }

  .social-media li {
    margin: 5px;
  }

  .footer-extra {
    font-size: 0.8rem;
  }
}

/* Adaptabilidad para pantallas pequeñas */
@media (max-width: 480px) {
  .footer-links li {
    margin: 8px 0;
  }

  .social-media a {
    font-size: 1.5rem;
  }
}
</style>
