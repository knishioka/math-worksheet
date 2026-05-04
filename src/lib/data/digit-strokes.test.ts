import { describe, expect, it } from 'vitest';
import { DIGIT_STROKES } from './digit-strokes';

const SVG_NUMBER = String.raw`-?(?:\d+(?:\.\d+)?|\.\d+)`;
const SVG_MOVE_START_RE = new RegExp(
  String.raw`^M\s*(${SVG_NUMBER})[\s,]+(${SVG_NUMBER})`
);

describe('DIGIT_STROKES', () => {
  it('0〜9の全数字にストロークデータがある', () => {
    for (let digit = 0; digit <= 9; digit++) {
      expect(DIGIT_STROKES[digit]?.digit).toBe(digit);
      expect(DIGIT_STROKES[digit]?.strokes.length).toBeGreaterThan(0);
    }
  });

  it('矢印の始点が各ストロークの実際の書き始め位置と一致する', () => {
    for (const data of Object.values(DIGIT_STROKES)) {
      for (const stroke of data.strokes) {
        const match = stroke.path.match(SVG_MOVE_START_RE);

        expect(match).not.toBeNull();
        expect(stroke.arrowStart).toEqual({
          x: Number(match?.[1]),
          y: Number(match?.[2]),
        });
      }
    }
  });

  it('7は短い左縦を入れてから、横棒と斜め線を書く', () => {
    expect(DIGIT_STROKES[7].strokes).toHaveLength(2);
    expect(DIGIT_STROKES[7].strokes[0].path).toBe('M 22 28 L 22 52');
    expect(DIGIT_STROKES[7].strokes[1].path).toBe('M 22 26 L 80 26 L 38 124');
    expect(DIGIT_STROKES[7].strokes[1].badgeOffset).toEqual({ x: 18, y: 0 });
  });

  it('8は上下に丸を重ねず、中央で交差する一筆の字形にする', () => {
    const path = DIGIT_STROKES[8].strokes[0].path;

    expect(path).toContain('M 64 38');
    expect(path).toContain('42 62');
    expect(path).toContain('50 68');
    expect(path).toContain('66 80');
    expect(path).toContain('64 38');
  });

  it('9は右上から輪を書き、同じ流れで下へ下ろす', () => {
    expect(DIGIT_STROKES[9].strokes).toHaveLength(1);
    expect(DIGIT_STROKES[9].strokes[0].path).toBe(
      'M 72 44 C 72 28, 60 20, 46 22 C 29 24, 22 38, 24 54 C 27 73, 45 81, 60 72 C 70 66, 74 55, 72 44 C 74 66, 70 96, 62 124'
    );
  });
});
