import React from "react";

export type ToolPage = {
  slug: string;
  name: string;
  category: string;
  metaTitle: string;
  description: string;
  headline: string;
  subheadline: string;
  whyHard: React.ReactNode;
  howTtycHelps: React.ReactNode;
  examplePrompts: string[];
  sections: { title: string; body: React.ReactNode }[];
};

export const allTools: ToolPage[] = [
  {
    slug: "davinci-resolve",
    name: "DaVinci Resolve",
    category: "Video Editing",
    metaTitle: "Learn DaVinci Resolve with AI | Talk To Your Computer",
    description:
      "Stop hunting through DaVinci Resolve menus. Share your screen, ask out loud, and get instant help with color grading, editing, and export settings.",
    headline: "Learn DaVinci Resolve with AI",
    subheadline:
      "DaVinci Resolve is one of the most powerful video editors ever made. It is also one of the hardest to learn. Talk To Your Computer sees your timeline and answers your questions in real time.",
    whyHard: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          DaVinci Resolve is not one application. It is six applications duct-taped together behind a row of page tabs at the bottom of your screen. The <strong className="text-neutral-900 dark:text-white">Cut page</strong> and the <strong className="text-neutral-900 dark:text-white">Edit page</strong> both edit video but behave differently. The <strong className="text-neutral-900 dark:text-white">Color page</strong> uses a node-based grading system that looks nothing like the layer-based approach in Premiere or Final Cut. The <strong className="text-neutral-900 dark:text-white">Fusion page</strong> is a full compositing environment with its own logic. Most beginners accidentally end up on the wrong page and cannot figure out why the tools they just used have disappeared.
        </p>
        <p>
          The inspector panel changes its contents depending on which page you are on. Timeline behaviors differ between Cut and Edit. The render settings page — Deliver — has so many codec and format options that most people just pick the first preset and hope for the best. Even basic operations like changing the timeline frame rate after you have started a project require hunting through menus that are not where you would expect them to be.
        </p>
        <p>
          YouTube tutorials help, but they are always for a different version, a different layout, or a different workflow than yours. When you are staring at your own timeline trying to figure out why your LUT is affecting every clip, you need an answer for <em>your</em> screen, not a pre-recorded walkthrough of someone else&apos;s.
        </p>
      </div>
    ),
    howTtycHelps: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Share your screen with Talk To Your Computer, open DaVinci Resolve, and just ask. The AI sees your actual timeline, your actual node graph, your actual export settings. When you say <em>&quot;why is this LUT affecting all my clips?&quot;</em> it can see that you applied it at the timeline level instead of the clip level and tell you exactly where to move it.
        </p>
        <p>
          No more pausing tutorials at 4:37, squinting at someone else&apos;s UI, and trying to find the same button in your version. The answer is about <strong className="text-neutral-900 dark:text-white">your project, your screen, right now</strong>. Ask about color nodes, ask where to find a specific render setting, ask why your audio is out of sync. Hold the mic button in the floating window, speak, get the answer, keep editing.
        </p>
      </div>
    ),
    examplePrompts: [
      "How do I apply a LUT to only one clip without it affecting my whole timeline",
      "Where is the option to change my timeline frame rate after I already started editing",
      "How do I make the audio waveform bigger so I can see it better on the timeline",
      "What is the difference between the Cut page and the Edit page and which one should I use",
      "How do I export just a section of my timeline not the whole thing",
      "How do I link audio and video clips that got separated",
    ],
    sections: [
      {
        title: "Color Grading Without a Film School Degree",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              The Color page is where DaVinci Resolve&apos;s reputation was built, and it is also where most beginners hit a wall. The node-based grading system is fundamentally different from the adjustment-layer approach you may know from Premiere or Lightroom. Each node is a processing step, and the order matters. A serial node after a parallel node produces a different result than the reverse. None of this is explained on screen.
            </p>
            <p>
              With Talk To Your Computer watching your Color page, you can ask things like <em>&quot;what does this node do?&quot;</em> or <em>&quot;why does my footage look washed out after adding this second node?&quot;</em> and get a direct answer based on your actual node tree. It turns the most intimidating page in the application into a conversation.
            </p>
          </div>
        ),
      },
      {
        title: "Exporting Without Guessing",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              The Deliver page has dozens of presets and hundreds of individual settings. H.264 or H.265? Which profile level? CBR or VBR? What data rate for YouTube? Most people choose &quot;YouTube&quot; from the preset list and accept whatever comes out, even when the file size is three times what it should be or the quality is noticeably soft.
            </p>
            <p>
              Ask Talk To Your Computer while you are on the Deliver page: <em>&quot;what settings should I use to upload this to Instagram at the best quality?&quot;</em> and get specific codec, resolution, and bitrate recommendations based on what it can see in your project settings. No more exporting three times to get it right.
            </p>
          </div>
        ),
      },
      {
        title: "The Multi-Page Workflow Explained",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Most DaVinci Resolve confusion comes from not understanding which page to use when. The Cut page is designed for fast assembly and rough cuts. The Edit page is for precise timeline work. The Fusion page handles compositing and motion graphics. The Color page is for grading. The Fairlight page is a full digital audio workstation. You do not need all of them for every project, but knowing which one to open for a specific task saves enormous time.
            </p>
            <p>
              When you are unsure, just ask: <em>&quot;I want to add text that moves across the screen — should I do this in Edit or Fusion?&quot;</em> Talk To Your Computer can see which page you are on and suggest whether to stay or switch, and explain why.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    slug: "blender",
    name: "Blender",
    category: "3D Modeling & Animation",
    metaTitle: "Learn Blender with AI | Talk To Your Computer",
    description:
      "Navigate Blender's complex interface by asking out loud. Share your screen and get real-time help with modeling, materials, rendering, and more.",
    headline: "Learn Blender with AI",
    subheadline:
      "Blender is free, wildly powerful, and famously difficult to learn. Talk To Your Computer watches your viewport and answers questions about whatever you are stuck on.",
    whyHard: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Blender&apos;s interface is <strong className="text-neutral-900 dark:text-white">context-sensitive to a degree that no other creative tool attempts</strong>. The same keyboard shortcut does different things depending on whether you are in Object Mode, Edit Mode, Sculpt Mode, Weight Paint Mode, or any of the other modes. Pressing G moves an object in Object Mode but moves individual vertices in Edit Mode. Pressing X deletes in some contexts and constrains to an axis in others. There is no consistent mapping of keys to actions, and this is by design.
        </p>
        <p>
          Then there is the <strong className="text-neutral-900 dark:text-white">modifier stack</strong>. Modifiers are non-destructive operations that stack on top of each other, and the order they are in changes the result. A Subdivision Surface above a Mirror modifier produces different geometry than the reverse. Applying a modifier bakes it permanently. Not applying it means you are working on geometry that does not visually match what the modifier shows you. The mental model is powerful once you have it, but getting there is a process of confusing failures.
        </p>
        <p>
          Materials, rendering engines (Cycles vs EEVEE vs the new EEVEE Next), UV unwrapping, rigging, physics simulations — each is essentially a sub-application with its own learning curve. And Blender&apos;s documentation, while excellent, cannot tell you what went wrong with the specific mesh you are looking at right now.
        </p>
      </div>
    ),
    howTtycHelps: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Share your screen, open Blender, and ask. When you say <em>&quot;I accidentally entered sculpt mode and I cannot get back&quot;</em>, Talk To Your Computer can see your mode dropdown and tell you exactly how to switch back. When your material is showing in the viewport but not in the render, it can look at your material nodes and spot the issue.
        </p>
        <p>
          Blender problems are almost always visual — something looks wrong on screen and you do not know why. That is exactly the kind of problem a screen-aware AI assistant is built for. <strong className="text-neutral-900 dark:text-white">You show it what you see, you describe what you expected, and it bridges the gap.</strong>
        </p>
      </div>
    ),
    examplePrompts: [
      "I accidentally entered sculpt mode and I cannot get back to where I was",
      "How do I add a material that actually shows up in the render and not just the viewport",
      "What is the difference between applying a modifier and just having it in the stack",
      "How do I parent one object to another so they move together",
      "I cannot find the render output settings to change where my render saves",
      "How do I mirror my mesh across the X axis without it being offset",
    ],
    sections: [
      {
        title: "Modes and Why Blender Feels Inconsistent at First",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Object Mode, Edit Mode, Sculpt Mode, Vertex Paint, Weight Paint, Texture Paint, Pose Mode — Blender has more modes than most applications have tools. Each mode changes what your mouse does, what your keyboard shortcuts do, and what panels are visible. The learning curve is not one curve; it is a separate curve per mode.
            </p>
            <p>
              The fastest way through this is to ask as you go. <em>&quot;I am trying to select individual faces but I can only select whole objects&quot;</em> is a common question with a simple answer — you are in Object Mode and need to switch to Edit Mode and enable Face select. But if you do not know the vocabulary, you cannot Google it effectively. Saying it out loud while your screen is shared just works.
            </p>
          </div>
        ),
      },
      {
        title: "The Modifier Stack Is Not as Scary as It Looks",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Modifiers are Blender&apos;s way of letting you do complex operations without permanently changing your mesh. A Subdivision Surface modifier smooths your geometry. A Boolean modifier cuts one shape out of another. An Array modifier duplicates your object in a pattern. They stack, and the order they are in matters — the top modifier is processed first.
            </p>
            <p>
              The confusion comes when you need to decide whether to apply a modifier or leave it live. Applying bakes the result into your mesh permanently. Leaving it live keeps your original geometry editable but means what you see in the viewport is not what you are actually editing. When you are stuck, ask: <em>&quot;should I apply this mirror modifier before I start adding detail?&quot;</em> and get guidance specific to your workflow.
            </p>
          </div>
        ),
      },
      {
        title: "Rendering Your First Scene Without Waiting 3 Hours",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Blender ships with two render engines: Cycles (physically accurate, slow) and EEVEE (real-time, fast, some visual compromises). Beginners often render with Cycles at full resolution on a CPU without realizing that switching to GPU rendering or dropping the sample count could cut their render time by 90%.
            </p>
            <p>
              If your render is taking forever, share your screen and ask: <em>&quot;how do I make this render faster without it looking terrible?&quot;</em> Talk To Your Computer can see your render settings, your sample count, whether you have GPU compute enabled, and whether your scene complexity actually requires Cycles or whether EEVEE would give you a visually identical result in a fraction of the time.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    slug: "make",
    name: "Make.com",
    category: "Automation",
    metaTitle: "Learn Make.com with AI | Talk To Your Computer",
    description:
      "Confused by Make.com scenarios, bundles, and iterators? Share your screen and ask. Get instant answers about your specific automation workflow.",
    headline: "Learn Make.com with AI",
    subheadline:
      "Make.com looks simple until it is not. When your scenario fires five times instead of once and you do not know why, Talk To Your Computer can look at your modules and explain what is happening.",
    whyHard: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Make.com&apos;s scenario builder looks deceptively simple — drag modules onto a canvas, connect them with lines, press play. But the execution model underneath is where everyone gets confused. <strong className="text-neutral-900 dark:text-white">Bundles</strong> are the core concept, and most people do not understand them until their third or fourth broken scenario. A single trigger can emit multiple bundles, and every downstream module runs once per bundle. This is why your HTTP module fires five times when you expected it to fire once.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Iterators</strong> explode arrays into individual items. <strong className="text-neutral-900 dark:text-white">Aggregators</strong> collapse items back into arrays. <strong className="text-neutral-900 dark:text-white">Routers</strong> split the flow into parallel paths. <strong className="text-neutral-900 dark:text-white">Filters</strong> conditionally block execution. These four primitives combine to handle any automation logic, but knowing which one to use when is the entire learning curve. The documentation explains each in isolation; it does not explain the specific combination your scenario needs.
        </p>
        <p>
          Error handling adds another layer. Resume, Ignore, Break, Rollback, and Commit each have different behaviors, and choosing the wrong one can silently swallow errors or halt your entire scenario. When module 4 of 8 shows a red error badge and the error message references &quot;Bundle 3 of 5&quot; — you need to understand both the error and the execution flow to fix it.
        </p>
      </div>
    ),
    howTtycHelps: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Share your screen with your Make.com scenario open and ask: <em>&quot;why is this module running five times?&quot;</em> Talk To Your Computer can see your scenario layout, the module connections, and the data flow indicators. It can explain that your trigger is emitting multiple bundles and suggest where to add an aggregator if you want the downstream modules to process everything as a single batch.
        </p>
        <p>
          Error debugging is where this really shines. Instead of copying error messages into Google and reading forum posts from 2022, you can point at your failed module and say <em>&quot;what does this error mean and how do I fix it?&quot;</em> The AI sees the error, the module configuration, and the surrounding scenario context all at once.
        </p>
      </div>
    ),
    examplePrompts: [
      "Why is my HTTP module running 5 times when I only want it to run once",
      "What is the difference between a filter and a router in Make",
      "How do I take an array from one module and process each item individually",
      "My scenario is showing an error on module 4 but I do not understand the error message",
      "How do I store data between scenario runs without using a data store",
      "How do I test just one module without running the whole scenario",
    ],
    sections: [
      {
        title: "Bundles and Items — The Core Concept Most People Miss",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              A <strong className="text-neutral-900 dark:text-white">bundle</strong> is a packet of data that flows through your scenario. When a trigger module (like &quot;Watch Rows&quot; in Google Sheets) finds 5 new rows, it emits 5 bundles. Every single module downstream runs 5 times — once per bundle. This is the single most common source of confusion in Make.com.
            </p>
            <p>
              If you want all 5 items to be processed as a group — for example, sending one email with all 5 items listed inside — you need an <strong className="text-neutral-900 dark:text-white">Array Aggregator</strong> before your email module. It collects all the bundles and outputs a single bundle containing an array. Understanding when to aggregate and when to let bundles flow individually is the key to building reliable scenarios.
            </p>
          </div>
        ),
      },
      {
        title: "Building Reliable Error Handling",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Make.com&apos;s error handling directives — Resume, Ignore, Break, Rollback, Commit — are powerful but poorly understood. <strong className="text-neutral-900 dark:text-white">Ignore</strong> silently swallows the error and continues. <strong className="text-neutral-900 dark:text-white">Resume</strong> provides a fallback output and continues. <strong className="text-neutral-900 dark:text-white">Break</strong> stops the current execution and stores the bundle for retry. Choosing the wrong one means either lost data or an inbox full of failed execution notifications.
            </p>
            <p>
              When you are not sure which handler to use, share your scenario and ask. Describe what should happen when a module fails — should the scenario keep going, retry later, or alert you? The right answer depends on your specific workflow, and having AI look at your scenario structure makes the recommendation specific rather than generic.
            </p>
          </div>
        ),
      },
      {
        title: "When to Use Routers vs Filters vs Iterators",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              A <strong className="text-neutral-900 dark:text-white">Router</strong> splits your scenario into parallel paths — every bundle goes down every path (unless filtered). A <strong className="text-neutral-900 dark:text-white">Filter</strong> sits between two modules and blocks bundles that do not match a condition. An <strong className="text-neutral-900 dark:text-white">Iterator</strong> takes an array inside a bundle and emits one bundle per array item.
            </p>
            <p>
              People confuse routers with if/else logic. A router is not if/else — it is &quot;and also.&quot; If you add filters to router paths, then it becomes conditional. But without filters, every path runs for every bundle. If your scenario is doing something unexpected, this distinction is usually the reason. Ask while looking at your scenario and get an answer that references your specific module layout.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    slug: "after-effects",
    name: "Adobe After Effects",
    category: "Motion Graphics",
    metaTitle: "Learn After Effects with AI | Talk To Your Computer",
    description:
      "Struggling with After Effects precomps, track mattes, or expressions? Share your screen and ask. Get real-time answers about your actual composition.",
    headline: "Learn After Effects with AI",
    subheadline:
      "After Effects is the industry standard for motion graphics and visual effects. It is also where most people learn what the word 'precomp' means the hard way.",
    whyHard: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          After Effects has a layer-based compositing model that seems straightforward until you need to combine layers in specific ways. <strong className="text-neutral-900 dark:text-white">Track mattes</strong> — alpha matte, luma matte, inverted alpha, inverted luma — are one of the most powerful features and one of the most confusing. The matte layer needs to be directly above the target layer, it needs to be the right type, and the layer order matters. When it does not work, your layer just disappears and you have no idea why.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Precomposing</strong> is another concept that trips people up. Sometimes you need to precomp to isolate effects. Sometimes precomping breaks your animation because transform properties now operate in a different coordinate space. Knowing when to precomp and when not to is experience that takes months to build — or one question to ask.
        </p>
        <p>
          Then there are <strong className="text-neutral-900 dark:text-white">expressions</strong>. After Effects has a JavaScript-based expression language that can automate animations, link properties, and create procedural motion. But the documentation assumes you already know JavaScript, and the expression editor gives you a blinking cursor in a tiny text field with error messages that say things like &quot;Object of type CannotCallWithoutExpression is not supported.&quot;
        </p>
      </div>
    ),
    howTtycHelps: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Share your After Effects composition and ask: <em>&quot;my track matte is not working and I cannot figure out why the layer is just disappearing.&quot;</em> Talk To Your Computer can see your layer stack, the matte assignment, and the layer order. It might spot that your matte layer is below your target layer, or that you have an inverted alpha matte when you need a regular alpha matte.
        </p>
        <p>
          For expressions, you can say <em>&quot;how do I make this loop without duplicating the keyframes?&quot;</em> and get the exact expression — <code>loopOut(&quot;cycle&quot;)</code> — along with where to apply it. No JavaScript knowledge required. The AI writes the expression, you paste it in, it works.
        </p>
      </div>
    ),
    examplePrompts: [
      "My track matte is not working and I cannot figure out why the layer is just disappearing",
      "How do I loop an animation without duplicating the keyframes manually",
      "What is the difference between a precomp and a null object for organizing my composition",
      "How do I make text animate on one letter at a time",
      "My render is taking forever and I do not know which setting to change to make it faster",
      "How do I sync my animation to a specific beat in the audio",
    ],
    sections: [
      {
        title: "Precomposing — When It Helps and When It Creates More Problems",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Precomposing wraps one or more layers into a nested composition. This is useful when you want to apply an effect to a group of layers, isolate a section of your timeline, or keep your project organized. But precomping changes the coordinate space — a layer that was at position (500, 300) in your main comp is now at a different position inside the precomp, and any position-based animation may shift.
            </p>
            <p>
              The rule of thumb: precomp when you need to treat multiple layers as one unit. Do not precomp just to organize — use folders and labels instead. If you have already precomped and your animation broke, ask Talk To Your Computer to look at your composition hierarchy and explain what happened.
            </p>
          </div>
        ),
      },
      {
        title: "Expressions Without Learning to Code",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              You do not need to learn JavaScript to use After Effects expressions. You need to know about five expressions: <code>loopOut()</code>, <code>wiggle()</code>, <code>linear()</code>, <code>time</code>, and pick-whipping (linking one property to another). These five cover 80% of what people use expressions for — looping animations, adding organic randomness, remapping values, animating based on time, and linking properties together.
            </p>
            <p>
              When you need an expression, just describe what you want in plain English: <em>&quot;I want this layer to slowly rotate forever without keyframes.&quot;</em> Talk To Your Computer gives you the expression and tells you which property to apply it to. You Alt-click the stopwatch, paste, done.
            </p>
          </div>
        ),
      },
      {
        title: "Rendering Faster Without Sacrificing Quality",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              After Effects renders on CPU by default, which is slow. The Render Queue gives you control over output modules and formats, but the settings are dense. Many people do not realize they can render to an intermediate codec (like ProRes or DNxHR) much faster and then use Adobe Media Encoder to transcode to H.264 for delivery — a two-step workflow that is faster than rendering directly to H.264.
            </p>
            <p>
              If your render is slow, share your screen on the Render Queue panel and ask <em>&quot;how do I make this render faster?&quot;</em> The AI can check your output settings, resolution, and codec selection and suggest specific changes. It might notice you are rendering at full resolution when your delivery is 1080p, or that you have a computationally expensive effect that could be pre-rendered.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    slug: "notion",
    name: "Notion",
    category: "Productivity",
    metaTitle: "Learn Notion with AI | Talk To Your Computer",
    description:
      "Confused by Notion databases, relations, and rollups? Share your screen and ask. Get instant help building views, formulas, and templates.",
    headline: "Learn Notion with AI",
    subheadline:
      "Notion can be a second brain or a second headache. The difference is understanding databases, relations, and views — which is exactly what most people get stuck on.",
    whyHard: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Notion looks like a note-taking app but behaves like a database application wearing a note-taking costume. The fundamental confusion starts with the difference between a <strong className="text-neutral-900 dark:text-white">page</strong> and a <strong className="text-neutral-900 dark:text-white">database entry</strong>. Pages live freely in your workspace. Database entries live inside databases and have properties. When people try to use Notion like a note app, they create pages. When they realize they need structure, they convert to databases. Then they discover that a database page and a regular page behave differently and the frustration begins.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Relations</strong> link entries between databases — connect a task to a project, a project to a client. <strong className="text-neutral-900 dark:text-white">Rollups</strong> pull data from related entries — show the total hours logged across all tasks in a project. These two features are what make Notion powerful for project management, but the setup is unintuitive. You have to create the relation property first, then configure the rollup to reference a specific property through that relation. Most people give up before they get it working.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Formulas</strong> broke for many people when Notion switched from the old syntax to the new formula 2.0 syntax. Properties that were referenced by name in quotes now use a different syntax. If you rename a property, old formulas may break silently. And the formula editor gives minimal error feedback — you get a red underline and no explanation.
        </p>
      </div>
    ),
    howTtycHelps: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Share your Notion workspace and ask: <em>&quot;how do I create a relation between these two databases?&quot;</em> Talk To Your Computer sees your actual database properties and can walk you through adding the relation and configuring the rollup step by step. No generic tutorial — specific guidance for your specific databases.
        </p>
        <p>
          Formula debugging is especially effective. Say <em>&quot;my formula stopped working after I renamed a property&quot;</em> and the AI can see your formula, spot the broken reference, and tell you exactly what to change. It is faster than re-reading the formula documentation and trying to figure out what &quot;Syntax error at position 34&quot; means.
        </p>
      </div>
    ),
    examplePrompts: [
      "How do I create a relation between two databases so I can see related items in both",
      "My formula stopped working after I renamed a property how do I fix it",
      "What is the difference between a linked database view and duplicating the database",
      "How do I make a template button that automatically sets a date to today",
      "How do I filter a view so it only shows my own tasks not everyone elses",
      "How do I create a gallery view that shows the cover image from each page",
    ],
    sections: [
      {
        title: "Databases vs Pages — The Mental Model That Makes Notion Click",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Everything in Notion is a block. A page is a block. A database is a block that contains pages with structured properties. Once this clicks, Notion makes sense. A database is not a spreadsheet — it is a collection of pages that share a schema. Each &quot;row&quot; is actually a full page with a title, properties, and its own content area.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Inline databases</strong> live inside a page. <strong className="text-neutral-900 dark:text-white">Full-page databases</strong> are their own top-level page. <strong className="text-neutral-900 dark:text-white">Linked database views</strong> are filtered windows into an existing database — they do not duplicate data, they just show a different view of it. Understanding which one you need for your use case avoids the most common Notion mess: duplicate data scattered across pages that slowly fall out of sync.
            </p>
          </div>
        ),
      },
      {
        title: "Relations and Rollups Without the Frustration",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              A <strong className="text-neutral-900 dark:text-white">relation</strong> is a property type that links entries between two databases. Create a &quot;Project&quot; relation on your Tasks database and you can assign each task to a project. The project page then shows all related tasks automatically. This is the foundation of every useful Notion workspace.
            </p>
            <p>
              A <strong className="text-neutral-900 dark:text-white">rollup</strong> goes one step further — it reaches through a relation and pulls data from the related entries. If each task has an &quot;Hours&quot; property, a rollup on the Project database can sum all hours across related tasks. The setup is: create the relation first, then add a rollup that references the relation and specifies which property to aggregate and how (sum, average, count, etc.). Ask Talk To Your Computer to guide you through this while looking at your actual databases.
            </p>
          </div>
        ),
      },
      {
        title: "Building Views That Actually Save You Time",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              A Notion database can be viewed as a table, board, calendar, timeline, gallery, or list. Each view can have its own filters, sorts, and visible properties. Most people create one view and try to make it work for everything. The power move is creating multiple views of the same database — a board view filtered to your tasks, a calendar view for deadlines, a table view for everything.
            </p>
            <p>
              Filters are where most people make mistakes. A filter that says &quot;Created by is me&quot; works differently than &quot;Assigned to contains me.&quot; If your view is not showing what you expect, share your screen and ask. The AI can see your filter configuration and spot whether the logic is wrong or the property reference is off.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    slug: "excel",
    name: "Microsoft Excel",
    category: "Data Analysis",
    metaTitle: "Learn Advanced Excel with AI | Talk To Your Computer",
    description:
      "VLOOKUP returning #N/A? Formulas breaking when copied? Share your screen and ask. Get real-time help with formulas, pivot tables, and Power Query.",
    headline: "Learn Advanced Excel with AI",
    subheadline:
      "Basic Excel is easy. Advanced Excel — VLOOKUP, pivot tables, Power Query, dynamic arrays — is where spreadsheets become powerful and formulas start breaking in ways that make no sense.",
    whyHard: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          The single most confusing concept in Excel is <strong className="text-neutral-900 dark:text-white">absolute vs relative cell references</strong>. When you write <code>=A1*B1</code> and copy it down, the references shift — A1 becomes A2, B1 becomes B2. This is usually what you want. But when you copy it sideways, B1 becomes C1, and if column C is not what you intended, your formula is silently wrong. Adding dollar signs (<code>$A$1</code>, <code>A$1</code>, <code>$A1</code>) locks row, column, or both — and getting this wrong produces results that look plausible but are incorrect. You can stare at a spreadsheet for an hour before realizing the formula in cell J47 is referencing the wrong column because you forgot a single dollar sign.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">VLOOKUP</strong> is the function everyone learns and then fights with. It returns #N/A when the lookup value has a trailing space, when the data types do not match (text vs number), when the lookup column is not the leftmost column, or when the range is not sorted and you forgot to set the last argument to FALSE. Each of these produces the same error with no indication of which one is the cause.
        </p>
        <p>
          <strong className="text-neutral-900 dark:text-white">Power Query</strong> is Excel&apos;s data transformation engine and it is genuinely powerful — merge tables, unpivot data, clean text, combine files from a folder. But it uses its own M language, its own editor, and its own refresh logic. Most Excel users do not know it exists, and those who find it are intimidated by the formula bar showing code like <code>Table.TransformColumnTypes(Source, &#123;&#123;&quot;Date&quot;, type date&#125;&#125;)</code>.
        </p>
      </div>
    ),
    howTtycHelps: (
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Share your spreadsheet and ask: <em>&quot;why does my VLOOKUP return #N/A when I can clearly see the value in the column?&quot;</em> Talk To Your Computer can see your formula, your data, and the lookup range. It might spot that your lookup value is formatted as text while the column contains numbers — a classic invisible mismatch that produces #N/A every time.
        </p>
        <p>
          For formula building, just describe what you want: <em>&quot;I want to sum all sales from column D where the region in column A is East.&quot;</em> You get the exact SUMIF formula back, with the right references for your actual data layout. No more Googling &quot;SUMIF syntax&quot; and translating a generic example to your spreadsheet.
        </p>
      </div>
    ),
    examplePrompts: [
      "Why does my VLOOKUP return NA when I can clearly see the value in the column",
      "How do I make a formula that does not change the column reference when I copy it sideways",
      "What is the difference between XLOOKUP and VLOOKUP and should I switch",
      "How do I create a pivot table that automatically updates when I add new rows",
      "How do I use Power Query to combine multiple sheets into one table",
      "My array formula is not working the same way in the new version of Excel",
    ],
    sections: [
      {
        title: "Why Copy-Pasting Formulas Breaks Everything (And How to Fix It)",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Every cell reference in Excel is either relative, absolute, or mixed. <code>A1</code> is relative — it shifts when copied. <code>$A$1</code> is absolute — it stays put. <code>$A1</code> locks the column but lets the row shift. <code>A$1</code> locks the row but lets the column shift. Getting this wrong is the number one cause of spreadsheet errors that look correct but produce wrong numbers.
            </p>
            <p>
              The fix is understanding <em>why</em> you need each type. Referencing a tax rate in a single cell? Use <code>$A$1</code>. Building a multiplication table where rows and columns both matter? Use <code>$A1 * A$1</code>. If you are not sure, share your screen and ask: <em>&quot;I am copying this formula down and the result is wrong in row 10.&quot;</em> The AI can see exactly which reference is shifting when it should not be.
            </p>
          </div>
        ),
      },
      {
        title: "VLOOKUP Is Fine But Here Is What the Pros Use Instead",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              VLOOKUP has a fundamental limitation: it can only look to the right. If your lookup value is in column C and the data you want is in column A, VLOOKUP cannot do it. <strong className="text-neutral-900 dark:text-white">INDEX/MATCH</strong> solves this — MATCH finds the row, INDEX returns the value from any column. It is faster on large datasets and more flexible.
            </p>
            <p>
              If you have Microsoft 365, <strong className="text-neutral-900 dark:text-white">XLOOKUP</strong> is the modern replacement. It looks in any direction, returns errors gracefully, and has a cleaner syntax. But if you share workbooks with people on older Excel versions, XLOOKUP will show as an error on their machines. Ask Talk To Your Computer which one to use for your specific situation — it depends on your Excel version and who else uses your files.
            </p>
          </div>
        ),
      },
      {
        title: "Power Query — The Feature That Makes Excel Actually Powerful",
        body: (
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Power Query is a data import and transformation tool built into Excel (Data tab → Get Data). It can pull data from files, databases, web pages, and APIs. It can merge tables, remove duplicates, split columns, unpivot data, and handle dozens of transformation steps — all recorded as repeatable queries that refresh with one click.
            </p>
            <p>
              The learning curve is the M language that Power Query generates under the hood. You do not need to write M code — the visual editor handles most operations. But when you need to do something the visual editor does not support, you end up in the Advanced Editor staring at unfamiliar syntax. Ask Talk To Your Computer while you have the Power Query editor open: <em>&quot;how do I combine all the sheets in this workbook into one table?&quot;</em> and get step-by-step guidance for your specific data.
            </p>
          </div>
        ),
      },
    ],
  },
];

export function getAllToolSlugs(): string[] {
  return allTools.map((t) => t.slug);
}

export function getTool(slug: string): ToolPage | undefined {
  return allTools.find((t) => t.slug === slug);
}
