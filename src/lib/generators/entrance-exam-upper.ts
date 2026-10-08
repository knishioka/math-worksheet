import type { UpperEntranceExamPattern } from '../../config/entrance-exam-patterns';
import { randomInt } from '../utils/math';
import {
  entranceWord as word,
  gcd,
  lcm,
  type EntranceContent as Content,
} from './entrance-exam-shared';

function multiples(index: number): Content {
  const a = randomInt(1, 3);
  const b = a + randomInt(2, 4);
  const unit = randomInt(3, 12);
  const change = randomInt(1, b - a - 1);
  const amount = change * unit;
  const transfer = index % 2 === 0;
  const nextA = a + change;
  const nextB = transfer ? b - change : b + change;
  return word(
    `はじめのあおいさんとけんさんのカードの枚数の比は${a}:${b}です。${transfer ? `けんさんがあおいさんに${amount}枚渡す` : `2人がそれぞれ${amount}枚もらう`}と、比は${nextA}:${nextB}になります。はじめのあおいさんのカードは何枚ですか。`,
    a * unit,
    '枚',
    [
      transfer
        ? `合計の枚数は変わらず、比の合計も${a}＋${b}＝${nextA}＋${nextB}なので、比の1つ分は同じ。`
        : `枚数の差は変わらず、比の差も${b}−${a}＝${nextB}−${nextA}なので、比の1つ分は同じ。`,
      `あおいさんの増えた分は${nextA}−${a}＝${change}つ分。1つ分は${amount}÷${change}＝${unit}（枚）。`,
      `はじめは${unit}×${a}＝${a * unit}（枚）。`,
    ]
  );
}

function ratioSharing(index: number): Content {
  const a = randomInt(1, 4);
  const b = randomInt(2, 5);
  const unit = randomInt(3, 12);
  if (index % 2 === 0) {
    const total = (a + b) * unit;
    return word(
      `${total}枚のカードを、あおいさんとけんさんで${a}:${b}の比に分けます。あおいさんは何枚もらいますか。`,
      a * unit,
      '枚',
      [
        `比の合計は${a}＋${b}＝${a + b}。`,
        `1つ分は${total}÷${a + b}＝${unit}（枚）。あおいさんは${unit}×${a}＝${a * unit}（枚）。`,
      ]
    );
  }
  const c = randomInt(2, 5);
  const d = randomInt(1, 4);
  const middle = lcm(b, c);
  const first = (a * middle) / b;
  const last = (d * middle) / c;
  const parts = first + middle + last;
  const total = parts * unit;
  return word(
    `あおいさんとけんさんのカードの枚数の比は${a}:${b}、けんさんとみおさんの比は${c}:${d}です。3人の合計は${total}枚です。けんさんは何枚持っていますか。`,
    middle * unit,
    '枚',
    [
      `けんさんの比を${middle}にそろえると、3人の比は${first}:${middle}:${last}。`,
      `比の合計は${first}＋${middle}＋${last}＝${parts}。1つ分は${total}÷${parts}＝${unit}（枚）。`,
      `けんさんは${unit}×${middle}＝${middle * unit}（枚）。`,
    ]
  );
}

function age(index: number): Content {
  const factor = randomInt(3, 4);
  const childAtTarget = randomInt(10, 15);
  const years = randomInt(2, 6);
  const future = index % 2 === 0;
  const child = childAtTarget + (future ? -years : years);
  const parent = childAtTarget * factor + (future ? -years : years);
  const difference = parent - child;
  return word(
    `現在、父は${parent}歳、子は${child}歳です。父の年齢が子の年齢の${factor}倍になるのは、今から何年${future ? '後' : '前'}ですか。`,
    years,
    '年',
    [
      `年齢の差は${parent}−${child}＝${difference}（歳）で変わらない。`,
      `${factor}倍のとき、差は子の${factor - 1}人分。子は${difference}÷${factor - 1}＝${childAtTarget}（歳）。`,
      future
        ? `${childAtTarget}−${child}＝${years}（年）後。`
        : `${child}−${childAtTarget}＝${years}（年）前。`,
    ]
  );
}

