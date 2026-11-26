import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Building2,
  Cpu,
  BookOpen,
  Coffee,
  Trophy,
  Navigation,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore';

export const CampusSearch: React.FC = () => {
  const searchOpen = useCampusStore((s) => s.searchOpen);
  const setSearchOpen = useCampusStore((s) => s.setSearchOpen);
  const buildings = useCampusStore((s) => s.buildings);
  const facilities = useCampusStore((s) => s.facilities);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const selectFacility = useCampusStore((s) => s.selectFacility);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  // Aggregate searchable items
  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Popular defaults
      return buildings.slice(0, 5).map((b) => ({
        type: 'building' as const,
        id: b.id,
        title: b.name,
        subtitle: `${b.floors} Floors • ${b.departments.join(', ')}`,
        category: b.category,
        verified: b.verified
      }));
    }

    const matches: Array<{
      type: 'building' | 'facility' | 'department';
      id: string;
      title: string;
      subtitle: string;
      category: string;
      verified: string;
      buildingId?: string;
    }> = [];

    // Search buildings
    buildings.forEach((b) => {
      const matchName = b.name.toLowerCase().includes(q) || b.shortName.toLowerCase().includes(q);
      const matchDept = b.departments.some((d) => d.toLowerCase().includes(q));
      const matchFac = b.facilities.some((f) => f.toLowerCase().includes(q));

      if (matchName || matchDept || matchFac) {
        matches.push({
          type: 'building',
          id: b.id,
          title: b.name,
          subtitle: `${b.floors} Floors • ${b.category.toUpperCase()}`,
          category: b.category,
          verified: b.verified
        });
      }

      // Add matching departments
      b.departments.forEach((dept) => {
        if (dept.toLowerCase().includes(q)) {
          matches.push({
            type: 'department',
            id: `dept-${b.id}-${dept}`,
            title: dept,
            subtitle: `Department located in ${b.name}`,
            category: 'academic',
            verified: 'VERIFIED',
            buildingId: b.id
          });
        }
      });
    });

    // Search facilities
    facilities.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
        matches.push({
          type: 'facility',
          id: f.id,
          title: f.name,
          subtitle: f.description,
          category: f.category,
          verified: f.verified,
          buildingId: f.buildingId
        });
      }
    });

    return matches.slice(0, 10);
  }, [query, buildings, facilities]);

  const handleSelect = (item: (typeof results)[0]) => {
    if (item.type === 'building') {
      selectBuilding(item.id);
    } else if (item.type === 'department') {
      if (item.buildingId) selectBuilding(item.buildingId);
    } else if (item.type === 'facility') {
      selectFacility(item.id);
    }
    setSearchOpen(false);
  };

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl glass-panel-glow rounded-2xl overflow-hidden shadow-2xl border border-sky-400/40 text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
              } else if (e.key === 'Enter' && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
              }
            }}
            placeholder="Search CSE, Library, Principal Office, Labs, Canteen, Hostels..."
            className="w-full bg-transparent text-sm md:text-base outline-none text-white placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
          {results.length > 0 ? (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-sky-600/30 border border-sky-400/40 text-white' : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-white/5 text-sky-400">
                      {item.category === 'academic' ? (
                        <Cpu className="w-4 h-4" />
                      ) : item.category === 'library' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : item.category === 'canteen' ? (
                        <Coffee className="w-4 h-4" />
                      ) : item.category === 'sports' ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.verified === 'VERIFIED' && (
                          <span title="Verified Campus Asset">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                      {item.type}
                    </span>
                    <Navigation className="w-4 h-4 text-slate-400 hover:text-sky-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium">No campus locations matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching "CSE", "Library", "Audit", or "Hostel"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
