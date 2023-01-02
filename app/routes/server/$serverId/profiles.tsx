import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getProfilesForServer } from "~/models/profiles.server";

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.serverId, "serverId is required");
  return await getProfilesForServer(params.serverId);
}

export default function Profiles() {
  const profiles = useLoaderData<typeof loader>();
  return (
    <>
      <p>Here's all the profiles</p>
      {profiles.map((profile) => {
        return (
          <Link
            to={`/profile/${profile.id}`}
            key={profile.id}
            className="block"
          >
            {profile.name}
          </Link>
        );
      })}
    </>
  );
}
