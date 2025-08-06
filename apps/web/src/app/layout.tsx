import { ThemeProvider } from "@/provider/themes";

import "./globals.css";

import { BreakpointIndicator } from "@/components/dev/breakpoint-indicator";
import { LineSeedSans, Sarabun } from "@/fonts";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "The Codex",
  description: "Your personal Librarian that handle every file for you.",
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
          "bg-background font-line-seed-sans h-full min-h-screen w-full antialiased",
          LineSeedSans.variable,
          Sarabun.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          {children}
          <BreakpointIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
