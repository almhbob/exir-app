# Exir API

Backend HTTP API أولي لمنصة إكسير.

## التشغيل

شغل قاعدة البيانات ثم شغل الحزمة باسم `exir-api`.

## المتغيرات

- `DATABASE_URL`: رابط PostgreSQL.
- `API_PORT`: منفذ الخادم. القيمة الافتراضية 8080.
- `ENABLE_DEMO_AUTH`: تفعيل تسجيل الدخول التجريبي أثناء التطوير.

## المسارات الحالية

- `GET /api/healthz`
- `POST /api/auth/demo-login`
- `GET /api/users/me`
- `POST /api/provider-applications`
- `GET /api/provider-applications`
- `POST /api/bookings`
- `GET /api/bookings`

هذه طبقة تأسيسية للتطوير ويجب استبدال الحماية المؤقتة بمصادقة حقيقية قبل الإنتاج.
