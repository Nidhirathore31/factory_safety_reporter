import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const SearchBar = ({ searchQuery, onSearchChange, onSearch, searchHistory, onClearHistory }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState([
    'safety equipment malfunction',
    'slip hazard wet floor',
    'maintenance required conveyor',
    'PPE compliance check',
    'emergency procedure drill',
    'chemical spill cleanup',
    'equipment lockout procedure',
    'fall protection inspection'
  ]);

  const searchRef = useRef(null);

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && 
    searchQuery?.length > 0
  );

  const filteredHistory = searchHistory?.filter(item =>
    item?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && 
    item !== searchQuery
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    setShowSuggestions(value?.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter') {
      onSearch(searchQuery);
      setShowSuggestions(false);
    } else if (e?.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search forms by content, worker name, hazards, or keywords..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
              className="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent industrial-transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground industrial-transition"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
        
        <Button
          variant="default"
          onClick={() => onSearch(searchQuery)}
          iconName="Search"
          iconPosition="left"
          className="px-6"
        >
          Search
        </Button>

        <Button
          variant="outline"
          iconName="Filter"
          iconPosition="left"
          className="px-4"
        >
          Advanced
        </Button>
      </div>
      {/* Search Suggestions and History */}
      {showSuggestions && (filteredSuggestions?.length > 0 || filteredHistory?.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg industrial-shadow z-200 max-h-80 overflow-y-auto">
          {/* Search History */}
          {filteredHistory?.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recent Searches
                </h4>
                <button
                  onClick={onClearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground industrial-transition"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {filteredHistory?.slice(0, 3)?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full flex items-center space-x-2 p-2 text-left text-sm text-popover-foreground hover:bg-muted rounded-md industrial-transition"
                  >
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auto-complete Suggestions */}
          {filteredSuggestions?.length > 0 && (
            <div className="p-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Suggestions
              </h4>
              <div className="space-y-1">
                {filteredSuggestions?.slice(0, 5)?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-2 p-2 text-left text-sm text-popover-foreground hover:bg-muted rounded-md industrial-transition"
                  >
                    <Icon name="Search" size={14} className="text-muted-foreground" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;