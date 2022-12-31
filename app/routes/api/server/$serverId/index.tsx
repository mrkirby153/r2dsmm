import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { verifyCanAccessServer } from "~/auth/utils.server";

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.serverId, "Server ID should be set");
  const server = await verifyCanAccessServer(params.serverId, request);
  return json(server);
}
