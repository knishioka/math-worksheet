import { randomInt } from '../../utils/math';
import { exercise, type StudioExercise } from './exercise';
import { gcd, lcm } from '../entrance-exam-shared';

function combinedMean(): StudioExercise {
  const small = randomInt(3, 8);
  const large = small * 2;
  const low = randomInt(55, 75);
  const difference = randomInt(2, 6) * 3;
  const high = low + difference;
  return exercise(
    [
      `${small}人の組の平均点は${low}点、${large}人の組の平均点は${high}点です。二組を合わせた平均点は何点ですか。`,
      `A group of ${small} pupils averages ${low} points. Another group of ${large} pupils averages ${high} points. What is the mean score of all the pupils?`,
    ],
    low + (difference * 2) / 3,
    ['点', 'points'],
    [
      `各組の合計点を足し、全員の人数で割る。`,
      `Recover each group total, then divide their sum by the total number of pupils.`,
    ],
    `(${small} × ${low} + ${large} × ${high}) ÷ ${small + large} = ${low + (difference * 2) / 3}`
  );
}

function replacedScore(): StudioExercise {
  const size = randomInt(4, 8);
  const mean = randomInt(58, 78);
  const old = randomInt(50, 68);
  const increase = randomInt(2, 4);
  return exercise(
    [
      `${size}人の平均点は${mean}点でした。${old}点の人が一人抜けて別の人が入ると、平均が${increase}点上がりました。新しく入った人は何点ですか。`,
      `A team of ${size} has a mean score of ${mean}. A member with ${old} points leaves. After a replacement joins, the mean rises by ${increase} points. What is the new member's score?`,
    ],
    old + size * increase,
    ['点', 'points'],
    [
      `人数は一定なので、合計点の増加分を抜けた人の点に足す。`,
      `The change in the total score equals the difference between the two members' scores.`,
    ],
    `${old} + ${size} × ${increase} = ${old + size * increase}`
  );
}

export const averages = [combinedMean, replacedScore] as const;

function squareTiles(): StudioExercise {
  const scale = randomInt(3, 10);
  const short = randomInt(2, 7) * scale;
  const long = short + scale;
  return exercise(
    [
      `縦${short}cm、横${long}cmの板を、切りくずが出ないよう同じ大きさの正方形に切ります。一辺を最大にすると何cmですか。`,
      `A ${short} cm by ${long} cm board is cut into identical squares without waste, along lines parallel to its edges. What is the greatest possible side length in centimetres?`,
    ],
    gcd(short, long),
    ['cm', 'cm'],
    [
      `一辺は縦と横の長さをどちらも割り切れる。共通の約数のうち最大を選ぶ。`,
      `The side length must divide both dimensions. Choose their greatest common factor.`,
    ],
    `${short} ÷ ${scale} = ${short / scale}, ${long} ÷ ${scale} = ${long / scale}`
  );
}

function threeRoutes(): StudioExercise {
  const a = randomInt(3, 6);
  const b = a + 1;
  const c = a + 2;
  const period = lcm(lcm(a, b), c);
  return exercise(
    [
      `三つのバス路線が${a}分、${b}分、${c}分おきに発車します。今同時に発車しました。次に三つがそろって発車するのは何分後ですか。`,
      `Three bus routes leave every ${a}, ${b} and ${c} minutes. They depart together now. In how many minutes will all three next depart together?`,
    ],
    period,
    ['分', 'minutes'],
    [
      `三つの間隔の最小公倍数を求める。`,
      `Find the first positive multiple shared by all three intervals.`,
    ],
    `${period} ÷ ${a} = ${period / a}, ${period} ÷ ${b} = ${period / b}, ${period} ÷ ${c} = ${period / c}`
  );
}

export const divisibility = [squareTiles, threeRoutes] as const;

function reversePercent(): StudioExercise {
  const initial = randomInt(4, 18) * 100;
  const sold = randomInt(2, 5) * 10;
  const second = randomInt(2, 5) * 10;
  const remaining = (initial * (100 - sold) * (100 - second)) / 10000;
  return exercise(
    [
      `本を初日に全体の${sold}％、翌日に残りの${second}％売り、${remaining}冊残りました。はじめは何冊ありましたか。`,
      `A shop sells ${sold}% of its books on Monday and ${second}% of the remaining books on Tuesday. It has ${remaining} books left. How many did it start with?`,
    ],
    initial,
    ['冊', 'books'],
    [
      `翌日、初日の順に、それぞれ売れ残った割合で割る。`,
      `Work backwards through the two fractions that remained.`,
    ],
    `${remaining} × 100 ÷ ${100 - second} × 100 ÷ ${100 - sold} = ${initial}`
  );
}

export const percentChange = [reversePercent] as const;

