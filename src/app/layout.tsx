import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "LedgerFlow Expense Tracker",
  description:
    "Clean, high-precision expense tracking, budget planning, and financial analytics dashboard.",
  openGraph: {
    title: "LedgerFlow Expense Tracker",
    description:
      "Clean, high-precision expense tracking, budget planning, and financial analytics dashboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LedgerFlow Expense Tracker",
    description:
      "Clean, high-precision expense tracking, budget planning, and financial analytics dashboard.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
