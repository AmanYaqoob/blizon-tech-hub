
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  autoFocus?: boolean;
  debounceMs?: number;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for clients, projects, team members...", 
  className = "relative w-full",
  inputClassName = "w-full pl-10 py-2",
  iconClassName = "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
  autoFocus = false,
  debounceMs = 300
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Debounce search to improve performance
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);
    
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch, debounceMs]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <Search className={iconClassName} />
        <Input
          type="search"
          placeholder={placeholder}
          className={inputClassName}
          value={searchTerm}
          onChange={handleChange}
          autoFocus={autoFocus}
        />
      </div>
    </form>
  );
};

export default SearchBar;