function equivalent(index: number): Content {
  const denominator = randomInt(3, 8);
  const numerator = randomInt(1, denominator - 2);
  const unit = randomInt(5, 20);
  const remainingParts = denominator - numerator;
  if (index % 2 === 0) {
    const remaining = remainingParts * unit;
    return word(
      `本を全体の${numerator}/${denominator}だけ読むと、残りは${remaining}ページでした。この本は全部で何ページですか。`,
      denominator * unit,
      'ページ',
      [
        `残りは全体の${remainingParts}/${denominator}。`,
        `1つ分は${remaining}÷${remainingParts}＝${unit}（ページ）。全体は${unit}×${denominator}＝${denominator * unit}（ページ）。`,
      ]
    );
  }
  const secondDenominator = randomInt(2, 5);
  const secondNumerator = randomInt(1, secondDenominator - 1);
  const remaining =
    remainingParts * (secondDenominator - secondNumerator) * unit;
  const afterFirst = remainingParts * secondDenominator * unit;
  const total = denominator * secondDenominator * unit;
  return word(
    `1日目に本全体の${numerator}/${denominator}を読み、2日目にその残りの${secondNumerator}/${secondDenominator}を読みました。まだ${remaining}ページ残っています。本は全部で何ページですか。`,
    total,
    'ページ',
    [
      `最後の残りは、1日目の残りの${secondDenominator - secondNumerator}/${secondDenominator}。`,
      `1日目の残りは${remaining}÷${secondDenominator - secondNumerator}×${secondDenominator}＝${afterFirst}（ページ）。`,
      `全体は${afterFirst}÷${remainingParts}×${denominator}＝${total}（ページ）。`,
    ]
  );
}

function reverse(index: number): Content {
  const factor = randomInt(2, 5);
  const addition = randomInt(5, 30);
  if (index % 2 === 0) {
    const original = randomInt(10, 60);
    const result = original * factor + addition;
    return word(
      `ある数を${factor}倍してから${addition}を足すと、${result}になりました。もとの数はいくつですか。`,
      original,
      '',
      [
        `足す前に戻すと${result}−${addition}＝${original * factor}。`,
        `倍にする前に戻すと${original * factor}÷${factor}＝${original}。`,
      ]
    );
  }
  const subtraction = randomInt(5, 30);
  const quotient = randomInt(5, 20);
  const original = quotient * factor + subtraction;
  const result = quotient + addition;
  return word(
    `ある数から${subtraction}を引き、その結果を${factor}で割り、${addition}を足すと${result}になりました。もとの数はいくつですか。`,
    original,
    '',
    [
      `足す前に戻すと${result}−${addition}＝${quotient}。`,
      `割る前に戻すと${quotient}×${factor}＝${quotient * factor}。`,
      `引く前に戻すと${quotient * factor}＋${subtraction}＝${original}。`,
    ]
  );
}

