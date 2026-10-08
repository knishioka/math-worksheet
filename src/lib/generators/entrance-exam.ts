import type { WordProblem } from '../../types';
import type { EntranceExamPattern } from '../../config/entrance-exam-patterns';
import { generateId, randomInt } from '../utils/math';
import {
  entranceWord as word,
  type EntranceContent as Content,
} from './entrance-exam-shared';
import { UPPER_ENTRANCE_GENERATORS } from './entrance-exam-upper';

function sumDifference(index: number): Content {
  const small = randomInt(10, 80);
  const difference = randomInt(5, 40);
  const large = small + difference;
  const total = small + large;
  const askLarge = index % 2 === 0;
  return word(
    `あおいさんとけんさんのビー玉は、合わせて${total}個です。あおいさんの方が${difference}個多く持っています。${askLarge ? 'あおい' : 'けん'}さんのビー玉は何個ですか。`,
    askLarge ? large : small,
    '個',
    [
      `合計から差を引くと、少ない方の2人分になる。${total}−${difference}＝${small * 2}（個）。`,
      `けんさんは${small * 2}÷2＝${small}（個）。`,
      ...(askLarge
        ? [`あおいさんは${small}＋${difference}＝${large}（個）。`]
        : []),
    ]
  );
}

function treePlanting(index: number): Content {
  const gaps = randomInt(5, 25);
  const interval = randomInt(2, 8);
  const length = gaps * interval;
  const variant = index % 4;
  const conditions = [
    '道の片側に、両端にも木を植えます。',
    '道の片側に、片方の端には木を植え、もう片方の端には植えません。',
    '道の片側に、両端には木を植えず、道の内側だけに植えます。',
    '池のまわりを1周するように木を植えます。',
  ];
  const adjustment = variant === 0 ? 1 : variant === 2 ? -1 : 0;
  const answer = gaps + adjustment;
  const reason = [
    `両端に植えると、本数は間の数より1多い。${gaps}＋1＝${answer}（本）。`,
    `片端だけに植えると、本数と間の数は同じ。${answer}本。`,
    `両端に植えないと、本数は間の数より1少ない。${gaps}−1＝${answer}（本）。`,
    `輪に植えると、本数と間の数は同じ。${answer}本。`,
  ][variant];
  const endSpacing =
    variant === 1
      ? `木を植えない端から、いちばん近い木までも${interval}mです。`
      : variant === 2
        ? `両端から、いちばん近い木までもそれぞれ${interval}mです。`
        : '';
  return word(
    `${variant === 3 ? '池のまわりの長さ' : '道の長さ'}は${length}mです。${conditions[variant]}木と木の間は${interval}mにそろえます。${endSpacing}木は全部で何本必要ですか。`,
    answer,
    '本',
    [`間の数は${length}÷${interval}＝${gaps}。`, reason]
  );
}

function craneTurtle(index: number): Content {
  const lowCount = randomInt(2, 20);
  const highCount = randomInt(2, 20);
  const count = lowCount + highCount;
  if (index % 2 === 0) {
    const legs = lowCount * 2 + highCount * 4;
    return word(
      `つるとかめが合わせて${count}匹います。足は全部で${legs}本です。つるの足を2本、かめの足を4本として、かめは何匹いますか。`,
      highCount,
      '匹',
      [
        `全部つると考えると、足は${count}×2＝${count * 2}（本）。`,
        `実際の足は${legs}−${count * 2}＝${highCount * 2}（本）多い。`,
        `つる1匹をかめに替えると足が4−2＝2（本）増える。かめは${highCount * 2}÷2＝${highCount}（匹）。`,
      ]
    );
  }
  const lowPrice = randomInt(3, 8) * 10;
  const difference = randomInt(1, 4) * 10;
  const highPrice = lowPrice + difference;
  const total = lowPrice * lowCount + highPrice * highCount;
  const extra = difference * highCount;
  return word(
    `1個${lowPrice}円の消しゴムと、1本${highPrice}円のえんぴつを、合わせて${count}点買いました。代金は${total}円です。えんぴつは何本買いましたか。`,
    highCount,
    '本',
    [
      `全部消しゴムと考えると、代金は${lowPrice}×${count}＝${lowPrice * count}（円）。`,
      `実際の代金との差は${total}−${lowPrice * count}＝${extra}（円）。`,
      `消しゴム1個をえんぴつ1本に替えると${highPrice}−${lowPrice}＝${difference}（円）増える。えんぴつは${extra}÷${difference}＝${highCount}（本）。`,
    ]
  );
}

