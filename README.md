# Template 02 — Corporate Site
FAQ / News / お問い合わせフォームを備えたコーポレート想定のテンプレート。レスポンシブ対応。

## デモ
- Live: https://mmmiiiyyyaaazzz.github.io/template2-portfolio/
- Source: このリポジトリ

## 特徴
- レイアウト: CSS Grid / Flex（再利用ユーティリティ `snippets.css`）
- セクション: Hero / About / Services / FAQ / News / Works / Flow / Access / Contact
- アクセシビリティ: スキップリンク、フォーム完了メッセージ整備予定

## ファイル構成（抜粋）
/
├─ index.html
├─ css/
│ ├─ snippets.css
│ └─ theme.css
└─ img/
   └─ screenshot-hero.jpg

## 使い方
1. ZIPダウンロード or `git clone`
2. `index.html` をブラウザで開く（ビルド不要）
3. `css/snippets.css` の `:root` 変数（色・余白・幅）でトーン調整

## スクリーンショット
![Template 02](./img/screenshot-hero.jpg)

## 今後の予定
- フォーム完了メッセージに `aria-live` 付与
- 必須エラーの補助文と `aria-describedby` の整理
