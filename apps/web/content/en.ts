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
    start: "Get started",
    docs: "Docs",
    playground: "Playground",
    benchmarks: "Benchmarks",
    github: "GitHub",
    menu: "Menu",
    close: "Close",
    settings: "Display settings"
  },
  codeCopy: {
    label: "Copy",
    copied: "Copied",
    action: "Copy the code for {title}"
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
    primaryAction: "Put it on your own site",
    secondaryAction: "Try it in the Playground",
    specimenLabel: "TYPE SAMPLE / 01",
    specimenText:
      "『美しい本文』は、文字そのものだけでなく、文字と文字のあいだに宿ります。",
    principles: {
      eyebrow: "Principles",
      title: "Standards first, a gentle hand second",
      items: [
        {
          index: "01",
          title: "CSS first",
          body: "Where a browser supports text-spacing-trim and text-autospace, that implementation is what runs. No extra script executes."
        },
        {
          index: "02",
          title: "Small fallback",
          body: "Only the work a browser cannot do yet gets added. The text itself is never touched, so what readers copy and what screen readers announce stay exactly as written."
        },
        {
          index: "03",
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
        { name: "mojikumi", description: "The all-in-one API for everyday use" },
        { name: "@mojikumi/css", description: "Presets built around standard CSS" },
        { name: "@mojikumi/dom", description: "The DOM layer that covers browser gaps" },
        { name: "@mojikumi/react", description: "Component and hook" },
        { name: "@mojikumi/rehype", description: "Markdown / MDX integration" }
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
  start: {
    title: "Get started",
    description: "How to put Mojikumi on the site you already have",
    eyebrow: "Getting started",
    heading: "One tag is the whole installation",
    lead: "There is no build step to set up. If your site lets you paste code into its settings, your body copy will be set differently in about five minutes. If you do not like it, delete what you pasted and the page is exactly as it was.",
    indexLabel: "On this page",
    choose: {
      eyebrow: "Choose",
      title: "Where can you paste code?",
      body: "Where the code goes changes which screen you open and how you check the result. Pick the service you use. If it is not here, the closest one will get you there.",
      pending:
        "Each set of instructions is written against the standard theme for that service. On a theme you have changed, the class around your body text may differ; the step on changing scope shows how to find the name your own site uses. Services where we cannot yet confirm that injected code reaches the body text, such as Wix and STUDIO, are not listed."
    },
    steps: {
      requirements: "What you need",
      time: "Time",
      access: "Access",
      open: "Where to go",
      paste: "The code to paste",
      verify: "Check that it worked",
      scope: "Change what it applies to",
      revert: "Undo it",
      trouble: "Common problems here"
    },
    guides: [
      {
        id: "html",
        index: "01",
        navLabel: "You can edit HTML",
        title: "Sites where you can edit the HTML",
        summary:
          "For anywhere you can open the template files: your own site, a static site generator, or a CMS whose theme you can edit.",
        time: "5 minutes",
        access: "Permission to edit template files",
        open: "Open the HTML that every page loads. Usually that is the shared template containing the head tag: individual HTML files on a static site, or the header template if your site has a theme.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-style="article"
></script>`,
        verify: "Open an article and find a place where two brackets meet, or a comma runs into one. Where that gap has closed up, it is working. If you cannot tell by eye, your browser's inspector will show a class of mjk on the body element.",
        scope: "Left alone, Mojikumi looks through the containers it knows until it finds your body text. If you know which element holds it, name it in data-target. That is also the fix when navigation or the footer changes along with the article.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".post-body"
  data-style="book"
></script>`,
        revert: "Delete the few lines you pasted. Mojikumi only ever adds elements and classes for display; your text was never rewritten, so nothing is left in what you have saved.",
        trouble: [
          "Pasted at the end of the body, the stylesheet arrives after the article has been painted once, and on a narrow screen the text shifts as it lands. In the head, nothing moves.",
          "It loads on pages other than articles, which is fine: only the body element is ever touched, so there is no need to load it conditionally."
        ]
      },
      {
        id: "wordpress",
        index: "02",
        navLabel: "WordPress",
        title: "WordPress",
        summary:
          "Adds the tag to your header without editing theme files, so it survives a theme update.",
        time: "5 minutes",
        access: "Admin rights to install a plugin",
        open: "Install a snippet plugin such as WPCode or Code Snippets and register the tag as header output. If you run a child theme, writing it into header.php just before wp_head does the same thing.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content, .wp-block-post-content"
  data-style="article"
></script>`,
        verify: "Open a post to check. The admin bar can stay where it is: neither it nor the block editor is ever touched.",
        scope: "Which class wraps your body text depends on the theme. The code above names the two you meet most often, one from classic themes and one from block themes. If nothing changes, inspect a post and use the class you actually find. Selectors are comma separated, so you can name as many as you need. To reach the excerpts on a post list or an archive as well, add the class they use. The third one below is Cocoon's excerpt class, and differs from theme to theme too. On a page where none of the ones you named is found, Mojikumi does nothing.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content, .wp-block-post-content, .entry-card-snippet"
  data-style="article"
></script>`,
        revert: "Disable or delete the snippet. Your posts were never rewritten, so nothing is left in the stored content.",
        trouble: [
          "The block editor does not show the result. Check a published post instead.",
          "With a caching plugin, the change may not appear straight away. Clear the cache and look again.",
          "If posts change but post lists and archives do not, data-target is not reaching anything on those pages. Add the class the excerpts use."
        ]
      },
      {
        id: "shopify",
        index: "03",
        navLabel: "Shopify",
        title: "Shopify",
        summary:
          "Edits the theme so the tag loads on every page. It applies to blog posts and product descriptions alike.",
        time: "5 minutes",
        access: "Admin rights to edit the theme",
        open: "From Online Store, open your theme and choose Edit code. Open theme.liquid in the layout folder, paste the tag just before the closing head tag, and save.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-template__content, .rte"
  data-style="article"
></script>`,
        verify: "Open a published blog post. The theme preview works for this too.",
        scope: "The code above uses the class names from standard themes such as Dawn. To narrow it to articles, or widen it to product descriptions, inspect the page you care about and use the class you find.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-template__content"
  data-style="article"
></script>`,
        revert: "Delete the line from theme.liquid and save. Duplicating the theme before you edit gives you a way back at any point.",
        trouble: [
          "A theme update can drop your edit. Repeat the steps afterwards.",
          "Checkout is not affected, because Shopify does not load theme code there."
        ]
      },
      {
        id: "webflow",
        index: "04",
        navLabel: "Webflow",
        title: "Webflow",
        summary:
          "Goes in the project's custom code, and applies to the Japanese inside rich text elements.",
        time: "5 minutes",
        access: "Rights to publish the project, on a paid site plan",
        open: "Open Custom code in Project settings, paste the tag into Head code, and save. It only reaches the site once you publish again.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".w-richtext"
  data-style="article"
></script>`,
        verify: "Check on the published site. Custom code does not run inside the editor's preview.",
        scope: "Rich text elements carry the w-richtext class. To limit it to a class of your own, name that one instead.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-body"
  data-style="article"
></script>`,
        revert: "Remove the line from Head code and publish again.",
        trouble: [
          "Projects without a paid site plan never emit custom code to the published site.",
          "Saving is not enough on its own. Publish for the change to appear."
        ]
      },
      {
        id: "squarespace",
        index: "05",
        navLabel: "Squarespace",
        title: "Squarespace",
        summary:
          "Goes in the site-wide code injection, which is a feature of the higher plans.",
        time: "5 minutes",
        access: "Rights to change site settings, on a Business plan or above",
        open: "Open Code Injection in the settings and paste the tag into the Header field. Use the site-wide setting rather than the per-page one.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".sqs-html-content"
  data-style="article"
></script>`,
        verify: "Check on a published page. In edit mode the editing chrome sits over the text, so look at the ordinary view.",
        scope: "Text blocks put their content inside the sqs-html-content class. To limit it to blog posts, inspect a post and use the class you find there.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".blog-item-content"
  data-style="article"
></script>`,
        revert: "Clear the field and save.",
        trouble: [
          "The lower plans have no field for injected code.",
          "The preview in edit mode may not show the result."
        ]
      },
      {
        id: "ghost",
        index: "06",
        navLabel: "Ghost",
        title: "Ghost",
        summary:
          "Goes in the site-wide code injection. There is no need to touch the theme.",
        time: "5 minutes",
        access: "Admin rights to change site settings",
        open: "Open Code injection from Settings and paste the tag into Site header, then save.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".gh-content, .post-content"
  data-style="article"
></script>`,
        verify: "Open a published post to check. The editor itself is never affected.",
        scope: "Most themes wrap the body in gh-content. On a theme of your own, inspect a post and use the class you find there.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".post-content"
  data-style="book"
></script>`,
        revert: "Clear the field and save.",
        trouble: [
          "Themes differ in what they call the body element. If nothing changes, check data-target.",
          "Posts delivered by email are not affected; this is only for pages shown in a browser."
        ]
      },
      {
        id: "custom-code",
        index: "07",
        navLabel: "Anything else",
        title: "Services not listed here",
        summary:
          "Any other service works the same way, as long as its settings let you paste code.",
        time: "5 minutes",
        access: "Admin rights over the site settings",
        open: "Find the field your service uses for injected code. It is usually called custom code, code injection, or something about the header, and it lives in the settings for the whole site. Choose the site-wide field rather than a per-page one.",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-style="article"
></script>`,
        verify: "Check on a published article rather than in the editor's preview, where the editing chrome is mixed into the page and can change what you see.",
        scope: "Every service names its body container differently. On a published article, inspect the body text and give data-target the class of the element wrapping all of it.",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-body"
  data-style="article"
></script>`,
        revert: "Clear the field and save. Nothing was written into your articles, so you can move to another approach whenever you like.",
        trouble: [
          "If the editor itself starts looking different, your service loads the same code into its editing screen. Narrow data-target to the body element only.",
          "If saving changes nothing, the service may still be serving a cached page. Wait, or clear the cache from its settings."
        ]
      }
    ],
    trouble: {
      id: "trouble",
      index: "08",
      title: "When it does not work",
      navLabel: "When it does not work",
      body: "Symptoms that come up whatever you are running. The explanations behind them are in the docs.",
      items: [
        {
          term: "Nothing changed",
          description:
            "Most likely data-target does not match your body element. Check in the inspector whether that element has a class of mjk. If it does not, the selector is wrong. If it does and the page still looks the same, your browser is already doing this work itself."
        },
        {
          term: "Too much changed",
          description:
            "If navigation or the footer moved too, narrow data-target to the body element. To leave one passage out, mark that element with data-no-mojikumi."
        },
        {
          term: "The editor looks wrong",
          description:
            "Admin bars and block editors are skipped, but a service with its own arrangement can slip through. Narrowing data-target to the body element settles it."
        },
        {
          term: "The page feels slower",
          description:
            "There is one file to load, just under 6KB compressed. Where the browser can do the work itself, nothing touches your text at all. If you would rather it never did, set data-precision to native."
        }
      ]
    },
    nextStep: {
      label: "Next step",
      title: "Try it on your own writing",
      link: "Open the Playground"
    }
  },
  docs: {
    title: "Docs",
    description: "How to adopt Mojikumi, and how the packages fit together",
    eyebrow: "Documentation",
    heading: "Start small, add only what you need",
    lead: "Start with one script tag, or with the CSS preset, then add the DOM fallback only where it is still needed. React and MDX follow the same steps, and the rule never changes: the text itself is left alone.",
    indexLabel: "On this page",
    sections: [
      {
        id: "script",
        index: "01",
        title: "Use it from a script tag",
        navLabel: "Script tag",
        language: "HTML",
        body: "On a site with no build step, one script is the whole installation. The stylesheet travels inside the bundle, so there is a single file to load, the tag carries its own settings, and articles that arrive after load are picked up on their own.",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content"
  data-style="article"
></script>`,
        table: {
          head: ["Attribute", "Default", "What it does"],
          rows: [
            ["data-target", "auto", "Selector for the body text; auto looks through the containers it knows"],
            ["data-style", "article", "article, book, or headline"],
            ["data-precision", "auto", "native, auto, or full"],
            ["data-exclude", "none", "Extra selectors to leave alone, comma separated"],
            ["data-css", "true", "Whether to load the bundled stylesheet"],
            ["data-auto", "true", "Set to false and nothing happens until Mojikumi.start() is called"]
          ]
        }
      },
      {
        id: "css",
        index: "02",
        title: "Use the CSS on its own",
        navLabel: "CSS",
        language: "TSX",
        body: "Import the CSS preset, put a class on your body copy, and you are done. Browsers that understand the standard properties start closing up punctuation right away. No build step, no JavaScript. Four presets ship with it, book, web, editorial and minimal, differing in how tightly they set.",
        code: `import "mojikumi/css";

<article lang="ja" className="mjk mjk-book">
  <p>『Webの日本語』を端正にする</p>
</article>`
      },
      {
        id: "dom",
        index: "03",
        title: "Add the DOM fallback",
        navLabel: "DOM",
        language: "TypeScript",
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
        index: "04",
        title: "Use it with React",
        navLabel: "React",
        language: "TSX",
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
        id: "astro",
        index: "05",
        title: "Use it with Astro",
        navLabel: "Astro",
        language: "Astro",
        body: "Astro ships static HTML, so the call goes in a component's script tag: the stylesheet in the frontmatter, the DOM layer on the client. Where a view transition swaps the document, call it again on astro:page-load.",
        code: `---
import "mojikumi/css";
---

<article class="article" lang="ja"><slot /></article>

<script>
  import { mojikumi } from "mojikumi";
  mojikumi(".article", { preset: "book" });
</script>`
      },
      {
        id: "vue",
        index: "06",
        title: "Use it with Vue / Nuxt",
        navLabel: "Vue / Nuxt",
        language: "Vue",
        body: "onMounted only runs in the browser, so what Nuxt renders on the server is your markup untouched. Destroy the instance as the component goes, and nothing it generated outlives it.",
        code: `<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createMojikumi } from "mojikumi";

const root = ref(null);
let instance;

onMounted(() => {
  instance = createMojikumi({ preset: "book" }).mount(root.value);
});

onBeforeUnmount(() => instance?.destroy());
</script>

<template>
  <article ref="root" lang="ja"><slot /></article>
</template>`
      },
      {
        id: "svelte",
        index: "07",
        title: "Use it with SvelteKit",
        navLabel: "SvelteKit",
        language: "Svelte",
        body: "An $effect runs in the browser only, leaving the server-rendered output alone. The function it returns is the teardown, so the instance is destroyed with the component.",
        code: `<script>
  import { createMojikumi } from "mojikumi";

  let root;

  $effect(() => {
    const instance = createMojikumi({ preset: "book" }).mount(root);
    return () => instance.destroy();
  });
</script>

<article bind:this={root} lang="ja"><slot /></article>`
      },
      {
        id: "mdx",
        index: "08",
        title: "Use it with Markdown / MDX",
        navLabel: "Markdown / MDX",
        language: "TypeScript",
        body: "Registered as a rehype plugin, the preset applies to the body of every article. The Markdown source stays as written, so authors never have to think about typesetting. Code blocks and math are left out, so runs of symbols are never disturbed.",
        code: `import rehypeMojikumi from "@mojikumi/rehype";

export default {
  rehypePlugins: [
    [rehypeMojikumi, { preset: "editorial" }]
  ]
};`
      },
      {
        id: "presets",
        index: "09",
        title: "Choosing a preset",
        navLabel: "Presets",
        body: "A preset is a set of adjustments taken together. Choose web if you are unsure. Take book where the page should read like a printed one, editorial where headings should break on phrase boundaries, and minimal to close up runs of punctuation and nothing else. Native uses only what the browser provides and never runs the fallback.",
        table: {
          head: ["Adjustment", "web", "book", "editorial", "minimal", "native"],
          rows: [
            ["Runs of punctuation", "○", "○", "○", "○", "○"],
            ["Line starts", "○", "○", "○", "—", "○"],
            ["Line ends", "Conditional", "○", "○", "—", "○"],
            ["Japanese with Latin", "○", "○", "—", "—", "○"],
            ["Paragraph indent", "—", "1em", "—", "—", "—"],
            ["Heading phrase breaks", "—", "—", "○", "—", "—"],
            ["JavaScript fallback", "○", "○", "○", "○", "—"]
          ]
        }
      },
      {
        id: "precision",
        index: "10",
        title: "Deferring to the browser",
        navLabel: "precision",
        body: "Precision decides how far the standard CSS is trusted before the DOM layer steps in. On auto, Mojikumi measures whether the browser is actually closing up punctuation before deciding, because some implementations accept the syntax and change nothing on screen. That is a measurement, not a support table.",
        table: {
          head: ["Value", "Behavior", "When to use it"],
          rows: [
            ["native", "Standard CSS only", "When no extra JavaScript is wanted"],
            ["auto", "Supplies only what is missing", "Almost always the right answer"],
            ["full", "Always runs the fallback", "Testing, or comparing implementations"]
          ]
        }
      },
      {
        id: "scope",
        index: "11",
        title: "Changing what it applies to",
        navLabel: "Scope",
        language: "HTML",
        body: "Code, form controls, anything being edited, SVG and MathML are left out without being asked. To exclude a particular passage, mark it with data-no-mojikumi. To exclude a set of them, pass selectors through exclude or data-exclude.",
        code: `<span data-no-mojikumi>console.log("日本語")</span>`,
        list: [
          "Excluded by default: script, style, code, pre, kbd, samp, textarea, input, select, option, contenteditable, svg, math",
          "Any element marked data-no-mojikumi, and everything inside it",
          "Any selector added through data-exclude or exclude"
        ]
      },
      {
        id: "api",
        index: "12",
        title: "Driving it from code",
        navLabel: "API",
        language: "JavaScript",
        body: "Loaded from a script tag, Mojikumi is available as a global. Set data-auto to false and the timing is yours to choose. From npm, the mojikumi package exposes the same behavior through its mojikumi function.",
        code: `Mojikumi.start({ target: ".article", style: "book" });
Mojikumi.refresh();
Mojikumi.stop();`,
        table: {
          head: ["Function", "What it does"],
          rows: [
            ["start(options)", "Applies Mojikumi, and keeps applying it to articles added later"],
            ["refresh()", "Measures line starts and line ends again"],
            ["stop()", "Removes the generated elements, the classes and the stylesheet"]
          ]
        }
      },
      {
        id: "version",
        index: "13",
        title: "Pinning a version",
        navLabel: "Pinning",
        language: "HTML",
        body: "What sits behind /v1/ is replaced whenever a fix ships. That is how a pasted tag receives improvements without being pasted again, and it also means our changes reach your site directly. To decide that timing yourself, use the URL with a version in it. Those files are never rewritten, so they are cached for a year.",
        code: `<script
  src="https://cdn.mojikumi.jp/{version}/mojikumi.min.js"
  data-target=".entry-content"
  data-style="article"
></script>`,
        list: [
          "The current release is {version}",
          "A pinned URL never updates, so moving to a new release means editing the tag",
          "To check that the file itself has not been swapped, generate a hash from it and add an integrity attribute"
        ]
      },
      {
        id: "self-host",
        index: "14",
        title: "Serving it yourself",
        navLabel: "Self-hosting",
        language: "HTML",
        body: "If you would rather not use the CDN, the npm package carries the same file. Copy node_modules/mojikumi/dist/mojikumi.browser.js somewhere your site serves it from and point src at that path. Nothing else changes.",
        code: `<script src="/assets/mojikumi.min.js" data-style="article"></script>`
      },
      {
        id: "uninstall",
        index: "15",
        title: "Taking it back out",
        navLabel: "Removing it",
        body: "Delete the script tag, or call stop(), and the page returns to how it was. Because the text is never rewritten, removing Mojikumi leaves nothing behind to clean up.",
        list: [
          "Generated elements and classes are removed, and changed attributes are put back",
          "The text was never altered, so nothing lingers in what you have saved",
          "If the script fails to load at all, the article still reads"
        ]
      }
    ],
    policy: {
      id: "policy",
      index: "16",
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
    sampleText:
      "『日本語組版処理の要件（JLREQ）』は、行頭に置く始め括弧類の扱いに、ひとつの正解を定めていません。「改行行頭の字下げは全角アキ、折返し行頭は天付きとする」。これがJIS X 4051の採用した方式で、岩波書店の組版もこれにならいます〈W3C技術ノート（2012年）、3.1.5〉。\n\nもうひとつの方式を採るのが、文芸書の版元（講談社、新潮社、文藝春秋、中央公論新社、筑摩書房）です。「改行行頭の字下げは二分アキ、折返し行頭は天付きとする」。会話の多い小説では「『またあした』」のように括弧が入れ子で重なる行が続き、行頭が下がりすぎるという判断からでした。\n\n和文と欧文のあいだにも決まりがあります。「欧字・アラビア数字の前後に配置される平仮名、片仮名又は漢字等との字間は、四分アキとする」（同3.2.6）。〈補足（注記）〉や『引用（「孫引き」を含む）』のように約物が三重に重なる箇所、そしてHTMLやCSS、2026年のような表記が混ざる箇所ほど、この差は効いてきます。",
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
  notFound: {
    eyebrow: "Error / 404",
    headlineLead: "No page carries",
    headlineAccent: "this number",
    lead: "The address may have changed, or the page may not be written yet. The table of contents below is the way back.",
    nombreLabel: "Nombre",
    runningHead: "Mojikumi",
    linksLabel: "Contents",
    links: [
      { index: "01", page: "start", label: "Put it on your own site" },
      { index: "02", page: "docs", label: "Read the documentation" },
      { index: "03", page: "playground", label: "Try it in the Playground" },
      { index: "04", page: "home", label: "Back to the home page" }
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