function convertSpeed(): StudioExercise {
  const metres = randomInt(3, 12) * 5;
  const seconds = randomInt(2, 6);
  const distance = metres * seconds;
  return exercise(
    [
      `電車は一定の速さで${seconds}秒間に${distance}m進みます。時速何kmですか。`,
      `A train covers ${distance} metres in ${seconds} seconds at constant speed. How many kilometres per hour is that?`,
    ],
    (metres * 36) / 10,
    ['km/h', 'km/h'],
    [
      `秒速に直してから、一時間の秒数をかけ、メートルをキロメートルに直す。`,
      `Find metres per second, then convert seconds to hours and metres to kilometres.`,
    ],
    `${distance} ÷ ${seconds} × 3600 ÷ 1000 = ${(metres * 36) / 10}`
  );
}

function returnSpeed(): StudioExercise {
  const scale = randomInt(2, 8);
  const slow = 3 * scale;
  const fast = 6 * scale;
  const distance = fast * randomInt(1, 4);
  return exercise(
    [
      `自転車で片道${distance}kmの道を往復します。行きは時速${slow}km、帰りは時速${fast}kmで、休みません。往復の平均の速さは時速何kmですか。`,
      `A cyclist rides ${distance} km out at ${slow} km/h and returns the same way at ${fast} km/h without stopping. What is the average speed for the whole ride?`,
    ],
    4 * scale,
    ['km/h', 'km/h'],
    [
      `往復の道のりを、行きと帰りにかかった時間の合計で割る。`,
      `Divide the total distance by the sum of the two travel times.`,
    ],
    `${distance * 2} ÷ (${distance} ÷ ${slow} + ${distance} ÷ ${fast}) = ${4 * scale}`
  );
}

export const speedUnits = [convertSpeed, returnSpeed] as const;

function moveVertex(): StudioExercise {
  const base = randomInt(4, 10) * 2;
  const height = randomInt(4, 12);
  const shift = randomInt(2, 8);
  return exercise(
    [
      `底辺${base}cm、高さ${height}cmの三角形で、頂点を底辺と平行に${shift}cm動かし、底辺の両端と結び直します。新しい三角形の面積は何cm²ですか。`,
      `A triangle has a base of ${base} cm and a height of ${height} cm. Its opposite vertex slides ${shift} cm parallel to the base. What is the area of the new triangle on the same base?`,
    ],
    (base * height) / 2,
    ['cm²', 'cm²'],
    [
      `平行に動かしても底辺までの垂直な距離は変わらない。`,
      `Sliding parallel to the base preserves the perpendicular height.`,
    ],
    `${base} × ${height} ÷ 2 = ${(base * height) / 2}`
  );
}

function equalRectangle(): StudioExercise {
  const width = randomInt(4, 12);
  const height = randomInt(4, 10);
  const base = width;
  return exercise(
    [
      `縦${height}cm、横${width}cmの長方形と同じ面積の三角形を作ります。底辺を${base}cmにすると、高さは何cmですか。`,
      `A triangle must cover the same area as a ${height} cm by ${width} cm rectangle. If its base is ${base} cm, how high must it be?`,
    ],
    2 * height,
    ['cm', 'cm'],
    [
      `長方形の面積を二倍して、三角形の底辺で割る。`,
      `Double the rectangle's area and divide by the triangle's base.`,
    ],
    `2 × ${height} × ${width} ÷ ${base} = ${2 * height}`
  );
}

export const equalArea = [moveVertex, equalRectangle] as const;

function splitTriangle(): StudioExercise {
  const left = randomInt(2, 7);
  const right = randomInt(2, 7);
  const part = randomInt(3, 10);
  const total = (left + right) * part;
  return exercise(
    [
      `三角形ABCの面積は${total}cm²です。灰色の三角形の面積は何cm²ですか。`,
      `Triangle ABC has area ${total} cm². What is the area of the shaded triangle?`,
    ],
    left * part,
    ['cm²', 'cm²'],
    [
      `頂点Aから直線BCまでの高さが共通なので、面積の比は底辺の比と等しい。`,
      `Both triangles have the same altitude from A, so their areas follow their base lengths.`,
    ],
    `${total} × ${left} ÷ (${left} + ${right}) = ${left * part}`,
    { kind: 'split-triangle', left, right, midpoint: false }
  );
}

function trapezoidDiagonals(): StudioExercise {
  const top = randomInt(2, 4);
  const bottom = top + randomInt(1, 3);
  const unit = randomInt(2, 6);
  const smallArea = top * top * unit;
  const whole = (top + bottom) ** 2 * unit;
  return exercise(
    [
      `図の台形の上底と下底の比は${top}：${bottom}です。灰色の三角形の面積が${smallArea}cm²のとき、台形全体は何cm²ですか。`,
      `The top and bottom bases of the trapezoid are in the ratio ${top}:${bottom}. The shaded triangle has area ${smallArea} cm². What is the whole area?`,
    ],
    whole,
    ['cm²', 'cm²'],
    [
      `上下の三角形は相似で高さの比も${top}:${bottom}。台形の高さは上の三角形の高さの${top + bottom}/${top}倍になる。`,
      `The top and bottom triangles are similar, so their heights are in the ratio ${top}:${bottom}. The full height is ${top + bottom}/${top} times the top height.`,
    ],
    `${smallArea} × (${top + bottom}/${top}) × (${top + bottom}/${top}) = ${whole}`,
    { kind: 'trapezoid-diagonals', top, bottom }
  );
}

