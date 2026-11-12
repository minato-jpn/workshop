#!/usr/bin/env python3
"""LT原稿の字数と話す速さ（字/秒）をスライドごとに集計する。

使い方: python3 pace.py script.md [--max 5.5]
前提: 見出し「## スライドN：パート名（M秒）」の下に、話す原稿を引用ブロック（> ）で書く。
字数は引用ブロック内の文字のみ。空白・改行は除外。
"""
import re
import sys

HEAD = re.compile(r"^##\s*スライド(\d+[a-z]?)[：:].*?（(\d+)秒）")


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    path = sys.argv[1]
    limit = 5.5
    if "--max" in sys.argv:
        i = sys.argv.index("--max")
        try:
            limit = float(sys.argv[i + 1])
        except (IndexError, ValueError):
            print("--max には数値を指定してください（例: --max 5.5）")
            return 2

    slides = []  # [no, sec, chars]
    cur = None
    with open(path, encoding="utf-8") as f:
        for line in f:
            m = HEAD.match(line)
            if m:
                cur = [m.group(1), int(m.group(2)), 0]
                slides.append(cur)
                continue
            if line.startswith("## "):
                cur = None
                continue
            if cur and line.startswith(">"):
                text = re.sub(r"\s", "", line[1:])
                cur[2] += len(text)

    if not slides:
        print("スライド見出し（## スライドN：…（M秒））が見つかりません")
        return 1

    total_s = total_c = 0
    over = []
    print("| No | 秒 | 字数 | 字/秒 |")
    print("| --- | --- | --- | --- |")
    for no, sec, chars in slides:
        rate = chars / sec if sec else 0
        mark = " ⚠" if rate > limit else ""
        if mark:
            over.append(no)
        print(f"| {no} | {sec} | {chars} | {rate:.2f}{mark} |")
        total_s += sec
        total_c += chars
    print(f"| 合計 | {total_s} | {total_c:,} | {total_c / total_s:.2f} |")
    if over:
        print(f"\n上限 {limit} 字/秒 超過: スライド {', '.join(map(str, over))}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
