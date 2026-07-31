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
      "ブラウザの実装だけでは揃いきらない日本語の字組みを、標準CSSを土台に整えるライブラリです。括弧まわりのアキや和欧文間の間隔を、本文の文字列を書き換えずに調整します。",
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
      "ブラウザの実装だけでは揃いきらない日本語の字組みを、標準CSSを土台に整えるライブラリです。括弧まわりのアキや和欧文間の間隔を、本文の文字列を書き換えずに調整します。",
    eyebrow: "Japanese typography compatibility layer",
    headlineLead: "Webの日本語を",
    headlineAccent: "端正にする",
    lead: "日本語の本文をWebに載せると、括弧の前後が間延びし、和文と欧文の境目が窮屈になります。Mojikumiは、ブラウザの実装だけでは揃いきらないこの差を標準CSSの上で補い、本文の字面を整えます。文字列そのものは書き換えないため、コピーした文章も読み上げの内容も元のままです。",
    primaryAction: "Playgroundで比較する",
    secondaryAction: "導入方法を見る",
    specimenLabel: "TYPE SAMPLE / 01",
    specimenText:
      "『美しい本文』は、文字そのものだけでなく、文字と文字のあいだに宿ります。",
    principles: {
      eyebrow: "Principles",
      title: "標準実装を活かし、足りない分だけを補う",
      items: [
        {
          index: "01",
          icon: "standards",
          title: "CSS first",
          body: "text-spacing-trimとtext-autospaceに対応したブラウザでは、その実装をそのまま使います。追加のスクリプトは読み込まれず、実行もされません。"
        },
        {
          index: "02",
          icon: "fallback",
          title: "Small fallback",
          body: "標準実装で届かない処理だけを、あとから補います。本文の文字列そのものには手を加えないため、読者がコピーした文章も、スクリーンリーダーが読み上げる内容も元のまま保たれます。"
        },
        {
          index: "03",
          icon: "layers",
          title: "Framework ready",
          body: "素のHTML、React、Markdownのいずれでも、同じ字組み方針をそのまま持ち込めます。環境ごとに設定を書き分ける必要はありません。"
        }
      ]
    },
    surfaces: {
      eyebrow: "One policy, several surfaces",
      title: "使う場所に合わせて、必要な層だけを選ぶ",
      body: "導入はCSSを一行読み込むところから始められます。DOM層やReact、Markdown / MDXとの連携は、必要になった時点で追加すれば十分です。どの段階に進んでも、プロジェクトの構成を組み替える必要はありません。",
      packages: [
        { name: "mojikumi", icon: "mojikumi", description: "既定の構成をまとめた統合API" },
        { name: "@mojikumi/css", icon: "css", description: "標準CSS中心のプリセット" },
        { name: "@mojikumi/dom", icon: "dom", description: "ブラウザ差を補うDOM層" },
        { name: "@mojikumi/react", icon: "react", description: "ComponentとHook" },
        { name: "@mojikumi/rehype", icon: "rehype", description: "Markdown / MDX連携" }
      ]
    },
    compare: {
      eyebrow: "Before / After",
      title: "半角一文字分の差が、読み心地を変える",
      body: "同じ一文を、約物調整なしの状態とMojikumiを適用した状態で並べています。括弧の前後や句読点のあとに空いていたアキが詰まり、行の長さが揃うことを確認できます。",
      sampleText:
        "『組版』は、文字と文字のあいだ（アキ）を整える仕事です。Webでも、JLREQが示す原則は変わりません。",
      beforeLabel: "約物調整なし",
      beforeNote: "括弧や句読点の前後に、全角分のアキがそのまま残った状態です。",
      afterLabel: "Mojikumi",
      afterNote: "約物のアキを半角分まで詰め、和文と欧文のあいだには逆に間隔を挿入します。",
      link: "Playgroundでもっと試す"
    },
    closing: {
      eyebrow: "See the difference",
      title: "同じ文章で違いを確かめる",
      body: "約物調整なし、YakuHanJP、標準CSS、Mojikumiの4つを並べ、行幅や文字サイズ、書体を切り替えながら見比べられます。入力欄にご自身の原稿を貼り付けて試すこともできます。",
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
    title: "プライバシーポリシー",
    description: "mojikumi.jpにおける情報の取り扱い方針",
    eyebrow: "Privacy",
    heading: "プライバシーポリシー",
    lead: "mojikumi.jpは、閲覧者を識別したり、その行動を追跡したりする仕組みを設けていません。アクセス解析、広告配信、問い合わせフォーム、アカウント登録のいずれも存在せず、Playgroundに入力された文章がサーバーへ送られることもありません。本ポリシーでは、当サイトが何を扱い、何を扱わないのかを具体的に記載します。",
    updated: "最終更新：2026年7月30日",
    sections: [
      {
        title: "サイトの構成",
        body: [
          "mojikumi.jpは、Next.jsの静的エクスポート（output: \"export\"）で生成した静的ファイルのみで構成されています。ページの表示時にサーバー側で実行される処理はなく、利用者の操作を受け取って記録する機能も設けていません。",
          "アカウント登録、問い合わせフォーム、コメント欄、ニュースレターの購読など、利用者から情報を受け取る機能は一切設置していません。"
        ]
      },
      {
        title: "ブラウザに保存される情報",
        body: [
          "当サイトが保存するのは、localStorageの項目「mojikumi.theme」ひとつだけです。値は「light」または「dark」のいずれかで、選択されたカラーテーマを次回以降の表示に引き継ぐためだけに使用します。外部へ送信することはありません。",
          "この項目はブラウザの設定からいつでも削除できます。削除後は、ご利用のOSの配色設定に従って表示されます。",
          "Cookieは使用していません。ログイン状態やセッションを保持しないため、そもそも必要としないためです。"
        ]
      },
      {
        title: "アクセス解析と広告",
        body: [
          "アクセス解析、広告配信、A/Bテスト、ヒートマップ、セッション録画などのタグおよびSDKは、一切組み込んでいません。どのページが何回閲覧されたかという記録も取得していません。",
          "ページの読み込み時に実行されるスクリプトは、前回選択されたテーマを復元する処理と、Mojikumi自身の字組み処理の2つだけです。いずれもブラウザ内で完結します。"
        ]
      },
      {
        title: "外部へのリクエスト",
        body: [
          "本文用のWebフォント（Shippori Mincho、Zen Maru Gothic）は、next/fontによってビルド時に取り込み、当サイトから配信しています。閲覧中にフォント配信元へリクエストが送信されることはありません。Playgroundの比較で使用するYakuHanJP、YakuHanMP、Noto Sans JPも、同様に自己ホストしています。",
          "したがって、通常の閲覧において外部ドメインへ送信される情報はありません。ページ内のリンクから移動した先（GitHub、npmなど）については、それぞれの事業者のポリシーが適用されます。"
        ]
      },
      {
        title: "Playgroundに入力された文章",
        body: [
          "Playgroundの入力欄に記入された文章は、すべてブラウザ内で処理されます。サーバーへの送信、保存、記録のいずれも行いません。ページを離れた時点で、どこにも残りません。",
          "ただし、共有端末での利用時や画面共有中は、通常のWebページと同様の注意が必要です。機密情報の入力はお控えください。"
        ]
      },
      {
        title: "ホスティング事業者のログ",
        body: [
          "当サイトはVercel上で配信しています。IPアドレスやUser-Agentなど、Webサーバーが通常記録する範囲のアクセスログが、同社側で保持される場合があります。",
          "これは配信の仕組み上避けられないもので、当サイトの運営者が閲覧または利用することはできません。"
        ]
      },
      {
        title: "本ポリシーの変更と検証",
        body: [
          "本ポリシーを変更した場合は、このページと公開リポジトリの更新履歴の双方に記録します。",
          "ここに記載した内容は、すべてサイトのソースコードから検証できます。記述と実装が食い違っている場合は、実装を正としてお読みください。そのうえでIssuesにご報告いただければ、記述を修正します。"
        ]
      }
    ]
  },
  terms: {
    title: "利用規約",
    description: "Mojikumiのライセンス、免責事項、第三者ソフトウェアの表示",
    eyebrow: "Terms",
    heading: "利用規約",
    lead: "本規約は、Mojikumiの各パッケージおよび当サイトをご利用いただく際の条件を定めるものです。ソフトウェアはMIT Licenseのもとで公開しており、その定めの範囲であれば、商用・非商用を問わず自由にご利用いただけます。",
    updated: "最終更新：2026年7月30日",
    sections: [
      {
        title: "ライセンス",
        body: [
          "Mojikumiの各パッケージ、および当サイトのソースコードは、MIT License（Copyright (c) 2026 akira）のもとで公開しています。商用・非商用を問わず、改変および再配布が可能です。ライセンス全文は、リポジトリのLICENSEファイルをご確認ください。",
          "当サイトに掲載している文章および図版は、出典を明示していただければ、引用や紹介にご利用いただけます。"
        ]
      },
      {
        title: "免責事項",
        body: [
          "MIT Licenseの定めのとおり、本ソフトウェアは現状有姿で提供されます。商品性、特定目的への適合性、権利非侵害を含め、明示・黙示を問わずいかなる保証も行いません。利用によって生じた損害について、作者は一切の責任を負いません。",
          "重要な用途に組み込む場合は、実際に運用する環境で表示をご確認のうえ採用してください。"
        ]
      },
      {
        title: "字組みの結果に影響する条件",
        body: [
          "設定が同一であっても、字組みの見え方は、ブラウザの実装状況と、書体が備える約物メトリクス（haltやchwsなど）によって変わります。Mojikumiは動作を確認済みの組み合わせにのみ詰めを適用し、判断のつかない書体では調整を行いません。",
          "確認済みとして扱っている組み合わせは、リポジトリのCOMPATIBILITY.mdおよびFONT-MATRIX.mdに記載しています。Benchmarksページに掲載する数値も、手順を公開できるものに限定しています。これらの内容は予告なく更新されることがあります。"
        ]
      },
      {
        title: "Playgroundについて",
        body: [
          "Playgroundは、字組みの違いを確認するための検証用ツールです。入力された内容がブラウザの外に出ることはありませんが、何を入力するかについての責任は利用者に帰属します。機密情報の入力はお控えください。"
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
          "Yaku Han JPは、Playgroundにおいて従来手法との比較対象として使用しています。ライセンス全文は、サイト内の/fonts/YakuHanJP-LICENSE.txtに同梱しています。"
        ]
      },
      {
        title: "お問い合わせ",
        body: [
          "不具合のご報告、本規約に関するご質問、字組みが正しく表示されない事例のご共有は、GitHubリポジトリのIssuesまでお寄せください。再現可能な文章とブラウザの情報を添えていただけますと、確認がスムーズに進みます。"
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
