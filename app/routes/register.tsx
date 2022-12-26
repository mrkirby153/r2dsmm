import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import { Input } from "~/components/FormInput";
import { Button, ButtonStyle } from "~/components/Button";
import { safeRedirect, validateEmail } from "~/utils";
import type { ActionArgs, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const redirectTo = safeRedirect(formData.get("redirectTo") || "/");

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email is invalid",
          password: null,
          confirmPassword: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length == 0) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is required",
          confirmPassword: null,
        },
      },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          confirmPassword: "Passwords do not match",
        },
      },
      { status: 400 }
    );
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return json(
      {
        errors: {
          password: null,
          email: "Email is already in use",
          confirmPassword: null,
        },
      },
      { status: 400 }
    );
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
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md rounded border border-gray-200 px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">Register</h1>
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
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            error={actionData?.errors?.confirmPassword}
          />
          <input
            type="hidden"
            id="redirectTo"
            name="redirectTo"
            value={redirectTo}
          />
          <Button buttonStyle={ButtonStyle.Primary}>Register</Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to={{ pathname: "/login", search: searchParams.toString() }}
              className="text-blue-500 underline"
            >
              Log In
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
