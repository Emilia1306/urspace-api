export const jwtSecret = process.env.JWT_SECRET || 'secret_key'; // Clave secreta para firmar el token
export const jwtExpiration = '1h'; // Tiempo de expiración del token