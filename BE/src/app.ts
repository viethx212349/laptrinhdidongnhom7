import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ===================== ROUTES =====================

// Health check - kiểm tra server + kết nối Supabase
app.get('/api/health', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('interns').select('id').limit(1);

    const dbStatus = error ? 'disconnected' : 'connected';

    res.json({
      success: true,
      data: {
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString(),
      },
      message: 'InternFlow Mobile Backend is running',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error',
      },
    });
  }
});

// ===================== START SERVER =====================

app.listen(PORT, () => {
  console.log(`🚀 InternFlow Mobile Backend running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
