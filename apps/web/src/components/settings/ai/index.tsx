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
import { Scroller } from "@/components/ui/scroller";
import { useQueryFetchClient } from "@/lib/api/client";

function AiPreference() {
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: aiPreferences,
    isLoading,
    refetch,
  } = useQueryFetchClient.useQuery("get", "/api/v1/auth/ai-preferences", {
    enabled: !isEditing,
  });

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
          depth_of_explanation: preference?.depth_of_explanation || undefined,
          language_preference: preference?.language_preference || {
            LANGUAGE: [],
          },
          stopwords: preference?.stopwords || { STOP: [] },
        }}
        onSuccess={() => {
          setIsEditing(false);
          refetch();
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
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5" />
        <h4 className="font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );

  return (
    <Scroller className="flex h-full flex-col gap-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Preferences</h3>
          <p className="text-muted-foreground text-sm">
            Configure how AI should interact with you
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)} variant="outline">
          Edit Preferences
        </Button>
      </div>

      {preference ? (
        <div className="space-y-6">
          {preference.call && (
            <PreferenceItem icon={BotIcon} title="AI Call">
              <p className="text-muted-foreground text-sm">{preference.call}</p>
            </PreferenceItem>
          )}

          {preference.skillset && (
            <PreferenceItem icon={TargetIcon} title="Skillset">
              <p className="text-muted-foreground text-sm">
                {preference.skillset}
              </p>
            </PreferenceItem>
          )}

          {preference.depth_of_explanation && (
            <PreferenceItem
              icon={MessageSquareIcon}
              title="Depth of Explanation"
            >
              <Badge variant="outline">
                {preference.depth_of_explanation.charAt(0) +
                  preference.depth_of_explanation.slice(1).toLowerCase()}
              </Badge>
            </PreferenceItem>
          )}

          {preference.language_preference?.LANGUAGE &&
            preference.language_preference.LANGUAGE.length > 0 && (
              <PreferenceItem icon={LanguagesIcon} title="Language Preferences">
                <div className="flex flex-wrap gap-2">
                  {preference.language_preference.LANGUAGE.map(
                    (lang, index) => (
                      <Badge key={index} variant="secondary">
                        {lang}
                      </Badge>
                    ),
                  )}
                </div>
              </PreferenceItem>
            )}

          {preference.stopwords?.STOP &&
            preference.stopwords.STOP.length > 0 && (
              <PreferenceItem icon={XIcon} title="Stopwords">
                <div className="flex flex-wrap gap-2">
                  {preference.stopwords.STOP.map((word, index) => (
                    <Badge key={index} variant="destructive">
                      {word}
                    </Badge>
                  ))}
                </div>
              </PreferenceItem>
            )}
        </div>
      ) : (
        <div className="rounded-lg border p-6">
          <div className="mb-4">
            <h4 className="font-semibold">No AI Preferences Set</h4>
            <p className="text-muted-foreground text-sm">
              Configure your AI preferences to personalize your experience
            </p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Set AI Preferences</Button>
        </div>
      )}
    </Scroller>
  );
}

export default AiPreference;
