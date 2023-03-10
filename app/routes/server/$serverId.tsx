import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { verifyCanAccessServer } from "~/auth/utils.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.serverId, "Server ID should be set");
  return await verifyCanAccessServer(params.serverId, request);
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
  const elements = links.map((link) => {
    const path = link.href.substring(1);

    const renderStyles = ({
      isActive,
    }: {
      isActive: boolean;
      isPending: boolean;
    }) => {
      let styles =
        "block border-l-2 px-2 pb-1 transition sm:inline-block sm:border-b-2 sm:border-l-0";
      if (isActive) {
        styles += " border-blue-500 font-medium";
      } else {
        styles += " hover:border-blue-200";
      }
      return styles;
    };

    return (
      <li key={link.href} className="inline first:ml-0 sm:ml-2">
        <NavLink to={path} className={renderStyles} end>
          {link.name}
        </NavLink>
      </li>
    );
  });

  return (
    <nav className="absolute left-3 float-left mb-3 sm:relative sm:left-0 sm:float-none">
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
