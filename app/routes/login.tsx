import { Form, useActionData, useSearchParams } from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { Input } from "~/components/FormInput";
import { createUserSession, getUserId } from "~/session.server";
import { Button, ButtonStyle } from "~/components/Button";
import { Link } from "react-router-dom";
import { safeRedirect, validateEmail } from "~/utils";
import { verifyLogin } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }
  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md rounded border border-gray-200 px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <Form method="post" className="space-y-6">
          <Input
            label="Email"
            id="email"
            placeholder="username@example.com"
            error={actionData?.errors?.email}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            error={actionData?.errors?.password}
          />
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
        </Form>
      </div>
    </div>
  );
}