function profitLoss(index: number): Content {
  const variant = index % 3;
  const cost = randomInt(4, 20) * 100;
  const markup = randomInt(5, 6) * 10;
  const discount = (variant === 2 ? randomInt(5, 6) : randomInt(1, 2)) * 10;
  const listPrice = (cost * (100 + markup)) / 100;
  const salePercent = ((100 + markup) * (100 - discount)) / 100;
  const salePrice = (cost * salePercent) / 100;
  const profit = salePrice - cost;
  if (variant === 2)
    return word(
      `原価${cost}円の品物に、原価の${markup}％の利益を見込んで定価をつけました。定価の${discount}％引きで売ると、損失は何円ですか。`,
      -profit,
      '円',
      [
        `定価は${cost}×${100 + markup}÷100＝${listPrice}（円）。`,
        `売価は${listPrice}×${100 - discount}÷100＝${salePrice}（円）。損失は${cost}−${salePrice}＝${-profit}（円）。`,
      ]
    );
  if (variant === 0)
    return word(
      `原価${cost}円の品物に、原価の${markup}％の利益を見込んで定価をつけました。定価の${discount}％引きで売ると、利益は何円ですか。`,
      profit,
      '円',
      [
        `定価は${cost}×${100 + markup}÷100＝${listPrice}（円）。`,
        `売価は${listPrice}×${100 - discount}÷100＝${salePrice}（円）。利益は${salePrice}−${cost}＝${profit}（円）。`,
      ]
    );
  return word(
    `ある品物に、原価の${markup}％の利益を見込んで定価をつけました。定価の${discount}％引きで売ると、利益は${profit}円でした。原価は何円ですか。`,
    cost,
    '円',
    [
      `売価は原価の${100 + markup}％の${100 - discount}％なので、原価の${salePercent}％。`,
      `利益は原価の${salePercent}−100＝${salePercent - 100}％。`,
      `原価は${profit}×100÷${salePercent - 100}＝${cost}（円）。`,
    ]
  );
}

function saltWater(index: number): Content {
  const base = randomInt(1, 5) * 100;
  if (index % 2 === 0) {
    const a = randomInt(1, 3);
    const b = randomInt(1, 3);
    const low = randomInt(1, 6);
    const differenceUnit = randomInt(1, 2);
    const high = low + (a + b) * differenceUnit;
    const massA = a * base;
    const massB = b * base;
    const salt = (massA * low + massB * high) / 100;
    const concentration = low + b * differenceUnit;
    return word(
      `${low}％の食塩水${massA}gと、${high}％の食塩水${massB}gを混ぜます。混ぜた食塩水の濃度は何％ですか。`,
      concentration,
      '％',
      [
        `食塩の合計は${massA}×${low}÷100＋${massB}×${high}÷100＝${salt}（g）。`,
        `食塩水は${massA}＋${massB}＝${massA + massB}（g）。濃度は${salt}×100÷${massA + massB}＝${concentration}（％）。`,
      ]
    );
  }
  const target = randomInt(2, 5);
  const factor = randomInt(2, 3);
  const initial = target * factor;
  const salt = (base * initial) / 100;
  return word(
    `${initial}％の食塩水${base}gに水だけを加えて、${target}％の食塩水にします。水を何g加えますか。`,
    base * (factor - 1),
    'g',
    [
      `水を加えても食塩は${base}×${initial}÷100＝${salt}（g）のまま。`,
      `${target}％にする食塩水全体は${salt}×100÷${target}＝${base * factor}（g）。`,
      `加える水は${base * factor}−${base}＝${base * (factor - 1)}（g）。`,
    ]
  );
}

function traveler(index: number): Content {
  const slow = randomInt(4, 8) * 10;
  const fast = slow + randomInt(1, 4) * 10;
  const minutes = randomInt(5, 20);
  const meeting = index % 2 === 0;
  const closingSpeed = meeting ? slow + fast : fast - slow;
  const distance = closingSpeed * minutes;
  return word(
    meeting
      ? `${distance}m離れた2人が同時に向かい合って歩き始めます。速さは分速${slow}mと分速${fast}mです。何分後に出会いますか。`
      : `あおいさんは、けんさんより${distance}m前にいます。2人は同時に同じ方向へ歩き始め、あおいさんは分速${slow}m、けんさんは分速${fast}mで歩きます。何分後にけんさんが追いつきますか。`,
    minutes,
    '分',
    [
      `1分で縮まる距離は${meeting ? `${slow}＋${fast}` : `${fast}−${slow}`}＝${closingSpeed}（m）。`,
      `${distance}÷${closingSpeed}＝${minutes}（分）。`,
    ]
  );
}

