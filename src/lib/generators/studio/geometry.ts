import { randomInt } from '../../utils/math';
import { exercise, type StudioExercise } from './exercise';

function largerTriangle(): StudioExercise {
  const small = randomInt(2, 5);
  const large = small + randomInt(1, 4);
  const part = randomInt(2, 8);
  const area = small * small * part;
  return exercise(
    [
      `相似な二つの三角形で、対応する辺の長さの比は小：大＝${small}：${large}です。小さい三角形の面積が${area}cm²なら、大きい方は何cm²ですか。`,
      `Two similar triangles have corresponding sides in the ratio ${small} to ${large}, smaller to larger. The smaller has area ${area} cm². What is the larger area?`,
    ],
    large * large * part,
    ['cm²', 'cm²'],
    [
      `底辺も高さも同じ割合で伸びるので、面積にはその割合を二回かける。`,
      `Both the base and the height scale by the side ratio.`,
    ],
    `${area} × (${large}/${small})² = ${large * large * part}`
  );
}

function parallelCut(): StudioExercise {
  const side = randomInt(3, 6);
  const whole = side + randomInt(1, 4);
  const unit = randomInt(2, 7);
  const area = whole * whole * unit;
  return exercise(
    [
      `底辺と向かい合う頂点から一辺に沿って${side}cmの点で、底辺に平行な線を引きます。その辺の全長は${whole}cm、三角形全体の面積は${area}cm²です。底辺側の台形の面積は何cm²ですか。`,
      `A line parallel to a triangle's base cuts one side ${side} cm from the opposite vertex. That side is ${whole} cm long and the full area is ${area} cm². What is the area of the trapezoid next to the base?`,
    ],
    area - side * side * unit,
    ['cm²', 'cm²'],
    [
      `頂点側の小三角形は全体と相似。全体から小三角形の面積を引く。`,
      `Subtract the similar triangle at the vertex from the whole triangle.`,
    ],
    `${area} − ${area} × (${side}/${whole})² = ${area - side * side * unit}`
  );
}

export const similarArea = [largerTriangle, parallelCut] as const;

function sweptArea(): StudioExercise {
  const radius = randomInt(2, 8) * 2;
  const angle = [90, 180, 270][randomInt(0, 2)];
  const area = Math.round((314 * radius * radius * angle) / 360) / 100;
  return exercise(
    [
      `長さ${radius}cmの棒が片端を中心に図の角度だけ回ります。棒が通った灰色の部分は何cm²ですか。円周率は3.14とします。`,
      `A ${radius} cm rod turns about one end through the angle shown. What shaded area does it sweep out? Use 3.14 for pi.`,
    ],
    area,
    ['cm²', 'cm²'],
    [
      `おうぎ形が円全体のどの割合かを中心角で求める。`,
      `Multiply the disk area by the fraction of a full turn.`,
    ],
    `3.14 × ${radius} × ${radius} × ${angle} ÷ 360 = ${area}`,
    { kind: 'sector', angle, highlight: 'area' }
  );
}

function arcLength(): StudioExercise {
  const radius = randomInt(2, 10) * 2;
  const angle = [90, 180, 270][randomInt(0, 2)];
  const length = Math.round((628 * radius * angle) / 360) / 100;
  return exercise(
    [
      `半径${radius}mの円形トラックのうち、図の太い弧を走りました。走った距離は何mですか。円周率は3.14とします。`,
      `On a circular track of radius ${radius} m, a runner follows the bold arc. How far does the runner go? Use 3.14 for pi.`,
    ],
    length,
    ['m', 'm'],
    [
      `円周に中心角が一周に占める割合をかける。`,
      `Take the same fraction of the circumference as the angle is of a full turn.`,
    ],
    `2 × 3.14 × ${radius} × ${angle} ÷ 360 = ${length}`,
    { kind: 'sector', angle, highlight: 'arc' }
  );
}

