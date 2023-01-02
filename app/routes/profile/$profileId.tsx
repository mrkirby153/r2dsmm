import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { verifyCanAccessProfile } from "~/auth/utils.server";

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.profileId, "profileId must be set");
  return verifyCanAccessProfile(params.profileId, request);
}

export default function ProfileId() {
  const profile = useLoaderData<typeof loader>();
  return (
    <>
      <p>
        {profile.server.name} {">"} {profile.name} ({profile.id})
      </p>
      <Outlet />
    </>
  );
}
