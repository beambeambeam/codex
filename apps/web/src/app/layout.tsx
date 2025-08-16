import { ThemeProvider } from "@/provider/themes";

import "./globals.css";
import "@xyflow/react/dist/style.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { BreakpointIndicator } from "@/components/dev/breakpoint-indicator";
import { Toaster } from "@/components/ui/sonner";
import { LineSeedSans, Sarabun } from "@/fonts";
import { cn } from "@/lib/utils";
import QueryProvider from "@/provider/query";
import { UserProvider } from "@/store/user";

export const metadata = {
  title: "Codex",
  description: "Make your data, Askable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background h-full min-h-screen w-full font-mono antialiased",
          LineSeedSans.variable,
          Sarabun.variable,
        )}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark"]}
          >
            <NuqsAdapter>
              <UserProvider>
                {children}

                <Toaster />
                <BreakpointIndicator />
              </UserProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
