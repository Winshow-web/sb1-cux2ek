import {supabase} from "../supabase/index.js";

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(500).json({ error: 'Internal server error during token verification' });
  }
};

export default verifyToken;
