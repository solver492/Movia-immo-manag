import { Building2, TrendingUp, Key, Clock } from 'lucide-react';
import { Property } from '../types/property';

interface StatsCardsProps {
  properties: Property[];
}

export function StatsCards({ properties }: StatsCardsProps) {
  const total = properties.length;
  const aVendre = properties.filter((p) => p.transaction === 'À vendre').length;
  const aLouer = properties.filter((p) => p.transaction === 'À louer').length;
  const actifs = properties.filter((p) => p.statut_mandat === 'Actif').length;

  const stats = [
    {
      label: 'Total des biens',
      value: total,
      icon: Building2,
      color: 'bg-blue-50 text-[#0f2552]',
      iconBg: 'bg-[#0f2552]',
    },
    {
      label: 'À vendre',
      value: aVendre,
      icon: TrendingUp,
      color: 'bg-sky-50 text-sky-800',
      iconBg: 'bg-sky-600',
    },
    {
      label: 'À louer',
      value: aLouer,
      icon: Key,
      color: 'bg-emerald-50 text-emerald-800',
      iconBg: 'bg-emerald-600',
    },
    {
      label: 'Mandats actifs',
      value: actifs,
      icon: Clock,
      color: 'bg-amber-50 text-amber-800',
      iconBg: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-xl p-4 ${stat.color} border border-white/60 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium opacity-70 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} rounded-lg p-2 opacity-90`}>
                <Icon size={18} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
