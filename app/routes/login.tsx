import { useSearchParams } from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { Input } from "~/components/FormInput";
import { createUserSession, getUserId } from "~/session.server";
import { Button, ButtonStyle } from "~/components/Button";
import { Link } from "react-router-dom";
import { manualValidationErrors, safeRedirect } from "~/utils";
import { verifyLogin } from "~/models/user.server";
import * as yup from "yup";
import { withYup } from "@remix-validated-form/with-yup";
import { ValidatedForm, validationError } from "remix-validated-form";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

const validator = withYup(
  yup.object({
    email: yup.string().email().label("Email").required(),
    password: yup.string().min(8).label("Password").required(),
  })
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const fieldValues = await validator.validate(formData);
  const remember = formData.get("remember") === "on";
  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }
  const { email, password } = fieldValues.data;

  const user = await verifyLogin(email, password);

  if (!user) {
    return manualValidationErrors({
      email: "Invalid email or password",
    });
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === true,
    redirectTo,
  });
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md rounded border border-gray-200 px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
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
          <input
            type="hidden"
            id="redirectTo"
            name="redirectTo"
            value={redirectTo}
          />
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <Button buttonStyle={ButtonStyle.Primary}>Log In</Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={{ pathname: "/register", search: searchParams.toString() }}
              className="text-blue-500 underline"
            >
              Create One
            </Link>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}