function midpointArea(): StudioExercise {
  const left = randomInt(2, 7);
  const right = randomInt(2, 7);
  const part = randomInt(2, 6);
  const total = (left + right) * 2 * part;
  return exercise(
    [
      `三角形ABCの面積は${total}cm²で、EはADの中点です。灰色の三角形の面積は何cm²ですか。`,
      `Triangle ABC has area ${total} cm². E is the midpoint of AD. What is the area of the shaded triangle?`,
    ],
    left * part,
    ['cm²', 'cm²'],
    [
      '底辺BDとBCの比から三角形ABDの面積を求める。BEは底辺ADを二等分するので、三角形BDEはその半分。',
      'Use BD as a fraction of BC to find the area of ABD. BE halves base AD, so BDE has half the area of ABD.',
    ],
    `${total} × ${left} ÷ (${left} + ${right}) ÷ 2 = ${left * part}`,
    { kind: 'split-triangle', left, right, midpoint: true }
  );
}

export const triangleRatio = [
  splitTriangle,
  trapezoidDiagonals,
  midpointArea,
] as const;

function mixedSales(): StudioExercise {
  const count = randomInt(12, 30);
  const full = randomInt(4, 10);
  const price = randomInt(4, 9) * 10;
  const sale = price - 10;
  const total = full * price + (count - full) * sale;
  return exercise(
    [
      `店がノート${count}冊を売りました。定価は${price}円、特売価格は${sale}円で、売上は${total}円でした。定価で売れたのは何冊ですか。`,
      `A stall sells ${count} notebooks. The regular price is ${price} yen and the sale price is ${sale} yen. Receipts total ${total} yen. How many sold at the regular price?`,
    ],
    full,
    ['冊', 'notebooks'],
    [
      `全部を特売価格で売ったときの売上との差を使う。`,
      `Compare the receipts with the amount if every book had sold at the sale price.`,
    ],
    `(${total} − ${count} × ${sale}) ÷ (${price} − ${sale}) = ${full}`
  );
}

function saltExchange(): StudioExercise {
  const mass = randomInt(2, 8) * 100;
  const percent = randomInt(2, 8) * 2;
  const removed = mass / 2;
  return exercise(
    [
      `よく混ぜた${percent}％の食塩水${mass}gから${removed}gを取り出し、同じ重さの水を加えます。もう一度混ぜると濃度は何％ですか。`,
      `From ${mass} g of well-mixed ${percent}% salt solution, ${removed} g is removed and replaced with the same mass of pure water. What is the new salt percentage?`,
    ],
    percent / 2,
    ['％', '%'],
    [
      `取り出した後の食塩だけが残り、全体の重さはもとに戻る。`,
      `Only the salt in the retained solution remains, while the total mass returns to its original value.`,
    ],
    `${percent} × (${mass} − ${removed}) ÷ ${mass} = ${percent / 2}`
  );
}

function twoMixtures(): StudioExercise {
  const mass = randomInt(2, 6) * 100;
  const low = randomInt(1, 4);
  const high = low + randomInt(2, 5) * 3;
  const result = (2 * low + high) / 3;
  return exercise(
    [
      `同じ重さ${mass}gの食塩水が二つあり、Aは${low}％、Bは${high}％です。Aの半分をBに入れてよく混ぜ、同じ重さをBからAに戻します。Aの濃度は何％ですか。`,
      `Two beakers each hold ${mass} g of salt solution. A is ${low}% salt and B is ${high}%. Pour half of A into B, stir thoroughly, then pour the same mass back into A. What is A's final salt percentage?`,
    ],
    result,
    ['％', '%'],
    [
      '最初に混ぜたBはA由来一に対してB由来二。戻した後のAでは、元の液とBから戻した液の重さが等しい。',
      'After the first pour, B contains one part from A and two original parts from B. The final A mixes equal masses of its original solution and this mixture.',
    ],
    `(${low} + (${low} + 2 × ${high}) ÷ 3) ÷ 2 = ${result}`
  );
}

function ratioTransfer(): StudioExercise {
  const unit = randomInt(3, 12);
  const small = randomInt(2, 5);
  const large = small + randomInt(3, 5);
  const transfer = unit * 2;
  return exercise(
    [
      `姉と妹のカードの枚数の比は${large}:${small}です。姉が妹に${transfer}枚渡すと、姉は全体の${large - 2}/${large + small}を持つことになります。初めの姉のカードは何枚ですか。`,
      `Two sisters have cards in the ratio ${large}:${small}, older to younger. The older sister gives the younger ${transfer} cards and now holds ${large - 2}/${large + small} of their total. How many cards did the older sister start with?`,
    ],
    large * unit,
    ['枚', 'cards'],
    [
      '全体は変わらない。姉が失った全体の割合と、渡した枚数を対応させる。',
      'The total stays fixed. Compare the older sister’s shares of that same total before and after the transfer.',
    ],
    `${transfer} ÷ (${large} − ${large - 2}) × ${large} = ${large * unit}`
  );
}

export const exchange = [
  mixedSales,
  saltExchange,
  twoMixtures,
  ratioTransfer,
] as const;
