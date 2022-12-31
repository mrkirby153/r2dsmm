import invariant from "tiny-invariant";
import { useMatchesData } from "~/utils";

/**
 * Gets the server info from the root server
 *
 * @returns Server info from the root server route
 */
export default function useServerInfo() {
  const data = useMatchesData("routes/server/$serverId");
  invariant(data, "Server info not found. Not a child of server route?");
  return data;
}
