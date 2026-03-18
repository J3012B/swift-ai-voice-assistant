import React from "react";
import Link from "next/link";

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  readingTime: string;
  content: React.ReactNode;
};

const post1Content = (
  <div className="space-y-6">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Talking to your computer used to mean barking commands at Siri or dictating text into a box. In 2026, it means something entirely different — having a real back-and-forth conversation with an AI that can actually see what&apos;s on your screen and help you get things done. This guide walks you through exactly how to do that.
    </p>

    <h2 className="text-2xl font-bold mt-8">What Does &quot;Talking to Your Computer&quot; Actually Mean Now?</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      The old version was dictation: you speak, text appears. Useful, but limited. The new version is a genuine conversation: you ask a question out loud, the AI responds (also out loud), you follow up, it adapts. The AI has context about what you&apos;re doing — what apps are open, what&apos;s on your screen, what you were working on five minutes ago.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      This is the difference between a transcription service and an actual assistant. One records your words. The other thinks with you.
    </p>

    <h2 className="text-2xl font-bold mt-8">Step 1: Pick the Right Tool for the Job</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Not all &quot;AI voice&quot; tools are created equal. There are three broad categories:
    </p>
    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <li><strong className="text-neutral-900 dark:text-white">Voice dictation tools</strong> (SuperWhisper, Wispr Flow) — transcribe your speech to text. Great for writing. Not for conversations.</li>
      <li><strong className="text-neutral-900 dark:text-white">Keyboard-driven AI launchers</strong> (Raycast AI) — let you type prompts quickly. Keyboard-first, not voice-first.</li>
      <li><strong className="text-neutral-900 dark:text-white">Screen-aware voice assistants</strong> (<Link href="/" className="text-neutral-900 dark:text-white underline underline-offset-2">Talk To Your Computer</Link>) — have full voice conversations and can see your screen in real time.</li>
    </ul>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      If you want to talk to your computer and have it actually understand your context — what you&apos;re looking at, what problem you&apos;re solving — you need the third category.
    </p>

    <h2 className="text-2xl font-bold mt-8">Step 2: Set Up Screen Sharing</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      For a truly context-aware experience, you want an AI that can see your screen. With Talk To Your Computer, this works entirely in your browser — no app to install, no system permissions to configure beyond what Chrome already asks for.
    </p>
    <ol className="list-decimal list-inside space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <li>Open <Link href="/" className="text-neutral-900 dark:text-white underline underline-offset-2">talktoyour.computer</Link> in Chrome or Edge</li>
      <li>Click &quot;Share Screen&quot; when prompted — you can share your full desktop, a specific app window, or a browser tab</li>
      <li>Grant microphone access when asked</li>
      <li>You&apos;re ready — the AI can now see what you&apos;re working on</li>
    </ol>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      The screen sharing runs locally in your browser. The AI receives frames from your screen combined with your voice, so it has real context — not just your words in a vacuum.
    </p>

    <h2 className="text-2xl font-bold mt-8">Step 3: Start a Real Conversation</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Once you&apos;re set up, just start talking. You don&apos;t need to phrase things perfectly. Some examples of what actually works:
    </p>
    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <li>&quot;What is this error message saying?&quot; — while looking at a terminal</li>
      <li>&quot;Can you summarize the key points in this article?&quot; — while reading something in your browser</li>
      <li>&quot;Walk me through what this code does&quot; — while looking at a file in your editor</li>
      <li>&quot;I&apos;m trying to figure out why this chart looks wrong&quot; — while in a spreadsheet</li>
      <li>&quot;How do I do this faster?&quot; — while working in any app</li>
    </ul>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      The AI sees what you&apos;re looking at, so you can speak naturally without having to copy-paste content or describe everything in detail. The context is already there.
    </p>

    <h2 className="text-2xl font-bold mt-8">Step 4: Use Follow-Up Questions</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      The real power of voice conversation is iteration. You can ask a follow-up without restating all the context:
    </p>
    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <li>&quot;Can you explain that more simply?&quot;</li>
      <li>&quot;What would happen if I changed this part?&quot;</li>
      <li>&quot;Give me an example of how I&apos;d use this&quot;</li>
      <li>&quot;What are the risks of doing it this way?&quot;</li>
    </ul>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Each response builds on what came before. This is what makes voice conversations fundamentally different from one-shot text prompts — the AI holds the thread of what you&apos;re working through together.
    </p>

    <h2 className="text-2xl font-bold mt-8">Tips for Getting Better Results</h2>
    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <li><strong className="text-neutral-900 dark:text-white">Be direct, not polite.</strong> &quot;Explain this error&quot; works better than &quot;Could you perhaps help me understand what might be causing this issue.&quot;</li>
      <li><strong className="text-neutral-900 dark:text-white">Give it something to look at.</strong> Have the relevant content on screen before you ask. If you&apos;re asking about a document, open it first.</li>
      <li><strong className="text-neutral-900 dark:text-white">Use it for thinking out loud.</strong> AI voice assistants are surprisingly good as a rubber duck — talk through a problem and let the AI reflect it back.</li>
      <li><strong className="text-neutral-900 dark:text-white">Ask for options, not just answers.</strong> &quot;What are three ways I could approach this?&quot; gives you more to work with than a single answer.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Frequently Asked Questions</h2>

    <h3 className="text-xl font-semibold mt-6">Does talking to your computer require any special hardware?</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      No. Any computer with a microphone — which is every modern laptop — will work. A headset or earbuds improves audio quality slightly but is not required. The AI is doing the heavy lifting, not your hardware.
    </p>

    <h3 className="text-xl font-semibold mt-6">Is it private? Can the AI see passwords or sensitive content?</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      You control what the AI sees. With browser-based tools like Talk To Your Computer, you choose which window or tab to share. You can share just one app window and the AI will only see that. If you&apos;re entering a password, switch to a different window or pause the session.
    </p>

    <h3 className="text-xl font-semibold mt-6">What&apos;s the difference between this and asking ChatGPT in a text box?</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Two things: speed and context. Voice is 3-4x faster than typing for most people. And with screen sharing, you skip the copy-paste step entirely — the AI already sees what you&apos;re working on. For repetitive or in-context work, this adds up to a significant productivity difference.
    </p>

    <h3 className="text-xl font-semibold mt-6">Does it work on Windows, not just Mac?</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Browser-based tools like Talk To Your Computer work on any OS — Windows, Mac, Linux, Chromebook. Because it runs in the browser, there&apos;s nothing to install and no platform lock-in. Mac-specific tools like SuperWhisper and Wispr Flow require a Mac.
    </p>

    <h3 className="text-xl font-semibold mt-6">Is there a free way to try this before paying?</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Yes. Talk To Your Computer has a free tier with 5 interactions — no credit card required. You can get a real sense of what screen-aware voice conversations feel like before deciding if it&apos;s worth $19/month for unlimited access.
    </p>
  </div>
);