function sectorPerimeter(): StudioExercise {
  const radius = randomInt(2, 8) * 2;
  const angle = [90, 180, 270][randomInt(0, 2)];
  const perimeter =
    Math.round((628 * radius * angle) / 360 + 200 * radius) / 100;
  return exercise(
    [
      `半径${radius}cmのおうぎ形を太線に沿って切り取ります。切り取った形の周りの長さは何cmですか。円周率は3.14とします。`,
      `Cut out the sector of radius ${radius} cm along the bold outline. What is the perimeter of the cutout? Use 3.14 for pi.`,
    ],
    perimeter,
    ['cm', 'cm'],
    [
      '円周に中心角の割合をかけて弧の長さを求め、半径二本分を足す。',
      'Take the indicated fraction of the circumference, then add the two straight radii.',
    ],
    `2 × 3.14 × ${radius} × ${angle} ÷ 360 + 2 × ${radius} = ${perimeter}`,
    { kind: 'sector', angle, highlight: 'perimeter' }
  );
}

export const sectors = [sweptArea, arcLength, sectorPerimeter] as const;

function slidingCard(): StudioExercise {
  const width = randomInt(4, 10);
  const height = randomInt(3, 8);
  const slide = randomInt(2, 7);
  return exercise(
    [
      `横${width}cm、縦${height}cmのカードを回さずに右へ${slide}cmまっすぐ動かします。初めと終わりを含め、カードが一度でも覆った部分は何cm²ですか。`,
      `A card ${width} cm wide and ${height} cm tall slides ${slide} cm to the right without turning. What is the total area swept out, including the starting position?`,
    ],
    (width + slide) * height,
    ['cm²', 'cm²'],
    [
      `通った部分は、横が移動距離だけ長くなった長方形。`,
      `The swept rectangle is wider than the card by the distance it moves.`,
    ],
    `(${width} + ${slide}) × ${height} = ${(width + slide) * height}`
  );
}

function halfTurn(): StudioExercise {
  const left = randomInt(1, 7);
  const centre = left + randomInt(2, 7);
  const right = 2 * centre - left;
  return exercise(
    [
      `方眼紙の同じ横線上で、点Pの横座標は${left}です。半回転させた後の点Pの横座標は${right}です。回転の中心の横座標はいくつですか。`,
      `On a grid, point P has horizontal coordinate ${left}. After a half turn, it lies on the same row at coordinate ${right}. What is the horizontal coordinate of the centre of rotation?`,
    ],
    centre,
    ['', ''],
    [
      `半回転の中心は、もとの点と移った点を結ぶ線分の中点。`,
      `The centre of a half turn is the midpoint between a point and its image.`,
    ],
    `(${left} + ${right}) ÷ 2 = ${centre}`
  );
}

function mirror(): StudioExercise {
  const axis = randomInt(5, 12);
  const left = axis - randomInt(2, 4);
  return exercise(
    [
      `方眼紙で、横座標${axis}を通る縦線が対称の軸です。横座標${left}の点を線対称に移すと、横座標はいくつになりますか。`,
      `On a grid, a vertical mirror line has horizontal coordinate ${axis}. A point at horizontal coordinate ${left} is reflected in the line. What is its new horizontal coordinate?`,
    ],
    2 * axis - left,
    ['', ''],
    [
      `軸からの距離を測り、反対側へ同じ距離だけ進む。`,
      `Measure the distance to the mirror, then move that far beyond it.`,
    ],
    `${axis} + (${axis} − ${left}) = ${2 * axis - left}`
  );
}

function rotatedOverlap(): StudioExercise {
  const side = randomInt(4, 9) * 2;
  const offset = randomInt(2, side - 1);
  return exercise(
    [
      `一辺${side}cmの正方形を左下の頂点を中心に時計回りに直角だけ回し、上へ${offset}cm平行移動します。初めの正方形と最後の正方形が重なる面積は何cm²ですか。`,
      `A square of side ${side} cm turns a quarter turn clockwise about its bottom left corner and then slides ${offset} cm straight up. What area do its original and final positions share?`,
    ],
    side * offset,
    ['cm²', 'cm²'],
    [
      '回転直後の正方形は元の正方形の真下にある。上へ動かした高さだけ、二つの位置が重なる。',
      'After the turn, the square lies directly below its original position. Sliding up makes a strip of the two squares overlap.',
    ],
    `${side} × ${offset} = ${side * offset}`
  );
}

export const motion = [slidingCard, halfTurn, mirror, rotatedOverlap] as const;

