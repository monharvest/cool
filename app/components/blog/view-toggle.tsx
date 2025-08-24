
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Image as ImageIcon } from 'lucide-react';
import type { ViewMode } from '@/lib/types';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const viewOptions = [
    { value: 'grid' as ViewMode, icon: Grid3X3, label: 'Grid View' },
    { value: 'list' as ViewMode, icon: List, label: 'List View' },
    { value: 'covers' as ViewMode, icon: ImageIcon, label: 'Cover View' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {viewOptions.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={currentView === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(value)}
          className={`flex items-center space-x-1 ${
            currentView === value
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}
