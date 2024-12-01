import { supabase } from "../db/index.js";

const verifyToken = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    // Verify token using Supabase's getUser API
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request object
    req.user = data.user;

    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(500).json({ error: 'Internal server error during token verification' });
  }
};

export default verifyToken;
