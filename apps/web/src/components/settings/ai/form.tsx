"use client";

import React, { useCallback } from "react";
import {
  BotIcon,
  LanguagesIcon,
  MessageSquareIcon,
  TargetIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Scroller } from "@/components/ui/scroller";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryFetchClient } from "@/lib/api/client";
import { parseErrorDetail } from "@/lib/utils";
import FormProps from "@/types/form";

const aiPreferenceFormSchema = z.object({
  call: z.string(),
  skillset: z.string(),
  depth_of_explanation: z.enum(["SHORT", "MEDIUM", "DETAIL"]),
  language_preference: z.object({
    LANGUAGE: z.array(z.string()).min(1, "At least one language is required"),
  }),
  stopwords: z.object({
    STOP: z.array(z.string()),
  }),
});

export type AiPreferenceFormSchemaType = z.infer<typeof aiPreferenceFormSchema>;

interface AiPreferenceFormProps extends FormProps<AiPreferenceFormSchemaType> {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function AiPreferenceForm(props: AiPreferenceFormProps) {
  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "put",
    "/api/v1/auth/ai-preferences",
    {
      onSuccess() {
        toast.success("AI preferences updated successfully");
        props.onSuccess?.();
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to update AI preferences");
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: aiPreferenceFormSchema },
    defaultValues: {
      call: "",
      skillset: "",
      depth_of_explanation: "MEDIUM" as const,
      language_preference: {
        LANGUAGE: [],
      },
      stopwords: {
        STOP: [],
      },
      ...props.defaultValues,
    },
    onSubmit: async ({ value }) => {
      mutate({
        body: {
          call: value.call || null,
          skillset: value.skillset || null,
          depth_of_explanation: value.depth_of_explanation || null,
          language_preference: value.language_preference || null,
          stopwords: value.stopwords || null,
        },
      });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  // Common language options
  const languageOptions: Option[] = [
    { value: "EN", label: "English" },
    { value: "TH", label: "Thai" },
    { value: "ZH", label: "Chinese" },
    { value: "JA", label: "Japanese" },
    { value: "KO", label: "Korean" },
    { value: "ES", label: "Spanish" },
    { value: "FR", label: "French" },
    { value: "DE", label: "German" },
    { value: "IT", label: "Italian" },
    { value: "PT", label: "Portuguese" },
    { value: "RU", label: "Russian" },
    { value: "AR", label: "Arabic" },
    { value: "HI", label: "Hindi" },
    { value: "ID", label: "Indonesian" },
    { value: "MS", label: "Malay" },
    { value: "VI", label: "Vietnamese" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">AI Preferences</h3>
          <p className="text-muted-foreground text-sm">
            Configure how AI should interact with you
          </p>
        </div>
      </div>
      <Scroller className="flex flex-1 flex-col gap-y-6 p-4">
        <form.AppForm>
          <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
            <form.AppField name="call">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>
                      <BotIcon className="size-4" />
                      AI Call
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="call"
                      placeholder="Enter AI call instruction (e.g., You are a helpful assistant)..."
                      name={field.name}
                      value={field.state.value}
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
                    <Badge>
                      <TargetIcon className="size-4" />
                      Skillset
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="skillset"
                      placeholder="Enter your skillset (e.g., Python, JavaScript, React)..."
                      name={field.name}
                      value={field.state.value}
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

            <form.AppField name="depth_of_explanation">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>
                      <MessageSquareIcon className="size-4" />
                      Depth of Explanation
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as "SHORT" | "MEDIUM" | "DETAIL",
                        )
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select explanation depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHORT">Short</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="DETAIL">Detail</SelectItem>
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <form.AppField name="language_preference.LANGUAGE">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>
                      <LanguagesIcon className="size-4" />
                      Language Preferences
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <MultipleSelector
                      value={(field.state.value || []).map((lang) => ({
                        value: lang,
                        label:
                          languageOptions.find((opt) => opt.value === lang)
                            ?.label || lang,
                      }))}
                      onChange={(options) => {
                        field.handleChange(options.map((opt) => opt.value));
                      }}
                      options={languageOptions}
                      placeholder="Select languages..."
                      maxSelected={10}
                      className="min-w-[200px]"
                      emptyIndicator="No languages found."
                      hideClearAllButton
                      disabled={isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <form.AppField name="stopwords.STOP">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>
                    <Badge>
                      <TargetIcon className="size-4" />
                      Stopwords
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <MultipleSelector
                      value={(field.state.value || []).map((word) => ({
                        value: word,
                        label: word,
                      }))}
                      onChange={(options) => {
                        field.handleChange(options.map((opt) => opt.value));
                      }}
                      placeholder="Add stopwords..."
                      maxSelected={20}
                      className="min-w-[200px]"
                      emptyIndicator="No stopwords added yet."
                      creatable
                      hideClearAllButton
                      disabled={isPending}
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
            type="button"
            variant="ghost"
            className="w-fit"
            disabled={isPending}
            onClick={() => props.onCancel?.()}
          >
            Cancel
          </Button>
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

export default AiPreferenceForm;
