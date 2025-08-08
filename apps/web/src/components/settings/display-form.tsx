"use client";

// ...existing code...
import { PenBoxIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableInput,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} from "@/components/ui/editable";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useQueryFetchClient } from "@/lib/api/client";
import { parseErrorDetail } from "@/lib/utils";
import { useUserActions } from "@/store/user";
import FormProps from "@/types/form";

const displayFormSchema = z.object({
  display: z.string().min(1, "Display name is required"),
});

export type DisplayFormSchemaType = z.infer<typeof displayFormSchema>;

function DisplayForm(props: FormProps<DisplayFormSchemaType>) {
  const { setDisplay } = useUserActions();

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "put",
    "/api/v1/auth/edit",
    {
      onSuccess: (data) => {
        toast.success("Display name updated!");
        if (data.detail?.display) {
          setDisplay(data.detail?.display);
        }
      },
      onError: (error: unknown) => {
        toast.error(
          parseErrorDetail(error) ||
            "Failed to update display name. Please try again.",
        );
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: displayFormSchema },
    defaultValues: {
      display: "",
      ...props.defaultValues,
    },
    onSubmit: ({ value }) =>
      mutate({
        body: {
          ...value,
        },
      }),
  });

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="display">
          {(field) => (
            <field.FormItem>
              <field.FormControl>
                <Editable
                  defaultValue={field.state.value}
                  onSubmit={(val) => {
                    field.handleChange(val);
                    form.handleSubmit();
                  }}
                  onBlur={field.handleBlur}
                  disabled={isPending}
                >
                  <div className="flex items-center gap-2">
                    <EditableArea className="flex-1">
                      <EditablePreview className="!text-2xl font-bold" />
                      <EditableInput
                        className="!text-2xl font-bold"
                        disabled={isPending}
                      />
                    </EditableArea>
                    <EditableTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                      >
                        <PenBoxIcon className="size-5" />
                      </Button>
                    </EditableTrigger>
                    <EditableToolbar>
                      <EditableSubmit asChild>
                        <Button size="sm" type="submit" disabled={isPending}>
                          {isPending ? "Saving..." : "Save"}
                        </Button>
                      </EditableSubmit>
                      <EditableCancel asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                        >
                          Cancel
                        </Button>
                      </EditableCancel>
                    </EditableToolbar>
                  </div>
                </Editable>
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
}
export default DisplayForm;
