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
      "A compatibility layer for Japanese typography on the web: standard CSS first, a small fallback only where browsers fall short.",
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
      "A compatibility layer for Japanese typography on the web: standard CSS first, a small fallback only where browsers fall short.",
    eyebrow: "Japanese typography compatibility layer",
    headlineLead: "Japanese type,",
    headlineAccent: "quietly set right",
    lead: "Mojikumi is not another typesetting engine. It builds on web standards and fills in what is still missing — the space around punctuation, the breathing room between Japanese and Latin text.",
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
          body: "text-spacing-trim, text-autospace and the rest of the maturing platform always take precedence."
        },
        {
          index: "02",
          icon: "fallback",
          title: "Small fallback",
          body: "Only the work a browser cannot do yet is added. Your text, what readers copy and what screen readers announce stay untouched."
        },
        {
          index: "03",
          icon: "layers",
          title: "Framework ready",
          body: "Plain DOM, React, Markdown and MDX all follow the same typesetting policy."
        }
      ]
    },
    surfaces: {
      eyebrow: "One policy, several surfaces",
      title: "Adopt only the layers you need",
      body: "From a CSS-only setup to the DOM fallback, React and MDX. Nothing about your project structure has to change to get started.",
      packages: [
        { name: "mojikumi", icon: "mojikumi", description: "The all-in-one API for everyday use" },
        { name: "@mojikumi/css", icon: "css", description: "Presets built around standard CSS" },
        { name: "@mojikumi/dom", icon: "dom", description: "The DOM layer that covers browser gaps" },
        { name: "@mojikumi/react", icon: "react", description: "Component and hook" },
        { name: "@mojikumi/rehype", icon: "rehype", description: "Markdown / MDX integration" }
      ]
    },
    closing: {
      eyebrow: "See the difference",
      title: "The same passage, four ways",
      body: "Put no adjustment, YakuhanJP, standard CSS and Mojikumi side by side, then change the measure and the typeface as you read.",
      link: "Open the Playground"
    }
  },
  docs: {
    title: "Docs",
    description: "How to adopt Mojikumi, and how the packages fit together",
    eyebrow: "Documentation",
    heading: "Start small, add only what you need",
    lead: "Apply the standard CSS first, then add the DOM fallback only in the environments that need it. React and MDX follow the same rule: the text itself is never rewritten.",
    indexLabel: "On this page",
    sections: [
      {
        id: "css",
        index: "01",
        title: "Use the CSS on its own",
        navLabel: "CSS",
        body: "The CSS preset alone is a perfectly good starting point. Browsers that understand the standard properties simply use them.",
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
        body: "Runs of punctuation, line starts and line ends — the places standard CSS cannot settle yet are handled at runtime.",
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
        body: "Server rendering emits ordinary HTML; any DOM adjustment happens after mount.",
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
        body: "",
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
        "Standard CSS always comes first",
        "Never change the text, what gets copied, or what is read aloud",
        "Keep every fallback removable as native implementations catch up",
        "Never over-tighten with an unverified font"
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
      "Compare Japanese typesetting with no adjustment, YakuhanJP, standard CSS and Mojikumi",
    eyebrow: "Interactive comparison",
    heading: "Compare the same passage",
    lead: "No adjustment, YakuhanJP, standard CSS and Mojikumi, shown side by side. Switching between Auto and the fallback demo shows which part is the browser's work and which part is the compatibility layer's.",
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
      note: "Auto prefers the standard CSS a browser already supports. The fallback demo forces the result an unsupported browser would get.",
      missingSeparator: ", ",
      missing: {
        punctuation: "punctuation pairs",
        lineStart: "line start",
        lineEnd: "line end",
        autospace: "Japanese–Latin spacing"
      }
    },
    samples: {
      before: {
        title: "Unadjusted",
        note: "Reference: no punctuation adjustment"
      },
      yakuhan: {
        title: "YakuhanJP",
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
      "The YakuhanJP comparison uses the punctuation subset from Yaku Han JP v4.1.1 (© Qrac, OFL-1.1 AND MIT), served from this site."
  },
  benchmarks: {
    title: "Benchmarks",
    description: "How Mojikumi measures performance, and what will be published",
    eyebrow: "Performance & compatibility",
    heading: "Measuring speed and the size of the fallback",
    lead: "Mojikumi is designed to do less work as browser support grows. Alongside processing time, the added DOM and the cost of re-evaluation are tracked continuously.",
    status: {
      label: "Current status",
      title: "Measurement pipeline in preparation",
      body: "The measurement conditions are still being fixed. Until comparable data is available, no estimates and no single-device results will be published."
    },
    metrics: {
      eyebrow: "Metrics",
      title: "What gets measured",
      items: [
        { term: "First pass", description: "Time to analyze and adjust a body of text for the first time" },
        { term: "Re-evaluation", description: "Time to update after a resize or a font load" },
        { term: "Added DOM", description: "Number of elements the fallback introduces" },
        { term: "Memory", description: "Heap usage across long texts and multiple articles" }
      ]
    },
    matrix: {
      eyebrow: "Matrix",
      title: "The environments we hold steady",
      items: [
        { term: "Chromium", description: "Latest / macOS and Linux" },
        { term: "Firefox", description: "Latest / macOS and Linux" },
        { term: "WebKit", description: "Latest / macOS" },
        { term: "Content", description: "1k characters, 10k characters, multiple paragraphs" }
      ]
    },
    method: {
      label: "Method",
      title: "Only results you can reproduce",
      body: "The measurement code, the input text, the browser versions and the font conditions all live in the repository, and this page reflects the JSON produced under fixed conditions in CI. Device-dependent live measurements are kept separate from published results."
    }
  },
  privacy: {
    title: "Privacy",
    description: "What this site handles, and what it deliberately does not",
    eyebrow: "Privacy",
    heading: "Collecting nothing, and showing the code for it",
    lead: "This page states only what can be verified from the implementation of mojikumi.jp. Where this text and the code disagree, the code is authoritative.",
    updated: "Last updated: 30 July 2026",
    sections: [
      {
        title: "How this site is built",
        body: [
          "mojikumi.jp is a set of static files produced by Next.js static export (output: \"export\"). There are no accounts, no contact forms and no comment threads — nothing that receives information from a visitor."
        ]
      },
      {
        title: "What is stored in your browser",
        body: [
          "One localStorage entry, \"mojikumi.theme\", remembers the color theme you picked. Its value is either \"light\" or \"dark\", it is used for nothing else, and it is never transmitted. Clear it in your browser settings and the site follows your OS color scheme again.",
          "No cookies are used."
        ]
      },
      {
        title: "Analytics and advertising",
        body: [
          "There are no analytics, advertising, A/B testing or session-recording tags of any kind. The only scripts that run on load are the one that restores your theme and Mojikumi's own typesetting code."
        ]
      },
      {
        title: "Outbound requests",
        body: [
          "The body typefaces (Shippori Mincho and Zen Maru Gothic) are pulled in at build time by next/font and served from this site, so no request goes to a font provider while you read. The YakuHanJP and YakuHanMP subsets used in the Playground comparison are self-hosted the same way.",
          "As a result, ordinary browsing sends nothing to a third-party domain. Links that take you elsewhere — GitHub, npm — are governed by those services' own policies."
        ]
      },
      {
        title: "Text you type into the Playground",
        body: [
          "Anything you enter in the Playground is processed entirely inside your browser. It is never sent to a server, never stored and never logged, and it is gone when you leave the page."
        ]
      },
      {
        title: "Hosting provider logs",
        body: [
          "The site is served from Vercel. The provider may retain the access logs a web server ordinarily records, such as IP addresses and user agents. Those logs are not available to us."
        ]
      },
      {
        title: "Changes",
        body: [
          "Any change to this policy is reflected on this page and in the history of the public repository."
        ]
      }
    ]
  },
  terms: {
    title: "Terms",
    description: "License, disclaimer and third-party notices for Mojikumi",
    eyebrow: "Terms",
    heading: "The MIT License, and the limits of what is verified",
    lead: "The conditions that apply to the Mojikumi software and to this site.",
    updated: "Last updated: 30 July 2026",
    sections: [
      {
        title: "License",
        body: [
          "The Mojikumi packages and the source of this site are published under the MIT License (Copyright (c) 2026 akira). The full text is in the LICENSE file of the repository.",
          "The prose and diagrams on this site may be quoted or reproduced as long as the source is credited."
        ]
      },
      {
        title: "No warranty",
        body: [
          "As stated in the MIT License, the software is provided \"as is\", without warranty of any kind, including merchantability, fitness for a particular purpose and non-infringement. The author is not liable for any damages arising from its use."
        ]
      },
      {
        title: "Compatibility and measurements",
        body: [
          "Typesetting results depend on what a browser implements and on the punctuation metrics a font carries, such as halt and chws. As COMPATIBILITY.md and FONT-MATRIX.md in the repository state, combinations that have not been verified are marked as unverified rather than asserted.",
          "The Benchmarks page will only carry figures obtained under conditions that can be reproduced. Its contents may be updated without notice."
        ]
      },
      {
        title: "About the Playground",
        body: [
          "The Playground is a tool for inspecting typesetting differences. You are responsible for what you type into it, so please do not enter confidential material."
        ]
      },
      {
        title: "Third-party software and typefaces",
        list: [
          "Shippori Mincho, Zen Maru Gothic — SIL Open Font License 1.1",
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
          "Please use the Issues page of the GitHub repository for bug reports and questions about these terms."
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
