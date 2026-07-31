export const locales = ["ja", "en"] as const;

export type Locale = (typeof locales)[number];

export type TermDefinition = {
  term: string;
  description: string;
};

export type LegalSection = {
  title: string;
  body?: string[];
  list?: string[];
};

export type DocsSection = {
  id: string;
  index: string;
  title: string;
  navLabel: string;
  body: string;
  language: string;
  code: string;
};

export type Dictionary = {
  locale: Locale;
  localeName: string;
  localeShort: string;
  ogLocale: string;
  meta: {
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    ogAlt: string;
  };
  nav: {
    label: string;
    home: string;
    docs: string;
    playground: string;
    benchmarks: string;
    github: string;
    menu: string;
    close: string;
    settings: string;
  };
  theme: {
    label: string;
    light: string;
    dark: string;
    lightTitle: string;
    darkTitle: string;
  };
  language: {
    label: string;
    ja: string;
    en: string;
    jaTitle: string;
    enTitle: string;
  };
  home: {
    title: string;
    description: string;
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    lead: string;
    primaryAction: string;
    secondaryAction: string;
    specimenLabel: string;
    specimenText: string;
    principles: {
      eyebrow: string;
      title: string;
      items: {
        index: string;
        title: string;
        body: string;
      }[];
    };
    surfaces: {
      eyebrow: string;
      title: string;
      body: string;
      packages: {
        name: string;
        description: string;
      }[];
    };
    compare: {
      eyebrow: string;
      title: string;
      body: string;
      sampleText: string;
      beforeLabel: string;
      beforeNote: string;
      afterLabel: string;
      afterNote: string;
      link: string;
    };
    closing: {
      eyebrow: string;
      title: string;
      body: string;
      link: string;
    };
  };
  docs: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    indexLabel: string;
    codeCopy: {
      label: string;
      copied: string;
      /** Names the button for assistive technology; `{title}` takes the section. */
      action: string;
    };
    sections: DocsSection[];
    policy: {
      id: string;
      index: string;
      title: string;
      navLabel: string;
      items: string[];
    };
    nextStep: {
      label: string;
      title: string;
      link: string;
    };
  };
  playground: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    regionLabel: string;
    /** Japanese in both locales: it is the specimen the tool exists to set. */
    sampleText: string;
    controls: {
      heading: string;
      reset: string;
      text: string;
      preset: string;
      font: string;
      fontSerif: string;
      fontSans: string;
      precision: string;
      precisionAuto: string;
      precisionFull: string;
      size: string;
      sizeUnit: string;
      width: string;
      widthUnit: string;
      debug: string;
    };
    status: {
      fallbackDemo: string;
      nativeOnly: string;
      supplementing: string;
      native: string;
      note: string;
      missingSeparator: string;
      missing: {
        punctuation: string;
        lineStart: string;
        lineEnd: string;
        autospace: string;
      };
    };
    samples: {
      before: { title: string; note: string };
      yakuhan: { title: string; note: string };
      native: { title: string; note: string };
      mojikumi: {
        title: string;
        noteFallback: string;
        noteNativeOnly: string;
        noteNative: string;
      };
    };
    credit: string;
  };
  benchmarks: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    status: {
      label: string;
      title: string;
      body: string;
      link: string;
    };
    metrics: {
      eyebrow: string;
      title: string;
      items: TermDefinition[];
    };
    matrix: {
      eyebrow: string;
      title: string;
      items: TermDefinition[];
    };
    method: {
      label: string;
      title: string;
      body: string;
    };
  };
  privacy: LegalPage;
  terms: LegalPage;
  footer: {
    tagline: string;
    note: string;
    product: string;
    project: string;
    legal: string;
    npm: string;
    releases: string;
    privacy: string;
    terms: string;
    license: string;
    copyright: string;
    credit: string;
  };
};

export type LegalPage = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
};
