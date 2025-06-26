'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download, Printer, FileText, BarChart3, TrendingUp, DollarSign } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generatePDF, printElement } from '@/lib/pdf-utils'

interface ReportData {
  projects: any[]
  sales: any[]
  contractors: any[]
  suppliers: any[]
  purchases: any[]
  invoices: any[]
  extracts: any[]
}

interface FinancialSummary {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  pendingPayments: number
  completedSales: number
  activeProjects: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    projects: [],
    sales: [],
    contractors: [],
    suppliers: [],
    purchases: [],
    invoices: [],
    extracts: []
  })
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
    completedSales: 0,
    activeProjects: 0
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [activeReport, setActiveReport] = useState('financial')

  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Fetch all data in parallel
      const [
        projectsRes,
        salesRes,
        contractorsRes,
        suppliersRes,
        purchasesRes,
        invoicesRes,
        extractsRes
      ] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('sales').select(`
          *,
          apartment:apartments(
            *,
            project:projects(name)
          )
        `).gte('sale_date', dateRange.startDate).lte('sale_date', dateRange.endDate),
        supabase.from('contractors').select('*'),
        supabase.from('suppliers').select('*'),
        supabase.from('purchases').select(`
          *,
          supplier:suppliers(name),
          project:projects(name)
        `).gte('purchase_date', dateRange.startDate).lte('purchase_date', dateRange.endDate),
        supabase.from('invoices').select(`
          *,
          supplier:suppliers(name)
        `).gte('invoice_date', dateRange.startDate).lte('invoice_date', dateRange.endDate),
        supabase.from('extracts').select(`
          *,
          contractor:contractors(name),
          project:projects(name)
        `).gte('extract_date', dateRange.startDate).lte('extract_date', dateRange.endDate)
      ])

      const data = {
        projects: projectsRes.data || [],
        sales: salesRes.data || [],
        contractors: contractorsRes.data || [],
        suppliers: suppliersRes.data || [],
        purchases: purchasesRes.data || [],
        invoices: invoicesRes.data || [],
        extracts: extractsRes.data || []
      }

      setReportData(data)

      // Calculate financial summary
      const totalRevenue = data.sales
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + (s.sale_price || 0), 0)

      const totalExpenses = 
        data.purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0) +
        data.invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0) +
        data.extracts.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0)

      const pendingPayments = 
        data.invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount || 0), 0) +
        data.extracts.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.amount || 0), 0)

      setFinancialSummary({
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingPayments,
        completedSales: data.sales.filter(s => s.status === 'completed').length,
        activeProjects: data.projects.filter(p => p.status === 'in_progress').length
      })

    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      await generatePDF('report-content', `تقرير-${activeReport}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('حدث خطأ أثناء تصدير التقرير')
    }
  }

  const handlePrint = () => {
    try {
      printElement('report-content')
    } catch (error) {
      console.error('Error printing:', error)
      alert('حدث خطأ أثناء طباعة التقرير')
    }
  }

  const reportTypes = [
    { id: 'financial', name: 'التقرير المالي', icon: DollarSign },
    { id: 'sales', name: 'تقرير المبيعات', icon: TrendingUp },
    { id: 'projects', name: 'تقرير المشاريع', icon: BarChart3 },
    { id: 'expenses', name: 'تقرير المصروفات', icon: FileText }
  ]

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">التقارير المالية والإدارية</h1>
            <p className="text-gray-600 mt-2">تقارير شاملة عن أداء الشركة</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button onClick={handleExportPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير PDF
            </Button>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportTypes.map((type) => (
            <Button
              key={type.id}
              variant={activeReport === type.id ? 'default' : 'outline'}
              onClick={() => setActiveReport(type.id)}
              className="flex items-center gap-2 h-auto p-4"
            >
              <type.icon className="h-5 w-5" />
              <span>{type.name}</span>
            </Button>
          ))}
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="startDate">من تاريخ</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">إلى تاريخ</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button onClick={fetchReportData} disabled={loading}>
                {loading ? 'جاري التحديث...' : 'تحديث التقرير'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <div id="report-content" className="space-y-6">
          {/* Report Header */}
          <div className="header text-center border-b pb-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">
              نظام إدارة المقاولات والتطوير العقاري
            </h1>
            <h2 className="text-xl font-semibold mb-2">
              {reportTypes.find(t => t.id === activeReport)?.name}
            </h2>
            <p className="text-gray-600">
              من {formatDate(dateRange.startDate)} إلى {formatDate(dateRange.endDate)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تاريخ الإنشاء: {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Financial Summary */}
          {activeReport === 'financial' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{formatCurrency(financialSummary.totalRevenue)}</div>
                  <div className="stat-label">إجمالي الإيرادات</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatCurrency(financialSummary.totalExpenses)}</div>
                  <div className="stat-label">إجمالي المصروفات</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatCurrency(financialSummary.netProfit)}</div>
                  <div className="stat-label">صافي الربح</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatCurrency(financialSummary.pendingPayments)}</div>
                  <div className="stat-label">المدفوعات المعلقة</div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الإيرادات والمصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>البيان</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>النسبة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">إيرادات المبيعات</TableCell>
                        <TableCell>{formatCurrency(financialSummary.totalRevenue)}</TableCell>
                        <TableCell>100%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">مصروفات المشتريات</TableCell>
                        <TableCell>
                          {formatCurrency(
                            reportData.purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0)
                          )}
                        </TableCell>
                        <TableCell>
                          {financialSummary.totalRevenue > 0 
                            ? ((reportData.purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0) / financialSummary.totalRevenue) * 100).toFixed(1)
                            : 0}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">مستخلصات المقاولين</TableCell>
                        <TableCell>
                          {formatCurrency(
                            reportData.extracts.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0)
                          )}
                        </TableCell>
                        <TableCell>
                          {financialSummary.totalRevenue > 0 
                            ? ((reportData.extracts.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0) / financialSummary.totalRevenue) * 100).toFixed(1)
                            : 0}%
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-bold bg-gray-50">
                        <TableCell>صافي الربح</TableCell>
                        <TableCell>{formatCurrency(financialSummary.netProfit)}</TableCell>
                        <TableCell>
                          {financialSummary.totalRevenue > 0 
                            ? ((financialSummary.netProfit / financialSummary.totalRevenue) * 100).toFixed(1)
                            : 0}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Sales Report */}
          {activeReport === 'sales' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{reportData.sales.filter(s => s.status === 'completed').length}</div>
                  <div className="stat-label">المبيعات المكتملة</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{reportData.sales.filter(s => s.status === 'pending').length}</div>
                  <div className="stat-label">المبيعات المعلقة</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatCurrency(financialSummary.totalRevenue)}</div>
                  <div className="stat-label">إجمالي قيمة المبيعات</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {reportData.sales.filter(s => s.status === 'completed').length > 0
                      ? formatCurrency(financialSummary.totalRevenue / reportData.sales.filter(s => s.status === 'completed').length)
                      : formatCurrency(0)}
                  </div>
                  <div className="stat-label">متوسط قيمة البيع</div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل المبيعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العميل</TableHead>
                        <TableHead>الشقة</TableHead>
                        <TableHead>المشروع</TableHead>
                        <TableHead>قيمة البيع</TableHead>
                        <TableHead>تاريخ البيع</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.customer_name}</TableCell>
                          <TableCell>شقة {sale.apartment?.apartment_number}</TableCell>
                          <TableCell>{sale.apartment?.project?.name}</TableCell>
                          <TableCell>{formatCurrency(sale.sale_price || 0)}</TableCell>
                          <TableCell>{formatDate(sale.sale_date)}</TableCell>
                          <TableCell>
                            {sale.status === 'completed' ? 'مكتمل' : 
                             sale.status === 'pending' ? 'معلق' : 'ملغي'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Projects Report */}
          {activeReport === 'projects' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{reportData.projects.length}</div>
                  <div className="stat-label">إجمالي المشاريع</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{reportData.projects.filter(p => p.status === 'in_progress').length}</div>
                  <div className="stat-label">المشاريع النشطة</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{reportData.projects.filter(p => p.status === 'completed').length}</div>
                  <div className="stat-label">المشاريع المكتملة</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {formatCurrency(
                      reportData.projects.reduce((sum, p) => sum + (p.budget || 0), 0)
                    )}
                  </div>
                  <div className="stat-label">إجمالي الميزانيات</div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل المشاريع</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المشروع</TableHead>
                        <TableHead>الموقع</TableHead>
                        <TableHead>الميزانية</TableHead>
                        <TableHead>تاريخ البداية</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.location || '-'}</TableCell>
                          <TableCell>{formatCurrency(project.budget || 0)}</TableCell>
                          <TableCell>{formatDate(project.start_date)}</TableCell>
                          <TableCell>
                            {project.status === 'planning' ? 'تخطيط' :
                             project.status === 'in_progress' ? 'قيد التنفيذ' :
                             project.status === 'completed' ? 'مكتمل' : 'متوقف'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Expenses Report */}
          {activeReport === 'expenses' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">
                    {formatCurrency(
                      reportData.purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0)
                    )}
                  </div>
                  <div className="stat-label">مصروفات المشتريات</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {formatCurrency(
                      reportData.extracts.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0)
                    )}
                  </div>
                  <div className="stat-label">مستخلصات المقاولين</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {formatCurrency(
                      reportData.invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0)
                    )}
                  </div>
                  <div className="stat-label">فواتير الموردين</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatCurrency(financialSummary.totalExpenses)}</div>
                  <div className="stat-label">إجمالي المصروفات</div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل المصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>النوع</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.purchases.map((purchase) => (
                        <TableRow key={`purchase-${purchase.id}`}>
                          <TableCell>مشتريات</TableCell>
                          <TableCell>{purchase.item_name}</TableCell>
                          <TableCell>{formatCurrency(purchase.total_amount || 0)}</TableCell>
                          <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                          <TableCell>
                            {purchase.status === 'ordered' ? 'مطلوب' :
                             purchase.status === 'received' ? 'مستلم' : 'ملغي'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {reportData.extracts.map((extract) => (
                        <TableRow key={`extract-${extract.id}`}>
                          <TableCell>مستخلص</TableCell>
                          <TableCell>{extract.description}</TableCell>
                          <TableCell>{formatCurrency(extract.amount || 0)}</TableCell>
                          <TableCell>{formatDate(extract.extract_date)}</TableCell>
                          <TableCell>
                            {extract.status === 'pending' ? 'معلق' :
                             extract.status === 'approved' ? 'معتمد' : 'مدفوع'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
