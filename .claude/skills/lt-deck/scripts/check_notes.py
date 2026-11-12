#!/usr/bin/env python3
"""発表者ノート（slides/index.html）と原稿（script.md）の「話す原稿」を照合する。

使い方: python3 check_notes.py <script.md> <slides/index.html>
結果:   全スライド一致なら exit 0。不一致（枚数違いを含む）があれば番号と差分を出して exit 1。
        引数やファイルの誤りは exit 2。

■ 照合の対象
- script.md：見出し「## スライドN：…」（N は 6a のような枝番も可）ごとに、
  「**話す原稿**」の行から次の「**…**」行・「---」・次の「## 」見出しまでのあいだにある
  引用行（> で始まる行）だけを使う。行頭の「>」と直後の空白1つを取り除く。
- index.html：`<aside class="notes">…</aside>` を出現順に取り出す。
  i 番目のノートを script.md の i 番目のスライドと対応させる（番号ではなく順番で対応）。

■ 照合の前に取り除くもの（マーカー規則）
1. `<p class="cue">…</p>` の段落を丸ごと取り除く。
   秒数（⏱ 26秒（累計 0:26））・演出メモ・「このLTの山場」などは、すべてこの段落に書く決まり。
2. 全角の角かっこ［…］で囲んだ部分を取り除く。
   例：［削る候補①：最初に削る］。かっこの中だけを取り除き、続く本文（削る候補の文そのもの）は残して照合する。
3. HTML タグ（<strong> <span class="cut"> <br> など）を取り除き、文字参照（&amp; など）を元に戻す。
4. 両方とも、空白・改行をすべて取り除いてから比べる（全角スペースも含む）。
   句読点やかぎかっこは取り除かない。文言の違いとして検出する。
"""
import difflib
import html
import re
import sys

HEAD = re.compile(r"^##\s*スライド(\d+[a-z]?)[：:]")
NOTES = re.compile(r'<aside\s+class="notes"\s*>(.*?)</aside>', re.S)
CUE = re.compile(r'<p\s+class="cue"\s*>.*?</p>', re.S)
BRACKET = re.compile(r"［[^］]*］")
TAG = re.compile(r"<[^>]+>")
SPACE = re.compile(r"\s+")


def norm(text: str) -> str:
    return SPACE.sub("", text)


def parse_script(path: str):
    """[(スライド番号, 話す原稿の正規化テキスト)] を返す。"""
    slides = []
    cur = None
    in_speech = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            m = HEAD.match(line)
            if m:
                cur = [m.group(1), []]
                slides.append(cur)
                in_speech = False
                continue
            if line.startswith("## "):
                cur, in_speech = None, False
                continue
            if cur is None:
                continue
            s = line.strip()
            if s.startswith("**話す原稿**"):
                in_speech = True
                continue
            if s.startswith("**") or s == "---":
                in_speech = False
                continue
            if in_speech and line.startswith(">"):
                body = line[1:]
                if body.startswith(" "):
                    body = body[1:]
                cur[1].append(body)
    return [(no, norm("".join(lines))) for no, lines in slides]


def parse_notes(path: str):
    with open(path, encoding="utf-8") as f:
        src = f.read()
    out = []
    for raw in NOTES.findall(src):
        t = CUE.sub("", raw)
        t = BRACKET.sub("", t)
        t = html.unescape(TAG.sub("", t))
        out.append(norm(t))
    return out


def show_diff(expected: str, actual: str) -> None:
    sm = difflib.SequenceMatcher(None, expected, actual, autojunk=False)
    for op, a1, a2, b1, b2 in sm.get_opcodes():
        if op == "equal":
            continue
        ctx = expected[max(0, a1 - 12):a1]
        print(f"    {op}: …{ctx}［原稿:「{expected[a1:a2]}」→ ノート:「{actual[b1:b2]}」］")


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    script_path, html_path = sys.argv[1], sys.argv[2]
    try:
        script = parse_script(script_path)
        notes = parse_notes(html_path)
    except OSError as e:
        print(f"ファイルを開けません: {e}")
        return 2
    if not script:
        print(f"{script_path} に「## スライドN：」の見出しが見つかりません")
        return 2

    ng = 0
    if len(script) != len(notes):
        print(f"NG 枚数が違います：script.md {len(script)}枚 / ノート {len(notes)}枚")
        ng += 1
    for i, (no, expected) in enumerate(script):
        if i >= len(notes):
            print(f"NG スライド{no}：対応するノートがありません")
            ng += 1
            continue
        actual = notes[i]
        if not expected:
            print(f"NG スライド{no}：script.md に「話す原稿」の引用行がありません")
            ng += 1
        elif expected == actual:
            print(f"OK スライド{no}（{len(expected)}字）")
        else:
            print(f"NG スライド{no}：ノートと原稿が一致しません")
            show_diff(expected, actual)
            ng += 1

    print(f"\n{'一致' if ng == 0 else f'不一致 {ng} 件'}（script.md {len(script)}枚 / ノート {len(notes)}枚）")
    return 1 if ng else 0


if __name__ == "__main__":
    sys.exit(main())
