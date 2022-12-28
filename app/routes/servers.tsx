import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getServersForUser } from "~/models/servers.server";
import { requireUser } from "~/session.server";
import  { GameMode } from "@prisma/client";
import invariant from "tiny-invariant";

export const loader = async({request}: LoaderArgs) => {
    const user = await requireUser(request)
    return getServersForUser(user)
}

const GAME_MODE_TRANSLATIONS = {
    [GameMode.CLASSIC]: 'Classic',
    [GameMode.ECLIPSE]: 'Eclipse',
    [GameMode.SIMULACRUM]: 'Simulacrum'
}

export default function Servers() {
    const servers = useLoaderData<typeof loader>()

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-lg rounded border border-gray-200 px-8 py-8">
        <h1 className="mb-4 text-2xl font-bold">Servers</h1>
        <p>
            Below are a list of servers currently configured
        </p>

        <table className="border-collapse border rounded border-slate-500 w-full mt-3">
            <thead className="bg-slate-300">
                <tr>
                    <th>Name</th>
                    <th>Game Mode</th>
                    <th>Active Profile</th>
                </tr>
            </thead>
            <tbody>
                {servers.map(server => {
                    invariant(server.activeProfile, `Server ${server.id} must have an active profile`)
                    return (
                        <tr key={server.id} className="text-center">
                            <td>{server.name}</td>
                            <td>{GAME_MODE_TRANSLATIONS[server.activeProfile.gameMode]}</td>
                            <td>{server.activeProfile.name}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Link to="/servers/new" className="block mt-4 text-center bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded">Create</Link>
      </div>
    </div>
  );
}
