import React from "react";

export type FeatureComparison = {
  feature: string;
  ttyc: boolean;
  competitor: boolean;
};

export type CompetitorSection = {
  title: string;
  body: React.ReactNode;
};

export type Competitor = {
  slug: string;
  name: string;
  tagline: string;
  metaTitle: string;
  description: string;
  heroHeadline: string;
  heroSubheadline: string;
  features: FeatureComparison[];
  sections: CompetitorSection[];
  content: React.ReactNode;
};

const superwhisperSections: CompetitorSection[] = [
  {
    title: "What SuperWhisper Does Well",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        SuperWhisper is genuinely excellent at one thing: turning your speech into accurate, well-formatted text. The transcription quality — powered by OpenAI&apos;s Whisper model — is among the best available. It handles technical vocabulary, developer terminology, and punctuation commands reliably. If you write a lot and want to compose by speaking instead of typing, SuperWhisper will meaningfully speed up your workflow. It sits in your menu bar, activates with a hotkey, and stays out of your way. For dictation, it&apos;s hard to fault.
      </p>
    ),
  },
  {
    title: "Where SuperWhisper Falls Short",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        SuperWhisper is a one-way tool. It transcribes what you say — it does not respond, it does not converse, and it has no awareness of what&apos;s on your screen. If you ask it a question, the question gets transcribed and dropped wherever your cursor is. That&apos;s the end of the interaction. There&apos;s no AI thinking alongside you, no follow-up, no context. It&apos;s a microphone with very good speech recognition, not an assistant. For problem-solving, debugging, learning, or any use case where you want the AI to actually engage with your work — SuperWhisper is not the right tool.
      </p>
    ),
  },
  {
    title: "When to Use SuperWhisper vs Talk To Your Computer",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          <strong className="text-neutral-900 dark:text-white">Use SuperWhisper</strong> when your primary goal is text input — you want to compose emails, write documentation, dictate meeting notes, or fill in forms faster. If the job is &quot;words in, text out,&quot; SuperWhisper is excellent.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Talk To Your Computer</strong> when you need the AI to actually engage with what you&apos;re doing. Debugging a problem, working through a complex document, learning a new tool, or having a real conversation about something on your screen. The difference is whether you want a transcription service or a thinking partner.
        </p>
        <p>
          They solve different problems. Some people use both — SuperWhisper for writing, Talk To Your Computer for problem-solving sessions.
        </p>
      </div>
    ),
  },
  {
    title: "Platform and Pricing",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        SuperWhisper is Mac-only, requires installation, and has a paid subscription with no meaningful free tier. Talk To Your Computer runs in any modern browser — no install, no platform lock-in. It works on Mac, Windows, and Linux. There&apos;s a free tier with 5 interactions so you can try the experience before committing to $19/month.
      </p>
    ),
  },
];

const superwhisperContent = (
  <div className="space-y-8">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      SuperWhisper and Talk To Your Computer are both in the &quot;AI voice&quot; category, but they&apos;re solving fundamentally different problems. SuperWhisper is a dictation tool that turns speech into text. Talk To Your Computer is a voice assistant that has real conversations and sees your screen. Understanding that distinction is the whole comparison.
    </p>
    {superwhisperSections.map((s) => (
      <div key={s.title}>
        <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
        {s.body}
      </div>
    ))}
  </div>
);

