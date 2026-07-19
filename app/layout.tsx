import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "성공 대화론 독서모임",
  description: "책 문장, 성찰, 질문, 대화 기록을 한 화면에서 다루는 독서모임 진행판.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
