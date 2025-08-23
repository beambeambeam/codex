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
import { cacheUtils } from "@/lib/query/cache";
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
        cacheUtils.invalidateQueries(["get", "/api/v1/auth/ai-preferences"]);
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
    { value: "English", label: "English" },
    { value: "Thai", label: "Thai" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Russian", label: "Russian" },
    { value: "Arabic", label: "Arabic" },
    { value: "Hindi", label: "Hindi" },
    { value: "Indonesian", label: "Indonesian" },
    { value: "Malay", label: "Malay" },
    { value: "Vietnamese", label: "Vietnamese" },
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
                      What should Codex call you?
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="call"
                      placeholder="Enter your name or a source (e.g., 'John', 'Jane', 'Stack Overflow', 'Wikipedia')"
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
                      What do you do?
                    </Badge>
                  </field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      id="skillset"
                      placeholder="Describe your role, profession, or main interests (e.g., software engineer, student, designer, or your primary focus)..."
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
                      How detailed should explanations be?
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your preferred level of detail" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHORT">Keep it brief</SelectItem>
                        <SelectItem value="MEDIUM">
                          Give me the essentials
                        </SelectItem>
                        <SelectItem value="DETAIL">
                          Explain everything thoroughly
                        </SelectItem>
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
                      Which languages do you prefer?
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
                      placeholder="Choose your preferred languages..."
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
                      Any words you&apos;d like Codex to avoid?
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
                      placeholder="Add words you'd prefer Codex to skip..."
                      maxSelected={20}
                      className="min-w-[200px]"
                      emptyIndicator="No words added yet."
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
