#!/usr/bin/env python3
"""原稿（script.md）の「スライドに載せる文言」が、スライド（slides/index.html）に載っているかを照合する。

使い方: python3 check_slides.py <script.md> <slides/index.html>
結果:   全文言が見つかれば exit 0。見つからない文言があれば番号つきで表示して exit 1。
        枚数が違うときも exit 1。引数やファイルの誤りは exit 2。

■ 照合の対象
- script.md：見出し「## スライドN：…」ごとに、「**スライドに載せる文言**」の行から
  次の「**…**」行・「---」・次の「## 」見出しまでにある箇条書き（- で始まる行。入れ子も含む）。
  - 「ラベル：値」の形なら値だけを使う（例：「- 見出し：配属前の想像と現実」→「配属前の想像と現実」）。
  - 値が空の行（例：「- 箇条書き：」）は飛ばし、その下の入れ子の項目を照合する。
  - ラベルが SKIP_LABELS（演出・補足説明など）か「図」で終わるもの（図・循環図・構成図など）の行は照合しない。
    これらは文言ではなく、図や見せ方の説明なので。
    図の中の文字を照合したいときは、「- 図の文字：…」のように別の行に書く。
  - 行末に「（照合しない）」と書いた行も照合しない。
- index.html：`<section class="slide" …>` を出現順に取り出し、i 番目を script.md の i 番目のスライドと対応させる。
  発表者ノート（<aside class="notes">）は対象から外す。

■ 比べ方
- 両方とも、HTML タグを取り除き、文字参照を元に戻し、空白・改行をすべて取り除いてから比べる。
  <br> で改行していても一致する。句読点やかぎかっこはそのまま比べる。
- 値に「→」「／」で区切った複数の語があっても、全体で1つの文字列として探す。
"""
import html
import re
import sys

HEAD = re.compile(r"^##\s*スライド(\d+[a-z]?)[：:]")
SECTION = re.compile(r'<section\s+class="slide[^"]*"[^>]*>(.*?)</section>', re.S)
NOTES = re.compile(r"<aside\s+class=\"notes\"\s*>.*?</aside>", re.S)
TAG = re.compile(r"<[^>]+>")
SPACE = re.compile(r"\s+")
ITEM = re.compile(r"^\s*-\s+(.*)$")
SKIP_LABELS = {"図", "演出", "補足説明", "レイアウト", "配置", "メモ"}
NO_CHECK = "（照合しない）"


def norm(text: str) -> str:
    return SPACE.sub("", text)


def parse_script(path):
    slides = []  # [(no, [phrases])]
    cur = None
    in_block = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            m = HEAD.match(line)
            if m:
                cur = (m.group(1), [])
                slides.append(cur)
                in_block = False
                continue
            if cur is None:
                continue
            s = line.strip()
            if s.startswith("## ") or s == "---":
                in_block = False
                continue
            if s.startswith("**"):
                in_block = s.startswith("**スライドに載せる文言**")
                continue
            if not in_block:
                continue
            im = ITEM.match(line)
            if not im:
                continue
            body = im.group(1).strip()
            if body.endswith(NO_CHECK):
                continue
            if "：" in body:
                label, value = body.split("：", 1)
                label = label.strip()
                if label in SKIP_LABELS or label.endswith("図"):
                    continue
                # 「想像：…」のように値の側にラベルが残る書き方もあるので、値が空でなければ値を使う
                value = value.strip()
                if not value:
                    continue
                cur[1].append((body, value))
            else:
                cur[1].append((body, body))
    return slides


def parse_html(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    out = []
    for sec in SECTION.findall(text):
        sec = NOTES.sub("", sec)
        sec = html.unescape(TAG.sub("", sec))
        out.append(norm(sec))
    return out


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    try:
        script = parse_script(sys.argv[1])
        sections = parse_html(sys.argv[2])
    except OSError as e:
        print(f"ファイルを開けません: {e}")
        return 2
    if not script:
        print("script.md にスライド見出し（## スライドN：…）が見つかりません")
        return 2

    bad = 0
    if len(script) != len(sections):
        print(f"NG 枚数が違います（script.md {len(script)}枚 / スライド {len(sections)}枚）")
        bad += 1
    for i, (no, phrases) in enumerate(script):
        if i >= len(sections):
            print(f"NG スライド{no}：index.html に対応する section がありません")
            bad += 1
            continue
        sec = sections[i]
        missing = []
        for raw, value in phrases:
            v = norm(value)
            # 「想像：仕様書が…」のようにラベルごと表示している場合もあるので、全体でも探す
            if v not in sec and norm(raw) not in sec:
                missing.append(raw)
        if missing:
            bad += 1
            print(f"NG スライド{no}：見つからない文言 {len(missing)}件")
            for m in missing:
                print(f"   - {m}")
        else:
            print(f"OK スライド{no}（{len(phrases)}件）")
    if bad:
        print(f"\n不一致あり（script.md {len(script)}枚 / スライド {len(sections)}枚）")
        return 1
    print(f"\n一致（script.md {len(script)}枚 / スライド {len(sections)}枚）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
