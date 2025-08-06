import { ThemeProvider } from "@/provider/themes";

import "./globals.css";

import { BreakpointIndicator } from "@/components/dev/breakpoint-indicator";
import { LineSeedSans, Sarabun } from "@/fonts";
import { cn } from "@/lib/utils";

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