function stackedBoxes(): StudioExercise {
  const length = randomInt(8, 14);
  const width = randomInt(4, 8);
  const base = randomInt(2, 6);
  const top = randomInt(2, 5);
  const extra = randomInt(2, 6);
  return exercise(
    [
      `底が${length}cm×${width}cm、高さ${base}cmの直方体に、底が${top}cm×${width}cm、高さ${extra}cmの直方体を重ねます。重なりは面だけです。全体の体積は何cm³ですか。`,
      `One block measures ${length} by ${width} by ${base} cm. A second measures ${top} by ${width} by ${extra} cm. They touch face to face without overlapping. What is their combined volume?`,
    ],
    width * (length * base + top * extra),
    ['cm³', 'cm³'],
    [
      `二つの直方体に分け、それぞれの体積を足す。`,
      `Find the volume of each rectangular block and add them.`,
    ],
    `${length} × ${width} × ${base} + ${top} × ${width} × ${extra} = ${width * (length * base + top * extra)}`
  );
}

function foldedNet(): StudioExercise {
  const first = randomInt(1, 9);
  const ask = randomInt(0, 3);
  const opposite = (ask + 2) % 4;
  return exercise(
    [
      `図の展開図を折って立方体にします。${first + ask}の反対側にある面の番号はいくつですか。`,
      `Fold the net shown into a cube. Which numbered face is opposite ${first + ask}?`,
    ],
    first + opposite,
    ['', ''],
    [
      `横一列の四面は側面を一周する。一つ飛ばした面が反対側。`,
      `The row wraps around the four side faces. Opposite faces are two positions apart.`,
    ],
    `${first} ↔ ${first + 2}, ${first + 1} ↔ ${first + 3}`,
    { kind: 'cube-net', first }
  );
}

export const solidNets = [stackedBoxes, foldedNet] as const;

function parallelSlice(): StudioExercise {
  const edge = randomInt(4, 12);
  const height = randomInt(1, edge - 1);
  return exercise(
    [
      `図の立方体を、底面から${height}cmの高さで底面と平行に切ります。切り口の面積は何cm²ですか。`,
      `Slice the cube parallel to its base at a height of ${height} cm above it. What is the area of the cross-section?`,
    ],
    edge * edge,
    ['cm²', 'cm²'],
    [
      `切り口は底面と同じ大きさの正方形になる。`,
      `The section is a square congruent to the base.`,
    ],
    `${edge} × ${edge} = ${edge * edge}`,
    { kind: 'level-slice', edge, height }
  );
}

function cornerSlice(): StudioExercise {
  const edge = randomInt(5, 12);
  const distance = randomInt(2, edge - 1);
  return exercise(
    [
      `図の黒い点は、同じ頂点からそれぞれ${distance}cmの位置にあります。三点を通る平面で立方体を切ると、切り口には何本の辺がありますか。`,
      `The marked points are each ${distance} cm from the same corner. A plane cuts through the three marks. How many sides does the section have?`,
    ],
    3,
    ['本', 'sides'],
    [
      `同じ面にある印を二つずつ結ぶ。角に接する三面に線分が一本ずつできる。`,
      `Join each pair of marks on a shared face. Each of the three faces at the corner contributes one segment.`,
    ],
    `1 + 1 + 1 = 3`,
    { kind: 'corner-marks', edge, distance }
  );
}

function diagonalSlice(): StudioExercise {
  const side = randomInt(2, 7);
  return exercise(
    [
      '図の立方体を、底面の対角線を通り、底面に垂直な平面で切ります。できた一方の立体の体積は何cm³ですか。',
      'Cut the cube through the base diagonal with a plane perpendicular to the base, as shown. What is the volume of one of the resulting solids?',
    ],
    side ** 3 / 2,
    ['cm³', 'cm³'],
    [
      '上面も底面も対角線で二等分される。どの高さでも切り分けた二つの断面積は等しい。',
      'The plane follows a diagonal across the top and base. At every height it divides the square into two equal triangles.',
    ],
    `${side} × ${side} × ${side} ÷ 2 = ${side ** 3 / 2}`,
    { kind: 'diagonal-slice', edge: side }
  );
}

export const cubeSection = [parallelSlice, cornerSlice, diagonalSlice] as const;
