import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertCardProps {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export function AlertCard({ title, description, severity }: AlertCardProps) {
  const severityConfig = {
    critical: {
      bgColor: 'bg-red-50 dark:bg-red-900/10',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-900 dark:text-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-900 dark:text-blue-200',
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.iconColor} mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${config.textColor} mb-1`}>{title}</h4>
          <p className={`text-sm ${config.textColor} opacity-90`}>{description}</p>
        </div>
      </div>
    </div>
  );
}
