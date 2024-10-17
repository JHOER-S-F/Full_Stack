// camController.js
const nodemailer = require('nodemailer');
const pool = require('../config/db'); // Asegúrate de tener el pool configurado

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Cambia esto a tu servidor SMTP
  port: 587, // Usualmente 587 para TLS
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER || 'tu_email@example.com', // Tu correo electrónico
    pass: process.env.SMTP_PASS || 'tu_contraseña' // Tu contraseña de correo
  }
});

// Método para enviar un mensaje de contacto
const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Validación básica
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const mailOptions = {
    from: email, // Remitente
    to: 'info@reservas.com', // Destinatario
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: message,
    html: `<p><strong>Nombre:</strong> ${name}</p>
           <p><strong>Correo:</strong> ${email}</p>
           <p><strong>Mensaje:</strong></p>
           <p>${message}</p>`
  };

  try {
    // Inserción en la tabla preguntas
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO preguntas (nombre, correo, mensaje) VALUES (?, ?, ?)',
      [name, email, message]
    );
    connection.release();

    // Envío de correo
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: 'Mensaje enviado con éxito y guardado en la base de datos.' });
  } catch (error) {
    console.error('Error al enviar el correo o guardar en la base de datos:', error);
    return res.status(500).json({ error: 'Error al enviar el mensaje. Intenta de nuevo más tarde.' });
  }
};

module.exports = { sendContactMessage };
