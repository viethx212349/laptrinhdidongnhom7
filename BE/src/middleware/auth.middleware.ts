/**
 * Auth Middleware — xác định Intern hiện tại
 * 
 * TODO: Khi có authentication thật (JWT/Supabase Auth), thay logic ở đây.
 * Hiện tại dùng header X-Intern-Id để simulate cho development.
 */
import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include internId
declare global {
  namespace Express {
    interface Request {
      internId?: string;
    }
  }
}

/**
 * Middleware: extract intern identity from request
 * 
 * Development: uses X-Intern-Id header
 * Production: sẽ dùng JWT token / Supabase Auth
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // TODO: Replace with real auth logic (JWT verification, Supabase Auth)
  const internId = req.headers['x-intern-id'] as string;

  if (!internId) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing authentication. Provide X-Intern-Id header.',
      },
    });
    return;
  }

  req.internId = internId;
  next();
};
