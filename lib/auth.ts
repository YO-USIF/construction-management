import { createSupabaseClient } from './supabase'
import { User } from './supabase'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return null
    }

    return userData as User
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signUp(email: string, password: string, fullName: string, role: string = 'employee') {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      }
    }
  })

  if (data.user && !error) {
    // Insert user data into public.users table
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role as any,
        }
      ])

    if (insertError) {
      console.error('Error inserting user data:', insertError)
    }
  }

  return { data, error }
}

export async function signOut() {
  const supabase = createSupabaseClient()
  
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { data, error }
}

export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

export function isAdmin(userRole: string): boolean {
  return userRole === 'admin'
}

export function isManager(userRole: string): boolean {
  return userRole === 'manager' || userRole === 'admin'
}

export function canManageUsers(userRole: string): boolean {
  return userRole === 'admin'
}

export function canManageFinances(userRole: string): boolean {
  return ['admin', 'manager', 'accountant'].includes(userRole)
}

export function canViewReports(userRole: string): boolean {
  return ['admin', 'manager', 'accountant', 'supervisor'].includes(userRole)
}
