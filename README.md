# إكسير — Exir App

تطبيق Expo/React Native لمنصة رعاية صحية منزلية واستشارات أونلاين. المستودع مبني كـ PNPM workspace ويحتوي على تطبيق الموبايل، API Server، مكتبات API client، ومكتبة قاعدة بيانات PostgreSQL باستخدام Drizzle.

## حالة المشروع الحالية

المشروع في مرحلة MVP تجريبي. الواجهة الأساسية موجودة، وتمت إضافة Backend أولي داخل `artifacts/api-server` لمسارات المستخدمين، طلبات انضمام مقدمي الخدمة، والحجوزات. التشغيل التجاري لا يزال يتطلب مصادقة حقيقية، صلاحيات متقدمة، لوحة إدارة، بوابة دفع، وإجراءات قانونية/تشغيلية قبل الإطلاق.

## البنية

- `artifacts/mobile`: تطبيق Expo.
- `artifacts/api-server`: Backend Express API.
- `lib/api-client-react`: عميل API مولد للاستخدام داخل React Query.
- `lib/api-zod`: مخططات Zod مولدة من OpenAPI.
- `lib/db`: اتصال PostgreSQL ومخططات Drizzle.
- `scripts`: سكربتات تشغيل وصيانة workspace.

## المتطلبات

- Node.js 24
- pnpm
- PostgreSQL عند تشغيل قاعدة البيانات والـ API
- Expo CLI عبر حزمة تطبيق الموبايل

## التشغيل المحلي

1. ثبّت الحزم عبر pnpm.
2. اضبط `DATABASE_URL` و `PORT`.
3. شغل Drizzle push لحزمة `@workspace/db`.
4. شغل API server من حزمة `@workspace/api-server`.
5. شغل تطبيق الموبايل من حزمة `@workspace/mobile`.

## API Server

المسارات الحالية داخل `artifacts/api-server`:

- `GET /api/healthz`
- `POST /api/auth/demo-login`
- `GET /api/users/me`
- `POST /api/provider-applications`
- `GET /api/provider-applications`
- `POST /api/bookings`
- `GET /api/bookings`

المسارات الخاصة بالمستخدم تستخدم رأسًا مؤقتًا للتطوير باسم `x-user-id`. هذا ليس مناسبًا للإنتاج ويجب استبداله بمصادقة حقيقية.

## قاعدة البيانات

يجب ضبط `DATABASE_URL` قبل تشغيل أوامر Drizzle أو API Server. تمت إضافة مخططات أساسية لـ:

- المستخدمين وأدوارهم
- ملفات المرضى
- طلبات انضمام مقدمي الخدمة
- ملفات مقدمي الخدمة المعتمدين
- الحجوزات

## ربط تطبيق الموبايل بالـ API

تمت إضافة جسر API داخل `artifacts/mobile/lib/api.ts`. يمكن تفعيل الربط التدريجي عبر `EXPO_PUBLIC_USE_REMOTE_API=true` وضبط `EXPO_PUBLIC_API_URL`.

## ملاحظات أمان مهمة

- لا تستخدم demo login في الإنتاج.
- لا تستخدم `x-user-id` كحماية إنتاجية.
- لا تقبل الطبيب تلقائيًا قبل مراجعة المستندات من Backend أو لوحة إدارة.
- لا تحفظ الملفات الطبية الحساسة كرابط عام دون صلاحيات وصول.
- يفضل أن يتم رفع المستندات عبر Backend موقّع بدل الاعتماد على unsigned upload preset من التطبيق.
- يجب مراجعة الشروط القانونية وسياسة الخصوصية حسب البلد المستهدف قبل الإطلاق.

## فحوصات CI

تمت إضافة GitHub Actions لتشغيل تثبيت الحزم ثم `pnpm run typecheck` عند الدفع إلى `main` أو فتح Pull Request.

## المرحلة التالية المقترحة

1. استبدال demo auth بمصادقة حقيقية.
2. ربط `AppContext` تدريجيًا بمسارات الـ API بدل البيانات المحلية.
3. إنشاء لوحة إدارة لمراجعة طلبات انضمام الأطباء.
4. إضافة إشعارات للحجوزات.
5. إضافة نظام دفع وسجل معاملات.
6. إضافة ملفات طبية وتقييمات بصلاحيات وصول واضحة.
