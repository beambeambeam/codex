"use client";

import React, { useCallback } from "react";
import {
  BotIcon,
  LanguagesIcon,
  MessageSquareIcon,
  TargetIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  call: z.string().optional(),
  skillset: z.string().optional(),
  depth_of_explanation: z.enum(["SHORT", "MEDIUM", "DETAIL"]).optional(),
  language_preference: z
    .object({
      LANGUAGE: z.array(z.string()).min(1, "At least one language is required"),
    })
    .optional(),
  stopwords: z
    .object({
      STOP: z.array(z.string()),
    })
    .optional(),
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
      depth_of_explanation: undefined,
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

  const addLanguage = useCallback(() => {
    const currentLanguages =
      form.getFieldValue("language_preference.LANGUAGE") || [];
    const newLanguage = prompt("Enter language code (e.g., EN, TH):");
    if (newLanguage && newLanguage.trim()) {
      form.setFieldValue("language_preference.LANGUAGE", [
        ...currentLanguages,
        newLanguage.trim().toUpperCase(),
      ]);
    }
  }, [form]);

  const removeLanguage = useCallback(
    (index: number) => {
      const currentLanguages =
        form.getFieldValue("language_preference.LANGUAGE") || [];
      form.setFieldValue(
        "language_preference.LANGUAGE",
        currentLanguages.filter((_, i) => i !== index),
      );
    },
    [form],
  );

  const addStopword = useCallback(() => {
    const currentStopwords = form.getFieldValue("stopwords.STOP") || [];
    const newStopword = prompt("Enter stopword:");
    if (newStopword && newStopword.trim()) {
      form.setFieldValue("stopwords.STOP", [
        ...currentStopwords,
        newStopword.trim(),
      ]);
    }
  }, [form]);

  const removeStopword = useCallback(
    (index: number) => {
      const currentStopwords = form.getFieldValue("stopwords.STOP") || [];
      form.setFieldValue(
        "stopwords.STOP",
        currentStopwords.filter((_, i) => i !== index),
      );
    },
    [form],
  );

  return (
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
                  onValueChange={field.handleChange}
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
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(field.state.value || []).map((lang, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {lang}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeLanguage(index)}
                          disabled={isPending}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLanguage}
                    disabled={isPending}
                  >
                    Add Language
                  </Button>
                </div>
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
                  <XIcon className="size-4" />
                  Stopwords
                </Badge>
              </field.FormLabel>
              <field.FormControl>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(field.state.value || []).map((word, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="gap-1"
                      >
                        {word}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeStopword(index)}
                          disabled={isPending}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStopword}
                    disabled={isPending}
                  >
                    Add Stopword
                  </Button>
                </div>
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <div className="flex w-full items-end justify-end gap-2">
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
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}

export default AiPreferenceForm;
