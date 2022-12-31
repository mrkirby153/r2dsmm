import { getServer } from "~/models/servers.server";
import { getUser } from "~/session.server";

export async function verifyCanAccessServer(
  serverId: string,
  request: Request
) {
  const server = await getServer(serverId);
  if (!server) {
    throw new Response("Server not found", {
      status: 404,
      statusText: "Not Found",
    });
  }
  const loggedInUser = await getUser(request);
  if (loggedInUser) {
    if (server.ownerId !== loggedInUser.id) {
      throw new Response("Server not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
  } else {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== server.key) {
      throw new Response("Server not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
  }
  return server;
}
