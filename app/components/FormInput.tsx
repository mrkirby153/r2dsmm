import { Form } from "@remix-run/react";
import React, { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | null | undefined;
}

export function Input(props: InputProps) {
  const { id, error, label, ...rest } = props;
  const [displayErrors, setDisplayErrors] = useState(true);
  const isError = error && displayErrors;
  const classes = `w-full rounded border ${
    isError ? "border-red-500" : "border-gray-500"
  } px-2 py-1 text-lg`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className={classes}
          name={id}
          {...rest}
          onChange={(e) => {
            setDisplayErrors(false);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
        />
        {isError && (
          <div className="pt-1 text-red-700" id={`${id}-error`}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export function LogoutForm(props: React.PropsWithChildren) {
  return (
    <Form action="/logout" method="post">
      {props.children}
    </Form>
  );
}
