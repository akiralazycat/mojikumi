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
      "括弧や句読点まわりのアキ、和文と欧文のあいだの間隔。ブラウザだけでは揃いきらない日本語の字組みを、標準CSSを土台に整えます。",
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
      "括弧や句読点まわりのアキ、和文と欧文のあいだの間隔。ブラウザだけでは揃いきらない日本語の字組みを、標準CSSを土台に整えます。",
    eyebrow: "Japanese typography compatibility layer",
    headlineLead: "Webの日本語を",
    headlineAccent: "端正にする",
    lead: "括弧や句読点のまわりに空きすぎるアキ、和文と欧文が隣り合うときの窮屈さ。ブラウザだけではまだ揃いきらない部分を、標準CSSを土台にそっと整えます。読み手が気づかないくらい自然に、本文が締まります。",
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
          body: "ブラウザがtext-spacing-trimやtext-autospaceに対応していれば、その実装をそのまま使います。追加のスクリプトは動きません。"
        },
        {
          index: "02",
          icon: "fallback",
          title: "Small fallback",
          body: "足りない処理だけを後から補います。本文の文字列には手を入れないので、読者がコピーした文章も、読み上げの内容も元のままです。"
        },
        {
          index: "03",
          icon: "layers",
          title: "Framework ready",
          body: "素のHTMLでも、ReactでもMarkdownでも。ひとつの字組み方針を、そのまま持ち込めます。"
        }
      ]
    },
    surfaces: {
      eyebrow: "One policy, several surfaces",
      title: "使う場所に合わせて必要な層だけ",
      body: "CSSを一行読み込むところから始めて、必要になったときにDOM層やReact、MDXの連携を足していけます。どの段階でも、プロジェクトの構成を組み替える必要はありません。",
      packages: [
        { name: "mojikumi", icon: "mojikumi", description: "通常利用向けの統合API" },
        { name: "@mojikumi/css", icon: "css", description: "標準CSS中心のプリセット" },
        { name: "@mojikumi/dom", icon: "dom", description: "ブラウザ差を補うDOM層" },
        { name: "@mojikumi/react", icon: "react", description: "ComponentとHook" },
        { name: "@mojikumi/rehype", icon: "rehype", description: "Markdown / MDX連携" }
      ]
    },
    compare: {
      eyebrow: "Before / After",
      title: "一文字ぶんの差が、読み心地を変える",
      body: "同じ一文を、約物調整なしとMojikumiで組んでみます。括弧の前後や句読点のあとに空くアキが詰まり、行の長さが揃うのがわかります。",
      sampleText:
        "『組版』は、文字と文字のあいだ（アキ）を整える仕事です。Webでも、JLREQが示す原則は変わりません。",
      beforeLabel: "約物調整なし",
      beforeNote: "括弧や句読点の前後に、全角ぶんのアキがそのまま残ります。",
      afterLabel: "Mojikumi",
      afterNote: "アキを半角ぶんに詰め、和文と欧文のあいだには逆に間隔を入れます。",
      link: "Playgroundでもっと試す"
    },
    closing: {
      eyebrow: "See the difference",
      title: "同じ文章で違いを確かめる",
      body: "約物調整なし、YakuHanJP、標準CSS、Mojikumiの4つを並べて、行幅や文字サイズ、書体を動かしながら見比べられます。入力欄に自分の原稿を貼り付けても構いません。",
      link: "Playgroundを開く"
    }
  },
  docs: {
    title: "Docs",
    description: "Mojikumiの導入方法とパッケージ構成",
    eyebrow: "Documentation",
    heading: "小さく導入し必要な分だけ補う",
    lead: "まず標準CSSを適用し、それでも揃わない環境にだけDOMフォールバックを足します。ReactでもMDXでも手順は同じで、本文の文字列に手を入れない方針は変わりません。",
    indexLabel: "このページ",
    sections: [
      {
        id: "css",
        index: "01",
        title: "CSSだけで使う",
        navLabel: "CSS",
        body: "まずはCSSプリセットを読み込んで、本文の要素にクラスを付けるだけです。標準CSSを理解するブラウザは、この時点で約物のアキを詰めはじめます。ビルド設定もJavaScriptも増えません。プリセットはbook、web、editorial、minimalの4種類があり、詰めの強さが違います。",
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
        body: "標準CSSがまだ届かないブラウザにも同じ見た目を届けたいときは、DOM層を足します。約物が連続する箇所や、行頭・行末に来た括弧など、CSSだけでは揃わない位置を実行時に測って補います。precisionをautoにしておけば、対応済みのブラウザでは何もしません。",
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
        body: "サーバーでは通常のHTMLを書き出し、ブラウザに届いてから必要な分だけ補います。囲むだけのComponentと、既存の要素に付けるHookのどちらでも使えるので、いまのレイアウトを組み替えずに差し込めます。",
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
        body: "rehypeプラグインとして組み込むと、記事の本文にプリセットが適用されます。原稿のMarkdownはそのままで、書き手が字組みを意識する必要はありません。コードブロックや数式は対象から外れるので、記号の並びが崩れる心配もありません。",
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
        "まず標準CSSで動く。ブラウザが対応していれば、それだけで完結します",
        "本文の文字列は書き換えない。コピーした文章も、読み上げの内容も元のままです",
        "ブラウザの対応が進むほど、読み込むコードは自然と減っていきます",
        "約物メトリクスを持たない書体では、無理に詰めません"
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
    description: "未調整、YakuHanJP、標準CSS、Mojikumiの日本語字組みを比較します",
    eyebrow: "Interactive comparison",
    heading: "同じ文章で字組みを比べる",
    lead: "約物調整なし、YakuHanJP、標準CSS、Mojikumiの4つを、同じ文章で並べて表示します。文字サイズや行幅、書体を動かしながら、どこがどう変わるのかを目で確かめられます。入力欄の文章はブラウザの中だけで処理されます。",
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
      note: "Autoは、いま使っているブラウザが対応している標準CSSを優先します。Fallbackに切り替えると、未対応のブラウザで見えるはずの補完結果を強制的に表示します。",
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
        title: "YakuHanJP",
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
      "YakuHanJPの比較には、Yaku Han JP v4.1.1（© Qrac、OFL-1.1 AND MIT）の約物サブセットを自己ホストして使用しています。地の文には、この書体が切り出された元であるNoto Sans JPを合わせています。"
  },
  benchmarks: {
    title: "Benchmarks",
    description: "Mojikumiの性能計測方針と公開予定の指標",
    eyebrow: "Performance & compatibility",
    heading: "速さと補完の小ささを測る",
    lead: "Mojikumiは、ブラウザの標準実装が育つほど仕事が減っていく設計です。処理にかかる時間だけでなく、補完のために追加されるDOMの量や、組み直しのコストも合わせて記録します。",
    status: {
      label: "Current status",
      title: "計測環境を準備しています",
      body: "いま進めているのは、何度測っても同じ数字が出る条件を固める作業です。端末やブラウザのバージョンが変われば結果も動くため、条件を書き残せないうちは数値を出しません。それまでのあいだ、実際の速さと見え方はPlaygroundで直接確かめられます。",
      link: "Playgroundで確かめる"
    },
    metrics: {
      eyebrow: "Metrics",
      title: "測定するもの",
      items: [
        {
          term: "初期処理",
          description: "本文をはじめて解析し、必要なアキを入れ終えるまでの時間"
        },
        {
          term: "再評価",
          description: "ウィンドウ幅が変わったときや、書体が読み込まれたあとに組み直す時間"
        },
        {
          term: "DOM増加量",
          description: "補完のために追加される要素の数。少ないほど、標準CSSだけで足りている"
        },
        {
          term: "メモリ",
          description: "長い記事や、複数の記事を同時に開いたときのヒープ使用量"
        }
      ]
    },
    matrix: {
      eyebrow: "Matrix",
      title: "揃える環境",
      items: [
        { term: "Chromium", description: "最新版 / macOS・Linux" },
        { term: "Firefox", description: "最新版 / macOS・Linux" },
        { term: "WebKit", description: "最新版 / macOS" },
        { term: "Content", description: "1千字・1万字・複数段落の3種類" }
      ]
    },
    method: {
      label: "Method",
      title: "再現できる結果だけを公開する",
      body: "計測に使ったコード、入力した文章、ブラウザのバージョン、書体の条件はリポジトリに残しています。同じ手順をたどれば、手元でも近い数字が出るはずです。このページに載せるのは、CIの固定条件で得られた結果だけで、その場で動かすライブ計測は端末の状態に左右されるため別扱いにします。"
    }
  },
  privacy: {
    title: "プライバシー",
    description: "Mojikumiのサイトが扱うデータと、扱わないデータについて",
    eyebrow: "Privacy",
    heading: "何も集めていません",
    lead: "このサイトには、あなたを追いかける仕組みがひとつもありません。アクセス解析も広告もなく、フォームもアカウントもなく、Playgroundに書いた文章がどこかへ送られることもありません。以下は、その中身を具体的に書いたものです。",
    updated: "最終更新：2026年7月30日",
    sections: [
      {
        title: "このサイトの構成",
        body: [
          "mojikumi.jpは、Next.jsの静的エクスポート（output: \"export\"）で生成した静的ファイルだけで構成されています。ページを開いたときに動くサーバー側の処理はなく、あなたの操作を受け取って記録する窓口もありません。",
          "アカウント登録、問い合わせフォーム、コメント欄、ニュースレターの購読といった、利用者から情報を受け取る仕組みはひとつも置いていません。"
        ]
      },
      {
        title: "ブラウザに保存するもの",
        body: [
          "保存するのは、選んだカラーテーマを覚えるためのlocalStorageの項目「mojikumi.theme」ひとつだけです。値は「light」または「dark」のどちらかで、次に開いたときの配色を決める以外には使わず、外部へ送信することもありません。",
          "この項目はブラウザの設定から削除できます。削除したあとは、お使いのOSの配色設定にそのまま従います。",
          "Cookieは使用していません。ログイン状態やセッションを持たないため、必要になる場面がありません。"
        ]
      },
      {
        title: "アクセス解析・広告",
        body: [
          "アクセス解析、広告配信、A/Bテスト、ヒートマップ、セッション録画といったタグやSDKは、ひとつも組み込んでいません。どのページを何人が見たかという記録も、こちらでは取っていません。",
          "ページの読み込み時に動くスクリプトは、前回選んだテーマを復元するものと、Mojikumi自身の字組み処理だけです。どちらもブラウザの中で完結します。"
        ]
      },
      {
        title: "外部へのリクエスト",
        body: [
          "本文用のWebフォント（Shippori Mincho、Zen Maru Gothic）はnext/fontによってビルド時に取り込み、このサイトから配信しています。読んでいるあいだにフォント配信元へリクエストが飛ぶことはありません。Playgroundの比較で使うYakuHanJP、YakuHanMP、Noto Sans JPも同じく自己ホストしています。",
          "そのため、通常の閲覧で外部のドメインへ送られる情報はありません。ページ内のリンクから移動した先（GitHub、npmなど）では、それぞれの事業者のポリシーが適用されます。"
        ]
      },
      {
        title: "Playgroundに入力したテキスト",
        body: [
          "Playgroundの入力欄に書いた文章は、ブラウザの中だけで処理されます。サーバーへ送信することも、保存や記録をすることもありません。ページを離れれば、どこにも残りません。",
          "とはいえ、共有端末や画面共有中の入力には、通常のWebページと同じ注意が必要です。機密情報を貼り付けるのは避けてください。"
        ]
      },
      {
        title: "ホスティング事業者のログ",
        body: [
          "このサイトはVercel上で配信しています。IPアドレスやUser-Agentなど、Webサーバーが通常記録する範囲のアクセスログが、事業者側で保持される場合があります。",
          "これは配信の仕組み上どうしても発生するもので、こちらが閲覧したり、利用したりできるものではありません。"
        ]
      },
      {
        title: "変更と、書かれていることの確かめ方",
        body: [
          "内容を変更した場合は、このページと、公開リポジトリの更新履歴の両方に残します。",
          "このページに書いてあることは、すべてサイトのソースコードから確かめられます。もし記述と実際の実装が食い違っていたら、実装のほうが正しいものとして扱ってください。そのうえで、Issuesで知らせていただければ記述を直します。"
        ]
      }
    ]
  },
  terms: {
    title: "利用規約",
    description: "Mojikumiのライセンス、免責、第三者ソフトウェアの表記",
    eyebrow: "Terms",
    heading: "ライセンスと、ご利用にあたって",
    lead: "Mojikumiのソフトウェアと、このサイトを使うときの条件をまとめています。ひとことで言えば、MIT Licenseの範囲で自由に使えます。",
    updated: "最終更新：2026年7月30日",
    sections: [
      {
        title: "ライセンス",
        body: [
          "Mojikumiの各パッケージと、このサイトのソースコードは、MIT License（Copyright (c) 2026 akira）で公開しています。商用・非商用を問わず、改変や再配布も自由です。全文はリポジトリのLICENSEファイルを参照してください。",
          "サイトに掲載している文章と図版は、出典を示していただければ、引用や紹介に利用できます。"
        ]
      },
      {
        title: "無保証",
        body: [
          "MIT Licenseの定めのとおり、ソフトウェアは現状のまま提供され、商品性、特定目的への適合性、権利非侵害を含むいかなる保証もありません。利用によって生じた損害について、作者は責任を負いません。",
          "重要な用途に組み込む場合は、実際に使う環境で表示を確認したうえで採用してください。"
        ]
      },
      {
        title: "字組みの結果が変わる条件",
        body: [
          "同じ設定でも、字組みの見え方はブラウザの実装状況と、書体が持つ約物メトリクス（haltやchwsなど）によって変わります。Mojikumiは、確かめられた組み合わせでだけ詰めを効かせ、判断がつかない書体では無理に詰めません。",
          "どの組み合わせを確認済みとして扱っているかは、リポジトリのCOMPATIBILITY.mdとFONT-MATRIX.mdにまとめています。Benchmarksページに載せる数値も、手順を公開できるものだけに絞っています。いずれも予告なく更新されます。"
        ]
      },
      {
        title: "Playgroundについて",
        body: [
          "Playgroundは、字組みの違いを確かめるための検証用ツールです。入力した内容はブラウザの外に出ませんが、何を入力するかについての責任は利用者にあります。機密情報の入力は避けてください。"
        ]
      },
      {
        title: "第三者ソフトウェアと書体",
        list: [
          "Shippori Mincho、Zen Maru Gothic、Noto Sans JP — SIL Open Font License 1.1",
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
          "不具合の報告、規約についての質問、字組みがおかしく見える事例の共有は、GitHubリポジトリのIssuesへお願いします。再現できる文章とブラウザの情報を添えていただけると助かります。"
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
