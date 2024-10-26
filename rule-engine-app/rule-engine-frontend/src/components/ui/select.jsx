import React, { useState, useRef, useEffect } from 'react';

const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = React.Children.toArray(children)
    .find(child => child.props.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 border border-gray-300 rounded-md bg-white text-left"
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.props.children : "Select an option"}
        </span>
        <span className="pointer-events-none">
          <svg
            className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {React.Children.map(children, child => {
              return React.cloneElement(child, {
                onClick: () => {
                  onValueChange(child.props.value);
                  setIsOpen(false);
                },
                isSelected: child.props.value === value
              });
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ value, children, onClick, isSelected }) => {
  return (
    <li
      onClick={onClick}
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
        isSelected ? 'bg-blue-50 text-blue-600' : ''
      }`}
    >
      {children}
    </li>
  );
};

export { Select, SelectItem };