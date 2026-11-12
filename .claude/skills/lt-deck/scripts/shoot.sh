#!/usr/bin/env bash
# shoot.sh — html-ppt のスライドを Linux の headless Chrome で1枚ずつ PNG に撮る
#
# 使い方: shoot.sh <slides/index.html> <出力ディレクトリ> [枚数]
#   枚数を省略すると、index.html の <section class="slide"> の数を使う。
#
# 出力:  <出力ディレクトリ>/s1.png … sN.png と、まとめのタイル画像 grid.png（Pillow があるとき）
# 結果:  全スライド撮影でき、白紙がなければ exit 0。白紙・撮影失敗があれば exit 1。引数の誤りは exit 2。
#
# 撮り方の要点:
#   - #/N で開くとスライド切り替えのトランジション途中が撮れて白紙になるので、?preview=N で開く。
#   - さらに、index.html と同じフォルダに一時コピーを作り、トランジションとアニメーションを無効にする
#     （相対パスの assets/ を解決するため、同じフォルダに置く）。一時ファイルは終了時に必ず消す。
#   - html-ppt 付属の render.sh は macOS の Chrome パス前提なので使わない。

set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  sed -n '2,9p' "$0" | sed 's|^# \{0,1\}||'
  exit 2
fi

HTML="$1"
OUT="$2"
if [[ ! -f "$HTML" ]]; then echo "error: $HTML がありません" >&2; exit 2; fi

DIR="$(cd "$(dirname "$HTML")" && pwd)"
HTML_ABS="$DIR/$(basename "$HTML")"
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"

if [[ $# -eq 3 ]]; then
  COUNT="$3"
  [[ "$COUNT" =~ ^[0-9]+$ && "$COUNT" -gt 0 ]] || { echo "error: 枚数は正の整数で指定してください" >&2; exit 2; }
else
  COUNT="$(grep -o '<section class="slide[" ]' "$HTML_ABS" | wc -l)"
  [[ "$COUNT" -gt 0 ]] || { echo "error: <section class=\"slide\"> が見つかりません。枚数を指定してください" >&2; exit 2; }
fi

CHROME=""
for c in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$c" >/dev/null 2>&1; then CHROME="$c"; break; fi
done
[[ -n "$CHROME" ]] || { echo "error: google-chrome / chromium が見つかりません" >&2; exit 2; }

TMP="$(mktemp "$DIR/.shoot-XXXXXX.html")"
trap 'rm -f "$TMP"' EXIT

NOANIM='<style>.slide,.slide *{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}</style>'
# </head> の直前に差し込む（最初の1か所のみ）
awk -v s="$NOANIM" '!done && /<\/head>/ { sub(/<\/head>/, s "</head>"); done=1 } { print }' "$HTML_ABS" > "$TMP"
grep -q 'animation-duration:0s' "$TMP" || { echo "error: </head> が見つからず、無効化用の CSS を差し込めませんでした" >&2; exit 1; }

echo "撮影: $COUNT 枚（$CHROME）→ $OUT"
FAIL=0
for i in $(seq 1 "$COUNT"); do
  rm -f "$OUT/s$i.png"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1920,1080 --virtual-time-budget=3000 \
    --screenshot="$OUT/s$i.png" "file://$TMP?preview=$i" >/dev/null 2>&1 || true
  if [[ ! -s "$OUT/s$i.png" ]]; then echo "  NG s$i.png：撮影に失敗"; FAIL=1; fi
done

# 白紙判定とタイル画像（Pillow があるとき）
if python3 -c 'import PIL' 2>/dev/null; then
  python3 - "$OUT" "$COUNT" <<'PY' || FAIL=1
import sys, os
from PIL import Image, ImageChops
out, n = sys.argv[1], int(sys.argv[2])
blank, ims = [], []
for i in range(1, n + 1):
    p = os.path.join(out, f"s{i}.png")
    if not os.path.exists(p):
        continue
    im = Image.open(p).convert("RGB")
    bg = Image.new("RGB", im.size, im.getpixel((2, 2)))
    bbox = ImageChops.difference(im, bg).getbbox()
    # 背景色と違う画素がほとんどない＝白紙とみなす
    ink = 0 if bbox is None else (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
    if ink < 2000:
        blank.append(i)
        print(f"  NG s{i}.png：白紙の可能性（背景以外の領域がほぼない）")
    else:
        print(f"  OK s{i}.png")
    ims.append(im)
if ims:
    cols = 3
    w, h = 640, 360
    rows = (len(ims) + cols - 1) // cols
    grid = Image.new("RGB", (cols * w, rows * h), (128, 128, 128))
    for k, im in enumerate(ims):
        grid.paste(im.resize((w, h)), ((k % cols) * w, (k // cols) * h))
    grid.save(os.path.join(out, "grid.png"))
    print(f"タイル画像: {os.path.join(out, 'grid.png')}")
sys.exit(1 if blank else 0)
PY
else
  echo "（Pillow がないため、白紙判定とタイル画像は省略しました。s*.png を直接見てください）"
fi

if [[ "$FAIL" -ne 0 ]]; then echo "結果: NG"; exit 1; fi
echo "結果: OK"
