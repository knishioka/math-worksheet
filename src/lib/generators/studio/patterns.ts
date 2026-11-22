import { randomInt } from '../../utils/math';
import { exercise, type StudioExercise } from './exercise';

function beadPosition(): StudioExercise {
  const period = randomInt(3, 7);
  const position = randomInt(3, 12) * period + randomInt(0, period - 1);
  const answer = ((position - 1) % period) + 1;
  return exercise(
    [
      `ビーズに1から${period}まで順に番号を書き、同じ並びをくり返します。最初から${position}個目の番号はいくつですか。`,
      `A necklace repeats the numbers 1 to ${period} in order. What number is on bead ${position}, counting from the start?`,
    ],
    answer,
    ['', ''],
    [
      `直前までのビーズを完全な組と残りに分け、次の番号を読む。`,
      `Remove full groups before the target bead, then count one more.`,
    ],
    `${position - 1} ÷ ${period} → ${Math.floor((position - 1) / period)} … ${(position - 1) % period}, ${(position - 1) % period} + 1 = ${answer}`
  );
}

function sharedBell(): StudioExercise {
  const a = randomInt(2, 5);
  const b = a + 1;
  const period = a * b;
  const end = period * randomInt(2, 6) + randomInt(0, period - 1);
  return exercise(
    [
      `ベルAは${a}分ごと、ベルBは${b}分ごとに鳴ります。今、同時に鳴りました。今の回を除き、${end}分後までに何回同時に鳴りますか。`,
      `Two bells ring every ${a} and ${b} minutes. They ring together now. Excluding now, how many times will they ring together in the next ${end} minutes, including the endpoint?`,
    ],
    Math.floor(end / period),
    ['回', 'times'],
    [
      `同時に鳴る間隔は最小公倍数。その間隔が何回入るか数える。`,
      `The bells coincide at multiples of their first common interval.`,
    ],
    `${a} × ${b} = ${period}, ${end} ÷ ${period} → ${Math.floor(end / period)} … ${end % period}`
  );
}

export const cycle = [beadPosition, sharedBell] as const;

function sumOfRows(): StudioExercise {
  const first = randomInt(3, 10);
  const step = randomInt(2, 5);
  const rows = randomInt(5, 14);
  const last = first + (rows - 1) * step;
  return exercise(
    [
      `劇場の最前列は${first}席で、後ろへ一列進むごとに${step}席ずつ増えます。全${rows}列には合計何席ありますか。`,
      `The first row has ${first} seats. Each successive row has ${step} more seats. How many seats are in all ${rows} rows?`,
    ],
    ((first + last) * rows) / 2,
    ['席', 'seats'],
    [
      `最後の列を求める。最初と最後の列の平均が、一列あたりの平均になる。`,
      `Find the last row. The average row length is halfway between the first and last.`,
    ],
    `${first} + (${rows} − 1) × ${step} = ${last}, (${first} + ${last}) × ${rows} ÷ 2 = ${((first + last) * rows) / 2}`
  );
}

function groupedTiles(): StudioExercise {
  const group = randomInt(4, 12);
  const position = (group * (group - 1)) / 2 + randomInt(1, group);
  return exercise(
    [
      `カードに1を1枚、2を2枚、3を3枚、と順に同じ数だけ書いて並べます。${position}枚目に書かれた数はいくつですか。`,
      `A stack starts with one card marked 1, two marked 2, three marked 3, and so on. What number is on card ${position} from the start?`,
    ],
    group,
    ['', ''],
    [
      `各組の終わりまでの枚数を足し、指定の位置が入る組を探す。`,
      `Add the group sizes until the running total reaches the target position.`,
    ],
    `${group - 1} × ${group} ÷ 2 = ${(group * (group - 1)) / 2} < ${position} ≤ ${(group * (group + 1)) / 2}`
  );
}

export const sequence = [sumOfRows, groupedTiles] as const;

function neitherClub(): StudioExercise {
  const both = randomInt(2, 8);
  const a = both + randomInt(4, 11);
  const b = both + randomInt(4, 11);
  const neither = randomInt(2, 7);
  const total = a + b - both + neither;
  return exercise(
    [
      `${total}人のクラスで、水泳が好きな人は${a}人、体操が好きな人は${b}人、両方好きな人は${both}人です。どちらも好きでない人は何人ですか。`,
      `Of ${total} pupils, ${a} like swimming, ${b} like gymnastics and ${both} like both. How many like neither?`,
    ],
    neither,
    ['人', 'pupils'],
    [
      `少なくとも片方が好きな人を求めるときは、重複分を一度引く。`,
      `Subtract the overlap once when counting pupils who like either activity.`,
    ],
    `${total} − (${a} + ${b} − ${both}) = ${neither}`
  );
}

