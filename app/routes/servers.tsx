import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getServersForUser } from "~/models/servers.server";
import { requireUser } from "~/session.server";
import { GameMode } from "@prisma/client";
import invariant from "tiny-invariant";
import { createRef, useState } from "react";
import { createPopper } from "@popperjs/core";

import { FaTrash, FaEllipsisV } from "react-icons/fa";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  return getServersForUser(user);
};

const GAME_MODE_TRANSLATIONS = {
  [GameMode.CLASSIC]: "Classic",
  [GameMode.ECLIPSE]: "Eclipse",
  [GameMode.SIMULACRUM]: "Simulacrum",
};

interface ServerProps {
  id: string;
  name: string;
  gameMode: GameMode;
}

function Server({ id, name, gameMode }: ServerProps) {
  const [popoverShow, setPopoverShow] = useState(false);
  const btnRef = createRef<HTMLDivElement>();
  const popoverRef = createRef<HTMLDivElement>();

  const openPopover = () => {
    invariant(btnRef.current, "Button ref should be set");
    invariant(popoverRef.current, "Popover ref should be set");
    createPopper(btnRef.current, popoverRef.current, {
      placement: "left",
    });
    setPopoverShow(true);
  };

  const closePopover = () => {
    setPopoverShow(false);
  };

  const onClick = () => {
    popoverShow ? closePopover() : openPopover();
  };

  return (
    <div
      key={id}
      className="flex border-b border-solid border-gray-200 px-3 py-3"
    >
      <Link className="" to={`/servers/${id}`}>
        {name}
      </Link>
      <div className="ml-3 max-h-max self-center text-xs italic text-gray-500">
        {GAME_MODE_TRANSLATIONS[gameMode]}
      </div>
      <div
        className="float-right ml-auto cursor-pointer self-center"
        ref={btnRef}
        onClick={onClick}
      >
        <FaEllipsisV />
      </div>
      <div
        ref={popoverRef}
        className={
          (popoverShow ? "" : "hidden ") +
          "rounded-md border border-solid border-gray-300 bg-white px-0"
        }
      >
        <Link to={`/servers/${id}/delete`}>
          <div className="cursor-pointer px-3 py-1 text-red-500 hover:bg-gray-200">
            <FaTrash className="inline" /> Delete
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function Servers() {
  const servers = useLoaderData<typeof loader>();
  invariant(servers, "Servers should be defined");

  const serverComponents = servers.map((server) => {
    invariant(server.activeProfile, "Active profile should be set");
    return (
      <Server
        key={server.id}
        id={server.id}
        name={server.name}
        gameMode={server.activeProfile.gameMode}
      />
    );
  });

  return (
    <div className="min-h-full flex-col">
      <div className="mx-auto mt-3 w-full max-w-[50%]">
        <h1 className="pb-3 text-center text-5xl">Servers</h1>
        <div className="mt-3 mb-3">{serverComponents}</div>
        <Link
          to={"create"}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 inline-block"
        >
          Create
        </Link>
      </div>
    </div>
  );
}
