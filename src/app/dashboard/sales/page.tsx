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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { createSupabaseClient, Sale, Apartment, Project } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'

interface SaleWithDetails extends Sale {
  apartment?: Apartment & { project?: Project }
}

export default function SalesPage() {
  const [sales, setSales] = useState<SaleWithDetails[]>([])
  const [apartments, setApartments] = useState<(Apartment & { project?: Project })[]>([])
  const [filteredSales, setFilteredSales] = useState<SaleWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDialog, setShowDialog] = useState(false)
  const [editingSale, setEditingSale] = useState<SaleWithDetails | null>(null)
  const [formData, setFormData] = useState({
    apartment_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    sale_price: '',
    down_payment: '',
    installment_plan: '',
    sale_date: '',
    status: 'pending' as const
  })

  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchSales()
    fetchApartments()
  }, [])

  useEffect(() => {
    filterSales()
  }, [sales, searchTerm, statusFilter])

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          apartment:apartments(
            *,
            project:projects(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSales(data || [])
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApartments = async () => {
    try {
      const { data, error } = await supabase
        .from('apartments')
        .select(`
          *,
          project:projects(*)
        `)
        .eq('status', 'available')

      if (error) throw error
      setApartments(data || [])
    } catch (error) {
      console.error('Error fetching apartments:', error)
    }
  }

  const filterSales = () => {
    let filtered = sales

    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.apartment?.apartment_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter)
    }

    setFilteredSales(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const saleData = {
        ...formData,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        down_payment: formData.down_payment ? parseFloat(formData.down_payment) : null
      }

      if (editingSale) {
        const { error } = await supabase
          .from('sales')
          .update(saleData)
          .eq('id', editingSale.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('sales')
          .insert([saleData])

        if (error) throw error

        // Update apartment status to reserved/sold
        if (formData.apartment_id && formData.status === 'completed') {
          await supabase
            .from('apartments')
            .update({ status: 'sold' })
            .eq('id', formData.apartment_id)
        } else if (formData.apartment_id) {
          await supabase
            .from('apartments')
            .update({ status: 'reserved' })
            .eq('id', formData.apartment_id)
        }
      }

      await fetchSales()
      await fetchApartments()
      setShowDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error saving sale:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sale: SaleWithDetails) => {
    setEditingSale(sale)
    setFormData({
      apartment_id: sale.apartment_id,
      customer_name: sale.customer_name,
      customer_phone: sale.customer_phone || '',
      customer_email: sale.customer_email || '',
      sale_price: sale.sale_price?.toString() || '',
      down_payment: sale.down_payment?.toString() || '',
      installment_plan: sale.installment_plan || '',
      sale_date: sale.sale_date || '',
      status: sale.status
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المبيعة؟')) return

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchSales()
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      apartment_id: '',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      sale_price: '',
      down_payment: '',
      installment_plan: '',
      sale_date: '',
      status: 'pending'
    })
    setEditingSale(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'مكتمل', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة مبيعات الشقق</h1>
            <p className="text-gray-600 mt-2">إدارة مبيعات الشقق وتتبع العملاء</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowDialog(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            مبيعة جديدة
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sales.filter(s => s.status === 'completed').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المبيعات المعلقة</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sales.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      sales
                        .filter(s => s.status === 'completed')
                        .reduce((sum, s) => sum + (s.sale_price || 0), 0)
                    )}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط سعر البيع</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      sales.filter(s => s.status === 'completed').length > 0
                        ? sales
                            .filter(s => s.status === 'completed')
                            .reduce((sum, s) => sum + (s.sale_price || 0), 0) /
                          sales.filter(s => s.status === 'completed').length
                        : 0
                    )}
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في المبيعات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">معلق</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المبيعات ({filteredSales.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>الشقة</TableHead>
                    <TableHead>سعر البيع</TableHead>
                    <TableHead>المقدم</TableHead>
                    <TableHead>تاريخ البيع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sale.customer_name}</div>
                          <div className="text-sm text-gray-500">{sale.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            شقة {sale.apartment?.apartment_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sale.apartment?.project?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sale.sale_price ? formatCurrency(sale.sale_price) : '-'}
                      </TableCell>
                      <TableCell>
                        {sale.down_payment ? formatCurrency(sale.down_payment) : '-'}
                      </TableCell>
                      <TableCell>
                        {sale.sale_date ? formatDate(sale.sale_date) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(sale)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(sale.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Sale Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSale ? 'تعديل المبيعة' : 'مبيعة جديدة'}
              </DialogTitle>
              <DialogClose onClick={() => setShowDialog(false)} />
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="apartment_id">الشقة *</Label>
                <select
                  id="apartment_id"
                  value={formData.apartment_id}
                  onChange={(e) => setFormData({ ...formData, apartment_id: e.target.value })}
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">اختر الشقة</option>
                  {apartments.map((apartment) => (
                    <option key={apartment.id} value={apartment.id}>
                      شقة {apartment.apartment_number} - {apartment.project?.name} - {formatCurrency(apartment.price || 0)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">اسم العميل *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone">رقم الهاتف</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customer_email">البريد الإلكتروني</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sale_price">سعر البيع</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    className="mt-1"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="down_payment">المقدم</Label>
                  <Input
                    id="down_payment"
                    type="number"
                    value={formData.down_payment}
                    onChange={(e) => setFormData({ ...formData, down_payment: e.target.value })}
                    className="mt-1"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="installment_plan">خطة التقسيط</Label>
                <Input
                  id="installment_plan"
                  value={formData.installment_plan}
                  onChange={(e) => setFormData({ ...formData, installment_plan: e.target.value })}
                  className="mt-1"
                  placeholder="مثال: 24 شهر"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sale_date">تاريخ البيع</Label>
                  <Input
                    id="sale_date"
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="pending">معلق</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'جاري الحفظ...' : editingSale ? 'تحديث' : 'حفظ'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
