import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  isCurrency?: boolean
  className?: string
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  isCurrency = false,
  className
}: StatsCardProps) {
  const displayValue = isCurrency && typeof value === 'number' 
    ? formatCurrency(value) 
    : value.toString()

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {displayValue}
        </div>
        {trend && (
          <p className="text-xs text-gray-500 mt-1">
            <span
              className={`inline-flex items-center ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            {' '}من الشهر الماضي
          </p>
        )}
      </CardContent>
    </Card>
  )
}
