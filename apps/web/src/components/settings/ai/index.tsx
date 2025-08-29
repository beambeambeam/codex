"use client";

import React, { useState } from "react";
import {
  BotIcon,
  LanguagesIcon,
  MessageSquareIcon,
  TargetIcon,
  XIcon,
} from "lucide-react";

import AiPreferenceForm from "@/components/settings/ai/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Scroller } from "@/components/ui/scroller";
import { useQueryFetchClient } from "@/lib/api/client";

function AiPreference() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: aiPreferences, isLoading } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/auth/ai-preferences",
    {
      enabled: !isEditing,
    },
  );

  const preference = aiPreferences?.detail;

  if (isLoading) {
    return (
      <Scroller className="flex h-full flex-col gap-y-4">
        <div className="animate-pulse space-y-4">
          <div className="bg-muted h-4 w-1/3 rounded"></div>
          <div className="bg-muted h-20 rounded"></div>
          <div className="bg-muted h-4 w-1/4 rounded"></div>
          <div className="bg-muted h-16 rounded"></div>
        </div>
      </Scroller>
    );
  }

  if (isEditing) {
    return (
      <AiPreferenceForm
        defaultValues={{
          call: preference?.call || "",
          skillset: preference?.skillset || "",
          depth_of_explanation: preference?.depth_of_explanation || "MEDIUM",
          language_preference: preference?.language_preference || {
            LANGUAGE: [],
          },
          stopwords: preference?.stopwords || { STOP: [] },
        }}
        onSuccess={() => {
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const PreferenceItem = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      <Badge className="mb-4 flex items-center gap-2">
        <Icon className="size-5" />
        <h4 className="font-semibold">{title}</h4>
      </Badge>
      <div
        className="hover:bg-foreground/2.5 cursor-pointer rounded-lg border-2 p-4"
        onClick={() => setIsEditing(true)}
      >
        {children}
      </div>
    </div>
  );

  return (
    <Scroller className="flex h-full flex-col gap-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Preferences</h3>
          <p className="text-muted-foreground text-sm">
            Personalize how Codex interacts with you
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)} variant="outline">
          Edit Settings
        </Button>
      </div>

      {preference ? (
        <div className="space-y-6">
          <PreferenceItem icon={BotIcon} title="What should Codex call you?">
            <p className="text-muted-foreground text-sm">
              {preference.call || "Not set"}
            </p>
          </PreferenceItem>

          <PreferenceItem icon={TargetIcon} title="What do you do?">
            <p className="text-muted-foreground text-sm">
              {preference.skillset || "Not specified"}
            </p>
          </PreferenceItem>

          <PreferenceItem
            icon={MessageSquareIcon}
            title="How detailed should explanations be?"
          >
            <p className="text-muted-foreground text-sm">
              {preference.depth_of_explanation === "SHORT" && "Keep it brief"}
              {preference.depth_of_explanation === "MEDIUM" &&
                "Give me the essentials"}
              {preference.depth_of_explanation === "DETAIL" &&
                "Explain everything thoroughly"}
              {!preference.depth_of_explanation && "Not configured"}
            </p>
          </PreferenceItem>

          <PreferenceItem
            icon={LanguagesIcon}
            title="Which languages do you prefer?"
          >
            <div className="flex flex-wrap gap-2">
              {preference.language_preference?.LANGUAGE &&
              preference.language_preference.LANGUAGE.length > 0 ? (
                preference.language_preference.LANGUAGE.map((lang, index) => (
                  <Pill key={index} variant="default">
                    {lang}
                  </Pill>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  No languages selected
                </span>
              )}
            </div>
          </PreferenceItem>

          <PreferenceItem
            icon={XIcon}
            title="Any words you'd like Codex to avoid?"
          >
            <div className="flex flex-wrap gap-2">
              {preference.stopwords?.STOP &&
              preference.stopwords.STOP.length > 0 ? (
                preference.stopwords.STOP.map((word, index) => (
                  <Badge key={index} variant="destructive">
                    {word}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  No words to avoid
                </span>
              )}
            </div>
          </PreferenceItem>
        </div>
      ) : (
        <div className="rounded-lg border p-6">
          <div className="mb-4">
            <h4 className="font-semibold">No preferences set yet</h4>
            <p className="text-muted-foreground text-sm">
              Let&apos;s personalize how Codex interacts with you
            </p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Set Preferences</Button>
        </div>
      )}
    </Scroller>
  );
}

export default AiPreference;
