import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ onValueChange, children, ...props }: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <div className="relative w-full">
      <select
        onChange={handleChange}
        className="w-full h-10 pl-3 pr-10 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

const SelectTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm" {...props}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  );
};

const SelectValue = ({ placeholder, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }) => {
  return <span className={`block truncate ${!children ? 'text-gray-500 dark:text-gray-400' : ''}`} {...props}>{children || placeholder}</span>;
};

const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md animate-in fade-in-80" {...props}>
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto p-1">
        {children}
      </div>
    </div>
  );
};

const SelectItem = ({ value, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
  return (
    <div
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      data-value={value}
      {...props}
    >
      <span className="truncate">{children}</span>
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } 