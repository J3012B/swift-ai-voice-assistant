import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";
import AuthModal from "./components/AuthModal";

export const metadata: Metadata = {
	title: "Talk To Your Computer - Easiest Screen Sharing + AI Voice Chat",
	description:
		"The easiest way to share your screen and talk with AI at the same time. Voice-powered AI assistant that can see and understand everything on your screen.",
	keywords: ["AI voice assistant", "screen sharing AI", "voice chat AI", "AI screen reader", "talk to computer", "AI desktop assistant"],
	openGraph: {
		title: "Talk To Your Computer - Easiest Screen Sharing + AI Voice Chat",
		description:
			"The easiest way to share your screen and talk with AI at the same time. Voice-powered AI assistant that can see and understand everything on your screen.",
		type: "website",
		siteName: "Talk To Your Computer",
	},
	twitter: {
		card: "summary_large_image",
		title: "Talk To Your Computer - Easiest Screen Sharing + AI Voice Chat",
		description:
			"The easiest way to share your screen and talk with AI at the same time. Voice-powered AI assistant that can see and understand everything on your screen.",
	},
	robots: {
		index: true,
		follow: true,
	},
	authors: [{ name: "Josef Büttgen" }],
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
				<Providers>
					<main className="flex flex-col items-center justify-center grow">
						{children}
					</main>
					<AuthModal />
				</Providers>

				<Toaster richColors theme="system" />
				<Analytics />
			</body>
		</html>
	);
}
