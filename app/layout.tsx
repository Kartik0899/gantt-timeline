import "../styles/globals.css";

export const metadata = {
  title: "Interactive Gantt Timeline",
  description:
    "Take-home interactive timeline implemented with Next.js & Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