const post2Content = (
  <div className="space-y-6">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      The market for AI voice tools on Mac has exploded over the past couple of years, and the options are genuinely different from each other — not just in features, but in philosophy. Some are focused on dictation. Some are keyboard-driven launchers that happen to support voice. And one is built entirely around having real voice conversations with an AI that can see your screen.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Here&apos;s an honest breakdown of the main contenders in 2026, and which use case each one actually serves.
    </p>

    <h2 className="text-2xl font-bold mt-8">1. SuperWhisper — Best Pure Voice Dictation</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      SuperWhisper is a Mac app built on OpenAI&apos;s Whisper transcription model. It lives in your menu bar, you press a hotkey, talk, and your words get transcribed and dropped wherever your cursor is. The transcription quality is genuinely excellent — one of the best available.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Good for:</strong> Writers, developers, and anyone who wants to compose text by speaking instead of typing. It handles technical vocabulary, punctuation commands, and custom vocabulary well. If you want to write faster by dictating, SuperWhisper is hard to beat.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Not good for:</strong> Actual conversations with AI, or anything requiring the AI to understand your current context. SuperWhisper transcribes; it doesn&apos;t think. It doesn&apos;t see your screen, doesn&apos;t respond back with voice, and doesn&apos;t hold a conversational thread. It&apos;s a one-way input tool.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Pricing:</strong> Paid subscription, Mac only. No free tier.
    </p>

    <h2 className="text-2xl font-bold mt-8">2. Wispr Flow — Best AI-Assisted Dictation</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Wispr Flow takes the dictation concept a step further by adding AI to the transcription. It doesn&apos;t just transcribe your speech verbatim — it cleans it up, formats it appropriately for the context (a Slack message sounds different from a formal email), and handles filler words. It also integrates across your apps so the polished output appears wherever you&apos;re typing.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Good for:</strong> Professionals who write a lot across multiple apps — email, Slack, documents, code comments. The AI formatting layer is genuinely useful if you speak in a stream-of-consciousness way and want the output to be polished.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Not good for:</strong> The same limitations as SuperWhisper — it&apos;s still fundamentally dictation, not conversation. Wispr Flow can&apos;t see your screen or respond to you. You speak at it, not with it. If you want the AI to help you think through a problem in real time, this won&apos;t do it.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Pricing:</strong> Subscription-based, Mac only. Free tier available with limits.
    </p>

    <h2 className="text-2xl font-bold mt-8">3. Raycast AI — Best Keyboard-Driven AI Launcher</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Raycast is a Mac launcher app (think Spotlight replacement) that has deeply integrated AI capabilities. You can open Raycast with a hotkey, type a prompt, and get AI-generated responses, run extensions, control your system, and more. The AI features include chat, text generation, and integrations with dozens of tools.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Good for:</strong> Power users who live on keyboard shortcuts and want fast AI access without leaving their workflow. Raycast is exceptional as a productivity multiplier for keyboard-centric work. The extension ecosystem is vast.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Not good for:</strong> Voice-first use. Raycast is fundamentally a keyboard tool — voice is an afterthought, not the primary interface. It also doesn&apos;t see your screen in the way a screen-aware assistant does. If you want to say &quot;what&apos;s going on with this error?&quot; while looking at a terminal, Raycast isn&apos;t the tool.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Pricing:</strong> Free base tier. Raycast AI requires a paid Pro plan. Mac only.
    </p>

    <h2 className="text-2xl font-bold mt-8">4. Talk To Your Computer — Best for Screen-Aware Voice Conversations</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Talk To Your Computer is built around a different premise: what if you could have a real voice conversation with an AI that can see exactly what&apos;s on your screen? No typing, no copy-pasting context, no describing what you&apos;re looking at. Just talk, and the AI already knows.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Good for:</strong> Developers debugging code, anyone working through complex documents or data, people learning new tools, or anyone who wants a thinking partner they can speak to in real time. The combination of voice conversation and screen context is uniquely powerful for problem-solving work.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Not good for:</strong> Pure dictation use cases — if you just want to write by speaking, SuperWhisper or Wispr Flow are better fits. Talk To Your Computer is optimized for conversations, not text input.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <strong className="text-neutral-900 dark:text-white">Pricing:</strong> Free tier (5 interactions, no credit card). $19/month for unlimited. Works on any OS — no installation required.
    </p>

    <h2 className="text-2xl font-bold mt-8">The Verdict: Which One Should You Use?</h2>
    <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <p><strong className="text-neutral-900 dark:text-white">Use SuperWhisper</strong> if you want to write faster by dictating. It&apos;s the best pure transcription tool on Mac.</p>
      <p><strong className="text-neutral-900 dark:text-white">Use Wispr Flow</strong> if you dictate across many different apps and want polished, context-aware output automatically.</p>
      <p><strong className="text-neutral-900 dark:text-white">Use Raycast AI</strong> if you&apos;re a keyboard power user who wants fast AI access as part of your existing launcher workflow.</p>
      <p><strong className="text-neutral-900 dark:text-white">Use Talk To Your Computer</strong> if you want to actually converse with an AI that understands what you&apos;re working on. Especially if you spend time problem-solving, debugging, learning, or navigating complex content.</p>
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      These tools aren&apos;t necessarily in competition — you might use Wispr Flow for writing and Talk To Your Computer for problem-solving sessions. But if you can only pick one and your primary use case is &quot;I want an AI I can talk to that actually understands my work,&quot; the answer is clear.
    </p>
  </div>
);

