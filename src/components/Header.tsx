import { Building2, Plus } from 'lucide-react';

interface HeaderProps {
  onAddProperty: () => void;
  totalCount: number;
}

export function Header({ onAddProperty, totalCount }: HeaderProps) {
  return (
    <header className="bg-[#0f2552] text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-[#2563eb] rounded-lg p-2">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Movia Immo</h1>
              <p className="text-[10px] text-blue-300 font-medium tracking-widest uppercase leading-none mt-0.5">
                Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-blue-200">
              <span className="bg-blue-500/30 text-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
              biens
            </span>
            <button
              onClick={onAddProperty}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nouveau bien</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
