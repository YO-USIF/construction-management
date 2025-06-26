import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database Types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'accountant' | 'employee' | 'supervisor'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  location: string
  start_date: string
  end_date: string
  budget: number
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  created_at: string
  updated_at: string
}

export interface Apartment {
  id: string
  project_id: string
  apartment_number: string
  floor: number
  area: number
  price: number
  status: 'available' | 'reserved' | 'sold'
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  apartment_id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  sale_price: number
  down_payment: number
  installment_plan: string
  sale_date: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Contractor {
  id: string
  name: string
  phone: string
  email: string
  specialty: string
  address: string
  created_at: string
  updated_at: string
}

export interface Extract {
  id: string
  contractor_id: string
  project_id: string
  amount: number
  description: string
  status: 'pending' | 'approved' | 'paid'
  extract_date: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  name: string
  phone: string
  email: string
  address: string
  category: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  supplier_id: string
  invoice_number: string
  amount: number
  description: string
  invoice_date: string
  due_date: string
  status: 'pending' | 'paid' | 'overdue'
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  supplier_id: string
  project_id: string
  item_name: string
  quantity: number
  unit_price: number
  total_amount: number
  purchase_date: string
  status: 'ordered' | 'received' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface MaintenanceTask {
  id: string
  project_id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  assigned_to: string
  due_date: string
  created_at: string
  updated_at: string
}

export interface DailyTask {
  id: string
  user_id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string
  created_at: string
  updated_at: string
}
