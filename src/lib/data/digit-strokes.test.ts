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

  it('7は左端の縦棒を足さず、横棒から斜め下へ一筆で書く', () => {
    expect(DIGIT_STROKES[7].strokes).toHaveLength(1);
    expect(DIGIT_STROKES[7].strokes[0].path).toBe('M 20 26 L 82 26 L 38 124');
  });

  it('8は上下同径の丸ではなく、中央のくびれと大きめの下ループを持つ', () => {
    const path = DIGIT_STROKES[8].strokes[0].path;

    expect(path).toContain('50 68');
    expect(path).toContain('76 103');
    expect(path).toContain('50 128');
  });

  it('9は上の輪から続けて下へ伸ばし、下端を巻かずに止める', () => {
    expect(DIGIT_STROKES[9].strokes).toHaveLength(1);
    expect(DIGIT_STROKES[9].strokes[0].path).toBe(
      'M 74 50 C 74 32, 62 20, 50 20 C 34 20, 24 33, 24 50 C 24 66, 36 76, 50 76 C 65 76, 74 66, 74 50 L 74 124'
    );
  });
});
