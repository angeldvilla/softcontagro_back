const jwt = require('jsonwebtoken');

const generateToken = (userId, username, roles) => {
  const payload = {
    userId,
    username,
    roles,
  };

  // Firma del token con una clave secreta
  const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'secreto');
    return decoded;
  } catch (error) {
    return null;
  }
};

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    const decoded = verifyToken(token);
  
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  
    req.user = decoded;
    next();
  };

module.exports = { generateToken, verifyToken, verifyTokenMiddleware };
