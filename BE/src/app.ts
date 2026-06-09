import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabase';
import notificationRoutes from './routes/notification.routes';

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
    // const { data, error } = await supabase.from('interns').select('id').limit(1);
    
    // Tạm thời bỏ qua DB cho health check để app không chết
    const dbStatus = 'disconnected';

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

// Mock Auth API (Vì hustrung chưa làm logic kết nối thực tế với bảng interns)
app.post('/api/auth/verify', (req, res) => {
  const { intern_code } = req.body;
  if (!intern_code) {
    return res.status(400).json({ success: false, message: 'Thiếu mã TTS' });
  }
  
  // Trả về mock data để FE có thể login
  res.json({
    success: true,
    data: {
      intern_id: 'mock-intern-123',
      intern_code: intern_code,
      full_name: 'Nguyễn Văn A (Mock)',
      position: 'Frontend Developer',
    },
    message: 'Đăng nhập giả lập thành công'
  });
});

// Notification APIs — /api/me/notifications
app.use('/api/me/notifications', notificationRoutes);

// ===================== START SERVER =====================

app.listen(PORT, () => {
  console.log(`🚀 InternFlow Mobile Backend running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔔 Notifications API: http://localhost:${PORT}/api/me/notifications`);
});

export default app;
