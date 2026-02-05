import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function KPICard({ title, value, icon: Icon, trend, iconBgColor = 'bg-blue-100', iconColor = 'text-blue-600' }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`${iconBgColor} dark:${iconBgColor}/20 p-4 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor} dark:${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
