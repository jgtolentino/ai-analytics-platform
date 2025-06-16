// Collapsible Section component for Scout Analytics
import { useState, ReactNode } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  icon,
  badge,
  disabled = false,
  onToggle
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (disabled) return;
    
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 
          transition-colors duration-200 flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${headerClassName}
        `}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-gray-500 text-sm">{icon}</span>
          )}
          <span className="font-medium text-gray-900">{title}</span>
          {badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span 
            className={`
              transform transition-transform duration-200 text-gray-500
              ${isOpen ? 'rotate-180' : 'rotate-0'}
            `}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Content */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className={`p-4 bg-white ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Group multiple collapsible sections with accordion behavior
export interface CollapsibleGroupProps {
  sections: Array<{
    id: string;
    title: string;
    content: ReactNode;
    icon?: string;
    badge?: string | number;
    disabled?: boolean;
  }>;
  allowMultiple?: boolean;
  defaultOpenSections?: string[];
  className?: string;
  onSectionToggle?: (sectionId: string, isOpen: boolean) => void;
}

export function CollapsibleGroup({
  sections,
  allowMultiple = false,
  defaultOpenSections = [],
  className = '',
  onSectionToggle
}: CollapsibleGroupProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(defaultOpenSections)
  );

  const handleSectionToggle = (sectionId: string) => {
    const newOpenSections = new Set(openSections);

    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      if (!allowMultiple) {
        newOpenSections.clear();
      }
      newOpenSections.add(sectionId);
    }

    setOpenSections(newOpenSections);
    onSectionToggle?.(sectionId, newOpenSections.has(sectionId));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {sections.map((section) => (
        <CollapsibleSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          badge={section.badge}
          disabled={section.disabled}
          defaultOpen={openSections.has(section.id)}
          onToggle={(isOpen) => {
            if (isOpen !== openSections.has(section.id)) {
              handleSectionToggle(section.id);
            }
          }}
        >
          {section.content}
        </CollapsibleSection>
      ))}
    </div>
  );
}