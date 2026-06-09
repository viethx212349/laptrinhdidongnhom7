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

app.post('/api/auth/verify', async (req, res) => {
  const rawInternCode = String(req.body.intern_code || '').trim();
  const internCode = rawInternCode.toUpperCase();

  if (!internCode) {
    return res.status(400).json({
      success: false,
      message: 'intern_code is required',
    });
  }

  try {
    const { data, error } = await supabase
      .from('interns')
      .select('id, intern_code, full_name, email, position, status')
      .ilike('intern_code', internCode)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Mã thực tập sinh không hợp lệ.',
      });
    }

    const internPayload = {
      intern_id: data.id,
      intern_code: data.intern_code,
      full_name: data.full_name,
      email: data.email ?? null,
      position: data.position ?? null,
      status: data.status ?? null,
    };

    res.json({
      success: true,
      data: internPayload,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});



app.get('/api/interns/:id/dashboard', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PARAMETERS',
        message: 'Intern id is required',
      },
    });
  }

  try {
    const [{ data: internData, error: internError }, { data: rawTasks, error: taskError }] = await Promise.all([
      supabase.from('interns').select('id, intern_code, full_name, email, position, status, phone, school').eq('id', id).single(),
      supabase
        .from('tasks')
        .select('id, title, description, status, rejected_count, due_date, assigned_at, submitted_at, mentor_feedback, submission_summary')
        .eq('intern_id', id)
        .order('assigned_at', { ascending: false }),
    ]);

    if (internError || !internData) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Intern not found',
        },
      });
    }

    if (taskError) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: taskError.message,
        },
      });
    }

    const tasks = (rawTasks ?? [])
      .map((task: any) => {
        const normalizedStatus = normalizeTaskStatus(task);
        return normalizedStatus
          ? {
              id: task.id,
              title: task.title,
              date: task.due_date || task.assigned_at || null,
              status: normalizedStatus,
              mentor_feedback: task.mentor_feedback ?? null,
              submission_summary: task.submission_summary ?? null,
            }
          : null;
      })
      .filter(Boolean);

    const totalTasks = tasks.length;
    const completedCount = tasks.filter((task: any) => task.status === 'HOÀN THÀNH').length;
    const overdueCount = tasks.filter((task: any) => task.status === 'TRỄ HẠN').length;

    res.json({
      success: true,
      data: {
        intern: {
          intern_id: internData.id,
          intern_code: internData.intern_code,
          full_name: internData.full_name,
          email: internData.email ?? null,
          position: internData.position ?? null,
          status: internData.status ?? null,
          phone: internData.phone ?? null,
          school: internData.school ?? null,
        },
        summary: {
          total_tasks: totalTasks,
          completed_count: completedCount,
          overdue_count: overdueCount,
        },
        tasks,
      },
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



app.get('/api/interns/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PARAMETERS',
        message: 'Intern id is required',
      },
    });
  }

  try {
    const { data, error } = await supabase
      .from('interns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.details?.includes('Multiple rows found')) {
        return res.status(500).json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: error.message,
          },
        });
      }

      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Intern not found',
        },
      });
    }

    res.json({
      success: true,
      data,
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

const normalizeTaskStatus = (task: any) => {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && task.status !== 'DONE' && dueDate < new Date();

  if (isOverdue) {
    return 'TRỄ HẠN';
  }

  const rejectedCount = Number(task.rejected_count ?? 0);
  if (rejectedCount > 0 && task.status !== 'DONE') {
    return 'CẦN SỬA';
  }

  switch (task.status) {
    case 'IN_PROGRESS':
      return 'ĐANG LÀM';
    case 'IN_REVIEW':
      return 'CHỜ DUYỆT';
    case 'DONE':
      return 'HOÀN THÀNH';
    default:
      return null;
  }
};

app.get('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('tasks').select('*, interns(full_name)').eq('id', id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Task not found' });
    
    let attachments: any[] = [];
    try {
      const res = await supabase.from('task_attachments').select('*').eq('task_id', id);
      if (res.data) attachments = res.data;
    } catch(e) {}

    res.json({
      success: true,
      data: {
        ...data,
        display_status: normalizeTaskStatus(data),
        attachments: attachments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Cấu hình thư mục lưu trữ file
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Thay thế khoảng trắng và ký tự đặc biệt trong tên file
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeOriginalName);
  }
});
const upload = multer({ storage });

// Serve static folder cho FE truy cập file
app.use('/uploads', express.static(uploadDir));

app.post('/api/tasks/:id/submit', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const { submission_summary } = req.body;
  
  let submission_link = null;
  // Nếu có file upload lên, lưu lại đường dẫn tương đối
  if (req.file) {
    submission_link = `/uploads/${req.file.filename}`;
  }
  
  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        status: 'IN_REVIEW',
        submission_summary: submission_summary || null,
        submission_link: submission_link || req.body.submission_link || null,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', id);
      
    if (error) throw error;
    res.json({ success: true, message: 'Báo cáo đã được nộp thành công!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

import notificationRoutes from './routes/notification.routes';

// ===================== START SERVER =====================

app.use('/api/me/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`🚀 InternFlow Mobile Backend running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔔 Notifications API: http://localhost:${PORT}/api/me/notifications`);
});

export default app;