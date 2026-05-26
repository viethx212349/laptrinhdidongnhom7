# InternFlow Mobile - Nhóm 7

Hệ thống quản lý thực tập sinh InternFlow - Phân hệ Mobile dành cho Intern.

## Cấu trúc dự án

```
├── FE/     # Mobile App (React Native + Expo)
├── BE/     # Backend API (Node.js + Express + TypeScript)
```

## Kiến trúc hệ thống

```
┌──────────────────┐     ┌──────────────────┐
│   Window App     │     │   Mobile App     │
│   (Mentor)       │     │   (Intern)       │
│   Electron +     │     │   React Native   │
│   ReactJS        │     │                  │
└───────┬──────────┘     └───────┬──────────┘
        │                        │
        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│  Window Backend  │     │  Mobile Backend  │
│                  │     │  (BE/)           │
└───────┬──────────┘     └───────┬──────────┘
        │                        │
        └──────────┬─────────────┘
                   ▼
         ┌──────────────────┐
         │    Supabase DB   │
         │   (Dùng chung)   │
         └──────────────────┘
```

## Cài đặt & Chạy

### Frontend (FE)

```bash
cd FE
npm install
npm start
```

### Backend (BE)

```bash
cd BE
npm install
cp .env.example .env   # Điền Supabase credentials
npm run dev
```

Backend chạy tại: `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server + kết nối DB |

## Tech Stack

| Thành phần | Công nghệ |
|------------|-----------|
| Mobile App | React Native, Expo, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL) |

## Thành viên - Nhóm 7

> Cập nhật danh sách thành viên tại đây.
