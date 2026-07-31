import type { Dictionary } from "./types";

export const en: Dictionary = {
  locale: "en",
  localeName: "English",
  localeShort: "EN",
  ogLocale: "en_US",
  meta: {
    defaultTitle: "Mojikumi — Japanese typography, quietly set right",
    titleTemplate: "%s — Mojikumi",
    description:
      "The space around brackets and punctuation, the gap where Japanese meets Latin text. Mojikumi settles what browsers cannot yet, on top of standard CSS.",
    ogAlt: "Mojikumi — Japanese typography, quietly set right"
  },
  nav: {
    label: "Main navigation",
    home: "Mojikumi home",
    docs: "Docs",
    playground: "Playground",
    benchmarks: "Benchmarks",
    github: "GitHub",
    menu: "Menu",
    close: "Close",
    settings: "Display settings"
  },
  theme: {
    label: "Color theme",
    light: "明",
    dark: "暗",
    lightTitle: "Light theme",
    darkTitle: "Dark theme"
  },
  language: {
    label: "Language",
    ja: "JA",
    en: "EN",
    jaTitle: "日本語で読む",
    enTitle: "Read in English"
  },
  home: {
    title: "Mojikumi — Japanese typography, quietly set right",
    description:
      "The space around brackets and punctuation, the gap where Japanese meets Latin text. Mojikumi settles what browsers cannot yet, on top of standard CSS.",
    eyebrow: "Japanese typography compatibility layer",
    headlineLead: "Japanese type,",
    headlineAccent: "quietly set right",
    lead: "The gaping space around brackets and punctuation, the cramped join where Japanese meets Latin text. Mojikumi settles what browsers cannot yet, building on standard CSS. Your readers will never notice the work, only that the page sits right.",
    primaryAction: "Compare in the Playground",
    secondaryAction: "Read the docs",
    specimenLabel: "TYPE SAMPLE / 01",
    specimenText:
      "『美しい本文』は、文字そのものだけでなく、文字と文字のあいだに宿ります。",
    principles: {
      eyebrow: "Principles",
      title: "Standards first, a gentle hand second",
      items: [
        {
          index: "01",
          icon: "standards",
          title: "CSS first",
          body: "Where a browser supports text-spacing-trim and text-autospace, that implementation is what runs. No extra script executes."
        },
        {
          index: "02",
          icon: "fallback",
          title: "Small fallback",
          body: "Only the work a browser cannot do yet gets added. The text itself is never touched, so what readers copy and what screen readers announce stay exactly as written."
        },
        {
          index: "03",
          icon: "layers",
          title: "Framework ready",
          body: "Plain HTML, React, Markdown. One typesetting policy carries across all of them unchanged."
        }
      ]
    },
    surfaces: {
      eyebrow: "One policy, several surfaces",
      title: "Adopt only the layers you need",
      body: "Start with a single CSS import, then add the DOM layer, React or MDX support as you need them. At no point does your project structure have to be rearranged.",
      packages: [
        { name: "mojikumi", icon: "mojikumi", description: "The all-in-one API for everyday use" },
        { name: "@mojikumi/css", icon: "css", description: "Presets built around standard CSS" },
        { name: "@mojikumi/dom", icon: "dom", description: "The DOM layer that covers browser gaps" },
        { name: "@mojikumi/react", icon: "react", description: "Component and hook" },
        { name: "@mojikumi/rehype", icon: "rehype", description: "Markdown / MDX integration" }
      ]
    },
    compare: {
      eyebrow: "Before / After",
      title: "Half a character wide, and the page reads differently",
      body: "The same passage, set once without punctuation adjustment and once with Mojikumi. Watch the half-character of space around the brackets and punctuation close up, the unevenness go out of the setting, and more of the text fit on each line.",
      sampleText:
        "『日本語組版処理の要件（JLREQ）』は、行末に置いた終わり括弧類や句読点について「その後ろを原則として二分アキとする」と定めたうえで、行の調整処理で詰めてベタ組にしてもよい、と述べています〈W3C技術ノート、2012年、3.1.9〉。約物が連続する箇所、たとえば「『引用』」や〈補足（注記）〉でアキを重ねないのも、同じ体裁上の判断です。",
      beforeLabel: "Unadjusted",
      beforeNote: "Adjacent brackets keep both halves of the space built into their glyphs.",
      afterLabel: "Mojikumi",
      afterNote: "Half a character of that space closes up, while a little breathing room opens between Japanese and Latin.",
      link: "Try more in the Playground"
    },
    closing: {
      eyebrow: "See the difference",
      title: "The same passage, four ways",
      body: "Put no adjustment, YakuHanJP, standard CSS and Mojikumi side by side, then change the measure, the size and the typeface as you read. Paste in your own copy if you like.",
      link: "Open the Playground"
    }
  },
  docs: {
    title: "Docs",
    description: "How to adopt Mojikumi, and how the packages fit together",
    eyebrow: "Documentation",
    heading: "Start small, add only what you need",
    lead: "Apply the standard CSS first, then add the DOM fallback only where it is still needed. React and MDX follow the same steps, and the rule never changes: the text itself is left alone.",
    indexLabel: "On this page",
    sections: [
      {
        id: "css",
        index: "01",
        title: "Use the CSS on its own",
        navLabel: "CSS",
        body: "Import the CSS preset, put a class on your body copy, and you are done. Browsers that understand the standard properties start closing up punctuation right away. No build step, no JavaScript. Four presets ship with it, book, web, editorial and minimal, differing in how tightly they set.",
        code: `import "mojikumi/css";

<article lang="ja" className="mjk mjk-book">
  <p>『Webの日本語』を端正にする</p>
</article>`
      },
      {
        id: "dom",
        index: "02",
        title: "Add the DOM fallback",
        navLabel: "DOM",
        body: "When browsers without the standard properties should see the same page, add the DOM layer. Runs of punctuation, a bracket landing at the start or end of a line: the positions CSS cannot settle are measured and corrected at runtime. Leave precision on auto and nothing runs where support already exists.",
        code: `import "mojikumi/css";
import { mojikumi } from "mojikumi";

const instance = mojikumi(".article", {
  preset: "book",
  precision: "auto"
});`
      },
      {
        id: "react",
        index: "03",
        title: "Use it with React",
        navLabel: "React",
        body: "The server emits ordinary HTML, and any adjustment happens once it reaches the browser. There is a component to wrap with and a hook to attach to an element you already render, so nothing about your layout has to move.",
        code: `import { Mojikumi } from "@mojikumi/react";

export function Article({ children }) {
  return (
    <Mojikumi as="article" preset="book">
      {children}
    </Mojikumi>
  );
}`
      },
      {
        id: "mdx",
        index: "04",
        title: "Use it with Markdown / MDX",
        navLabel: "Markdown / MDX",
        body: "Registered as a rehype plugin, the preset applies to the body of every article. The Markdown source stays as written, so authors never have to think about typesetting. Code blocks and math are left out, so runs of symbols are never disturbed.",
        code: `import rehypeMojikumi from "@mojikumi/rehype";

export default {
  rehypePlugins: [
    [rehypeMojikumi, { preset: "editorial" }]
  ]
};`
      }
    ],
    policy: {
      id: "policy",
      index: "05",
      title: "Design policy",
      navLabel: "Design policy",
      items: [
        "Standard CSS runs first, and where a browser supports it that is the whole story",
        "The text is never rewritten, so what gets copied and what is read aloud stay as written",
        "As native support grows, the amount of code that loads shrinks on its own",
        "Where a font carries no punctuation metrics, nothing is tightened by guesswork"
      ]
    },
    nextStep: {
      label: "Next step",
      title: "See it on real sentences",
      link: "To the Playground"
    }
  },
  playground: {
    title: "Playground",
    description:
      "Compare Japanese typesetting with no adjustment, YakuHanJP, standard CSS and Mojikumi",
    eyebrow: "Interactive comparison",
    heading: "Compare the same passage",
    lead: "No adjustment, YakuHanJP, standard CSS and Mojikumi, all set from the same text. Change the size, the measure and the typeface to see exactly what moves and where. Whatever you type stays inside your browser.",
    regionLabel: "Mojikumi comparison tool",
    controls: {
      heading: "Settings",
      reset: "Reset",
      text: "Text",
      preset: "Preset",
      font: "Typeface",
      fontSerif: "Mincho",
      fontSans: "Gothic",
      precision: "Mode",
      precisionAuto: "Auto",
      precisionFull: "Fallback",
      size: "Text size",
      sizeUnit: "px",
      width: "Measure",
      widthUnit: "em",
      debug: "Show punctuation classes and adjustments"
    },
    status: {
      fallbackDemo: "Replaying the DOM fallback",
      nativeOnly: "Native preset: standard CSS only",
      supplementing: "Filling in what is missing: ",
      native: "This browser is using standard CSS",
      note: "Auto prefers whatever standard CSS the browser you are using already supports. Switch to Fallback and it forces the result an unsupported browser would show you instead.",
      missingSeparator: ", ",
      missing: {
        punctuation: "punctuation pairs",
        lineStart: "line start",
        lineEnd: "line end",
        autospace: "Japanese and Latin spacing"
      }
    },
    samples: {
      before: {
        title: "Unadjusted",
        note: "Reference: no punctuation adjustment"
      },
      yakuhan: {
        title: "YakuHanJP",
        note: "The long-standing approach: swap in half-width punctuation glyphs"
      },
      native: {
        title: "Native CSS",
        note: "What this browser implements today"
      },
      mojikumi: {
        title: "Mojikumi",
        noteFallback: "Standard CSS + DOM fallback",
        noteNativeOnly: "Standard CSS only",
        noteNative: "Standard CSS, used as is"
      }
    },
    credit:
      "The YakuHanJP comparison uses the punctuation subset from Yaku Han JP v4.1.1 (© Qrac, OFL-1.1 AND MIT), served from this site. The running text behind it is Noto Sans JP, the face that subset was cut from."
  },
  benchmarks: {
    title: "Benchmarks",
    description: "How Mojikumi measures performance, and what will be published",
    eyebrow: "Performance & compatibility",
    heading: "Measuring speed and the size of the fallback",
    lead: "Mojikumi is built to do less work as browser support grows. Alongside processing time, the number of elements the fallback adds and the cost of setting the text again are tracked continuously.",
    status: {
      label: "Current status",
      title: "The measurement setup is being prepared",
      body: "The work right now is pinning down conditions that produce the same numbers every run. Results move with the device and the browser version, so nothing is published until those conditions can be written down. In the meantime, the speed and the look of it can be checked directly in the Playground.",
      link: "Check it in the Playground"
    },
    metrics: {
      eyebrow: "Metrics",
      title: "What gets measured",
      items: [
        {
          term: "First pass",
          description: "Time to analyze a body of text and finish placing the spacing"
        },
        {
          term: "Re-evaluation",
          description: "Time to set the text again after a resize or once a font loads"
        },
        {
          term: "Added DOM",
          description: "How many elements the fallback introduces. The fewer, the more standard CSS already covers"
        },
        {
          term: "Memory",
          description: "Heap usage across long texts and several articles open at once"
        }
      ]
    },
    matrix: {
      eyebrow: "Matrix",
      title: "The environments we hold steady",
      items: [
        { term: "Chromium", description: "Latest / macOS and Linux" },
        { term: "Firefox", description: "Latest / macOS and Linux" },
        { term: "WebKit", description: "Latest / macOS" },
        { term: "Content", description: "Three shapes: 1k characters, 10k characters, many paragraphs" }
      ]
    },
    method: {
      label: "Method",
      title: "Only results you can reproduce",
      body: "The measurement code, the input text, the browser versions and the font conditions all live in the repository. Follow the same steps and you should land close to the same numbers. This page carries only what CI produced under fixed conditions; live measurements taken on the spot depend on the state of the machine, so they are kept separate."
    }
  },
  privacy: {
    title: "Privacy Policy",
    description: "How mojikumi.jp handles information",
    eyebrow: "Privacy",
    heading: "Privacy Policy",
    lead: "mojikumi.jp has no mechanism for identifying visitors or tracking what they do. There is no analytics, no advertising, no contact form and no account system, and nothing entered into the Playground is sent to a server. This policy sets out in detail what the site handles and what it does not.",
    updated: "Last updated: 30 July 2026",
    sections: [
      {
        title: "How the site is built",
        body: [
          "mojikumi.jp is a set of static files produced by Next.js static export (output: \"export\"). No server-side code runs when you open a page, and there is no endpoint that takes in what you do.",
          "There are no accounts, no contact forms, no comment threads and no newsletter sign-ups. Nothing on the site is built to receive information from a visitor."
        ]
      },
      {
        title: "What is stored in your browser",
        body: [
          "One localStorage entry, \"mojikumi.theme\", remembers the color theme you picked. Its value is either \"light\" or \"dark\", it decides nothing but the colors on your next visit, and it is never transmitted anywhere.",
          "You can clear that entry from your browser settings at any time. Once it is gone, the site follows your operating system's color scheme again.",
          "No cookies are used. With no login and no session to keep, there is nothing for one to do."
        ]
      },
      {
        title: "Analytics and advertising",
        body: [
          "There are no analytics, advertising, A/B testing, heatmap or session-recording tags of any kind. No count is kept of who visited which page.",
          "The only scripts that run on load are the one that restores your chosen theme and Mojikumi's own typesetting code. Both finish inside your browser."
        ]
      },
      {
        title: "Outbound requests",
        body: [
          "The body typefaces (Shippori Mincho and Zen Maru Gothic) are pulled in at build time by next/font and served from this site, so no request reaches a font provider while you read. The YakuHanJP, YakuHanMP and Noto Sans JP faces used in the Playground comparison are self-hosted the same way.",
          "As a result, ordinary browsing sends nothing to a third-party domain. Links that take you elsewhere, such as GitHub and npm, are governed by those services' own policies."
        ]
      },
      {
        title: "Text entered in the Playground",
        body: [
          "Anything you enter in the Playground is processed entirely inside your browser. It is never sent to a server, never stored and never logged, and nothing of it remains once you leave the page.",
          "That said, the usual care applies on a shared machine or while screen sharing. Please do not paste confidential material into it."
        ]
      },
      {
        title: "Hosting provider logs",
        body: [
          "The site is served from Vercel. The provider may retain the access logs a web server ordinarily records, such as IP addresses and user agents.",
          "These are an unavoidable part of serving the site, and they are not something we can read or make use of."
        ]
      },
      {
        title: "Changes to this policy, and how to verify it",
        body: [
          "Any change to this policy is recorded both on this page and in the history of the public repository.",
          "Everything stated here can be checked against the site's source. If this text and the code ever disagree, treat the code as the truth, and please open an issue so the wording can be corrected."
        ]
      }
    ]
  },
  terms: {
    title: "Terms",
    description: "License, disclaimer and third-party notices for Mojikumi",
    eyebrow: "Terms",
    heading: "Terms of Use",
    lead: "These terms set out the conditions that apply to the Mojikumi packages and to this site. The software is published under the MIT License, and within its terms you are free to use it for any purpose, commercial or otherwise.",
    updated: "Last updated: 30 July 2026",
    sections: [
      {
        title: "License",
        body: [
          "The Mojikumi packages and the source of this site are published under the MIT License (Copyright (c) 2026 akira). Commercial use, modification and redistribution are all permitted. The full text is in the LICENSE file of the repository.",
          "The prose and diagrams on this site may be quoted or reproduced as long as the source is credited."
        ]
      },
      {
        title: "Disclaimer",
        body: [
          "As stated in the MIT License, the software is provided \"as is\", without warranty of any kind, including merchantability, fitness for a particular purpose and non-infringement. The author is not liable for any damages arising from its use.",
          "Before relying on it somewhere that matters, please confirm how it renders in the environment you actually ship to."
        ]
      },
      {
        title: "Conditions that affect the result",
        body: [
          "With identical settings, the typesetting still shifts with what a browser implements and with the punctuation metrics a font carries, such as halt and chws. Mojikumi tightens only where the combination has been confirmed, and leaves fonts it cannot judge alone.",
          "Which combinations count as confirmed is recorded in COMPATIBILITY.md and FONT-MATRIX.md in the repository. Figures on the Benchmarks page are limited to those whose procedure can be published. Both may be updated without notice."
        ]
      },
      {
        title: "About the Playground",
        body: [
          "The Playground is a tool for inspecting typesetting differences. What you type stays inside your browser, but you remain responsible for what you enter, so please do not use confidential material."
        ]
      },
      {
        title: "Third-party software and typefaces",
        list: [
          "Shippori Mincho, Zen Maru Gothic, Noto Sans JP — SIL Open Font License 1.1",
          "Yaku Han JP v4.1.1 (YakuHanJP / YakuHanMP) © Qrac — OFL-1.1 AND MIT",
          "Next.js, React — MIT License"
        ],
        body: [
          "Yaku Han JP is used in the Playground as the point of comparison for the font-substitution approach. Its full license text is served at /fonts/YakuHanJP-LICENSE.txt."
        ]
      },
      {
        title: "Contact",
        body: [
          "Bug reports, questions about these terms and examples of typesetting that looks wrong are all welcome in the Issues page of the GitHub repository. A reproducible sentence and your browser details are a great help."
        ]
      }
    ]
  },
  footer: {
    tagline: "Japanese on the web, quietly set right",
    note: "JLREQ × CSS Text",
    product: "Product",
    project: "Project",
    legal: "Legal",
    npm: "npm",
    releases: "Releases",
    privacy: "Privacy",
    terms: "Terms",
    license: "MIT License",
    copyright: "© 2026 Mojikumi",
    credit: "Designed by Akira Manabe"
  }
};
