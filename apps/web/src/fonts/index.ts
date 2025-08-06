import { Sarabun as SarabunGoogle } from "next/font/google";
import localFont from "next/font/local";

export const LineSeedSans = localFont({
  src: [
    {
      path: "./line/LINESeedSansTH_W_Th.woff",
      weight: "300",
    },
    {
      path: "./line/LINESeedSansTH_W_Rg.woff",
      weight: "400",
    },
    {
      path: "./line/LINESeedSansTH_W_Bd.woff",
      weight: "700",
    },
    {
      path: "./line/LINESeedSansTH_W_XBd.woff",
      weight: "800",
    },
    {
      path: "./line/LINESeedSansTH_W_He.woff",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-line-seed-sans",
});

export const Sarabun = SarabunGoogle({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sarabun",
  subsets: ["latin", "thai"],
});
