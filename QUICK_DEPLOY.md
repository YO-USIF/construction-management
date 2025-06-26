# 🚀 النشر السريع على Netlify (15 دقيقة)

## الخطوات السريعة

### 1️⃣ إعداد Supabase (5 دقائق)
```
1. اذهب إلى supabase.com
2. أنشئ مشروع جديد: construction-management
3. في SQL Editor، شغل محتوى database/schema.sql
4. احفظ Project URL و API Keys من Settings > API
```

### 2️⃣ رفع إلى GitHub (3 دقائق)
```
1. أنشئ مستودع جديد في GitHub
2. ارفع ملفات المشروع
```

### 3️⃣ النشر على Netlify (5 دقائق)
```
1. اذهب إلى netlify.com
2. اربط مستودع GitHub
3. أضف Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
4. انشر الموقع
```

### 4️⃣ إعداد المدير (2 دقيقة)
```
1. سجل في التطبيق
2. في Supabase > Users، غير role إلى 'admin'
3. سجل دخول مرة أخرى
```

## Environment Variables المطلوبة

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## إعدادات Netlify

```toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
```

## ✅ النتيجة النهائية

بعد 15 دقيقة ستحصل على:
- 🌐 نظام إدارة مقاولات كامل على الإنترنت
- 🔐 نظام مصادقة آمن
- 📊 جميع الوحدات العشرة تعمل
- 📱 يعمل على جميع الأجهزة
- 🇸🇦 دعم كامل للغة العربية

**رابط التطبيق**: `https://your-app-name.netlify.app`

---

للدليل المفصل، راجع: `NETLIFY_DEPLOYMENT_GUIDE.md`
