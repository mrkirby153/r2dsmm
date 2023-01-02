import { getProfile } from "~/models/profiles.server";
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

export async function verifyCanAccessProfile(
  profileId: string,
  request: Request
) {
  const profile = await getProfile(profileId);
  if (!profile) {
    throw new Response("Profile not found", {
      status: 404,
      statusText: "Not Found",
    });
  }
  const loggedInUser = await getUser(request);
  if (loggedInUser) {
    if (profile.server.ownerId !== loggedInUser.id) {
      throw new Response("Profile not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
  } else {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== profile.server.key) {
      throw new Response("Profile not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
  }
  return profile;
}
