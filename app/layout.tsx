import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
	title: "Talk To Your Computer",
	description:
		"An easy way to share your screen with AI and ask it questions.",
	openGraph: {
		title: "Talk To Your Computer",
		description:
			"An easy way to share your screen with AI and ask it questions.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Talk To Your Computer",
		description:
			"An easy way to share your screen with AI and ask it questions.",
	},
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={clsx(
					geist.variable,
					geistMono.variable,
					"py-8 px-6 lg:p-10 dark:text-white bg-white dark:bg-black min-h-dvh flex flex-col justify-between antialiased font-sans select-none"
				)}
			>
				<main className="flex flex-col items-center justify-center grow">
					{children}
				</main>

				<Toaster richColors theme="system" />
				<Analytics />
			</body>
		</html>
	);
}
