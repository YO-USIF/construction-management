# 🚀 دليل النشر على Netlify - خطوة بخطوة

## المتطلبات المسبقة ✅

- [ ] حساب GitHub (مجاني)
- [ ] حساب Supabase (مجاني) 
- [ ] حساب Netlify (مجاني)

---

## الخطوة 1: إعداد Supabase (5 دقائق) 🗄️

### 1.1 إنشاء مشروع Supabase جديد
1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط "Start your project"
3. سجل دخول أو أنشئ حساب جديد
4. اضغط "New Project"
5. اختر Organization أو أنشئ واحد جديد
6. املأ البيانات:
   - **Project name**: `construction-management`
   - **Database Password**: اختر كلمة مرور قوية (احفظها!)
   - **Region**: اختر أقرب منطقة لك
7. اضغط "Create new project"
8. انتظر 2-3 دقائق حتى يكتمل الإعداد

### 1.2 تشغيل Database Schema
1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. اضغط "New query"
3. انسخ والصق محتوى ملف `database/schema.sql` بالكامل
4. اضغط "Run" لتشغيل الـ SQL
5. تأكد من ظهور رسالة "Success" خضراء

### 1.3 الحصول على API Keys
1. اذهب إلى **Settings** > **API**
2. احفظ هذه القيم (ستحتاجها لاحقاً):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.4 إعداد Authentication
1. اذهب إلى **Authentication** > **Settings**
2. في **Site URL** أضف: `https://your-app-name.netlify.app`
3. في **Redirect URLs** أضف:
   - `https://your-app-name.netlify.app/auth/callback`
   - `http://localhost:3000/auth/callback`
4. اضغط "Save"

---

## الخطوة 2: رفع الكود إلى GitHub (3 دقائق) 📁

### 2.1 إنشاء مستودع GitHub
1. اذهب إلى [github.com](https://github.com)
2. اضغط "New repository"
3. املأ البيانات:
   - **Repository name**: `construction-management-system`
   - **Description**: `نظام إدارة المقاولات والتطوير العقاري`
   - اختر **Public** أو **Private**
   - لا تضع علامة على "Add a README file"
4. اضغط "Create repository"

### 2.2 رفع الكود
```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Construction Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/construction-management-system.git
git push -u origin main
```

**أو استخدم GitHub Desktop:**
1. حمل GitHub Desktop
2. اضغط "Add an Existing Repository from your Hard Drive"
3. اختر مجلد المشروع
4. اضغط "Publish repository"

---

## الخطوة 3: النشر على Netlify (5 دقائق) 🌐

### 3.1 ربط المستودع
1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول أو أنشئ حساب جديد
3. اضغط "Add new site" > "Import an existing project"
4. اختر "Deploy with GitHub"
5. امنح Netlify الصلاحيات المطلوبة
6. اختر المستودع `construction-management-system`

### 3.2 إعداد Build Settings
تأكد من الإعدادات التالية:
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: `18`

### 3.3 إضافة Environment Variables
1. اذهب إلى **Site settings** > **Environment variables**
2. اضغط "Add variable" وأضف:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.4 النشر
1. اضغط "Deploy site"
2. انتظر 3-5 دقائق حتى يكتمل البناء
3. ستحصل على رابط مثل: `https://amazing-name-123456.netlify.app`

---

## الخطوة 4: إعداد المستخدم الأول (2 دقيقة) 👤

### 4.1 إنشاء حساب Admin
1. اذهب إلى رابط التطبيق
2. اضغط "إنشاء حساب جديد"
3. املأ البيانات:
   - **الاسم الكامل**: اسمك
   - **البريد الإلكتروني**: بريدك
   - **كلمة المرور**: كلمة مرور قوية
   - **الدور الوظيفي**: اختر "مدير النظام"
4. اضغط "إنشاء حساب"

### 4.2 تفعيل صلاحيات Admin
1. ارجع إلى Supabase Dashboard
2. اذهب إلى **Authentication** > **Users**
3. ابحث عن المستخدم الذي أنشأته
4. اضغط على المستخدم
5. في **Raw User Meta Data** غير `role` إلى `admin`
6. اضغط "Save"

### 4.3 تسجيل الدخول
1. ارجع إلى التطبيق
2. اضغط "تسجيل الدخول"
3. أدخل بياناتك
4. ستدخل إلى لوحة التحكم الرئيسية

---

## الخطوة 5: تخصيص Domain (اختياري) 🌍

### 5.1 تغيير اسم الموقع
1. في Netlify Dashboard، اذهب إلى **Site settings** > **Site details**
2. اضغط "Change site name"
3. أدخل اسم مناسب مثل: `construction-management-pro`
4. الرابط الجديد: `https://construction-management-pro.netlify.app`

### 5.2 إضافة Domain مخصص (اختياري)
1. اذهب إلى **Domain settings**
2. اضغط "Add custom domain"
3. أدخل domain الخاص بك
4. اتبع التعليمات لإعداد DNS

---

## ✅ التحقق من نجاح النشر

### اختبر هذه الوظائف:
- [ ] تحميل الصفحة الرئيسية
- [ ] تسجيل الدخول والخروج
- [ ] إنشاء مشروع جديد
- [ ] عرض التقارير
- [ ] تصدير PDF

### في حالة وجود مشاكل:
1. تحقق من **Deploy logs** في Netlify
2. تأكد من صحة Environment Variables
3. تحقق من إعدادات Supabase

---

## 🎉 تهانينا!

نظام إدارة المقاولات والتطوير العقاري أصبح متاحاً على الإنترنت!

**رابط التطبيق**: `https://your-app-name.netlify.app`

### الخطوات التالية:
1. شارك الرابط مع فريق العمل
2. أنشئ حسابات للمستخدمين الآخرين
3. ابدأ في إدخال بيانات المشاريع
4. استكشف جميع الوحدات والميزات

---

## 📞 الدعم

إذا واجهت أي مشاكل:
- راجع **Deploy logs** في Netlify
- تحقق من **Database logs** في Supabase
- تأكد من صحة Environment Variables

**النظام جاهز للاستخدام! 🚀**
