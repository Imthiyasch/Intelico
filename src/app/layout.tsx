import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intellico — AI-Powered ATS Resume Builder",
  description:
    "Build ATS-optimized resumes in minutes with AI. Upload your CV or start fresh. 5 professional templates, PDF & Word export. Get more job interviews.",
  keywords: "ATS resume builder, AI resume, resume optimizer, job application, resume templates",
  authors: [{ name: "Intellico" }],
  openGraph: {
    title: "Intellico — AI-Powered ATS Resume Builder",
    description: "Build ATS-optimized resumes in minutes with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-surface-950">
        {children}
      </body>
    </html>
  );
}