function trainPassing(index: number): Content {
  const speed = randomInt(10, 20);
  if (index % 2 === 0) {
    const seconds = randomInt(10, 30);
    const length = speed * randomInt(2, 5);
    const bridge = speed * seconds - length;
    return word(
      `長さ${length}mの列車が、秒速${speed}mで、長さ${bridge}mの橋を渡ります。先頭が橋に入ってから最後尾が橋を出るまで、何秒かかりますか。`,
      seconds,
      '秒',
      [
        `先頭が進む距離は、列車と橋の長さの合計。${length}＋${bridge}＝${length + bridge}（m）。`,
        `時間は${length + bridge}÷${speed}＝${seconds}（秒）。`,
      ]
    );
  }
  const otherSpeed = randomInt(10, 20);
  const seconds = randomInt(4, 10);
  const lengthA = (speed + otherSpeed) * randomInt(1, seconds - 1);
  const lengthB = (speed + otherSpeed) * seconds - lengthA;
  return word(
    `長さ${lengthA}mで秒速${speed}mの列車と、長さ${lengthB}mで秒速${otherSpeed}mの列車が、反対方向へ進みます。先頭どうしが出会ってから、最後尾どうしが離れるまで何秒かかりますか。`,
    seconds,
    '秒',
    [
      `すれ違う距離は${lengthA}＋${lengthB}＝${lengthA + lengthB}（m）。`,
      `相対的な速さは${speed}＋${otherSpeed}＝${speed + otherSpeed}（m/秒）。時間は${lengthA + lengthB}÷${speed + otherSpeed}＝${seconds}（秒）。`,
    ]
  );
}

function river(index: number): Content {
  const still = randomInt(8, 15) * 10;
  const current = randomInt(2, 5) * 10;
  const downstream = still + current;
  const upstream = still - current;
  const distance = lcm(downstream, upstream) * randomInt(2, 4);
  const down = index % 2 === 0;
  const speed = down ? downstream : upstream;
  return word(
    `静水での速さが分速${still}mの船が、流れの速さが分速${current}mの川を${distance}m${down ? '下り' : '上り'}ます。船と流れの速さは一定です。何分かかりますか。`,
    distance / speed,
    '分',
    [
      `${down ? '下り' : '上り'}の速さは${still}${down ? '＋' : '−'}${current}＝${speed}（m/分）。`,
      `時間は${distance}÷${speed}＝${distance / speed}（分）。`,
    ]
  );
}

function work(index: number): Content {
  const a = randomInt(2, 4);
  const b = randomInt(1, 3);
  const common = lcm(a, b);
  const togetherDays = common * randomInt(2, 4);
  const firstDays = index % 2 === 0 ? 0 : (a + b) * b * randomInt(1, 2);
  const whole = (a + b) * togetherDays + a * firstDays;
  const aloneA = whole / a;
  const aloneB = whole / b;
  const modelWhole = lcm(aloneA, aloneB);
  const rateA = modelWhole / aloneA;
  const rateB = modelWhole / aloneB;
  const remaining = modelWhole - rateA * firstDays;
  return word(
    `ある仕事は、Aさん1人なら${aloneA}日、Bさん1人なら${aloneB}日かかります。2人の仕事の速さはそれぞれ一定です。${firstDays === 0 ? 'はじめから2人で一緒に働くと、何日で終わりますか。' : `Aさんが先に${firstDays}日働き、残りを2人で一緒に働きます。一緒に働く日数は何日ですか。`}`,
    togetherDays,
    '日',
    [
      `仕事全体を${modelWhole}とすると、1日にAさんは${rateA}、Bさんは${rateB}進める。`,
      ...(firstDays > 0
        ? [`残りの仕事は${modelWhole}−${rateA}×${firstDays}＝${remaining}。`]
        : []),
      `2人の1日分は${rateA}＋${rateB}＝${rateA + rateB}。${remaining}÷${rateA + rateB}＝${togetherDays}（日）。`,
    ]
  );
}