const wispflowSections: CompetitorSection[] = [
  {
    title: "What Wispr Flow Does Well",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Wispr Flow takes dictation a step further than raw transcription. It uses AI to clean up and reformat your spoken words — so if you dictate in a rambling, conversational way, Wispr Flow outputs polished text appropriate for the context (email, Slack message, document, etc). It works across your entire Mac, so you can dictate in virtually any text field. For people who write a lot across different apps and contexts, this automatic formatting layer is genuinely valuable. The integration is deep and the experience is refined.
      </p>
    ),
  },
  {
    title: "Where Wispr Flow Falls Short",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Like SuperWhisper, Wispr Flow is fundamentally a dictation and text-input tool. The AI enhances and polishes your output — it doesn&apos;t engage in a conversation with you. Wispr Flow can&apos;t see your screen, can&apos;t respond back, and can&apos;t hold a thread of dialogue. If you&apos;re staring at a broken spreadsheet formula and want to say &quot;why isn&apos;t this working?&quot; — Wispr Flow will transcribe that question into your spreadsheet and nothing else. The question goes nowhere. For conversational AI use cases, Wispr Flow is not designed for that job.
      </p>
    ),
  },
  {
    title: "When to Use Wispr Flow vs Talk To Your Computer",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Wispr Flow</strong> if you send a lot of emails, messages, and documents throughout your day and want to compose all of them by voice with AI-polished output. The cross-app integration and formatting intelligence are its strongest points.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Talk To Your Computer</strong> when you want the AI to be a participant in your work, not just a transcription layer. Real-time conversations, screen context, follow-up questions, problem-solving. These are not things Wispr Flow does.
        </p>
        <p>
          Again, these aren&apos;t necessarily competing — a professional might use Wispr Flow all day for writing and use Talk To Your Computer when they hit a problem that needs thinking through.
        </p>
      </div>
    ),
  },
  {
    title: "Platform and Pricing",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Wispr Flow is Mac-only and requires installation. It has a free tier with usage limits. Talk To Your Computer works in any browser on any OS — Mac, Windows, Linux. Free tier includes 5 full interactions at no cost, with unlimited access at $19/month.
      </p>
    ),
  },
];

const wispflowContent = (
  <div className="space-y-8">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Wispr Flow is an AI-powered dictation tool. Talk To Your Computer is an AI voice assistant that can see your screen. They share a surface-level similarity — both involve speaking to your computer — but the underlying capability and use case are quite different.
    </p>
    {wispflowSections.map((s) => (
      <div key={s.title}>
        <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
        {s.body}
      </div>
    ))}
  </div>
);

const raycastSections: CompetitorSection[] = [
  {
    title: "What Raycast AI Does Well",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Raycast is arguably the best productivity launcher on Mac. As a Spotlight replacement, it&apos;s in a different class entirely — faster, more extensible, with a rich extension ecosystem and built-in AI that you can reach with a single keystroke. For keyboard-centric users, Raycast AI is a compelling way to get quick AI help without breaking your flow. The AI can generate text, answer questions, help with code, and interact with other Raycast extensions. If you spend your day in the terminal, your editor, and various Mac apps — and you&apos;re a keyboard power user — Raycast AI is genuinely excellent.
      </p>
    ),
  },
  {
    title: "Where Raycast AI Falls Short",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Raycast is keyboard-first, not voice-first. Voice support exists but it&apos;s not the primary design paradigm. More importantly, Raycast doesn&apos;t see your screen as an active participant — you invoke it with a command, it responds, and you return to what you were doing. There&apos;s no ongoing visual context, no conversational thread tied to what&apos;s currently on your display. If you want to look at a chart, a codebase, or a document and have a conversation about it — Raycast isn&apos;t built for that. It&apos;s a command palette, not a screen-aware assistant.
      </p>
    ),
  },
  {
    title: "Different Use Cases, Different Tools",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Raycast AI</strong> if you&apos;re a Mac power user who wants fast, keyboard-triggered AI access integrated into your launcher workflow. Quickfire text generation, quick calculations, extension-driven automation — Raycast excels here.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Talk To Your Computer</strong> when you want to speak to an AI that can see what you&apos;re working on and have a real back-and-forth. Especially for debugging, problem-solving, working through complex material, or any time you want your hands free while the AI engages with your screen context.
        </p>
        <p>
          Unlike the other comparisons, Raycast and Talk To Your Computer have less overlap — Raycast is a Mac power-user tool, Talk To Your Computer is a screen-aware voice assistant. Many people use both comfortably.
        </p>
      </div>
    ),
  },
  {
    title: "Platform and Pricing",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Raycast is Mac-only and requires installation. The base Raycast app is free; Raycast AI requires a paid Pro subscription. Talk To Your Computer is browser-based — it works on Mac, Windows, and Linux with no installation. The free tier gives you 5 interactions without a credit card; unlimited access is $19/month.
      </p>
    ),
  },
];

