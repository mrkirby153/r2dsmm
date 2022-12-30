import { Link } from "@remix-run/react";
import { Button, ButtonStyle } from "~/components/Button";
import { LogoutForm } from "~/components/FormInput";
import { useOptionalUser } from "~/utils";

function LoginButtons() {
  const user = useOptionalUser();

  if (user) {
    return (
      <LogoutForm>
        <Button type="submit" buttonStyle={ButtonStyle.Danger}>
          Log Out
        </Button>
      </LogoutForm>
    );
  } else {
    return (
      <>
        <Link to={"/register"} className="ml-3 rounded bg-blue-500 py-2 px-4 text-center text-white hover:bg-blue-600">Register</Link>
        <Link to={"/login"} className="ml-3 rounded bg-green-500 py-2 px-4 text-center text-white hover:bg-green-600">Login</Link>
      </>
    );
  }
}

export default function Index() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-[50%] text-center">
        <h1 className="pb-3 text-5xl">R2DSMM</h1>
        <p>Welcome to the Risk of Rain 2 Dedicated Server Mod Manager</p>
        <div className="mt-4">
          <LoginButtons />
        </div>
      </div>
    </div>
  );
}