function differenceGathering(index: number): Content {
  const count = randomInt(5, 30);
  if (index % 2 === 0) {
    const lowPrice = randomInt(4, 12) * 10;
    const difference = randomInt(1, 5) * 10;
    const highPrice = lowPrice + difference;
    const extra = count * difference;
    return word(
      `同じ冊数のノートを買います。1冊${lowPrice}円のノートを買うときより、1冊${highPrice}円のノートを買うときの方が、代金は${extra}円高くなります。買うノートは何冊ですか。`,
      count,
      '冊',
      [
        `1冊あたりの差は${highPrice}−${lowPrice}＝${difference}（円）。`,
        `全体の差を1冊あたりの差で割る。${extra}÷${difference}＝${count}（冊）。`,
      ]
    );
  }
  const low = randomInt(3, 8);
  const difference = randomInt(2, 6);
  const high = low + difference;
  const extra = count * difference;
  return word(
    `同じ日数だけ計算の練習をします。毎日${low}問ずつ解くときより、毎日${high}問ずつ解くときの方が、解く問題は全部で${extra}問多くなります。練習する日数は何日ですか。`,
    count,
    '日',
    [
      `1日あたりの差は${high}−${low}＝${difference}（問）。`,
      `全体の差を1日あたりの差で割る。${extra}÷${difference}＝${count}（日）。`,
    ]
  );
}

function excessShortage(index: number): Content {
  const people = randomInt(8, 30);
  const low = randomInt(3, 8);
  const difference = randomInt(2, 5);
  const high = low + difference;
  const adjustment = randomInt(1, people - 1);
  const variant = index % 3;
  const total =
    variant === 0
      ? low * people + adjustment
      : variant === 1
        ? high * people + adjustment
        : low * people - adjustment;
  const lowBalance = total - low * people;
  const highBalance = total - high * people;
  const describeBalance = (balance: number): string =>
    balance > 0 ? `${balance}個余り` : `${-balance}個足りなくなり`;
  const surplusDifference = lowBalance - highBalance;
  const calculation =
    variant === 0
      ? `${lowBalance}＋${-highBalance}`
      : variant === 1
        ? `${lowBalance}−${highBalance}`
        : `${-highBalance}−${-lowBalance}`;
  return word(
    `子どもたちにあめを配ります。1人に${low}個ずつ配ると${describeBalance(lowBalance)}、1人に${high}個ずつ配ると${describeBalance(highBalance)}ます。子どもは何人いますか。`,
    people,
    '人',
    [
      `1人あたりに配る数の差は${high}−${low}＝${difference}（個）。`,
      `${variant === 0 ? '余りと不足を足す' : variant === 1 ? '余りの差を求める' : '不足の差を求める'}と、追加で必要なあめは${calculation}＝${surplusDifference}（個）。`,
      `人数は${surplusDifference}÷${difference}＝${people}（人）。`,
    ]
  );
}

function elimination(index: number): Content {
  const pencilPrice = randomInt(5, 12) * 10;
  const eraserPrice = randomInt(2, 6) * 10;
  const pencils = randomInt(1, 4);
  const erasers = randomInt(1, 4);
  const scale = index % 2 === 0 ? 1 : randomInt(2, 3);
  const extra = randomInt(1, 4);
  const secondPencils = pencils * scale;
  const secondErasers = erasers * scale + extra;
  const firstTotal = pencils * pencilPrice + erasers * eraserPrice;
  const secondTotal = secondPencils * pencilPrice + secondErasers * eraserPrice;
  const extraCost = extra * eraserPrice;
  return word(
    `えんぴつ${pencils}本と消しゴム${erasers}個で${firstTotal}円、えんぴつ${secondPencils}本と消しゴム${secondErasers}個で${secondTotal}円です。同じ種類の品物は、どれも同じ値段です。消しゴム1個の値段は何円ですか。`,
    eraserPrice,
    '円',
    [
      ...(scale === 1
        ? [`2つの買い物は、えんぴつがどちらも${pencils}本。`]
        : [
            `最初の買い物を${scale}倍すると、えんぴつ${secondPencils}本と消しゴム${erasers * scale}個で${firstTotal}×${scale}＝${firstTotal * scale}（円）。`,
          ]),
      `そろえて引くと、消しゴム${secondErasers}−${erasers * scale}＝${extra}（個）分の代金は${secondTotal}−${firstTotal * scale}＝${extraCost}（円）。`,
      `消しゴム1個は${extraCost}÷${extra}＝${eraserPrice}（円）。`,
    ]
  );
}

const GENERATORS: Record<EntranceExamPattern, (index: number) => Content> = {
  ...UPPER_ENTRANCE_GENERATORS,
  'entrance-sum-difference-jap': sumDifference,
  'entrance-tree-planting-jap': treePlanting,
  'entrance-crane-turtle-jap': craneTurtle,
  'entrance-difference-gathering-jap': differenceGathering,
  'entrance-excess-shortage-jap': excessShortage,
  'entrance-elimination-jap': elimination,
};

export function generateEntranceExamProblems(
  pattern: EntranceExamPattern,
  count: number
): WordProblem[] {
  // 2・3・4条件の巡回の開始位置を変え、少ない問題数でも同じ条件だけに偏らせない。
  const start = randomInt(0, 11);
  return Array.from({ length: count }, (_, index) => ({
    ...GENERATORS[pattern](index + start),
    id: `${generateId()}-${index}`,
  }));
}
