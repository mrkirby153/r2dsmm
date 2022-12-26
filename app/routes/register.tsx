import { Link, useSearchParams } from "@remix-run/react";

import { Input, SubmitButton } from "~/components/FormInput";
import { ButtonStyle } from "~/components/Button";
import { manualValidationErrors, safeRedirect } from "~/utils";
import type { ActionArgs, MetaFunction } from "@remix-run/server-runtime";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { ValidatedForm, validationError } from "remix-validated-form";

const validator = withYup(
  yup.object({
    email: yup.string().email().label("Email").required(),
    password: yup.string().min(8).label("Password").required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .label("Confirm Password")
      .required(),
  })
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo") || "/");

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }
  const { email, password } = fieldValues.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    return manualValidationErrors({
      email: "Email is already in use",
    });
  }
  const user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Register",
  };
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md rounded border border-gray-200 px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">Register</h1>
        <ValidatedForm
          method="post"
          className="space-y-6"
          validator={validator}
        >
          <Input
            label="Email"
            name="email"
            placeholder="username@example.com"
          />
          <Input label="Password" name="password" type="password" />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          />
          <input
            type="hidden"
            id="redirectTo"
            name="redirectTo"
            value={redirectTo}
          />
          <SubmitButton buttonStyle={ButtonStyle.Primary}>
            Register
          </SubmitButton>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to={{ pathname: "/login", search: searchParams.toString() }}
              className="text-blue-500 underline"
            >
              Log In
            </Link>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}