function bothClubs(): StudioExercise {
  const both = randomInt(2, 8);
  const a = both + randomInt(3, 12);
  const b = both + randomInt(3, 12);
  const total = a + b - both;
  return exercise(
    [
      `${total}人全員が合唱か演劇の少なくとも一方に参加します。合唱は${a}人、演劇は${b}人です。両方に参加するのは何人ですか。`,
      `All ${total} pupils join choir or drama or both. Choir has ${a} members and drama has ${b}. How many join both?`,
    ],
    both,
    ['人', 'pupils'],
    [
      `参加人数の和は、両方に参加した人だけを二度数えている。`,
      `Adding the two club sizes counts each shared member twice.`,
    ],
    `${a} + ${b} − ${total} = ${both}`
  );
}

export const sets = [neitherClub, bothClubs] as const;

function triangleExterior(): StudioExercise {
  const a = randomInt(30, 75);
  const b = randomInt(30, 75);
  return exercise(
    [
      `三角形の二つの内角は${a}°と${b}°です。残りの頂点で一辺を延ばすと、となり合う外角は何度ですか。`,
      `Two interior angles of a triangular sign are ${a}° and ${b}°. What is the exterior angle formed by extending a side at the third vertex?`,
    ],
    a + b,
    ['°', '°'],
    [
      `外角とそのとなりの内角の和は、三角形の内角の和に等しい。`,
      `The exterior angle equals the sum of the two remote interior angles.`,
    ],
    `${a} + ${b} = ${a + b}`
  );
}

function polygonInterior(): StudioExercise {
  const sides = [5, 6, 8, 9, 10, 12][randomInt(0, 5)];
  const turn = 360 / sides;
  return exercise(
    [
      `${sides}本の辺からなる正多角形のタイルがあります。一つの内角は何度ですか。`,
      `A regular polygonal tile has ${sides} sides. How many degrees are in each interior angle?`,
    ],
    180 - turn,
    ['°', '°'],
    [
      `一周の曲がり角を等分した外角を、一直線の角から引く。`,
      `Divide a full turn equally among the vertices, then subtract that turn from a straight angle.`,
    ],
    `180 − 360 ÷ ${sides} = ${180 - turn}`
  );
}

export const polygonAngles = [triangleExterior, polygonInterior] as const;

function cornerCut(): StudioExercise {
  const width = randomInt(10, 20);
  const height = randomInt(8, 14);
  const x = randomInt(2, 7);
  const y = randomInt(2, 6);
  return exercise(
    [
      `図の右上の通路は横${x}m、縦${y}mです。灰色の花壇の面積は何m²ですか。`,
      `The path in the top right corner is ${x} m wide and ${y} m tall. What is the area of the shaded garden in square metres?`,
    ],
    width * height - x * y,
    ['m²', 'm²'],
    [
      `全体の長方形から通路の長方形を引く。`,
      `Subtract the area of the path from the original rectangle.`,
    ],
    `${width} × ${height} − ${x} × ${y} = ${width * height - x * y}`,
    { kind: 'corner-garden', width, height, cutWidth: x, cutHeight: y }
  );
}

function crossingPaths(): StudioExercise {
  const width = randomInt(12, 25);
  const height = randomInt(8, 18);
  const path = randomInt(2, 4);
  return exercise(
    [
      `図の庭を横切る二本の道は、どちらも幅${path}mです。道の面積は合わせて何m²ですか。`,
      `Each shaded path across the garden is ${path} m wide. What is their combined area in square metres?`,
    ],
    path * (width + height - path),
    ['m²', 'm²'],
    [
      `二本の長方形を足すと交差した正方形を二度数える。`,
      `Add the two rectangles, then subtract their shared square.`,
    ],
    `${width} × ${path} + ${height} × ${path} − ${path} × ${path} = ${path * (width + height - path)}`,
    { kind: 'crossing-paths', width, height, pathWidth: path }
  );
}

function gardenBorder(): StudioExercise {
  const width = randomInt(12, 20);
  const height = randomInt(8, 14);
  const pathWidth = randomInt(1, 3);
  const insideWidth = width - 2 * pathWidth;
  const insideHeight = height - 2 * pathWidth;
  const area = width * height - insideWidth * insideHeight;
  return exercise(
    [
      `庭の内側を囲む灰色の道は、どこも幅${pathWidth}mです。道の面積は何m²ですか。`,
      `The shaded path around the inside of the garden is ${pathWidth} m wide everywhere. What is its area in square metres?`,
    ],
    area,
    ['m²', 'm²'],
    [
      '中央の長方形は、縦も横も道の幅二本分だけ短い。その面積を庭全体から引く。',
      'Subtract two path widths from each garden dimension. Subtract the area of that inner rectangle from the whole garden.',
    ],
    `${width} × ${height} − ${insideWidth} × ${insideHeight} = ${area}`,
    { kind: 'garden-border', width, height, pathWidth }
  );
}

