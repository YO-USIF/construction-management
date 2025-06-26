# 🔧 حل مشكلة قاعدة البيانات في Supabase

## المشكلة
```
ERROR: 42501: permission denied to set parameter "app.jwt_secret"
```

## السبب
هذا الخطأ يحدث لأن المستخدمين العاديين في Supabase لا يملكون صلاحية تعديل إعدادات قاعدة البيانات على مستوى النظام.

## ✅ الحل

### استخدم الملف المُصحح
بدلاً من `database/schema.sql`، استخدم `database/schema_fixed.sql`

### خطوات الإصلاح:

#### 1. احذف الجداول الموجودة (إذا كانت موجودة)
```sql
-- في Supabase SQL Editor، شغل هذا أولاً لحذف الجداول القديمة
DROP TABLE IF EXISTS public.daily_tasks CASCADE;
DROP TABLE IF EXISTS public.maintenance_tasks CASCADE;
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.extracts CASCADE;
DROP TABLE IF EXISTS public.contractors CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.apartments CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- حذف الأنواع المخصصة
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS apartment_status CASCADE;
DROP TYPE IF EXISTS sale_status CASCADE;
DROP TYPE IF EXISTS extract_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS purchase_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
```

#### 2. شغل الملف المُصحح
1. اذهب إلى **SQL Editor** في Supabase
2. انسخ والصق محتوى `database/schema_fixed.sql` بالكامل
3. اضغط **Run**
4. يجب أن ترى رسالة: "تم إنشاء قاعدة البيانات بنجاح!"

## ✅ التحقق من نجاح الإعداد

### 1. تحقق من الجداول
في **Table Editor**، يجب أن ترى:
- ✅ users
- ✅ projects  
- ✅ apartments
- ✅ sales
- ✅ contractors
- ✅ extracts
- ✅ suppliers
- ✅ invoices
- ✅ purchases
- ✅ maintenance_tasks
- ✅ daily_tasks

### 2. تحقق من البيانات التجريبية
في جدول `projects` يجب أن ترى 3 مشاريع تجريبية:
- مشروع الأندلس السكني
- برج النيل التجاري  
- مجمع الزهراء السكني

### 3. تحقق من Row Level Security
في **Authentication** > **Policies**، يجب أن ترى policies لكل جدول.

## 🔄 إذا استمرت المشاكل

### الحل البديل: إنشاء الجداول يدوياً

#### 1. إنشاء جدول المستخدمين
```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for authenticated users" ON public.users FOR SELECT USING (auth.role() = 'authenticated');
```

#### 2. إنشاء جدول المشاريع
```sql
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    status TEXT DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
```

#### 3. كرر نفس الطريقة للجداول الأخرى

## 📞 الدعم

إذا استمرت المشاكل:
1. تأكد من أنك تستخدم **SQL Editor** وليس Terminal
2. تأكد من أنك مسجل دخول في Supabase
3. جرب تشغيل الأوامر جزء بجزء بدلاً من الملف كاملاً
4. تحقق من **Logs** في Supabase للمزيد من التفاصيل

## ✅ النتيجة المتوقعة

بعد تطبيق الحل:
- ✅ جميع الجداول منشأة بنجاح
- ✅ Row Level Security مفعل
- ✅ البيانات التجريبية موجودة
- ✅ النظام جاهز للاستخدام

**الآن يمكنك متابعة خطوات النشر على Netlify!** 🚀
