import { ValidatedForm, validationError } from "remix-validated-form";
import { ButtonStyle } from "~/components/Button";
import useServerInfo from "~/hooks/useServerInfo";
import * as yup from "yup";
import { withYup } from "@remix-validated-form/with-yup";
import { Input, SubmitButton } from "~/components/FormInput";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { verifyCanAccessServer } from "~/auth/utils.server";
import { deleteServer } from "~/models/servers.server";

function getValidator(serverName: string) {
  return withYup(
    yup.object({
      serverName: yup
        .string()
        .required()
        .oneOf([serverName], "Server name does not match")
        .label("Server Name"),
    })
  );
}

export async function action({ request, params }: ActionArgs) {
  const serverId = params.serverId;
  invariant(serverId, "Server id must be set");
  const server = await verifyCanAccessServer(serverId, request);
  const formData = await request.formData();
  console.log(formData.get("serverName"));
  const fieldValues = await getValidator(server.name).validate(formData);
  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }
  await deleteServer(serverId);
  return redirect(`/servers`);
}

export const meta = {
  title: "Delete Server",
};

export default function Delete() {
  const server = useServerInfo();
  return (
    <>
      <div className="text-center">
        <p>Are you sure you want to delete this server?</p>
        <p>
          Deleting this server will delete all profiles and configuration
          associated with it
        </p>
      </div>

      <div className="mt-4 text-center">
        To confirm, type the name of the server in the box below
      </div>
      <div className="flex justify-center">
        <ValidatedForm validator={getValidator(server.name)} method="post">
          <Input name="serverName" label={null} />
          <div className="mt-2 flex justify-center">
            <SubmitButton buttonStyle={ButtonStyle.Danger} type="submit">
              Delete
            </SubmitButton>
          </div>
        </ValidatedForm>
      </div>
    </>
  );
}
