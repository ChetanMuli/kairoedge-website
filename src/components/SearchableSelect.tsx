import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

export interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: (string | SearchableOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  disabled = false,
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions: SearchableOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((o) => o.value === value);

  // Filter options based on search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`searchable-select-wrap ${className} ${isOpen ? "is-open" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        zIndex: isOpen ? 99999 : "auto"
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className="searchable-select-trigger"
        style={{ width: "100%", minWidth: 0, maxWidth: "100%" }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: "1 1 auto",
            display: "block",
            color: selectedOption ? "var(--ink)" : "var(--mut)",
            fontWeight: selectedOption ? 500 : 400
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className="searchable-select-chevron"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: "var(--sun)",
            flexShrink: 0
          }}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="searchable-select-panel" role="listbox">
          {/* Search Bar at top */}
          <div className="searchable-select-search-box">
            <Search size={15} color="var(--sun)" style={{ flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="searchable-select-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="searchable-select-clear-btn"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="searchable-select-options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`searchable-select-item ${
                      isSelected ? "is-selected" : ""
                    }`}
                    style={{ minWidth: 0, maxWidth: "100%" }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: "1 1 auto" }}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Check size={16} color="var(--sun)" style={{ flexShrink: 0, marginLeft: "8px" }} />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="searchable-select-no-results">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