const post3Content = (
  <div className="space-y-6">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Most AI assistants are context-blind. You type a question, they answer the question. They have no idea what you were doing five seconds ago, what&apos;s on your screen, or what you&apos;re actually trying to accomplish. You have to describe your situation in text before you can get help with it.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      A screen-aware AI assistant breaks this constraint. It sees what you see, in real time, and can participate in your work rather than just respond to isolated prompts. This sounds like a small change. It isn&apos;t.
    </p>

    <h2 className="text-2xl font-bold mt-8">What Screen-Aware Actually Means</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      A screen-aware AI assistant has access to visual frames from your display as part of its context window. When you ask a question, the AI isn&apos;t just processing your words — it&apos;s processing your words plus a real-time view of what&apos;s in front of you.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      This means you can ask questions like &quot;what does this mean?&quot; or &quot;why isn&apos;t this working?&quot; without having to explain what &quot;this&quot; refers to. The AI already sees it. This is the closest thing to having a knowledgeable colleague sitting next to you — one who can glance at your screen and actually engage with what you&apos;re doing.
    </p>

    <h2 className="text-2xl font-bold mt-8">Why Regular AI Falls Short</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Standard AI tools — ChatGPT, Claude.ai, Gemini — are powerful, but they require you to bring the context to them. If you hit an error in your code, you copy the error. You paste the relevant code. You describe the problem. You submit the prompt. Then you wait for the response, go back to your editor, try it, and repeat.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      This context-switching cost adds up. Research on attention and flow suggests that even brief interruptions — the kind of interruption involved in switching tabs to type a prompt — can cost 15-20 minutes of recovered focus. If you&apos;re doing this twenty times a day, you&apos;re spending a lot of cognitive energy just on the mechanics of asking for help.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Screen-aware AI eliminates this entirely. You stay in your tool. You talk. The AI already has the context. You stay in flow.
    </p>

    <h2 className="text-2xl font-bold mt-8">Real-World Use Cases</h2>

    <h3 className="text-xl font-semibold mt-6">Debugging Code</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      You&apos;re looking at an error in your terminal. Instead of copying the stack trace and pasting it into a chat window, you just say &quot;what&apos;s this error and how do I fix it?&quot; The AI sees the terminal, reads the error, understands the context, and explains. Then you can follow up: &quot;what if I don&apos;t want to refactor that part?&quot; or &quot;show me what the fixed version looks like.&quot;
    </p>

    <h3 className="text-xl font-semibold mt-6">Reading Complex Documents</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Legal documents, technical specifications, research papers, financial reports — dense material that takes time to parse. With a screen-aware AI, you can work through it conversationally. &quot;What does this clause actually mean for me?&quot; or &quot;Summarize the key risks in this section.&quot; The AI is reading alongside you, not waiting for you to copy the relevant paragraph.
    </p>

    <h3 className="text-xl font-semibold mt-6">Learning New Software</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Every time you encounter a new tool, there&apos;s a learning curve. A screen-aware assistant turns that into a guided walkthrough. &quot;I&apos;m looking at this settings panel — what does each option do?&quot; or &quot;I want to do X in this app, where should I look?&quot; The AI sees the actual UI you&apos;re working with, not a generic description of the software.
    </p>

    <h3 className="text-xl font-semibold mt-6">Data and Spreadsheets</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      You&apos;re looking at a spreadsheet or dashboard and something looks off. &quot;Why does this chart look weird?&quot; or &quot;Can you spot the outlier in this data?&quot; Instead of exporting data, formatting it, and pasting it into a prompt, you just ask. The AI analyzes what it sees and responds.
    </p>

    <h3 className="text-xl font-semibold mt-6">Multitasking Support</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Browser-based screen-aware AI like Talk To Your Computer runs in a small window while you work in other applications. It&apos;s always there, always watching, ready to help the moment you have a question. You don&apos;t need to switch focus — you just speak.
    </p>

    <h2 className="text-2xl font-bold mt-8">How Talk To Your Computer Does This</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <Link href="/" className="text-neutral-900 dark:text-white underline underline-offset-2">Talk To Your Computer</Link> combines browser-based screen sharing with real-time voice conversation. When you share your screen, the AI receives visual frames as part of its context. When you speak, your voice is processed alongside those frames. The result is an AI that can genuinely see and respond to what you&apos;re working on.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Crucially, this happens in a voice conversation — not a chat window. You speak, the AI speaks back. You follow up, it adapts. This conversational modality is faster than typing for most people, and it keeps your hands free to work in the applications you&apos;re actually using.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Because it&apos;s browser-based, there&apos;s nothing to install. It works on Windows, Mac, Linux — any desktop with a modern browser. You choose which window to share, so you control what the AI can see.
    </p>

    <h2 className="text-2xl font-bold mt-8">The Bigger Picture</h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Screen-aware AI is part of a broader shift from AI as a tool you use to AI as a presence in your workflow. The best version of this isn&apos;t an AI that answers questions when you remember to ask — it&apos;s one that&apos;s available, contextually informed, and easy to talk to whenever a question arises.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      We&apos;re still early in this. The models are getting better, the latency is dropping, and the friction of using AI during real work is shrinking. Screen awareness is a foundational piece of what makes AI genuinely useful in context — not just a powerful tool you occasionally visit, but something that&apos;s actually present when you need it.
    </p>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      If you haven&apos;t tried it yet, <Link href="/" className="text-neutral-900 dark:text-white underline underline-offset-2">Talk To Your Computer</Link> has a free tier — 5 interactions, no credit card required. It takes about 30 seconds to go from nothing to having an AI conversation about whatever is on your screen. That&apos;s the fastest way to understand what &quot;screen-aware&quot; actually means in practice.
    </p>
  </div>
);

