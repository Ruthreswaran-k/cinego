import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search movies, cinemas, genres...',
  className = '',
  defaultValue = '',
  onSearch,
}) => {
  const [val, setVal] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(val);
    } else {
      if (val.trim()) {
        navigate(`/search?q=${encodeURIComponent(val.trim())}`);
      } else {
        navigate('/search');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-zinc-400" />
      </div>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="block w-full pl-10 pr-4 py-2 border border-white/10 rounded-full leading-5 bg-zinc-900/80 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs sm:text-sm transition-all"
        placeholder={placeholder}
      />
    </form>
  );
};