function newton(index: number): Content {
  const firstWorkers = randomInt(2, 4);
  const secondWorkers = firstWorkers + randomInt(1, 3);
  const perWorker = randomInt(1, 3);
  const secondMinutes = randomInt(2, 6);
  const firstMinutes = (secondWorkers - firstWorkers + 1) * secondMinutes;
  const arriving = perWorker * (firstWorkers - 1);
  const initial = perWorker * firstMinutes;
  if (index % 2 === 0)
    return word(
      `図書館で返却本を整理します。開始時の本の冊数が同じなら、${firstWorkers}人で${firstMinutes}分、${secondWorkers}人で${secondMinutes}分かかります。1人が整理する速さは毎分${perWorker}冊で、作業中も一定の速さで本が返却されます。毎分何冊返却されますか。`,
      arriving,
      '冊/分',
      [
        `整理した合計は${firstWorkers}×${perWorker}×${firstMinutes}＝${firstWorkers * perWorker * firstMinutes}（冊）と、${secondWorkers}×${perWorker}×${secondMinutes}＝${secondWorkers * perWorker * secondMinutes}（冊）。`,
        `合計の差${firstWorkers * perWorker * firstMinutes - secondWorkers * perWorker * secondMinutes}冊は、時間の差${firstMinutes - secondMinutes}分の間に返却された本。`,
        `毎分${firstWorkers * perWorker * firstMinutes - secondWorkers * perWorker * secondMinutes}÷${firstMinutes - secondMinutes}＝${arriving}（冊）。`,
      ]
    );
  return word(
    `図書館で返却本を整理します。1人が整理する速さは毎分${perWorker}冊で、作業中も毎分${arriving}冊返却されます。${firstWorkers}人なら${firstMinutes}分で本がなくなります。同じ開始時の冊数を${secondMinutes}分でなくすには、何人必要ですか。`,
    secondWorkers,
    '人',
    [
      `最初の本は（${firstWorkers}×${perWorker}−${arriving}）×${firstMinutes}＝${initial}（冊）。`,
      `${secondMinutes}分で整理する合計は${initial}＋${arriving}×${secondMinutes}＝${initial + arriving * secondMinutes}（冊）。`,
      `1人が整理する量は${perWorker}×${secondMinutes}＝${perWorker * secondMinutes}（冊）。必要な人数は${initial + arriving * secondMinutes}÷${perWorker * secondMinutes}＝${secondWorkers}（人）。`,
    ]
  );
}

function advancedCraneTurtle(index: number): Content {
  const chickens = randomInt(5, 20);
  const spiders = randomInt(2, 10);
  const factor = index % 2 === 0 ? 1 : randomInt(2, 4);
  const dogs = spiders * factor;
  const count = chickens + dogs + spiders;
  const legs = chickens * 2 + dogs * 4 + spiders * 8;
  const bundleDifference = 2 * factor + 6;
  return word(
    `にわとり・犬・クモが合わせて${count}匹いて、足は全部で${legs}本です。足はにわとり2本、犬4本、クモ8本とします。犬の数は${factor === 1 ? 'クモの数と同じ' : `クモの数の${factor}倍`}です。クモは何匹いますか。`,
    spiders,
    '匹',
    [
      `全部にわとりとすると足は${count}×2＝${count * 2}（本）。実際との差は${legs}−${count * 2}＝${legs - count * 2}（本）。`,
      `クモ1匹と犬${factor}匹を1組にすると、にわとり${factor + 1}匹より足が（8−2）＋（4−2）×${factor}＝${bundleDifference}（本）多い。`,
      `クモは組の数と同じなので、${legs - count * 2}÷${bundleDifference}＝${spiders}（匹）。`,
    ]
  );
}

