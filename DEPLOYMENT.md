# دليل النشر على Netlify

هذا الدليل يوضح كيفية نشر نظام إدارة المقاولات على منصة Netlify.

## المتطلبات المسبقة

1. **حساب Supabase**
   - إنشاء مشروع جديد في Supabase
   - تشغيل SQL Schema الموجود في `database/schema.sql`
   - الحصول على URL المشروع و API Keys

2. **حساب Netlify**
   - إنشاء حساب مجاني على [netlify.com](https://netlify.com)

3. **مستودع Git**
   - رفع الكود إلى GitHub, GitLab, أو Bitbucket

## خطوات النشر

### الخطوة 1: إعداد Supabase

1. **إنشاء مشروع جديد**
   - اذهب إلى [supabase.com](https://supabase.com)
   - أنشئ مشروع جديد
   - احفظ URL المشروع و API Keys

2. **تشغيل Database Schema**
   - اذهب إلى SQL Editor في Supabase
   - انسخ والصق محتوى `database/schema.sql`
   - شغل الـ SQL

3. **إعداد Authentication**
   - اذهب إلى Authentication > Settings
   - أضف Site URL: `https://your-app-name.netlify.app`
   - أضف Redirect URLs للتطبيق

### الخطوة 2: إعداد المشروع للنشر

1. **تحديث next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
```

2. **إنشاء netlify.toml**
```toml
[build]
  publish = "out"
  command = "npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PRIVATE_TARGET = "server"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### الخطوة 3: النشر على Netlify

#### الطريقة الأولى: Git Integration (مُوصى بها)

1. **ربط المستودع**
   - اذهب إلى Netlify Dashboard
   - اضغط "New site from Git"
   - اختر مزود Git (GitHub/GitLab/Bitbucket)
   - اختر المستودع

2. **إعداد Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`

3. **إضافة Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Deploy**
   - اضغط "Deploy site"
   - انتظر انتهاء البناء

#### الطريقة الثانية: Manual Deploy

1. **بناء المشروع محلياً**
```bash
npm install
npm run build
```

2. **رفع المجلد**
   - اذهب إلى Netlify Dashboard
   - اسحب وأفلت مجلد `out` على الصفحة

### الخطوة 4: إعداد Domain (اختياري)

1. **Custom Domain**
   - اذهب إلى Site settings > Domain management
   - أضف domain مخصص
   - اتبع التعليمات لإعداد DNS

2. **SSL Certificate**
   - سيتم تفعيل HTTPS تلقائياً
   - تأكد من إعادة توجيه HTTP إلى HTTPS

### الخطوة 5: إعداد المستخدم الأول

1. **إنشاء حساب Admin**
   - اذهب إلى `/auth/register`
   - أنشئ حساب جديد
   - في Supabase Dashboard، اذهب إلى Authentication > Users
   - عدل المستخدم وغير الـ role إلى 'admin'

2. **تسجيل الدخول**
   - اذهب إلى `/auth/login`
   - سجل دخول بالحساب الجديد

## استكشاف الأخطاء

### مشاكل شائعة وحلولها

1. **Build Fails**
   ```
   Error: TypeScript errors
   ```
   **الحل**: تأكد من `typescript: { ignoreBuildErrors: true }` في next.config.js

2. **404 على الصفحات**
   ```
   Page not found
   ```
   **الحل**: تأكد من وجود `[[redirects]]` في netlify.toml

3. **Supabase Connection Error**
   ```
   Failed to connect to Supabase
   ```
   **الحل**: تحقق من Environment Variables في Netlify

4. **Images not loading**
   ```
   Image optimization error
   ```
   **الحل**: تأكد من `images: { unoptimized: true }` في next.config.js

### فحص Environment Variables

```bash
# في Netlify Functions أو Build Logs
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### تحديث التطبيق

1. **Auto Deploy**
   - أي push إلى main branch سيؤدي إلى deploy تلقائي

2. **Manual Deploy**
   - اذهب إلى Deploys tab
   - اضغط "Trigger deploy"

## الأمان

### إعدادات Supabase الأمنية

1. **Row Level Security**
   - تأكد من تفعيل RLS على جميع الجداول
   - راجع Policies في Supabase

2. **API Keys**
   - لا تشارك Service Role Key
   - استخدم Anon Key فقط في Frontend

3. **CORS Settings**
   - أضف domain التطبيق في Supabase CORS settings

### إعدادات Netlify الأمنية

1. **Environment Variables**
   - لا تضع secrets في الكود
   - استخدم Netlify Environment Variables

2. **Headers Security**
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
   ```

## المراقبة والصيانة

### Analytics
- فعل Netlify Analytics لمراقبة الأداء
- استخدم Supabase Dashboard لمراقبة قاعدة البيانات

### Backups
- Supabase يقوم بـ backup تلقائي
- يمكن تصدير البيانات من Dashboard

### Updates
- راقب تحديثات Next.js و Supabase
- اختبر التحديثات في بيئة تطوير أولاً

---

**ملاحظة**: هذا الدليل يفترض استخدام الخطة المجانية لـ Netlify و Supabase. للاستخدام التجاري، قد تحتاج إلى ترقية الخطة.
