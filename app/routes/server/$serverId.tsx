import {
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useSearchParams,
} from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getServer } from "~/models/servers.server";
import { Fragment } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.serverId, "Server ID should be set");
  const server = await getServer(params.serverId);
  if (!server) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }
  return server;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `Manage Server - ${data?.name || "Server"}`,
  };
};

interface LinkProps {
  name: string;
  href: string;
}

const links: LinkProps[] = [
  {
    name: "Overview",
    href: "/",
  },
  {
    name: "Profiles",
    href: "/profiles",
  },
  {
    name: "Delete",
    href: "/delete",
  },
];

function Navbar() {
  const matches = useMatches();
  const { pathname } = matches[matches.length - 1];
  const elements = links.map((link) => {
    const path = link.href.substring(1);
    const active = pathname.endsWith(link.href);
    return (
      <Link
        key={link.href}
        to={path}
        className={
          (active ? "border-blue-500 font-medium " : "hover:border-blue-200 ") +
          "block border-l-2 px-2 pb-1 transition sm:inline-block sm:border-b-2 sm:border-l-0 sm:ml-2 first:ml-0"
        }
      >
        <li>{link.name}</li>
      </Link>
    );
  });

  return (
    <nav className="mb-3">
      <ul>{elements}</ul>
    </nav>
  );
}

export default function Index() {
  const server = useLoaderData<typeof loader>();
  invariant(server, "Server should be set");
  return (
    <>
      <div className="mx-auto mt-3 w-full max-w-[50%]">
        <h1 className="pb-3 text-center text-5xl">{server.name}</h1>
        <Navbar />
        <Outlet />
      </div>
    </>
  );
}
