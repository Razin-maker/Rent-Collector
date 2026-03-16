import React, { useState, useEffect, useRef } from 'react';

const NeumorphicSelect = ({ value, onChange, options, placeholder = 'Select...' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 neumorphic-inner text-left text-gray-700 focus:outline-none flex justify-between items-center"
      >
        <span className={selected ? 'text-gray-700 font-medium' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full neumorphic bg-gray-100 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-all duration-150 ${
                value === opt.value
                  ? 'neumorphic-pressed text-blue-600'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeumorphicSelect;
