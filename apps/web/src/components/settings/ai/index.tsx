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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scroller } from "@/components/ui/scroller";
import { useQueryFetchClient } from "@/lib/api/client";

function AiPreferenceIndex() {
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

  return (
    <Scroller className="flex h-full flex-col gap-y-6">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BotIcon className="size-5" />
                  AI Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {preference.call}
                </p>
              </CardContent>
            </Card>
          )}

          {preference.skillset && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="size-5" />
                  Skillset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {preference.skillset}
                </p>
              </CardContent>
            </Card>
          )}

          {preference.depth_of_explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="size-5" />
                  Depth of Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">
                  {preference.depth_of_explanation.charAt(0) +
                    preference.depth_of_explanation.slice(1).toLowerCase()}
                </Badge>
              </CardContent>
            </Card>
          )}

          {preference.language_preference?.LANGUAGE &&
            preference.language_preference.LANGUAGE.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LanguagesIcon className="size-5" />
                    Language Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {preference.language_preference.LANGUAGE.map(
                      (lang, index) => (
                        <Badge key={index} variant="secondary">
                          {lang}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {preference.stopwords?.STOP &&
            preference.stopwords.STOP.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XIcon className="size-5" />
                    Stopwords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {preference.stopwords.STOP.map((word, index) => (
                      <Badge key={index} variant="destructive">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No AI Preferences Set</CardTitle>
            <CardDescription>
              Configure your AI preferences to personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsEditing(true)}>
              Set AI Preferences
            </Button>
          </CardContent>
        </Card>
      )}
    </Scroller>
  );
}

export default AiPreferenceIndex;
