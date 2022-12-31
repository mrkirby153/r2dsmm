import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "R2DSMM",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

const DisplayErrorToggle = ({ error }: { error: Error }) => {
  const [displayError, setDisplayError] = useState(false);
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (displayError) {
    return <pre className="mt-2 rounded-md bg-gray-100 p-4">{error.stack}</pre>;
  } else {
    return (
      <button
        onClick={() => setDisplayError(true)}
        className="mt-2 rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
      >
        Stacktrace
      </button>
    );
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="m-4">
        <h1 className="text-3xl">An Error Occurred</h1>
        <p className="mt-2 rounded border border-red-300 bg-red-100 p-4">
          {error.message}
        </p>
        <DisplayErrorToggle error={error} />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
