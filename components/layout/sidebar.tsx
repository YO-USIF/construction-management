'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TruckIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'الصفحة الرئيسية', href: '/dashboard', icon: HomeIcon },
  { name: 'المشاريع', href: '/dashboard/projects', icon: BuildingOfficeIcon },
  { name: 'مبيعات الشقق', href: '/dashboard/sales', icon: CurrencyDollarIcon },
  { name: 'المقاولين والمستخلصات', href: '/dashboard/contractors', icon: UserGroupIcon },
  { name: 'الموردين والفواتير', href: '/dashboard/suppliers', icon: TruckIcon },
  { name: 'المشتريات', href: '/dashboard/purchases', icon: ShoppingCartIcon },
  { name: 'الصيانة والتشغيل', href: '/dashboard/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'المهام اليومية', href: '/dashboard/tasks', icon: ClipboardDocumentListIcon },
  { name: 'التقارير المالية', href: '/dashboard/reports', icon: DocumentChartBarIcon },
  { name: 'إدارة المستخدمين', href: '/dashboard/users', icon: UsersIcon },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
            <h1 className="text-xl font-bold text-white">نظام إدارة المقاولات</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  onClick={() => onClose()}
                >
                  <item.icon className="w-5 h-5 ml-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
