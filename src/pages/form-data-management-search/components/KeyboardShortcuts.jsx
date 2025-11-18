import React, { useEffect } from 'react';

const KeyboardShortcuts = ({ 
  onSearch, 
  onSelectAll, 
  onClearSelection, 
  onToggleFilters,
  onExport,
  selectedRows,
  data 
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input field
      if (event?.target?.tagName === 'INPUT' || event?.target?.tagName === 'TEXTAREA') {
        return;
      }

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      switch (key) {
        case 'f':
          if (isModifierPressed) {
            event?.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[placeholder*="Search forms"]');
            if (searchInput) {
              searchInput?.focus();
            }
          }
          break;

        case 'a':
          if (isModifierPressed) {
            event?.preventDefault();
            onSelectAll();
          }
          break;

        case 'Escape':
          onClearSelection();
          break;

        case 'Enter':
          if (isModifierPressed) {
            event?.preventDefault();
            onSearch();
          }
          break;

        case 'e':
          if (isModifierPressed && selectedRows?.length > 0) {
            event?.preventDefault();
            onExport('csv');
          }
          break;

        case 'F':
          if (shiftKey) {
            event?.preventDefault();
            onToggleFilters();
          }
          break;

        case 'ArrowUp': case'ArrowDown':
          // Grid navigation could be implemented here
          // For now, we'll let the browser handle default behavior
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onSelectAll, onClearSelection, onToggleFilters, onExport, selectedRows]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;