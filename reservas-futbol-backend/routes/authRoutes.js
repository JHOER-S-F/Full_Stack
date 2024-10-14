const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post(
    '/register',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'Agrega un correo válido').isEmail(),
        check('password', 'El password debe ser de 6 caracteres como mínimo').isLength({ min: 6 })
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('correo', 'Agrega un correo válido').isEmail(),
        check('password', 'El password es obligatorio').exists()
    ],
    authController.login
);

router.get('/user', authMiddleware, authController.user);

module.exports = router;