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
    start: "Start",
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
      body: "貼り付け先によって、開く画面と確認の仕方が変わります。使っているサービスを選んでください。一覧になければ、いちばん近いものを選べば同じことができます。",
      pending:
        "各サービスの手順は、標準的なテーマの構成をもとに書いています。テーマを変更している場合は、本文を囲むクラス名が異なることがあります。「範囲を変える」の手順で自分のサイトの名前を確かめてください。WixやSTUDIOのように、カスタムコードから本文へ届くかどうかを確認できていないサービスは、まだ載せていません。"
    },
    style: {
      label: "体裁を選ぶ",
      notes: {
        minimal: "標準CSSで届く範囲だけを整えます。既存のデザインを動かしません。",
        article: "両端揃えにして行末まで揃えます。日本語の本文はこれが自然です。",
        book: "articleに段落の字下げとぶら下げを加えた、書籍の体裁です。"
      }
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
          "bodyの終わりに貼ると、CSSが届く前に本文が一度描画され、狭い画面では行が一度ずれます。headの中に置けば、これは起きません。",
          "記事以外のページでも読み込まれますが、対象は本文の要素だけなので、ページごとに読み込みを分ける必要はありません。"
        ]
      },
      {
        id: "wordpress",
        index: "02",
        navLabel: "WordPress",
        title: "WordPress",
        summary:
          "テーマのファイルを編集せず、ヘッダーへコードを追加する方法です。テーマを更新しても設定が残ります。",
        time: "5分",
        access: "プラグインを追加できる管理者権限",
        open: "スニペット系のプラグイン（WPCodeやCode Snippetsなど）を追加し、ヘッダーへ出力するコードとして登録します。子テーマを使っているなら、header.phpのwp_headの直前へ直接書いても同じです。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content, .wp-block-post-content"
  data-style="article"
></script>`,
        verify: "投稿ページを開いて確認します。管理バーが出ていても構いません。管理バーとブロックエディターの中では動かないようにしてあります。",
        scope: "本文を囲むクラス名はテーマによって違います。上のコードは、従来のテーマとブロックテーマでよく使われる2つを指定しています。変化がない場合は、投稿ページで本文を検証し、実際のクラス名に置き換えてください。セレクターはカンマで区切っていくつでも並べられます。投稿一覧の抜粋やアーカイブの説明文にも効かせたいときは、そのクラス名も足してください。下の例の3つめはCocoonの抜粋のクラスで、これもテーマごとに違います。書いたどれも見つからないページでは、Mojikumiは何もしません。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content, .wp-block-post-content, .entry-card-snippet"
  data-style="article"
></script>`,
        revert: "登録したスニペットを無効化するか削除すれば元に戻ります。投稿の内容は書き換えていないため、記事のデータには何も残りません。",
        trouble: [
          "ブロックエディターの編集画面には適用されません。仕上がりは公開後のページで確認してください。",
          "キャッシュ系のプラグインを使っている場合、貼った直後は反映されないことがあります。キャッシュを削除してから見てください。",
          "投稿ページでは変わるのに投稿一覧やアーカイブでは変わらないときは、data-targetがそれらのページの要素に届いていません。抜粋のクラス名を足してください。"
        ]
      },
      {
        id: "shopify",
        index: "03",
        navLabel: "Shopify",
        title: "Shopify",
        summary:
          "テーマのコードを編集し、全ページ共通のヘッダーへ追加します。ブログ記事にも商品説明にも効きます。",
        time: "5分",
        access: "テーマを編集できる管理者権限",
        open: "管理画面のオンラインストアからテーマを開き、「コードを編集」を選びます。layoutフォルダーのtheme.liquidを開き、headタグの終わりの直前へ貼り付けて保存します。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-template__content, .rte"
  data-style="article"
></script>`,
        verify: "公開中のブログ記事を開いて確認します。テーマのプレビューでも確認できます。",
        scope: "上のコードはDawnなど標準的なテーマのクラス名です。記事だけに絞りたい場合や、逆に商品説明にも広げたい場合は、対象のページで本文を検証してクラス名を確かめてください。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-template__content"
  data-style="article"
></script>`,
        revert: "theme.liquidから該当の行を削除して保存します。編集の前にテーマを複製しておくと、いつでも戻せます。",
        trouble: [
          "テーマを更新すると編集内容が失われることがあります。更新後に同じ手順をやり直してください。",
          "チェックアウト画面には適用されません。Shopifyがそこではテーマのコードを読み込まないためです。"
        ]
      },
      {
        id: "webflow",
        index: "04",
        navLabel: "Webflow",
        title: "Webflow",
        summary:
          "プロジェクト設定のカスタムコードへ追加します。リッチテキスト要素の中の日本語に効きます。",
        time: "5分",
        access: "プロジェクトを公開できる権限（有料のSite planが必要）",
        open: "Project settingsのCustom codeを開き、Head codeの欄へ貼り付けて保存します。反映にはサイトの再公開が必要です。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".w-richtext"
  data-style="article"
></script>`,
        verify: "公開したサイトで確認します。エディター内のプレビューではカスタムコードが実行されません。",
        scope: "リッチテキスト要素にはw-richtextというクラスが付きます。自分で付けたクラスに絞りたい場合は、そのクラス名を指定してください。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".article-body"
  data-style="article"
></script>`,
        revert: "Head codeから該当の行を削除し、もう一度公開します。",
        trouble: [
          "Site planに加入していないプロジェクトでは、カスタムコードが公開サイトへ出力されません。",
          "保存しただけでは反映されません。公開を実行してください。"
        ]
      },
      {
        id: "squarespace",
        index: "05",
        navLabel: "Squarespace",
        title: "Squarespace",
        summary:
          "サイト全体のCode Injectionへ追加します。コードを差し込める欄は上位プランの機能です。",
        time: "5分",
        access: "サイト設定を変更できる権限（Business以上のプラン）",
        open: "設定のCode Injectionを開き、Headerの欄へ貼り付けて保存します。ページ単位のCode Injectionではなく、サイト全体の設定を使います。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".sqs-html-content"
  data-style="article"
></script>`,
        verify: "公開されているページで確認します。編集モードでは編集用の要素が重なるため、通常の表示で見てください。",
        scope: "テキストブロックの中身はsqs-html-contentというクラスに入ります。ブログ記事だけに絞りたい場合は、記事ページで本文を検証してクラス名を確かめてください。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".blog-item-content"
  data-style="article"
></script>`,
        revert: "Code Injectionの欄から削除して保存すれば元に戻ります。",
        trouble: [
          "下位のプランではコードを差し込む欄が使えません。",
          "編集モードのプレビューには適用されないことがあります。"
        ]
      },
      {
        id: "ghost",
        index: "06",
        navLabel: "Ghost",
        title: "Ghost",
        summary:
          "サイト全体のCode injectionへ追加します。テーマを編集する必要はありません。",
        time: "5分",
        access: "サイト設定を変更できる管理者権限",
        open: "管理画面のSettingsからCode injectionを開き、Site headerの欄へ貼り付けて保存します。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".gh-content, .post-content"
  data-style="article"
></script>`,
        verify: "公開されている記事を開いて確認します。エディターの中には適用されません。",
        scope: "多くのテーマはgh-contentというクラスで本文を囲みます。独自のテーマを使っている場合は、記事ページで本文を検証してクラス名を確かめてください。",
        scopeCode: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".post-content"
  data-style="book"
></script>`,
        revert: "Code injectionの欄から削除して保存します。",
        trouble: [
          "テーマによって本文のクラス名が異なります。変化がない場合はdata-targetを確かめてください。",
          "メールで配信される記事には適用されません。ブラウザで表示されるページだけが対象です。"
        ]
      },
      {
        id: "custom-code",
        index: "07",
        navLabel: "一覧にないサービス",
        title: "一覧にないサービス",
        summary:
          "上に挙げていないサービスでも、管理画面からコードを差し込めるなら同じ方法が使えます。",
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
      index: "08",
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
        id: "astro",
        index: "05",
        title: "Astroで使う",
        navLabel: "Astro",
        language: "Astro",
        body: "Astroが出力するのは静的なHTMLなので、コンポーネントのscriptタグから呼び出します。フロントマターでCSSを読み込み、クライアント側のscriptでDOM層を適用します。ページ遷移でDOMが差し替わる構成では、astro:page-loadでもう一度呼んでください。",
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
        title: "Vue / Nuxtで使う",
        navLabel: "Vue / Nuxt",
        language: "Vue",
        body: "onMountedはブラウザでしか実行されないため、Nuxtのサーバーレンダリングでも本文はそのまま出力されます。コンポーネントが破棄されるときにdestroyを呼び、生成した要素を残さないようにします。",
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
        title: "SvelteKitで使う",
        navLabel: "SvelteKit",
        language: "Svelte",
        body: "$effectはブラウザでのみ実行されるため、サーバーレンダリングの結果には手が入りません。返した関数が後片付けになるので、コンポーネントが消えるときにdestroyが呼ばれます。",
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
        title: "Markdown / MDXで使う",
        navLabel: "Markdown / MDX",
        language: "TypeScript",
        body: "rehypeプラグインとして組み込むと、記事本文にプリセットが適用されます。原稿のMarkdownは変更する必要がなく、書き手が字組みを意識することもありません。コードブロックと数式は処理の対象から除外されるため、記号の並びが崩れることはありません。",
        code: `import rehypeMojikumi from "@mojikumi/rehype";

export default {
  rehypePlugins: [
    [rehypeMojikumi, { preset: "article" }]
  ]
};`
      },
      {
        id: "presets",
        index: "09",
        title: "プリセットを選ぶ",
        navLabel: "プリセット",
        body: "プリセットは、印刷の体裁にどこまで寄せるかの3段階です。minimalは標準CSSで届く範囲の妥協で、行末を揃えません。articleは両端揃えにして行末まで揃える、Mojikumiが本来やろうとしていることです。bookはそれに段落の字下げとぶら下げを足した書籍の体裁です。既定はminimalで、迷う場合はarticleを選んでください。行末を揃えるには両端揃えが要り、両端揃えにはブラウザがtext-spacing-trim: trim-bothを実装するまでDOM補完が要ります。何も指定しなかったページをその負担に署名させない、というのが既定を控えめにしておく理由です。旧名のweb、editorial、nativeもそのまま書けます。",
        table: {
          head: ["調整", "minimal", "article", "book"],
          rows: [
            ["連続する約物", "○", "○", "○"],
            ["行頭の調整", "○", "○", "○"],
            ["和欧文間", "○", "○", "○"],
            ["両端揃え", "—", "○", "○"],
            ["行末の調整", "条件付き", "○", "○"],
            ["段落の字下げ", "—", "—", "1em"],
            ["ぶら下げ", "—", "—", "○"]
          ]
        }
      },
      {
        id: "modifiers",
        index: "09",
        title: "字下げと両端揃えを選ぶ",
        navLabel: "修飾子",
        body: "段落の字下げと両端揃えは、日本語組版の正誤ではなく、そのページをどう設計するかの判断です。プリセットに固定せず、indentとjustifyで上書きできます。書き落とせばプリセットの判断がそのまま使われるので、bookの体裁のまま字下げだけをやめる、といった指定ができます。justifyをfalseにすると行末の調整も止まります。両端揃えでなければ効かない調整だからです。",
        language: "HTML",
        code: `<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-style="book"
  data-indent="false"
></script>`
      },
      {
        id: "precision",
        index: "10",
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
        index: "11",
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
        index: "12",
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
        id: "version",
        index: "13",
        title: "バージョンを固定する",
        navLabel: "バージョン固定",
        language: "HTML",
        body: "/v1/は修正が出るたびに中身が入れ替わります。貼り直さずに改善を受け取れる代わりに、こちらの変更がそのまま届きます。変更のタイミングを自分で決めたい場合は、バージョンを含むURLを指定してください。こちらのファイルは書き換えられないため、1年間キャッシュされます。",
        code: `<script
  src="https://cdn.mojikumi.jp/{version}/mojikumi.min.js"
  data-target=".entry-content"
  data-style="article"
></script>`,
        list: [
          "現在の最新版は{version}です",
          "固定したURLは更新されないため、新しい版へ移るときは書き換えが必要です",
          "配信物が置き換わっていないことまで確かめるなら、ファイルからハッシュを作ってintegrity属性を付けます"
        ]
      },
      {
        id: "self-host",
        index: "14",
        title: "自分のサーバーへ置く",
        navLabel: "自己ホスト",
        language: "HTML",
        body: "CDNを使わない場合は、npmパッケージに含まれる同じファイルを自分のサーバーへ置けます。node_modules/mojikumi/dist/mojikumi.browser.jsを公開ディレクトリへコピーし、srcをそのパスに変えるだけです。動作は変わりません。",
        code: `<script src="/assets/mojikumi.min.js" data-style="article"></script>`
      },
      {
        id: "uninstall",
        index: "15",
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
      index: "16",
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
      "『日本語組版処理の要件（JLREQ）』は、行頭に置く始め括弧類の扱いに、ひとつの正解を定めていません。「改行行頭の字下げは全角アキ、折返し行頭は天付きとする」。これがJIS X 4051の採用した方式で、岩波書店の組版もこれにならいます〈W3C技術ノート（2012年）、3.1.5〉。\n\nもうひとつの方式を採るのが、文芸書の版元（講談社、新潮社、文藝春秋、中央公論新社、筑摩書房）です。「改行行頭の字下げは二分アキ、折返し行頭は天付きとする」。会話の多い小説では「『またあした』」のように括弧が入れ子で重なる行が続き、行頭が下がりすぎるという判断からでした。\n\n和文と欧文のあいだにも決まりがあります。「欧字・アラビア数字の前後に配置される平仮名、片仮名又は漢字等との字間は、四分アキとする」（同3.2.6）。〈補足（注記）〉や『引用（「孫引き」を含む）』のように約物が三重に重なる箇所、そしてHTMLやCSS、2026年のような表記が混ざる箇所ほど、この差は効いてきます。",
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
      justify: "両端揃えにする",
      indent: "段落の先頭を字下げする",
      presetNotes: {
        minimal: "標準CSSで届く範囲だけを整えます。行末は揃えません。",
        article: "両端揃えにして行末まで揃えます。日本語の本文はこれが自然です。",
        book: "articleに段落の字下げとぶら下げを加えた、書籍の体裁です。"
      },
      snippetNote: "この設定をそのまま貼り付けられます。",
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
    description: "Mojikumiの処理コストとレイアウトシフトの計測結果",
    eyebrow: "Performance & compatibility",
    heading: "処理速度と補完量を測る",
    lead: "Mojikumiは、ブラウザの標準実装が広がるほど処理量が減る設計です。そのため計測では、処理にかかる時間に加えて、補完のために追加されるDOMの量と、組み直しに要するコストも記録します。",
    status: {
      label: "Current status",
      title: "Chromiumで計測しました",
      body: "ブラウザが標準実装を持っている場合、10,000字の記事に対してMojikumiが追加する要素は1つだけです。その1つは注入するstyle要素で、本文には何も足していません。字組みのすべてを標準CSSが引き受けたという意味で、これが設計の前提でした。実装を持たないブラウザではフォールバックが動き、処理時間は6倍から9倍になります。FirefoxとWebKitはまだ揃えていないため、下の表のfullはその代役です。",
      link: "Playgroundで確かめる"
    },
    results: {
      eyebrow: "Results",
      title: "計測結果",
      tables: [
        {
          caption: "処理コスト",
          note: "Chromium 148.0.7778.96、幅1280px、書体はシステム標準のserif。7回実行した中央値です。autoはこのブラウザの読者が実際に受け取る経路、fullはネイティブ実装を使わずフォールバックを強制した経路で、CSS Text Level 4のプロパティを持たないブラウザの代役として測っています。",
          table: {
            head: [
              "本文",
              "経路",
              "初期処理",
              "再評価",
              "DOM増加",
              "生成要素",
              "ヒープ"
            ],
            rows: [
              ["1,000字", "auto", "2.6ms", "0.2ms", "1", "0", "74KB"],
              ["1,000字", "full", "15.2ms", "5.0ms", "136", "135", "197KB"],
              ["10,000字", "auto", "5.5ms", "0.2ms", "1", "0", "88KB"],
              [
                "10,000字",
                "full",
                "45.6ms",
                "140.5ms",
                "1,243",
                "1,242",
                "250KB"
              ],
              ["記事10本", "auto", "7.4ms", "0.3ms", "1", "0", "120KB"],
              [
                "記事10本",
                "full",
                "48.9ms",
                "148.5ms",
                "1,351",
                "1,350",
                "288KB"
              ]
            ]
          }
        },
        {
          caption: "レイアウトシフト",
          note: "同じブラウザで、40msの遅延を付けて配信したバンドルを対象に、layout-shiftエントリーの合計を測っています。段落数（8 / 40）で結果は変わりませんでした。以前Chromium 141で測ったときは、bodyの終わりに置いた場合だけモバイルで0.033が出ていました。148では貼らない場合の行送りが最初からMojikumiと同じで、差そのものが消えています。",
          table: {
            head: ["貼る場所", "デスクトップ1280px", "モバイル390px"],
            rows: [
              ["貼らない", "0", "0"],
              ["headの中", "0", "0"],
              ["bodyの終わり", "0", "0"]
            ]
          }
        }
      ]
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
        { term: "Chromium", description: "148.0.7778.96 / macOS。計測済み" },
        {
          term: "Firefox",
          description: "未計測。フォールバックが実際に動く環境のひとつ"
        },
        {
          term: "WebKit",
          description:
            "未計測。text-spacing-trimを持たないため、表のfullが実測に置き換わります"
        },
        { term: "Content", description: "1,000字・10,000字・記事10本の3種類" }
      ]
    },
    method: {
      label: "Method",
      title: "再現できる結果だけを公開する",
      body: "計測コードはリポジトリのscripts/measure-cost.mjsとscripts/measure-shift.mjsで、条件と読み方はBENCHMARKS.mdに書いています。npm run measure:costとnpm run measure:shiftで、お手元でも同じ手順を踏めます。数値は機械に依存するため、絶対値より、条件を変えたときの差のほうを見てください。どちらの計測も、設計上の前提が崩れたときに失敗します。標準実装のあるブラウザでフォールバックの要素が出た場合と、headに置いたタグがシフトを起こした場合です。"
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
