<template>
  <section id="sobre" class="sobre-container">
    <h2>Sobre Nosotros</h2>
    <p>
      Somos un equipo dedicado a proporcionar las <strong>mejores instalaciones deportivas</strong> para que disfrutes de tus partidos de fútbol con amigos y familiares.
    </p>

    <div class="accordion-container">
      <div class="accordion">
        <h3 @click="toggleAccordion(0)">¿Quiénes Somos?</h3>
        <p v-if="activeAccordion === 0">
          Somos un grupo de apasionados por el deporte que busca ofrecer una experiencia de calidad en nuestras canchas, facilitando un ambiente saludable y divertido.
        </p>
      </div>

      <div class="accordion">
        <h3 @click="toggleAccordion(1)">¿A Qué Nos Dedicamos?</h3>
        <p v-if="activeAccordion === 1">
          Nos dedicamos a la gestión de reservas de canchas deportivas, asegurándonos de que nuestros clientes tengan acceso a instalaciones modernas y cómodas para disfrutar del fútbol.
        </p>
      </div>

      <div class="accordion">
        <h3 @click="toggleAccordion(2)">¿Qué Servicios Brindamos?</h3>
        <p v-if="activeAccordion === 2">
          Ofrecemos canchas de fútbol de césped sintético, alquiler de equipamiento, vestuarios, y un sistema de reservas en línea que facilita la organización de tus partidos.
        </p>
      </div>

      <div class="accordion">
        <h3 @click="toggleAccordion(3)">Nuestra Misión</h3>
        <p v-if="activeAccordion === 3">
          Nuestra misión es ofrecer instalaciones deportivas de alta calidad para que tanto aficionados como profesionales disfruten de su pasión por el fútbol.
        </p>
      </div>

      <div class="accordion">
        <h3 @click="toggleAccordion(4)">Nuestra Visión</h3>
        <p v-if="activeAccordion === 4">
          Aspiramos a ser líderes en el sector de alquiler de canchas deportivas, creando una comunidad donde el deporte sea accesible para todos.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SobreNosotros',
  data() {
    return {
      activeAccordion: null, // Controla qué texto desplegable está abierto
    };
  },
  methods: {
    toggleAccordion(index) {
      this.activeAccordion = this.activeAccordion === index ? null : index;
    },
  },
};
</script>

<style scoped>
.sobre-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f0f4f8; /* Fondo suave para mayor estética */
  color: #333;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2.5em;
  color: #1e90ff; /* Color azul vibrante para el título */
  margin-bottom: 20px;
  text-transform: uppercase;
}

p {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 20px;
}

.accordion-container {
  text-align: left;
  margin-top: 20px;
}

.accordion {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.accordion h3 {
  font-size: 1.5em;
  color: #1e90ff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion h3:hover {
  color: #104e8b; /* Oscurece al pasar el ratón */
}

.accordion p {
  font-size: 1.1em;
  color: #333;
  margin-top: 10px;
  line-height: 1.6;
}

.accordion-container .accordion:not(:last-child) {
  margin-bottom: 15px;
}

.accordion-container .accordion:hover {
  transform: translateY(-5px); /* Animación suave al pasar el ratón */
}

@media (max-width: 768px) {
  .sobre-container {
    padding: 15px;
  }

  h2 {
    font-size: 2em;
  }

  p, .accordion p {
    font-size: 1em;
  }

  .accordion h3 {
    font-size: 1.3em;
  }
}
</style>
