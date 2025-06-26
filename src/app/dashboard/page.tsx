'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import StatsCard from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline'
import { createSupabaseClient } from '@/lib/supabase'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalSales: number
  monthlySales: number
  totalContractors: number
  pendingTasks: number
  totalRevenue: number
  monthlyRevenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalSales: 0,
    monthlySales: 0,
    totalContractors: 0,
    pendingTasks: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const supabase = createSupabaseClient()
        
        // Fetch projects stats
        const { data: projects } = await supabase
          .from('projects')
          .select('status')
        
        const totalProjects = projects?.length || 0
        const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0

        // Fetch sales stats
        const { data: sales } = await supabase
          .from('sales')
          .select('sale_price, sale_date, status')
        
        const totalSales = sales?.filter(s => s.status === 'completed').length || 0
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        
        const monthlySales = sales?.filter(s => {
          const saleDate = new Date(s.sale_date)
          return saleDate.getMonth() === currentMonth && 
                 saleDate.getFullYear() === currentYear &&
                 s.status === 'completed'
        }).length || 0

        const totalRevenue = sales?.reduce((sum, sale) => {
          return sale.status === 'completed' ? sum + (sale.sale_price || 0) : sum
        }, 0) || 0

        const monthlyRevenue = sales?.reduce((sum, sale) => {
          const saleDate = new Date(s.sale_date)
          if (saleDate.getMonth() === currentMonth && 
              saleDate.getFullYear() === currentYear &&
              sale.status === 'completed') {
            return sum + (sale.sale_price || 0)
          }
          return sum
        }, 0) || 0

        // Fetch contractors stats
        const { data: contractors } = await supabase
          .from('contractors')
          .select('id')
        
        const totalContractors = contractors?.length || 0

        // Fetch pending tasks
        const { data: tasks } = await supabase
          .from('daily_tasks')
          .select('status')
          .eq('status', 'pending')
        
        const pendingTasks = tasks?.length || 0

        setStats({
          totalProjects,
          activeProjects,
          totalSales,
          monthlySales,
          totalContractors,
          pendingTasks,
          totalRevenue,
          monthlyRevenue,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">نظرة عامة على أداء الشركة والمشاريع</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي المشاريع"
            value={stats.totalProjects}
            icon={BuildingOfficeIcon}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="المشاريع النشطة"
            value={stats.activeProjects}
            icon={BuildingOfficeIcon}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="إجمالي المبيعات"
            value={stats.totalSales}
            icon={CurrencyDollarIcon}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="المهام المعلقة"
            value={stats.pendingTasks}
            icon={ClipboardDocumentListIcon}
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="إجمالي الإيرادات"
            value={stats.totalRevenue}
            icon={TrendingUpIcon}
            isCurrency={true}
            trend={{ value: 20, isPositive: true }}
          />
          <StatsCard
            title="إيرادات هذا الشهر"
            value={stats.monthlyRevenue}
            icon={TrendingUpIcon}
            isCurrency={true}
            trend={{ value: 10, isPositive: true }}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>المشاريع الحديثة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">مشروع الأندلس السكني</h4>
                    <p className="text-sm text-gray-600">قيد التنفيذ</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    نشط
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">برج النيل التجاري</h4>
                    <p className="text-sm text-gray-600">في مرحلة التخطيط</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    تخطيط
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">مجمع الزهراء السكني</h4>
                    <p className="text-sm text-gray-600">مكتمل</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    مكتمل
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المبيعات الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">شقة 201 - مشروع الأندلس</h4>
                    <p className="text-sm text-gray-600">أحمد محمد علي</p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">2,500,000 ج.م</p>
                    <p className="text-sm text-gray-600">اليوم</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">شقة 105 - برج النيل</h4>
                    <p className="text-sm text-gray-600">فاطمة أحمد</p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">1,800,000 ج.م</p>
                    <p className="text-sm text-gray-600">أمس</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">شقة 302 - مجمع الزهراء</h4>
                    <p className="text-sm text-gray-600">محمد حسن</p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">2,200,000 ج.م</p>
                    <p className="text-sm text-gray-600">منذ يومين</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
