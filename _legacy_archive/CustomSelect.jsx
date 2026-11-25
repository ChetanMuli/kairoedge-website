import React, { useEffect, useRef, useState } from "react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Type to search…",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to { value, label, subtext }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt, subtext: "" };
    }
    return {
      value: opt.value ?? opt.id ?? opt.name,
      label: opt.label ?? opt.name ?? String(opt.value),
      subtext: opt.subtext ?? (opt.code ? `${opt.code} · ${opt.city || ""}` : "")
    };
  });

  // Selected item label
  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Filtered options by search term
  const filteredOptions = normalizedOptions.filter((opt) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      opt.label.toLowerCase().includes(term) ||
      (opt.subtext && opt.subtext.toLowerCase().includes(term)) ||
      String(opt.value).toLowerCase().includes(term)
    );
  });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen, searchable]);

  function handleSelect(val) {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${isOpen ? "is-open" : ""} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        className={`custom-select-trigger ${selectedOption ? "has-value" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="custom-select-arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {searchable && (
            <div className="custom-select-search-wrap">
              <input
                ref={searchInputRef}
                type="text"
                className="custom-select-search-input"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {search && (
                <button
                  type="button"
                  className="custom-select-search-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearch("");
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className="custom-select-options-list">
            {filteredOptions.length === 0 ? (
              <div className="custom-select-empty">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`custom-select-option ${isSelected ? "is-selected" : ""}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="custom-select-option-content">
                      <span className="custom-select-option-label">{opt.label}</span>
                      {opt.subtext ? (
                        <span className="custom-select-option-sub">{opt.subtext}</span>
                      ) : null}
                    </div>
                    {isSelected && (
                      <span className="custom-select-check">✓</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
