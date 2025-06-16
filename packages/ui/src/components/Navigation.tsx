// Navigation component for Scout Analytics
import { useState } from 'react';
import { Button } from './Button';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps {
  items: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  collapsible?: boolean;
}

export function Navigation({
  items,
  onItemClick,
  className = '',
  variant = 'horizontal',
  collapsible = false
}: NavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    onItemClick?.(item);
  };

  const baseClasses = {
    horizontal: 'flex flex-row space-x-4',
    vertical: 'flex flex-col space-y-2',
    sidebar: 'flex flex-col w-64 bg-white border-r border-gray-200 h-full'
  };

  const itemClasses = {
    horizontal: 'px-4 py-2 rounded-md',
    vertical: 'px-4 py-2 rounded-md w-full text-left',
    sidebar: 'px-6 py-3 w-full text-left hover:bg-gray-50'
  };

  const activeClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';

  return (
    <nav className={`${baseClasses[variant]} ${className}`}>
      {variant === 'sidebar' && collapsible && (
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-start"
          >
            {collapsed ? '→' : '←'} {!collapsed && 'Collapse'}
          </Button>
        </div>
      )}

      <div className={collapsed ? 'hidden' : 'block'}>
        {items.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleItemClick(item)}
              className={`
                ${itemClasses[variant]}
                ${activeItem === item.id || item.active ? activeClasses : inactiveClasses}
                transition-colors duration-200
                flex items-center gap-3
              `}
            >
              {item.icon && (
                <span className="text-sm">{item.icon}</span>
              )}
              <span className={collapsed ? 'hidden' : 'block'}>
                {item.label}
              </span>
            </button>

            {item.children && (activeItem === item.id || item.active) && (
              <div className={`ml-4 mt-2 space-y-1 ${collapsed ? 'hidden' : 'block'}`}>
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleItemClick(child)}
                    className={`
                      ${itemClasses[variant]}
                      ${activeItem === child.id ? activeClasses : inactiveClasses}
                      text-sm ml-4
                    `}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}