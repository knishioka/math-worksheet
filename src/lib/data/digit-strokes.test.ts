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

  it('1は左上のはねを付けず、上から下への一本線にする', () => {
    expect(DIGIT_STROKES[1].strokes).toHaveLength(1);
    expect(DIGIT_STROKES[1].strokes[0].path).toBe('M 50 20 L 50 124');
  });

  it('7は短い左縦を入れてから、横棒と斜め線を書く', () => {
    expect(DIGIT_STROKES[7].strokes).toHaveLength(2);
    expect(DIGIT_STROKES[7].strokes[0].path).toBe('M 22 28 L 22 52');
    expect(DIGIT_STROKES[7].strokes[1].path).toBe('M 22 26 L 80 26 L 38 124');
    expect(DIGIT_STROKES[7].strokes[0].badgeOffset).toEqual({ x: -7, y: 9 });
    expect(DIGIT_STROKES[7].strokes[1].badgeOffset).toEqual({ x: 21, y: -7 });
  });

  it('8は上下に丸を重ねず、中央で交差する一筆の字形にする', () => {
    expect(DIGIT_STROKES[8].strokes).toHaveLength(1);
    expect(DIGIT_STROKES[8].strokes[0].path).toBe(
      'M 68 42 C 68 26, 54 18, 40 22 C 23 27, 22 50, 40 62 C 52 70, 64 76, 72 90 C 82 108, 68 126, 50 126 C 30 126, 20 112, 27 96 C 32 83, 43 75, 54 68 C 66 60, 76 52, 68 42'
    );
  });

  it('9は右上から輪を書き、同じ流れで下へ下ろす', () => {
    expect(DIGIT_STROKES[9].strokes).toHaveLength(1);
    expect(DIGIT_STROKES[9].strokes[0].path).toBe(
      'M 72 42 C 70 27, 58 19, 44 22 C 28 25, 21 39, 24 55 C 27 73, 45 81, 60 72 C 71 65, 76 53, 72 42 L 68 124'
    );
  });
});
