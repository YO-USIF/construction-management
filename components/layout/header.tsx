'use client'

import { useState } from 'react'
import { Menu, X, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
  user?: {
    full_name: string
    email: string
    role: string
  }
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'مدير النظام',
      manager: 'مدير',
      accountant: 'محاسب',
      employee: 'موظف',
      supervisor: 'مشرف'
    }
    return roleNames[role as keyof typeof roleNames] || role
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Page title - will be updated by individual pages */}
        <div className="flex-1 lg:mr-4">
          <h1 className="text-2xl font-semibold text-gray-900">لوحة التحكم</h1>
        </div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user?.full_name || 'المستخدم'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.role ? getRoleDisplayName(user.role) : ''}
                </div>
              </div>
            </Button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Navigate to profile page
                  }}
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  الملف الشخصي
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Navigate to settings page
                  }}
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  الإعدادات
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
