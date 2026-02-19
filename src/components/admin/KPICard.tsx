import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  suffix?: string;
  color?: 'ocean' | 'sage' | 'charcoal';
  description?: string;
}

export function KPICard({ title, value, icon: Icon, suffix = '', color = 'ocean', description }: KPICardProps) {
  const colorClasses = {
    ocean: 'bg-ocean-100 text-ocean-600',
    sage: 'bg-sage-100 text-sage-600',
    charcoal: 'bg-charcoal-100 text-charcoal-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-charcoal-600">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-charcoal-900">{value}</p>
        {suffix && <span className="text-sm text-charcoal-600">{suffix}</span>}
      </div>
      {description && (
        <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
