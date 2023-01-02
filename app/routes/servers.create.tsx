import { GameMode } from "@prisma/client";
import type { ActionArgs, MetaFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { withYup } from "@remix-validated-form/with-yup";
import { ValidatedForm, validationError } from "remix-validated-form";
import * as yup from "yup";
import { ButtonStyle } from "~/components/Button";
import { Input, SubmitButton } from "~/components/FormInput";
import Select from "~/components/Select";
import { createServer } from "~/models/servers.server";
import { requireUserId } from "~/session.server";

const validator = withYup(
  yup.object({
    name: yup.string().label("Name").required(),
    gameMode: yup
      .mixed<GameMode>()
      .label("Game Mode")
      .oneOf(Object.values(GameMode))
      .required(),
  })
);

const FRIENDLY_NAMES = {
  [GameMode.CLASSIC]: "Classic",
  [GameMode.SIMULACRUM]: "Simulacrum",
  [GameMode.ECLIPSE]: "Eclipse",
};

export const meta: MetaFunction = () => {
  return {
    title: "Create Server",
  };
};

export async function action({ request }: ActionArgs) {
  const user = await requireUserId(request);
  if (request.method !== "PUT") {
    throw new Response("Method not allowed", {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  const formData = await request.formData();
  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }
  const { name, gameMode } = fieldValues.data;
  const { server } = await createServer(user, name, gameMode as GameMode);
  return redirect(`/server/${server.id}`);
}

export default function Create() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md rounded border border-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Create Server</h1>
        <ValidatedForm method="put" className="space-y-6" validator={validator}>
          <Input label="Name" name="name" placeholder="Server Name" />
          <Select label="Game Mode" name="gameMode">
            {Object.values(GameMode).map((mode) => {
              return (
                <option key={mode} value={mode}>
                  {FRIENDLY_NAMES[mode]}
                </option>
              );
            })}
          </Select>
          <SubmitButton buttonStyle={ButtonStyle.Primary}>Create</SubmitButton>
        </ValidatedForm>
      </div>
    </div>
  );
}