export const posts: Post[] = [
  {
    slug: "how-to-talk-to-your-computer-using-ai",
    title: "How to Talk to Your Computer Using AI (2026 Guide)",
    metaTitle: "How to Talk to Your Computer Using AI (2026 Guide) | Talk To Your Computer",
    description:
      "A step-by-step guide to having real AI voice conversations with your computer in 2026 — including how to set up screen sharing so the AI sees your context.",
    date: "2026-03-10",
    readingTime: "7 min read",
    content: post1Content,
  },
  {
    slug: "best-ai-voice-assistant-for-mac",
    title: "Best AI Voice Assistant for Mac in 2026",
    metaTitle: "Best AI Voice Assistant for Mac in 2026 | Talk To Your Computer",
    description:
      "Comparing SuperWhisper, Wispr Flow, Raycast AI, and Talk To Your Computer — which AI voice tool is right for your use case on Mac?",
    date: "2026-03-05",
    readingTime: "8 min read",
    content: post2Content,
  },
  {
    slug: "screen-aware-ai-assistant",
    title: "What Is a Screen-Aware AI Assistant? (And Why It Changes Everything)",
    metaTitle: "What Is a Screen-Aware AI Assistant? | Talk To Your Computer",
    description:
      "Most AI assistants are context-blind. Screen-aware AI can see what's on your screen and participate in your actual work. Here's why that matters.",
    date: "2026-02-28",
    readingTime: "6 min read",
    content: post3Content,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}
