import { Form } from "@remix-run/react";
import React from "react";
import {
  useField,
  useFormContext,
  useIsSubmitting,
} from "remix-validated-form";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string | undefined | null;
}

export function Input({ label, name, error: propError, ...rest }: InputProps) {
  const { error, getInputProps } = useField(name);
  const displayError = error ? error : propError;

  const classes = `w-full rounded border ${
    error ? "border-red-500" : "border-gray-500"
  } px-2 py-1 text-lg`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          className={classes}
          name={name}
          {...getInputProps({ ...rest })}
        />
        {displayError && (
          <div className="pt-1 text-red-700">{displayError}</div>
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

export interface SubmitProps extends ButtonProps {}
export function SubmitButton(props: SubmitProps) {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;
  return <Button {...props} type="submit" disabled={disabled} />;
}
