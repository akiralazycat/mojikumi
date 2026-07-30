import type { Dictionary } from "./types";

export const ja: Dictionary = {
  locale: "ja",
  localeName: "日本語",
  localeShort: "JA",
  ogLocale: "ja_JP",
  meta: {
    defaultTitle: "Mojikumi — Webの日本語を端正にする",
    titleTemplate: "%s — Mojikumi",
    description:
      "標準CSSを優先し、ブラウザに足りない部分だけを補う、日本語字組みの互換レイヤー。",
    ogAlt: "Mojikumi — Webの日本語を端正にする"
  },
  nav: {
    label: "メインナビゲーション",
    home: "Mojikumi ホーム",
    docs: "Docs",
    playground: "Playground",
    benchmarks: "Benchmarks",
    github: "GitHub",
    menu: "メニュー",
    close: "閉じる",
    settings: "表示設定"
  },
  theme: {
    label: "カラーテーマ",
    light: "明",
    dark: "暗",
    lightTitle: "ライトテーマ",
    darkTitle: "ダークテーマ"
  },
  language: {
    label: "言語",
    ja: "JA",
    en: "EN",
    jaTitle: "日本語で読む",
    enTitle: "Read in English"
  },
  home: {
    title: "Mojikumi — Webの日本語を端正にする",
    description:
      "標準CSSを優先し、ブラウザに足りない部分だけを補う、日本語字組みの互換レイヤー。",
    eyebrow: "Japanese typography compatibility layer",
    headlineLead: "Webの日本語を",
    headlineAccent: "端正にする",
    lead: "Mojikumiは独自の組版エンジンではありません。Web標準を土台に、約物のアキや和欧文間の間隔など、まだ揃わない部分を静かに補います。",
    primaryAction: "Playgroundで比較する",
    secondaryAction: "導入方法を見る",
    specimenLabel: "TYPE SAMPLE / 01",
    specimenText:
      "『美しい本文』は、文字そのものだけでなく、文字と文字のあいだに宿ります。",
    principles: {
      eyebrow: "Principles",
      title: "標準を活かす穏やかな補完",
      items: [
        {
          index: "01",
          icon: "standards",
          title: "CSS first",
          body: "text-spacing-trimやtext-autospaceなど、育ちつつあるWeb標準を最優先します。"
        },
        {
          index: "02",
          icon: "fallback",
          title: "Small fallback",
          body: "ブラウザに足りない処理だけを補い、本文・コピー結果・読み上げ内容を守ります。"
        },
        {
          index: "03",
          icon: "layers",
          title: "Framework ready",
          body: "素のDOM、React、Markdown / MDXへ、同じ字組み方針を持ち込めます。"
        }
      ]
    },
    surfaces: {
      eyebrow: "One policy, several surfaces",
      title: "使う場所に合わせて必要な層だけ",
      body: "CSSだけの導入から、DOMフォールバック、React、MDXまで。プロジェクトの構成を大きく変えずに始められます。",
      packages: [
        { name: "mojikumi", icon: "mojikumi", description: "通常利用向けの統合API" },
        { name: "@mojikumi/css", icon: "css", description: "標準CSS中心のプリセット" },
        { name: "@mojikumi/dom", icon: "dom", description: "ブラウザ差を補うDOM層" },
        { name: "@mojikumi/react", icon: "react", description: "ComponentとHook" },
        { name: "@mojikumi/rehype", icon: "rehype", description: "Markdown / MDX連携" }
      ]
    },
    closing: {
      eyebrow: "See the difference",
      title: "同じ文章で違いを確かめる",
      body: "約物調整なし、YakuhanJP、標準CSS、Mojikumiの4つを並べて、行幅やフォントを変えながら比較できます。",
      link: "Playgroundを開く"
    }
  },
  docs: {
    title: "Docs",
    description: "Mojikumiの導入方法とパッケージ構成",
    eyebrow: "Documentation",
    heading: "小さく導入し必要な分だけ補う",
    lead: "まず標準CSSを適用し、必要な環境でだけDOMフォールバックを追加します。ReactやMDXでも、本文を変更しない方針は共通です。",
    indexLabel: "このページ",
    sections: [
      {
        id: "css",
        index: "01",
        title: "CSSだけで使う",
        navLabel: "CSS",
        body: "最初はCSSプリセットだけで構いません。標準CSSを理解するブラウザは、その機能をそのまま使います。",
        code: `import "mojikumi/css";

<article lang="ja" className="mjk mjk-book">
  <p>『Webの日本語』を端正にする</p>
</article>`
      },
      {
        id: "dom",
        index: "02",
        title: "DOMフォールバックを追加する",
        navLabel: "DOM",
        body: "約物の連続や行頭・行末など、標準CSSだけでは揃わない箇所を実行時に補います。",
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
        title: "Reactで使う",
        navLabel: "React",
        body: "SSRでは通常のHTMLを出力し、必要なDOM補完はマウント後に行います。",
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
        title: "Markdown / MDXで使う",
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
      title: "設計方針",
      navLabel: "設計方針",
      items: [
        "標準CSSを最優先する",
        "本文の文字列、コピー結果、読み上げ内容を変えない",
        "ネイティブ実装の進展に合わせてフォールバックを削除できるようにする",
        "未知のフォントでは過度に詰めない"
      ]
    },
    nextStep: {
      label: "次のステップ",
      title: "実際の文章で見比べる",
      link: "Playgroundへ"
    }
  },
  playground: {
    title: "Playground",
    description: "未調整、YakuhanJP、標準CSS、Mojikumiの日本語字組みを比較します",
    eyebrow: "Interactive comparison",
    heading: "同じ文章で字組みを比べる",
    lead: "約物調整なし、YakuhanJP、標準CSS、Mojikumiを並べて表示します。AutoとFallback demoを切り替えると、標準実装と互換補完の役割も確認できます。",
    regionLabel: "Mojikumi比較ツール",
    controls: {
      heading: "組版設定",
      reset: "初期値に戻す",
      text: "テキスト",
      preset: "プリセット",
      font: "フォント",
      fontSerif: "明朝",
      fontSans: "ゴシック",
      precision: "補完モード",
      precisionAuto: "Auto",
      precisionFull: "Fallback",
      size: "文字サイズ",
      sizeUnit: "px",
      width: "行幅",
      widthUnit: "em",
      debug: "約物クラスと調整位置を表示"
    },
    status: {
      fallbackDemo: "DOMフォールバックを再現中",
      nativeOnly: "Nativeプリセット：標準CSSのみ",
      supplementing: "不足機能を補完中：",
      native: "このブラウザでは標準CSSを使用中",
      note: "Autoは対応済みの標準CSSを優先します。Fallback demoでは、未対応ブラウザ向けの補完結果を強制表示します。",
      missingSeparator: "・",
      missing: {
        punctuation: "約物間",
        lineStart: "行頭",
        lineEnd: "行末",
        autospace: "和欧文間"
      }
    },
    samples: {
      before: {
        title: "Unadjusted",
        note: "比較用：約物調整なし"
      },
      yakuhan: {
        title: "YakuhanJP",
        note: "約物を半角字形に置き換える従来手法"
      },
      native: {
        title: "Native CSS",
        note: "現在のブラウザの標準実装"
      },
      mojikumi: {
        title: "Mojikumi",
        noteFallback: "標準CSS ＋ DOM補完",
        noteNativeOnly: "標準CSSのみ",
        noteNative: "標準CSSをそのまま使用"
      }
    },
    credit:
      "YakuhanJPの比較には、Yaku Han JP v4.1.1（© Qrac、OFL-1.1 AND MIT）の約物サブセットを自己ホストして使用しています。"
  },
  benchmarks: {
    title: "Benchmarks",
    description: "Mojikumiの性能計測方針と公開予定の指標",
    eyebrow: "Performance & compatibility",
    heading: "速さと補完の小ささを測る",
    lead: "Mojikumiは、ブラウザ標準が育つほど仕事を減らせる設計です。処理時間とともに、追加DOM量や再評価コストも継続的に記録します。",
    status: {
      label: "Current status",
      title: "Measurement pipeline in preparation",
      body: "現在は計測条件を固定している段階です。比較可能なデータが揃うまで、推測値や単一端末の結果は公開しません。"
    },
    metrics: {
      eyebrow: "Metrics",
      title: "測定するもの",
      items: [
        { term: "初期処理", description: "本文を初めて解析・補完するまでの時間" },
        { term: "再評価", description: "リサイズやフォント読み込み後の更新時間" },
        { term: "DOM増加量", description: "補完によって追加される要素数" },
        { term: "メモリ", description: "長文・複数記事でのヒープ使用量" }
      ]
    },
    matrix: {
      eyebrow: "Matrix",
      title: "揃える環境",
      items: [
        { term: "Chromium", description: "最新版 / macOS・Linux" },
        { term: "Firefox", description: "最新版 / macOS・Linux" },
        { term: "WebKit", description: "最新版 / macOS" },
        { term: "Content", description: "1千字・1万字・複数段落" }
      ]
    },
    method: {
      label: "Method",
      title: "再現できる結果だけを公開する",
      body: "計測コード、入力テキスト、ブラウザバージョン、フォント条件をリポジトリに残し、CI上の固定条件で得たJSONをこのページへ反映します。端末依存のライブ計測は、正式結果と分けて扱います。"
    }
  },
  privacy: {
    title: "プライバシー",
    description: "Mojikumiのサイトが扱うデータと、扱わないデータについて",
    eyebrow: "Privacy",
    heading: "集めないことを実装で示す",
    lead: "このページは、mojikumi.jpの実装から確認できる事実だけを記載しています。記述と実装が食い違う場合は、実装のほうが正です。",
    updated: "最終更新：2026年7月30日",
    sections: [
      {
        title: "このサイトの構成",
        body: [
          "mojikumi.jpは、Next.jsの静的エクスポート（output: \"export\"）で生成した静的ファイルだけで構成されています。アカウント、問い合わせフォーム、コメント欄など、利用者から情報を受け取る仕組みはありません。"
        ]
      },
      {
        title: "ブラウザに保存するもの",
        body: [
          "保存するのは、選択したカラーテーマを覚えるためのlocalStorageの項目「mojikumi.theme」ひとつだけです。値は「light」または「dark」で、次回以降の表示に使うほかには利用せず、外部へ送信しません。ブラウザの設定から削除すれば、以降はOSの配色設定に従います。",
          "Cookieは使用していません。"
        ]
      },
      {
        title: "アクセス解析・広告",
        body: [
          "アクセス解析、広告、A/Bテスト、ヒートマップなどのタグやSDKは組み込んでいません。ページの読み込み時に実行されるスクリプトは、テーマの復元とMojikumi自身の字組み処理だけです。"
        ]
      },
      {
        title: "外部へのリクエスト",
        body: [
          "本文用のWebフォント（Shippori Mincho、Zen Maru Gothic）はnext/fontによってビルド時に取り込み、このサイトから配信しています。閲覧時にフォント配信元へリクエストは発生しません。Playgroundの比較で使うYakuHanJP・YakuHanMPも同じく自己ホストしています。",
          "そのため、通常の閲覧で外部ドメインへ送られる情報はありません。ページ内のリンクから移動した先（GitHub、npmなど）では、それぞれの事業者のポリシーが適用されます。"
        ]
      },
      {
        title: "Playgroundに入力したテキスト",
        body: [
          "Playgroundの入力欄に書いた文章は、ブラウザの中だけで処理されます。サーバーへ送信することも、保存・記録することもありません。ページを離れると残りません。"
        ]
      },
      {
        title: "ホスティング事業者のログ",
        body: [
          "このサイトはVercel上で配信しています。IPアドレスやUser-Agentなど、Webサーバーが通常記録する範囲のアクセスログが事業者側で保持される場合があります。これは当方が閲覧・利用できるものではありません。"
        ]
      },
      {
        title: "変更",
        body: [
          "内容を変更した場合は、このページと、公開リポジトリの更新履歴に残します。"
        ]
      }
    ]
  },
  terms: {
    title: "利用規約",
    description: "Mojikumiのライセンス、免責、第三者ソフトウェアの表記",
    eyebrow: "Terms",
    heading: "MITライセンスと、検証済みの範囲",
    lead: "Mojikumiのソフトウェアと、このサイトの利用条件をまとめています。",
    updated: "最終更新：2026年7月30日",
    sections: [
      {
        title: "ライセンス",
        body: [
          "Mojikumiの各パッケージとこのサイトのソースコードは、MIT License（Copyright (c) 2026 akira）で公開しています。全文はリポジトリのLICENSEファイルを参照してください。",
          "サイトに掲載している文章と図版は、出典を示していただければ引用・紹介に利用できます。"
        ]
      },
      {
        title: "無保証",
        body: [
          "MIT Licenseの定めのとおり、ソフトウェアは現状のまま提供され、商品性、特定目的への適合性、権利非侵害を含むいかなる保証もありません。利用によって生じた損害について、作者は責任を負いません。"
        ]
      },
      {
        title: "互換性と計測値の扱い",
        body: [
          "字組みの結果は、ブラウザの実装状況とフォントが持つ約物メトリクス（haltやchwsなど）によって変わります。リポジトリのCOMPATIBILITY.mdとFONT-MATRIX.mdに記載のとおり、検証が済んでいない組み合わせは「未検証」として扱い、推測で断定しません。",
          "Benchmarksページの数値は、再現手順を公開できる条件で得られたものだけを掲載します。記載内容は予告なく更新されます。"
        ]
      },
      {
        title: "Playgroundについて",
        body: [
          "Playgroundは字組みの違いを確認するための検証用ツールです。入力する内容についての責任は利用者にあります。機密情報の入力は避けてください。"
        ]
      },
      {
        title: "第三者ソフトウェアと書体",
        list: [
          "Shippori Mincho、Zen Maru Gothic — SIL Open Font License 1.1",
          "Yaku Han JP v4.1.1（YakuHanJP / YakuHanMP）© Qrac — OFL-1.1 AND MIT",
          "Next.js、React — MIT License"
        ],
        body: [
          "Yaku Han JPは、Playgroundで従来手法の比較対象として使用しています。ライセンス全文はサイト内の/fonts/YakuHanJP-LICENSE.txtに同梱しています。"
        ]
      },
      {
        title: "連絡先",
        body: [
          "不具合の報告や規約についてのお問い合わせは、GitHubリポジトリのIssuesへお願いします。"
        ]
      }
    ]
  },
  footer: {
    tagline: "Webの日本語を端正にする",
    note: "JLREQ × CSS Text",
    product: "Product",
    project: "Project",
    legal: "Legal",
    npm: "npm",
    releases: "Releases",
    privacy: "プライバシー",
    terms: "利用規約",
    license: "MIT License",
    copyright: "© 2026 Mojikumi",
    credit: "Designed by Akira Manabe"
  }
};
