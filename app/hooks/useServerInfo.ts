import invariant from "tiny-invariant";
import type { loader } from "~/routes/server/$serverId";
import { useMatchesData } from "~/utils";

/**
 * Gets the server info from the root server
 *
 * @returns Server info from the root server route
 */
export default function useServerInfo(): Awaited<ReturnType<typeof loader>> {
  const data = useMatchesData("routes/server/$serverId");
  invariant(data, "Server info not found. Not a child of server route?");
  return data as Awaited<ReturnType<typeof loader>>;
}
