<template>
    <div>
        <h2>BIENVENIDO A</h2>
        <h1>SoccerBook</h1>
    </div>

    <nav>
        <ul>
            <li><a class="menu" id="menuToggle"><i class="fas fa-bars"></i></a></li> <!-- Ícono del menú -->
        </ul>
    </nav>

    <ul id="menuItems" style="display:none;"> <!-- Menú desplegable -->
        <li><a href="#">INICIO</a></li>
        <li><a href="#">A</a></li>
        <li><a href="#">CONTACTO</a></li>
    </ul>

    <!-- Sección Principal (Hero) -->
    <section class="hero">
        <h2>Bienvenidos a SoccerBook</h2>
        <p>Reserva tu cancha favorita en minutos</p>
        <a href="/login" class="btn">Reserva Ahora</a>
    </section>

    <!-- Sección de Características -->
    <section class="features">
        <div class="feature-item" data-animate="fade-in">
            <img src="../assets/pexels-thelazyartist-1598347.jpg" alt="Cancha">
            <h3>Rápido y Fácil</h3>
            <p>Reserva en solo unos pasos.</p>
        </div>
        <div class="feature-item" data-animate="fade-in">
            <img src="../assets/pexels-thelazyartist-1598347.jpg" alt="Calendario">
            <h3>Disponibilidad en Tiempo Real</h3>
            <p>Consulta las canchas disponibles.</p>
        </div>
        <div class="feature-item" data-animate="fade-in">
            <img src="../assets/soccer-5506110_1920.jpg" alt="Mapa">
            <h3>Encuentra Canchas Cercanas</h3>
            <p>Busca canchas cerca de tu ubicación.</p>
        </div>
    </section>

    <!-- Testimonios -->
    <section class="testimonials">
        <h2>Lo que dicen nuestros usuarios</h2> <br>
        <div class="testimonial visible" data-animate="slide-in">
            <p>"¡La mejor forma de reservar una cancha, fácil y rápido!"</p>
            <p>- Juan Pérez</p>
        </div>
        <div class="testimonial" data-animate="slide-in">
            <p>"Excelente plataforma, siempre encuentro la cancha que necesito."</p>
            <p>- María García</p>
        </div>
        <div class="testimonial" data-animate="slide-in">
            <p>"Me encanta lo fácil que es gestionar reservas desde mi móvil."</p>
            <p>- Carlos Rodríguez</p>
        </div>
    </section>

    <!-- Llamada a la Acción (CTA) -->
    <section class="cta">
        <h2>¿Listo para jugar?</h2> <br>
        <a href="/login" class="btn">Regístrate Ahora</a>
    </section>
</template>

<script>
export default {
    name: 'HomePage',
};

document.addEventListener("DOMContentLoaded", function() {
    // Manejo de la animación de las secciones con data-animate
    const elementsToAnimate = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Manejo de los testimonios
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;

    function showNextTestimonial() {
        testimonials[currentIndex].classList.remove('visible');
        currentIndex = (currentIndex + 1) % testimonials.length;
        testimonials[currentIndex].classList.add('visible');
    }

    setInterval(showNextTestimonial, 5000);

    testimonials[currentIndex].classList.add('visible');

    // Alternar el menú al hacer clic
    const toggleMenu = () => {
        const menu = document.getElementById('menuItems');
        menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
    };

    document.getElementById('menuToggle').addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
});
</script>

<style scoped>
/* Estilos Generales */
h1, h2 {
    color: #42b983;
    text-align: center;
}

body {
    background-color: #104210;
    font-family: 'Poppins', sans-serif;
}

/* HERO SECTION */
.hero {
    background-image: url('../assets/soccer-5506110_1920.jpg');
    background-size: cover;
    text-align: center;
    padding: 8rem 2rem;
    color: white;
}

.hero h2 {
    font-family: 'Abril Fatface', serif;
    font-size: 3rem;
}

.hero p {
    font-size: 1.5rem;
    margin: 1rem 0;
}

.btn {
    background-color: #FFD700;
    padding: 0.8rem 2rem;
    color: #000;
    text-transform: uppercase;
    font-weight: bold;
    border-radius: 8px;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #FFA500;
}

/* CARACTERÍSTICAS */
.features {
    display: flex;
    justify-content: space-around;
    padding: 4rem 2rem;
    background-color: #f4f4f4;
}

.feature-item {
    text-align: center;
    width: 30%;
}

.feature-item img {
    width: 80px;
    margin-bottom: 1rem;
}

/* ANIMACIONES */
[data-animate="fade-in"] {
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* TESTIMONIOS */
.testimonials {
    background-color: #006400;
    color: white;
    text-align: center;
    padding: 4rem 2rem;
    position: relative;
}

.testimonial {
    opacity: 0;
    transition: opacity 1s ease-in-out;
    position: absolute;
    width: 100%;
}

.testimonial.visible {
    opacity: 1;
}

/* CTA */
.cta {
    background-color: #FFD700;
    text-align: center;
    padding: 3rem 2rem;
}
</style>
