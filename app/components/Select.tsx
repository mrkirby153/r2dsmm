import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { useField } from "remix-validated-form";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  error?: string | undefined | null;
}

export default function Select({
  label,
  name,
  error: propError,
  ...rest
}: SelectProps) {
  const { error, getInputProps } = useField(name);
  let classes =
    "appearance-none block w-full pl-3 pr-10 py-2 border text-base sm:text-sm rounded-md";

  const displayError = error ? error : propError;

  if (displayError) {
    classes += " border-red-500";
  } else {
    classes += " border-gray-500";
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          className={classes}
          {...getInputProps({ ...rest })}
          name={name}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <FaChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {displayError && <div className="pt-1 text-red-700">{displayError}</div>}
    </div>
  );
}