function advancedRatioAge(index: number): Content {
  const child = randomInt(8, 14);
  const factor = randomInt(3, 4);
  const parent = child * factor;
  const years = randomInt(4, 12);
  const divisor = gcd(parent + years, child + years);
  const futureParent = (parent + years) / divisor;
  const futureChild = (child + years) / divisor;
  const difference = parent - child;
  const useSum = index % 2 === 0;
  return word(
    `現在の父と子の年齢の比は${factor}:1で、${useSum ? `年齢の合計は${parent + child}歳` : `年齢の差は${difference}歳`}です。父と子の年齢の比が${futureParent}:${futureChild}になるのは何年後ですか。`,
    years,
    '年',
    [
      `現在の子は${useSum ? `${parent + child}÷（${factor}＋1）` : `${difference}÷（${factor}−1）`}＝${child}（歳）、父は${parent}歳。`,
      `年齢の差${difference}歳は変わらない。将来の比の1つ分は${difference}÷（${futureParent}−${futureChild}）＝${divisor}（歳）。`,
      `将来の子は${divisor}×${futureChild}＝${child + years}（歳）。${child + years}−${child}＝${years}（年）後。`,
    ]
  );
}

function advancedSpeed(index: number): Content {
  if (index % 2 === 0) {
    const difference = randomInt(1, 3) * 10;
    const factor = randomInt(2, 4);
    const slow = difference * factor;
    const fast = slow + difference;
    const delay = randomInt(3, 8);
    const gap = slow * delay;
    return word(
      `あおいさんが分速${slow}mで歩き始め、その${delay}分後にけんさんが同じ場所から同じ道を分速${fast}mで追いかけます。速さは一定です。けんさんが歩き始めてから何分後に追いつきますか。`,
      factor * delay,
      '分',
      [
        `けんさんが出発するときの差は${slow}×${delay}＝${gap}（m）。`,
        `1分で縮まる距離は${fast}−${slow}＝${difference}（m）。`,
        `けんさんの出発から${gap}÷${difference}＝${factor * delay}（分）。`,
      ]
    );
  }
  const a = randomInt(4, 8) * 10;
  const b = randomInt(4, 8) * 10;
  const nextB = b + randomInt(1, 3) * 10;
  const first = randomInt(3, 8);
  const second = randomInt(4, 10);
  const firstDistance = (a + b) * first;
  const remaining = (a + nextB) * second;
  const distance = firstDistance + remaining;
  return word(
    `${distance}m離れたAさんとBさんが、同時に向かい合って歩き始めます。Aさんはずっと分速${a}mです。Bさんは最初は分速${b}mで、出発から${first}分後に分速${nextB}mに変えます。出発から何分後に出会いますか。`,
    first + second,
    '分',
    [
      `最初の${first}分に縮まる距離は（${a}＋${b}）×${first}＝${firstDistance}（m）。`,
      `残りは${distance}−${firstDistance}＝${remaining}（m）。その後は1分で${a}＋${nextB}＝${a + nextB}（m）縮まる。`,
      `出発から${first}＋${remaining}÷${a + nextB}＝${first + second}（分）後。`,
    ]
  );
}

export const UPPER_ENTRANCE_GENERATORS: Record<
  UpperEntranceExamPattern,
  (index: number) => Content
> = {
  'entrance-multiples-jap': multiples,
  'entrance-ratio-sharing-jap': ratioSharing,
  'entrance-age-jap': age,
  'entrance-equivalent-jap': equivalent,
  'entrance-reverse-jap': reverse,
  'entrance-profit-loss-jap': profitLoss,
  'entrance-salt-water-jap': saltWater,
  'entrance-traveler-jap': traveler,
  'entrance-train-passing-jap': trainPassing,
  'entrance-river-jap': river,
  'entrance-work-jap': work,
  'entrance-newton-jap': newton,
  'entrance-advanced-crane-turtle-jap': advancedCraneTurtle,
  'entrance-advanced-ratio-age-jap': advancedRatioAge,
  'entrance-advanced-speed-jap': advancedSpeed,
};
