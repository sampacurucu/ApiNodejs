const { verificarToken } = require('../helpers/jwt-helper');

const validarToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  const sesion = verificarToken(token)
  if(!sesion) {
    res.status(401)
    .json({
        mensaje: 'Acceso denegado. Token inválido.'
    })
    return
  }

  req.sesion = sesion
  next()
};

const permitirAccesoPublico = (req, res, next) => {
    const rutasPublicas = ['/ruta-publica-1', '/ruta-publica-2'];
    if (rutasPublicas.includes(req.path)) {
      return next();
    }
  
    validarToken(req, res, next);
}

module.exports = { permitirAccesoPublico };
