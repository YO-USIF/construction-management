export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{
          color: '#2563eb',
          marginBottom: '20px',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          🏗️ نظام إدارة المقاولات والتطوير العقاري
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '1.2rem',
          lineHeight: '1.6'
        }}>
          نظام إداري ومحاسبي شامل لشركات المقاولات والتطوير العقاري
        </p>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#1f2937', marginBottom: '15px' }}>الوحدات المتاحة:</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            textAlign: 'right'
          }}>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              📊 لوحة التحكم الرئيسية
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              🏗️ إدارة المشاريع
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              🏢 مبيعات الشقق
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              👷 المقاولين والمستخلصات
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              🚚 الموردين والفواتير
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              🛒 إدارة المشتريات
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              🔧 الصيانة والتشغيل
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              📋 المهام اليومية
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              📊 التقارير المالية
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
              👥 إدارة المستخدمين
            </div>
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #10b981'
        }}>
          <h3 style={{ color: '#059669', marginBottom: '10px' }}>✅ حالة النظام</h3>
          <p style={{ color: '#047857', margin: 0 }}>
            النظام مكتمل وجاهز للنشر على Netlify
          </p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            تم تطوير هذا النظام باستخدام Next.js و Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