const raycastContent = (
  <div className="space-y-8">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Raycast AI and Talk To Your Computer overlap less than you might think. Raycast is a keyboard-driven Mac launcher with AI built in — the best of its kind. Talk To Your Computer is a screen-aware AI voice assistant. One is for keyboard power users who want fast command-line access to AI; the other is for anyone who wants to have a voice conversation with an AI that sees their screen.
    </p>
    {raycastSections.map((s) => (
      <div key={s.title}>
        <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
        {s.body}
      </div>
    ))}
  </div>
);

const chatgptSections: CompetitorSection[] = [
  {
    title: "What ChatGPT Does Well",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        ChatGPT is the most capable general-purpose AI available. The breadth of knowledge, the quality of reasoning, and the ability to handle almost any task — from code to creative writing to research — is unmatched for most users. The Mac and Windows desktop apps are polished, and Advanced Voice Mode has improved significantly: you can have natural back-and-forth conversations with low latency. For everyday AI tasks — answering questions, drafting text, working through ideas — ChatGPT is an excellent default.
      </p>
    ),
  },
  {
    title: "The Key Difference: Ambient vs. Application",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          ChatGPT is an application you visit. You open it, do your task, and return to your work. Even with screen sharing enabled in the desktop app, the interaction model is: you switch to ChatGPT, you ask, you switch back. It&apos;s a destination.
        </p>
        <p>
          Talk To Your Computer is designed to run <em>alongside</em> your work. It uses a browser-based Picture-in-Picture overlay so it floats over whatever application you&apos;re in. You never leave your editor, spreadsheet, or document — you just speak, and the AI responds. The screen sharing is continuous and automatic, not something you trigger manually.
        </p>
        <p>
          This is the core distinction: if you&apos;re in the middle of debugging and want to ask about the error on your screen, Talk To Your Computer lets you do that without breaking your flow. ChatGPT asks you to bring the context to it; Talk To Your Computer is already watching.
        </p>
      </div>
    ),
  },
  {
    title: "When to Use ChatGPT vs Talk To Your Computer",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          <strong className="text-neutral-900 dark:text-white">Use ChatGPT</strong> for open-ended tasks that benefit from its breadth: research, writing, brainstorming, complex analysis with lots of context you provide, or tasks where you want to iterate over many messages with full control over what the AI sees.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Talk To Your Computer</strong> when you&apos;re in the middle of doing something and want voice-first AI help without switching apps. Debugging, working through a document, learning a tool in real time, or any time you want your hands free while the AI engages with what&apos;s on your screen. It&apos;s for flow-state work, not for tasks where you want to deliberate over a chat thread.
        </p>
      </div>
    ),
  },
  {
    title: "Platform and Pricing",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        ChatGPT&apos;s desktop app is available on Mac and Windows and requires installation. ChatGPT Free has limited access; Plus is $20/month. Talk To Your Computer runs in any modern browser — no install, works on Mac, Windows, and Linux. Free tier includes 5 interactions with no credit card required; unlimited access is $19/month.
      </p>
    ),
  },
];

const chatgptContent = (
  <div className="space-y-8">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      ChatGPT and Talk To Your Computer are both AI assistants you can talk to. But they&apos;re built around different interaction models. ChatGPT is a destination — a powerful AI you visit to get things done. Talk To Your Computer is ambient — an AI that runs alongside your work and can see your screen in real time. Understanding that distinction makes the comparison straightforward.
    </p>
    {chatgptSections.map((s) => (
      <div key={s.title}>
        <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
        {s.body}
      </div>
    ))}
  </div>
);

