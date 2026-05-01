import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface AutocompleteProps {
  label: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  error?: boolean;
}

export default function Autocomplete({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  onSelect,
  suggestions,
  isLoading,
  error
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (item: string) => {
    onChange(item);
    onSelect?.(item);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative space-y-2" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">
        {label}
      </label>
      <div className="relative">
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className={`w-full p-4 bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-2xl font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all pr-12`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          ) : (
            <Search size={18} className="opacity-40" />
          )}
        </div>
      </div>

      {isOpen && (value.length > 0 || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-5 py-3 cursor-pointer flex items-center justify-between transition-colors ${index === highlightedIndex ? "bg-primary/5 text-primary" : "text-gray-700"}`}
                >
                  <span className="font-semibold text-sm">{item}</span>
                  {item === value && <Check size={14} className="text-primary" />}
                </li>
              ))}
            </ul>
          ) : !isLoading && value.length > 0 ? (
            <div className="px-5 py-4 text-sm text-gray-400 italic">
              Aucun résultat pour "{value}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