export const compositeArea = [cornerCut, crossingPaths, gardenBorder] as const;

function breakage(): StudioExercise {
  const count = randomInt(22, 30);
  const broken = randomInt(2, 5);
  const reward = randomInt(2, 5);
  const penalty = randomInt(2, 6);
  const score = (count - broken) * reward - broken * penalty;
  return exercise(
    [
      `${count}問のクイズで、正解すると${reward}点増え、不正解だと${penalty}点減ります。全問に答え、合計は${score}点でした。不正解は何問ですか。`,
      `A quiz has ${count} questions. Each correct answer earns ${reward} points and each wrong answer loses ${penalty}. A player answers them all and scores ${score}. How many answers were wrong?`,
    ],
    broken,
    ['問', 'questions'],
    [
      `全部正解した場合と比べ、不正解一問で生じる差で割る。`,
      `Compare the score with a perfect score and divide by the swing per wrong answer.`,
    ],
    `(${count} × ${reward} − ${score}) ÷ (${reward} + ${penalty}) = ${broken}`
  );
}

function branchingTrees(): StudioExercise {
  const gap = randomInt(2, 5);
  const intervals = randomInt(4, 10);
  const length = intervals * gap;
  return exercise(
    [
      `広場の一点から三方向に、それぞれ長さ${length}mの道がのびています。出発点と各道の端に木を植え、道に沿って${gap}m間隔にそろえます。出発点の木を含めて全部で何本ですか。`,
      `Three paths radiate from one junction. Each is ${length} m from junction to tip. Trees stand at the junction, at every tip and every ${gap} m between them. How many trees are there?`,
    ],
    1 + 3 * intervals,
    ['本', 'trees'],
    [
      `交点の木は一度だけ数え、そこから先の木を道ごとに足す。`,
      `Count the junction once, then count the trees beyond it on each path.`,
    ],
    `1 + 3 × (${length} ÷ ${gap}) = ${1 + 3 * intervals}`
  );
}

function sharingAfterArrival(): StudioExercise {
  const children = randomInt(8, 20);
  const each = randomInt(3, 6);
  const newcomers = randomInt(2, 4);
  const leftover = randomInt(2, 6);
  const total = each * children + leftover;
  const shortage = (each + 2) * (children + newcomers) - total;
  return exercise(
    [
      `一人に${each}個ずつあめを配ると${leftover}個余ります。${newcomers}人加わり、全員に${each + 2}個ずつ配るには${shortage}個足りません。初めは何人でしたか。`,
      `Giving each child ${each} sweets leaves ${leftover}. If ${newcomers} more children join, giving everyone ${each + 2} sweets leaves a shortage of ${shortage}. How many children were there originally?`,
    ],
    children,
    ['人', 'children'],
    [
      '配る数の増加分から、新しく来た子の分を引く。残りは、もとの子に二個ずつ追加する分。',
      'Subtract the newcomers’ entire shares from the increase in sweets needed. The rest gives two extra sweets to each original child.',
    ],
    `(${leftover} + ${shortage} − ${newcomers} × ${each + 2}) ÷ 2 = ${children}`
  );
}

function threePairTotals(): StudioExercise {
  const apple = randomInt(5, 11) * 10;
  const pear = randomInt(7, 14) * 10;
  const orange = randomInt(3, 8) * 10;
  return exercise(
    [
      `りんごとなしは一個ずつで${apple + pear}円、なしとみかんは一個ずつで${pear + orange}円、みかんとりんごは一個ずつで${orange + apple}円です。りんご一個は何円ですか。`,
      `An apple and a pear cost ${apple + pear} yen, a pear and an orange cost ${pear + orange} yen, and an orange and an apple cost ${orange + apple} yen. What is the price of one apple?`,
    ],
    apple,
    ['円', 'yen'],
    [
      '三組の代金を足すと各品物を二回ずつ数える。合計を半分にしてから、なしとみかんの代金を引く。',
      'Adding the three bills counts each fruit twice. Halve the sum, then subtract the price of the pear and orange.',
    ],
    `(${apple + pear} + ${pear + orange} + ${orange + apple}) ÷ 2 − ${pear + orange} = ${apple}`
  );
}

export const changingCounts = [
  breakage,
  branchingTrees,
  sharingAfterArrival,
  threePairTotals,
] as const;