const siriSections: CompetitorSection[] = [
  {
    title: "What Siri Does Well",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Siri&apos;s primary strength is deep system integration. It can open applications, set reminders, send messages, control playback, look up contacts, and handle a wide range of operating-system-level tasks through a single voice command. It&apos;s always available — no browser, no app to open. With Apple Intelligence on modern Macs, Siri has also improved its ability to understand natural language requests and take actions across Apple&apos;s own apps. For quick hands-free system control, Siri is hard to beat precisely because it&apos;s already there.
      </p>
    ),
  },
  {
    title: "Where Siri Falls Short",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Siri cannot help you with your actual work. It cannot see your screen, read a document you&apos;re looking at, explain an error in your terminal, or have a sustained back-and-forth conversation about a technical problem. Ask Siri to walk you through a complex code bug or explain a clause in a contract and you&apos;ll hit its limits immediately. It&apos;s a system assistant, not a thinking partner. Siri is built for tasks (&quot;open Calendar&quot;, &quot;remind me at 3pm&quot;); Talk To Your Computer is built for conversations about your actual work.
      </p>
    ),
  },
  {
    title: "They Solve Different Problems",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Siri</strong> for system-level tasks: launching apps, managing reminders and calendar, controlling music, sending iMessages, and other OS-level actions where speed and convenience matter. For these tasks, nothing beats Siri&apos;s native integration.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Use Talk To Your Computer</strong> for knowledge work: debugging code, working through documents, getting explanations for things on your screen, problem-solving, learning. These are tasks that require an LLM with real reasoning ability and screen awareness — which Siri does not have.
        </p>
        <p>
          Most people end up using both: Siri to open apps and set timers, Talk To Your Computer when they actually need help thinking through their work.
        </p>
      </div>
    ),
  },
  {
    title: "Platform and Pricing",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Siri is free and built into every Apple device — no setup required. Talk To Your Computer runs in any modern browser with a free tier of 5 interactions (no credit card). Unlimited access is $19/month. For users on Windows or Linux, Talk To Your Computer is the obvious choice since Siri isn&apos;t available; for Mac users, both are worth having for their respective use cases.
      </p>
    ),
  },
];

const siriContent = (
  <div className="space-y-8">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      Siri and Talk To Your Computer are both voice assistants on Mac, but they&apos;re built for entirely different jobs. Siri controls your system. Talk To Your Computer helps you think through your work. The overlap is the voice interface; everything else is different.
    </p>
    {siriSections.map((s) => (
      <div key={s.title}>
        <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
        {s.body}
      </div>
    ))}
  </div>
);

const githubCopilotSections: CompetitorSection[] = [
  {
    title: "What GitHub Copilot Does Well",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        GitHub Copilot is the most widely-used AI coding tool in existence — and for good reason. Its inline code completion is fast, accurate, and context-aware based on your codebase. Copilot Chat lets you ask questions about your code directly inside VS Code, JetBrains, or other supported editors. For writing new code, understanding unfamiliar codebases, generating boilerplate, and suggesting completions mid-keystroke, Copilot is exceptional. It integrates so deeply into your editor workflow that using AI feels like a natural extension of typing.
      </p>
    ),
  },
  {
    title: "What Talk To Your Computer Adds for Developers",
    body: (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Talk To Your Computer fills gaps that Copilot doesn&apos;t cover. Copilot requires you to type — it&apos;s keyboard-driven by design. Talk To Your Computer is voice-first, so you can stay hands-free: ask questions out loud while reading a log file, explain what you&apos;re trying to accomplish while looking at a complex function, or talk through a debugging session without stopping to type.
        </p>
        <p>
          Copilot works within your editor and only sees your code. Talk To Your Computer can see your entire screen — including your terminal output, browser, design mockups, documentation, database GUI, or any other application you have open. If your bug spans multiple tools (which most interesting bugs do), Talk To Your Computer has the full picture.
        </p>
        <p>
          Copilot is best for generating and completing code. Talk To Your Computer is best for understanding, explaining, debugging, and working through problems — the messy cognitive work that happens between the moments of writing code.
        </p>
      </div>
    ),
  },
  {
    title: "They Work Well Together",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Unlike some of the other comparisons on this page, Copilot and Talk To Your Computer are genuinely complementary rather than competing. Many developers use Copilot for code generation inside their editor while using Talk To Your Computer for the broader problem-solving context — especially when jumping between terminal output, browser documentation, and their codebase. Copilot writes; Talk To Your Computer thinks out loud.
      </p>
    ),
  },
  {
    title: "Platform and Pricing",
    body: (
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        GitHub Copilot requires installation as an editor extension (VS Code, JetBrains, etc.) and a GitHub account. It&apos;s free for verified students and open-source maintainers; otherwise $10–$19/month. Talk To Your Computer runs in any browser — no extension, no install — with a free tier of 5 interactions and unlimited access at $19/month.
      </p>
    ),
  },
];

