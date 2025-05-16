export default function apiKeyAuth(req, res, next) {
  const clientKey = req.headers['x-api-key'];
  const serverKey = process.env.API_KEY;

  if (!clientKey || clientKey !== serverKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
