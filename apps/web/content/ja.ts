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
      "ブラウザの実装だけでは揃いきらない日本語の字組みを、標準CSSを土台に整えるライブラリです。括弧まわりの空白や和欧文間の間隔を、本文の文字列を書き換えずに調整します。",
    ogAlt: "Mojikumi — Webの日本語を端正にする"
  },
  nav: {
    label: "メインナビゲーション",
    home: "Mojikumi ホーム",
    start: "はじめる",
    docs: "Docs",
    playground: "Playground",
    benchmarks: "Benchmarks",
    github: "GitHub",
    menu: "メニュー",
    close: "閉じる",
    settings: "表示設定"
  },
  codeCopy: {
    label: "コピー",
    copied: "コピー済み",
    action: "{title}のコードをコピー"
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
      "ブラウザの実装だけでは揃いきらない日本語の字組みを、標準CSSを土台に整えるライブラリです。括弧まわりの空白や和欧文間の間隔を、本文の文字列を書き換えずに調整します。",
    eyebrow: "Japanese typography compatibility layer",
    headlineLead: "Webの日本語を",
    headlineAccent: "端正にする",
    lead: "日本語の本文をWebに載せると、括弧の前後が間延びし、和文と欧文の境目が窮屈になります。Mojikumiは、ブラウザの実装だけでは揃いきらないこの差を標準CSSの上で補い、本文の字面を整えます。文字列そのものは書き換えないため、コピーした文章も読み上げの内容も元のままです。",
    primaryAction: "自分のサイトへ入れる",
    secondaryAction: "Playgroundで試す",
    specimenLabel: "TYPE SAMPLE / 01",
    specimenText:
      "『美しい本文』は、文字そのものだけでなく、文字と文字のあいだに宿ります。",
    principles: {
      eyebrow: "Principles",
      title: "標準実装を活かし、足りない分だけを補う",
      items: [
        {
          index: "01",
          title: "CSS first",
          body: "text-spacing-trimとtext-autospaceに対応したブラウザでは、その実装をそのまま使います。追加のスクリプトは読み込まれず、実行もされません。"
        },
        {
          index: "02",
          title: "Small fallback",
          body: "標準実装で届かない処理だけを、あとから補います。本文の文字列そのものには手を加えないため、読者がコピーした文章も、スクリーンリーダーが読み上げる内容も元のまま保たれます。"
        },
        {
          index: "03",
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
        { name: "mojikumi", description: "既定の構成をまとめた統合API" },
        { name: "@mojikumi/css", description: "標準CSS中心のプリセット" },
        { name: "@mojikumi/dom", description: "ブラウザ差を補うDOM層" },
        { name: "@mojikumi/react", description: "ComponentとHook" },
        { name: "@mojikumi/rehype", description: "Markdown / MDX連携" }
      ]
    },
    compare: {
      eyebrow: "Before / After",
      title: "半字ぶんの差が、読み心地を変える",
      body: "同じ文章を、約物調整なしの状態とMojikumiを適用した状態で並べています。括弧の前後や句読点のあとに空いていた半字ぶんの空白が詰まり、字面のムラが消えて一行に入る字数が増えます。",
      sampleText:
        "『日本語組版処理の要件（JLREQ）』は、行末に置いた終わり括弧類や句読点について「その後ろを原則として二分アキとする」と定めたうえで、行の調整処理で詰めてベタ組にしてもよい、と述べています〈W3C技術ノート、2012年、3.1.9〉。約物が連続する箇所、たとえば「『引用』」や〈補足（注記）〉でアキを重ねないのも、同じ体裁上の判断です。",
      beforeLabel: "約物調整なし",
      beforeNote: "括弧が隣り合う箇所に、半字ぶんの空白がふたつ分そのまま残った状態です。",
      afterLabel: "Mojikumi",
      afterNote: "その重なりを半字ぶん詰め、和文と欧文のあいだには逆に間隔を挿入します。",
      link: "Playgroundでもっと試す"
    },
    closing: {
      eyebrow: "See the difference",
      title: "同じ文章で違いを確かめる",
      body: "約物調整なし、YakuHanJP、標準CSS、Mojikumiの4つを並べ、行幅や文字サイズ、書体を切り替えながら見比べられます。入力欄にご自身の原稿を貼り付けて試すこともできます。",
      link: "Playgroundを開く"
    }
  },
  start: {
    title: "はじめる",
    description: "Mojikumiを自分のサイトへ入れる手順",
    eyebrow: "Getting started",
    heading: "コードを1つ貼れば始められる",
    lead: "ビルド設定は要りません。管理画面からコードを貼れるサイトなら、5分ほどで本文の字組みが変わります。合わなければ、貼ったコードを消すだけで元どおりです。",
    indexLabel: "このページ",
    choose: {
      eyebrow: "Choose",
      title: "コードはどこに貼れますか",
      body: "貼り付け先によって、開く画面と確認の仕方が変わります。近いほうを選んでください。読み込むコードはどちらも同じです。",
      pending:
        "WordPressやShopifyなど、サービスごとの手順は実機で確認できた順に増やします。それまでも、下のどちらかの方法で同じことができます。"
    },
    steps: {
      requirements: "必要なもの",
      time: "所要時間",
      access: "必要な権限",
      open: "開く場所",
      paste: "貼り付けるコード",
      verify: "効いているか確かめる",
      scope: "範囲を変える",
      revert: "元に戻す",
      trouble: "この環境でよくある問題"
    },
    guides: [
      {
        id: "html",
        index: "01",
        navLabel: "HTMLを編集できる",
        title: "HTMLを直接編集できるサイト",
        summary:
          "テンプレートのファイルを触れる場合です。自作のサイト、静的サイトジェネレーター、テーマを編集できるCMSが当てはまります。",
        time: "5分",
        access: "テンプレートファイルを編集できること",
        open: "すべてのページで読み込まれるHTMLを開きます。多くの場合は、headタグを含む共通のテンプレートです。静的サイトなら各HTMLファイル、テーマがあるならヘッダー用のテンプレートが該当します。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-style="article"
></script>`,
        verify: "記事のページを開き、括弧や句読点が続いている箇所を見てください。『「引用」』のような並びが詰まっていれば効いています。分かりにくいときは、ブラウザの検証ツールで本文の要素にmjkというクラスが付いているかを確かめられます。",
        scope: "何も指定しなければ、本文らしい要素を上から順に探します。適用先が決まっているなら、data-targetにその要素のセレクターを書きます。ナビゲーションやフッターまで変わってしまうときも、これで狭められます。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".post-body"
  data-style="book"
></script>`,
        revert: "貼った数行を消せば元に戻ります。Mojikumiが足すのは表示のための要素とクラスだけで、本文そのものは書き換えていません。保存されている記事のデータには何も残りません。",
        trouble: [
          "bodyの終わりに貼ると、CSSが届く前に本文が一度描画され、字組みの変わる瞬間が見えます。headの中に置いてください。",
          "記事以外のページでも読み込まれますが、対象は本文の要素だけなので、ページごとに読み込みを分ける必要はありません。"
        ]
      },
      {
        id: "custom-code",
        index: "02",
        navLabel: "カスタムコード欄がある",
        title: "管理画面にカスタムコード欄があるサービス",
        summary:
          "HTMLのファイルは触れないが、管理画面からコードを差し込める場合です。Webflow、Shopify、Ghost、Squarespaceなどが当てはまります。",
        time: "5分",
        access: "サイト全体の設定を変更できる管理者権限",
        open: "管理画面で、コードを差し込む欄を探します。「カスタムコード」「Code Injection」「ヘッダーに追加するコード」などの名前で、サイト全体の設定にあります。ページ単位の設定ではなく、全ページ共通の欄を選びます。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-style="article"
></script>`,
        verify: "公開されている記事のページを開いて確認します。管理画面のプレビューでは編集用の要素が混ざるため、本番のページで見るほうが確実です。",
        scope: "本文を囲む要素の名前はサービスごとに違います。記事ページで本文を右クリックして検証を開き、本文全体を囲んでいる要素のクラス名をdata-targetに書きます。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-body"
  data-style="article"
></script>`,
        revert: "カスタムコード欄から消して保存すれば元に戻ります。記事の内容には手を入れていないため、あとから別の方法へ移ることもできます。",
        trouble: [
          "編集画面の表示まで変わる場合、そのサービスは編集画面にも同じコードを読み込んでいます。data-targetを本文の要素だけに絞ってください。",
          "保存しても反映されないときは、サービス側のキャッシュが残っている可能性があります。時間をおくか、キャッシュの削除を試してください。"
        ]
      }
    ],
    trouble: {
      id: "trouble",
      index: "03",
      title: "うまくいかないとき",
      navLabel: "うまくいかないとき",
      body: "どの環境でも起きる症状です。原因の詳しい説明はDocsにあります。",
      items: [
        {
          term: "何も変わらない",
          description:
            "本文の要素とdata-targetが一致していない可能性が高いです。検証ツールで本文の要素にmjkというクラスが付いているかを確認してください。付いていなければセレクターが違います。付いているのに変化が見えない場合は、そのブラウザがすでに標準の機能で同じ処理をしています。"
        },
        {
          term: "適用範囲が広すぎる",
          description:
            "ナビゲーションやフッターまで変わる場合は、data-targetを本文の要素だけに絞ります。一部分だけ外したいときは、その要素にdata-no-mojikumiを付けます。"
        },
        {
          term: "編集画面の表示が乱れる",
          description:
            "管理バーやブロックエディターの中では動かないようにしていますが、独自の作りだと届かないことがあります。data-targetを本文の要素だけに絞ると確実です。"
        },
        {
          term: "表示が遅くなった気がする",
          description:
            "読み込むファイルは1つで、圧縮後6KB弱です。標準の機能で足りるブラウザでは、そもそも本文へ手を入れません。気になる場合はdata-precisionにnativeを指定すると、ブラウザの実装だけを使います。"
        }
      ]
    },
    nextStep: {
      label: "次のステップ",
      title: "自分の文章で確かめる",
      link: "Playgroundを開く"
    }
  },
  docs: {
    title: "Docs",
    description: "Mojikumiの導入手順とパッケージ構成",
    eyebrow: "Documentation",
    heading: "段階的に導入する",
    lead: "導入は、スクリプトを1つ読み込むか、CSSプリセットを読み込むところから始まります。標準CSSだけでは揃わない環境には、DOMフォールバックを追加してください。ReactでもMarkdown / MDXでも手順は変わらず、本文の文字列に手を加えないという方針も共通です。",
    indexLabel: "このページ",
    sections: [
      {
        id: "script",
        index: "01",
        title: "スクリプトタグで使う",
        navLabel: "スクリプトタグ",
        language: "HTML",
        body: "ビルド設定を持たないサイトでは、スクリプトを1つ読み込むだけで動作します。CSSはバンドルに含まれているため、読み込むファイルは1つです。設定はタグの属性で渡し、読み込み後に追加された記事も自動的に対象になります。",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content"
  data-style="article"
></script>`,
        table: {
          head: ["属性", "既定値", "内容"],
          rows: [
            ["data-target", "auto", "本文のセレクター。autoは既知の本文要素を順に探します"],
            ["data-style", "article", "article（記事向け）、book（書籍風）、headline（見出し重視）"],
            ["data-precision", "auto", "native、auto、fullのいずれか"],
            ["data-exclude", "なし", "追加で除外するセレクター。カンマ区切り"],
            ["data-css", "true", "同梱CSSを読み込むかどうか"],
            ["data-auto", "true", "falseにするとMojikumi.start()を呼ぶまで何もしません"]
          ]
        }
      },
      {
        id: "css",
        index: "02",
        title: "CSSだけで使う",
        navLabel: "CSS",
        language: "TSX",
        body: "CSSプリセットを読み込み、本文の要素にクラスを付けます。標準CSSに対応したブラウザなら、これだけで約物まわりの空白が詰まります。ビルド設定の変更もJavaScriptの追加も不要です。プリセットはbook、web、editorial、minimalの4種類で、それぞれ詰めの強さが異なります。",
        code: `import "mojikumi/css";

<article lang="ja" className="mjk mjk-book">
  <p>『Webの日本語』を端正にする</p>
</article>`
      },
      {
        id: "dom",
        index: "03",
        title: "DOMフォールバックを追加する",
        navLabel: "DOM",
        language: "TypeScript",
        body: "標準CSSが未実装のブラウザでも同じ表示を得たい場合は、DOM層を追加します。約物が連続する箇所や、行頭・行末に置かれた括弧など、CSSだけでは揃わない位置を実行時に計測して補正する層です。precisionをautoに設定しておけば、対応済みのブラウザでは処理そのものが実行されません。",
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
        title: "Reactで使う",
        navLabel: "React",
        language: "TSX",
        body: "サーバーでは通常のHTMLを出力し、ブラウザに届いた時点で不足分だけを補います。要素を囲むComponentと、既存の要素に適用するHookのどちらでも利用できるため、現在のレイアウトを組み替える必要はありません。",
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
        index: "05",
        title: "Markdown / MDXで使う",
        navLabel: "Markdown / MDX",
        language: "TypeScript",
        body: "rehypeプラグインとして組み込むと、記事本文にプリセットが適用されます。原稿のMarkdownは変更する必要がなく、書き手が字組みを意識することもありません。コードブロックと数式は処理の対象から除外されるため、記号の並びが崩れることはありません。",
        code: `import rehypeMojikumi from "@mojikumi/rehype";

export default {
  rehypePlugins: [
    [rehypeMojikumi, { preset: "editorial" }]
  ]
};`
      },
      {
        id: "presets",
        index: "06",
        title: "プリセットを選ぶ",
        navLabel: "プリセット",
        body: "プリセットは、どの調整を行うかの組み合わせです。迷う場合はwebを選んでください。書籍に近い体裁が必要ならbook、見出しの文節改行を優先するならeditorial、約物の重なりだけを詰めたいならminimalが適します。nativeはブラウザの実装だけを使い、JavaScriptによる補完を行いません。",
        table: {
          head: ["調整", "web", "book", "editorial", "minimal", "native"],
          rows: [
            ["連続する約物", "○", "○", "○", "○", "○"],
            ["行頭の調整", "○", "○", "○", "—", "○"],
            ["行末の調整", "条件付き", "○", "○", "—", "○"],
            ["和欧文間", "○", "○", "—", "—", "○"],
            ["段落の字下げ", "—", "1em", "—", "—", "—"],
            ["見出しの文節改行", "—", "—", "○", "—", "—"],
            ["JSによる補完", "○", "○", "○", "○", "—"]
          ]
        }
      },
      {
        id: "precision",
        index: "07",
        title: "ブラウザの実装との切り替え",
        navLabel: "precision",
        body: "precisionは、標準CSSとDOM補完のどちらをどこまで使うかの指定です。既定のautoでは、ブラウザが実際に約物を詰めているかを実測してから判断します。構文としては対応していても表示が変わらない実装があるため、対応表ではなく実測で切り替えています。",
        table: {
          head: ["値", "動作", "使いどころ"],
          rows: [
            ["native", "標準CSSのみを使用します", "JavaScriptを増やしたくない場合"],
            ["auto", "不足している処理だけを補います", "通常はこれで十分です"],
            ["full", "常にDOM補完を適用します", "検証時や、実装差を確認する場合"]
          ]
        }
      },
      {
        id: "scope",
        index: "08",
        title: "適用範囲を変える",
        navLabel: "適用範囲",
        language: "HTML",
        body: "コード、フォーム、編集中の領域、SVG、MathMLは、指定がなくても対象から外れます。任意の範囲を外したい場合は、その要素にdata-no-mojikumiを付けます。まとめて外すなら、excludeやdata-excludeにセレクターを渡します。",
        code: `<span data-no-mojikumi>console.log("日本語")</span>`,
        list: [
          "既定の除外：script、style、code、pre、kbd、samp、textarea、input、select、option、contenteditable、svg、math",
          "data-no-mojikumiを付けた要素と、その内部",
          "data-excludeまたはexcludeで追加したセレクター"
        ]
      },
      {
        id: "api",
        index: "09",
        title: "プログラムから操作する",
        navLabel: "API",
        language: "JavaScript",
        body: "スクリプトタグで読み込むと、グローバルのMojikumiから操作できます。data-autoをfalseにしておけば、開始のタイミングも自分で決められます。npmから使う場合は、同じ処理をmojikumiパッケージのmojikumi関数が担当します。",
        code: `Mojikumi.start({ target: ".article", style: "book" });
Mojikumi.refresh();
Mojikumi.stop();`,
        table: {
          head: ["関数", "内容"],
          rows: [
            ["start(options)", "適用を開始し、以降に追加された記事も対象にします"],
            ["refresh()", "行頭・行末の判定をやり直します"],
            ["stop()", "生成した要素とクラス、読み込んだCSSをすべて取り除きます"]
          ]
        }
      },
      {
        id: "self-host",
        index: "10",
        title: "自分のサーバーへ置く",
        navLabel: "自己ホスト",
        language: "HTML",
        body: "CDNを使わない場合は、npmパッケージに含まれる同じファイルを自分のサーバーへ置けます。node_modules/mojikumi/dist/mojikumi.browser.jsを公開ディレクトリへコピーし、srcをそのパスに変えるだけです。動作は変わりません。",
        code: `<script src="/assets/mojikumi.min.js" data-style="article"></script>`
      },
      {
        id: "uninstall",
        index: "11",
        title: "元に戻す",
        navLabel: "元に戻す",
        body: "スクリプトタグを消す、あるいはstop()を呼ぶと、その場で元の状態に戻ります。Mojikumiは本文の文字列を書き換えないため、取り外したあとに痕跡は残りません。",
        list: [
          "生成した要素とクラスを取り除き、変更した属性を元の値へ戻します",
          "本文の文字列は変更していないため、保存されたデータには何も残りません",
          "スクリプトが読み込めなかった場合も、本文はそのまま表示されます"
        ]
      }
    ],
    policy: {
      id: "policy",
      index: "12",
      title: "設計方針",
      navLabel: "設計方針",
      items: [
        "まず標準CSSで動作し、ブラウザが対応していればそれだけで完結します",
        "本文の文字列は書き換えないため、コピーした文章も読み上げの内容も元のまま保たれます",
        "ブラウザの対応が進むほど、読み込まれるコードは自然に減っていきます",
        "約物メトリクスを備えていない書体では、詰めを適用しません"
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
    description: "約物調整なし、YakuHanJP、標準CSS、Mojikumiの4つで日本語の字組みを比較します",
    eyebrow: "Interactive comparison",
    heading: "同じ文章で字組みを比べる",
    lead: "約物調整なし、YakuHanJP、標準CSS、Mojikumiの4つを、同じ文章で並べて表示します。文字サイズ、行幅、書体を切り替えながら、どこがどう変わるのかを比較できます。入力欄の文章はブラウザ内でのみ処理され、外部へ送信されることはありません。",
    regionLabel: "Mojikumi比較ツール",
    sampleText:
      "『日本語組版処理の要件（JLREQ）』は、行頭に置く始め括弧類の扱いに、ひとつの正解を定めていません。「改行行頭の字下げは全角アキ、折返し行頭は天付きとする」。これがJIS X 4051の採用した方式で、岩波書店の組版もこれにならいます〈W3C技術ノート、2012年、3.1.5〉。\n\n「改行行頭の字下げは二分アキ、折返し行頭は天付きとする」。こちらを選んだのが、講談社、新潮社、文藝春秋、中央公論新社、筑摩書房といった文芸書の版元です。会話の多い小説では、行頭が下がりすぎるという判断からでした。\n\n和文と欧文のあいだにも決まりがあります。「欧字・アラビア数字の前後に配置される平仮名、片仮名又は漢字等との字間は、四分アキとする」（同3.2.6）。HTMLやCSS、2026年のような表記が本文に混ざるほど、この差は効いてきます。",
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
      note: "Autoは、ご利用のブラウザが対応している標準CSSを優先します。Fallbackに切り替えると、標準CSSに未対応のブラウザで表示されるはずの補完結果を強制的に描画します。",
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
        note: "ご利用のブラウザの標準実装"
      },
      mojikumi: {
        title: "Mojikumi",
        noteFallback: "標準CSS ＋ DOM補完",
        noteNativeOnly: "標準CSSのみ",
        noteNative: "標準CSSをそのまま使用"
      }
    },
    credit:
      "YakuHanJPとの比較には、Yaku Han JP v4.1.1（© Qrac、OFL-1.1 AND MIT）の約物サブセットを自己ホストして使用しています。地の文には、このサブセットの切り出し元であるNoto Sans JPを組み合わせています。"
  },
  benchmarks: {
    title: "Benchmarks",
    description: "Mojikumiの性能計測の方針と、公開予定の指標",
    eyebrow: "Performance & compatibility",
    heading: "処理速度と補完量を測る",
    lead: "Mojikumiは、ブラウザの標準実装が広がるほど処理量が減る設計です。そのため計測では、処理にかかる時間に加えて、補完のために追加されるDOMの量と、組み直しに要するコストも記録します。",
    status: {
      label: "Current status",
      title: "計測環境を準備しています",
      body: "現在は、再現性のある計測条件を確定させる作業を進めています。端末やブラウザのバージョンが変われば結果も変動するため、条件を明記できない段階で数値を公開することはしません。それまでのあいだ、実際の処理速度と表示はPlaygroundで直接ご確認いただけます。",
      link: "Playgroundで確かめる"
    },
    metrics: {
      eyebrow: "Metrics",
      title: "測定するもの",
      items: [
        {
          term: "初期処理",
          description: "本文を最初に解析し、必要な空白の調整を終えるまでの時間"
        },
        {
          term: "再評価",
          description: "ウィンドウ幅の変更後、または書体の読み込み完了後に組み直しへ要する時間"
        },
        {
          term: "DOM増加量",
          description: "補完のために追加される要素の数。少ないほど標準CSSだけで足りていることを示す"
        },
        {
          term: "メモリ",
          description: "長文の記事、および複数の記事を同時に開いた場合のヒープ使用量"
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
        { term: "Content", description: "1,000字・10,000字・複数段落の3種類" }
      ]
    },
    method: {
      label: "Method",
      title: "再現できる結果だけを公開する",
      body: "計測に使用したコード、入力した文章、ブラウザのバージョン、書体の条件は、すべてリポジトリに記録しています。同じ手順をたどれば、お手元でも近い数値が得られるはずです。このページに掲載するのは、CIの固定条件で得られた結果に限ります。その場で実行するライブ計測は端末の状態に左右されるため、別の扱いとします。"
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
