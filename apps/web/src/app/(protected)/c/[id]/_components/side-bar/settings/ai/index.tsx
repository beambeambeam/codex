"use client";

import React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scroller } from "@/components/ui/scroller";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";

const collectionAiPreferenceFormSchema = z.object({
  tones_and_style: z.string(),
  skillset: z.string(),
  sensitivity: z.string(),
});

export type CollectionAiPreferenceFormSchemaType = z.infer<
  typeof collectionAiPreferenceFormSchema
>;

function CollectionAi() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id;

  const { data: aiPreferences, isLoading } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections/{collection_id}/ai-preferences",
    {
      params: {
        path: {
          collection_id: collectionId,
        },
      },
      enabled: !!collectionId,
    },
  );

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "put",
    "/api/v1/collections/{collection_id}/ai-preferences",
    {
      params: {
        path: {
          collection_id: collectionId,
        },
      },
      onSuccess() {
        toast.success("AI preferences updated successfully");
        cacheUtils.invalidateQueries([
          "get",
          "/api/v1/collections/{collection_id}/ai-preferences",
        ]);
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to update AI preferences");
      },
    },
  );

  const preference = aiPreferences;

  const form = useAppForm({
    validators: { onChange: collectionAiPreferenceFormSchema },
    defaultValues: {
      tones_and_style: "",
      skillset: "",
      sensitivity: "",
      ...preference,
    },
    onSubmit: async ({ value }) => {
      mutate({
        params: {
          path: {
            collection_id: collectionId,
          },
        },
        body: {
          tones_and_style: value.tones_and_style || null,
          skillset: value.skillset || null,
          sensitivity: value.sensitivity || null,
        },
      });
    },
  });

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-lg font-semibold">AI Preferences</h3>
            <p className="text-muted-foreground text-sm">
              Configure how AI should interact with this collection
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">AI Preferences</h3>
          <p className="text-muted-foreground text-sm">
            Configure how AI should interact with this collection
          </p>
        </div>
      </div>
      <Scroller className="flex flex-1 flex-col gap-y-6 p-4">
        <form.AppForm>
          <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
            <form.AppField name="tones_and_style">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>Tone and Style</Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="tones_and_style"
                      placeholder="Describe the preferred tone and style for AI interactions with this collection (e.g., 'Professional and formal tone', 'Casual and friendly approach')"
                      name={field.name}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      className="min-h-[100px]"
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <form.AppField name="skillset">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>Skillset</Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="skillset"
                      placeholder="Describe the skillset or expertise areas relevant to this collection (e.g., 'Technical documentation', 'API design', 'Data analysis')"
                      name={field.name}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      className="min-h-[80px]"
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <form.AppField name="sensitivity">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>Sensitivity Guidelines</Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="sensitivity"
                      placeholder="Describe any sensitivity guidelines or special handling requirements (e.g., 'Handle sensitive data with care', 'Avoid technical jargon')"
                      name={field.name}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      className="min-h-[80px]"
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>
          </form>
        </form.AppForm>

        <div className="pt-10"></div>
      </Scroller>

      <div className="bg-background p-4">
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-fit"
            variant="outline"
            onClick={handleSubmit}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CollectionAi;
