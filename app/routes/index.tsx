import { Link } from "@remix-run/react";
import { Button, ButtonStyle } from "~/components/Button";
import { LogoutForm } from "~/components/FormInput";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        Welcome to the Risk of Rain Dedicated Server Mod Manager
        <div className="mt-4">
          {(!user && (
            <>
              <Link
                to={"/register"}
                className="rounded bg-blue-500 py-2 px-4 text-center text-white hover:bg-blue-600"
              >
                Register
              </Link>
              <Link
                to={"/login"}
                className="ml-3 rounded bg-green-500 py-2 px-4 text-center text-white hover:bg-green-600"
              >
                Login
              </Link>
            </>
          )) || (
            <LogoutForm>
              <Button type="submit" buttonStyle={ButtonStyle.Danger}>
                Logout
              </Button>
            </LogoutForm>
          )}
        </div>
      </div>
    </div>
  );
}