const githubCopilotContent = (
  <div className="space-y-8">
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      GitHub Copilot and Talk To Your Computer are both AI tools developers use — but they target different parts of the workflow. Copilot is your keyboard companion inside the editor. Talk To Your Computer is your voice-first thinking partner that can see everything on your screen. For most developers, the question isn&apos;t which one to choose — it&apos;s how to use both.
    </p>
    {githubCopilotSections.map((s) => (
      <div key={s.title}>
        <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
        {s.body}
      </div>
    ))}
  </div>
);

export const competitors: Competitor[] = [
  {
    slug: "superwhisper",
    name: "SuperWhisper",
    tagline: "SuperWhisper vs Talk To Your Computer",
    metaTitle: "SuperWhisper vs Talk To Your Computer — Which Is Better? (2026)",
    description:
      "SuperWhisper is a Mac voice dictation app. Talk To Your Computer is a screen-aware AI voice assistant. See how they compare and which one is right for you.",
    heroHeadline: "SuperWhisper vs Talk To Your Computer",
    heroSubheadline:
      "SuperWhisper transcribes your speech. Talk To Your Computer has a full conversation with you — and sees your screen while doing it.",
    features: [
      { feature: "Sees your screen", ttyc: true, competitor: false },
      { feature: "Voice conversations (two-way)", ttyc: true, competitor: false },
      { feature: "Works in browser (no install)", ttyc: true, competitor: false },
      { feature: "Real-time transcription", ttyc: false, competitor: true },
      { feature: "Offline mode", ttyc: false, competitor: true },
      { feature: "Free tier", ttyc: true, competitor: false },
      { feature: "Mac native app", ttyc: false, competitor: true },
    ],
    sections: superwhisperSections,
    content: superwhisperContent,
  },
  {
    slug: "wispr-flow",
    name: "Wispr Flow",
    tagline: "Wispr Flow vs Talk To Your Computer",
    metaTitle: "Wispr Flow vs Talk To Your Computer — Which Is Better? (2026)",
    description:
      "Wispr Flow is an AI voice dictation app for Mac. Talk To Your Computer is a screen-aware AI voice assistant. See how they compare.",
    heroHeadline: "Wispr Flow vs Talk To Your Computer",
    heroSubheadline:
      "Wispr Flow uses AI to polish your dictated text. Talk To Your Computer uses AI to have a real conversation with you — while seeing what's on your screen.",
    features: [
      { feature: "Sees your screen", ttyc: true, competitor: false },
      { feature: "Voice conversations (two-way)", ttyc: true, competitor: false },
      { feature: "Works in browser (no install)", ttyc: true, competitor: false },
      { feature: "AI-formatted dictation output", ttyc: false, competitor: true },
      { feature: "Cross-app text input", ttyc: false, competitor: true },
      { feature: "Free tier", ttyc: true, competitor: true },
      { feature: "Mac native app", ttyc: false, competitor: true },
    ],
    sections: wispflowSections,
    content: wispflowContent,
  },
  {
    slug: "raycast",
    name: "Raycast AI",
    tagline: "Raycast AI vs Talk To Your Computer",
    metaTitle: "Raycast AI vs Talk To Your Computer — Which Is Better? (2026)",
    description:
      "Raycast AI is a keyboard-driven Mac launcher with AI built in. Talk To Your Computer is a screen-aware AI voice assistant. See how they compare.",
    heroHeadline: "Raycast AI vs Talk To Your Computer",
    heroSubheadline:
      "Raycast AI is the best keyboard-driven AI launcher on Mac. Talk To Your Computer is the best voice assistant that can see your screen.",
    features: [
      { feature: "Sees your screen", ttyc: true, competitor: false },
      { feature: "Voice-first interface", ttyc: true, competitor: false },
      { feature: "Works in browser (no install)", ttyc: true, competitor: false },
      { feature: "Keyboard-driven AI access", ttyc: false, competitor: true },
      { feature: "Extension ecosystem", ttyc: false, competitor: true },
      { feature: "Free tier", ttyc: true, competitor: true },
      { feature: "Mac native app", ttyc: false, competitor: true },
    ],
    sections: raycastSections,
    content: raycastContent,
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    tagline: "ChatGPT vs Talk To Your Computer",
    metaTitle: "ChatGPT vs Talk To Your Computer — Which Is Better? (2026)",
    description:
      "ChatGPT is the world's most popular AI assistant. Talk To Your Computer is a screen-aware voice assistant that runs alongside your work. See how they compare.",
    heroHeadline: "ChatGPT vs Talk To Your Computer",
    heroSubheadline:
      "ChatGPT is a powerful AI you visit. Talk To Your Computer is an AI that runs alongside your work — voice-first, screen-aware, always watching.",
    features: [
      { feature: "Sees your screen", ttyc: true, competitor: true },
      { feature: "Voice-first interface", ttyc: true, competitor: false },
      { feature: "Ambient overlay (runs over other apps)", ttyc: true, competitor: false },
      { feature: "Works in browser (no install)", ttyc: true, competitor: false },
      { feature: "Continuous screen context (always on)", ttyc: true, competitor: false },
      { feature: "Free tier", ttyc: true, competitor: true },
      { feature: "Broad general knowledge", ttyc: false, competitor: true },
    ],
    sections: chatgptSections,
    content: chatgptContent,
  },
  {
    slug: "siri",
    name: "Siri",
    tagline: "Siri vs Talk To Your Computer",
    metaTitle: "Siri vs Talk To Your Computer — Which AI Assistant Is Better for Work? (2026)",
    description:
      "Siri controls your Mac. Talk To Your Computer helps you think through your work. Both are voice assistants — but for completely different jobs.",
    heroHeadline: "Siri vs Talk To Your Computer",
    heroSubheadline:
      "Siri is built into every Mac and great for system control. Talk To Your Computer is a screen-aware AI that helps you with the actual work on your screen.",
    features: [
      { feature: "Sees your screen", ttyc: true, competitor: false },
      { feature: "LLM-powered deep conversations", ttyc: true, competitor: false },
      { feature: "Explains code, documents, data", ttyc: true, competitor: false },
      { feature: "Built into macOS (no setup)", ttyc: false, competitor: true },
      { feature: "System control (open apps, reminders)", ttyc: false, competitor: true },
      { feature: "Free to use", ttyc: true, competitor: true },
      { feature: "Works on Windows & Linux", ttyc: true, competitor: false },
    ],
    sections: siriSections,
    content: siriContent,
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    tagline: "GitHub Copilot vs Talk To Your Computer",
    metaTitle: "GitHub Copilot vs Talk To Your Computer — Which Is Better for Developers? (2026)",
    description:
      "GitHub Copilot is the leading AI code completion tool. Talk To Your Computer is a voice-first screen-aware AI. For developers, they solve different problems — and work well together.",
    heroHeadline: "GitHub Copilot vs Talk To Your Computer",
    heroSubheadline:
      "GitHub Copilot writes code. Talk To Your Computer helps you think through your entire screen — terminal, browser, editor, and all — by voice.",
    features: [
      { feature: "Sees your entire screen", ttyc: true, competitor: false },
      { feature: "Voice-first interface", ttyc: true, competitor: false },
      { feature: "Works in browser (no install)", ttyc: true, competitor: false },
      { feature: "Inline code completion", ttyc: false, competitor: true },
      { feature: "Deep editor integration", ttyc: false, competitor: true },
      { feature: "Free tier", ttyc: true, competitor: true },
      { feature: "Explains terminal output, browser, all apps", ttyc: true, competitor: false },
    ],
    sections: githubCopilotSections,
    content: githubCopilotContent,
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
  return competitors.map((c) => c.slug);
}
