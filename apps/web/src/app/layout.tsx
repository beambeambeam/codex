import { ThemeProvider } from "@/provider/themes";

import "./globals.css";

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
      <body className="bg-background h-full min-h-screen w-full antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
