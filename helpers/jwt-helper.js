const jwt = require('jsonwebtoken');

const SECRET_KEY = '0IxKbr9vkgh4VKO98V3ZfZ0og57LihJJ'

const generarToken = (sesion) => {  
  const token = jwt.sign(sesion, SECRET_KEY, { expiresIn: '20m' });
  return token;
};


const verificarToken = (token) => {
  try {
    const sesion = jwt.verify(token, SECRET_KEY);
    return sesion;
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return null;
  }
};

module.exports = { generarToken, verificarToken }
