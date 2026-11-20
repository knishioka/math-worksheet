import { randomInt } from '../../utils/math';
import { exercise, type StudioExercise } from './exercise';

function zeroDigits(): StudioExercise {
  const largest = randomInt(3, 8);
  return exercise(
    [
      `0から${largest}までの数字カードが一枚ずつあります。二枚を選んで並べると、異なる二桁の整数は何通りできますか。`,
      `There is one digit card for each digit from 0 to ${largest}. How many different two-digit numbers can you form using two cards?`,
    ],
    largest * largest,
    ['通り', 'numbers'],
    [
      `十の位には0を使えない。一の位には、使ったカード以外のどれでも使える。`,
      `The tens digit cannot be zero. For the units digit, any remaining card is allowed.`,
    ],
    `${largest} × ${largest} = ${largest * largest}`
  );
}

function repeatDigit(): StudioExercise {
  const count = randomInt(3, 7);
  const digit = randomInt(1, count);
  return exercise(
    [
      `1から${count}までの数字カードが一枚ずつと、もう一枚の${digit}のカードがあります。二枚を使ってできる異なる二桁の整数は何通りですか。`,
      `You have one card for each digit from 1 to ${count} and one extra card marked ${digit}. How many distinct two-digit numbers can you make with two cards?`,
    ],
    count * (count - 1) + 1,
    ['通り', 'numbers'],
    [
      `異なる数字を並べた場合に、二枚ある数字を重ねた一通りを足す。`,
      `Count ordered pairs of distinct digits, then add the one possible double.`,
    ],
    `${count} × (${count} − 1) + 1 = ${count * (count - 1) + 1}`
  );
}

export const digitCount = [zeroDigits, repeatDigit] as const;

function clockAngle(): StudioExercise {
  const hour = randomInt(1, 11);
  const minute = randomInt(1, 11) * 5;
  const raw = Math.abs(30 * hour + minute / 2 - 6 * minute);
  const angle = Math.min(raw, 360 - raw);
  return exercise(
    [
      `${hour}時${minute}分の時計で、長針と短針のなす角のうち、小さい方は何度ですか。`,
      `At ${hour}:${String(minute).padStart(2, '0')} on an analogue clock, how many degrees are in the smaller angle between the hands?`,
    ],
    angle,
    ['°', '°'],
    [
      `十二時の方向から測る。短針も一分に0.5°ずつ進む。二つの向きの差から小さい角を選ぶ。`,
      `Measure both hands clockwise from twelve. The hour hand also advances half a degree each minute.`,
    ],
    `${Math.max(30 * hour + minute / 2, 6 * minute)}° − ${Math.min(30 * hour + minute / 2, 6 * minute)}° = ${raw}°${raw > 180 ? `, 360° − ${raw}° = ${angle}°` : ''}`
  );
}

function clockMeeting(): StudioExercise {
  const hour = randomInt(1, 10);
  const numerator = hour * 60;
  return exercise(
    [
      `${hour}時ちょうどから、長針が次に短針に重なるまで何分ですか。分数で答えましょう。`,
      `Starting at exactly ${hour} o'clock, how many minutes pass before the minute hand next catches the hour hand? Give a fraction.`,
    ],
    `${numerator}/11`,
    ['分', 'minutes'],
    [
      `初めの角度差を、一分あたりに縮まる角度で割る。`,
      `Divide the initial gap in degrees by the gain of the minute hand per minute.`,
    ],
    `${30 * hour} ÷ (6 − 0.5) = ${numerator}/11`
  );
}

function secondRightAngle(): StudioExercise {
  const hour = randomInt(4, 7);
  const numerator = 60 * (hour + 3);
  return exercise(
    [
      `${hour}時ちょうどから一時間以内に、長針と短針は二度直角になります。二度目は${hour}時から何分後ですか。分数で答えましょう。`,
      `In the hour after ${hour} o'clock, the hands of a clock form a right angle twice. How many minutes past ${hour} is the second right angle? Give a fraction.`,
    ],
    `${numerator}/11`,
    ['分', 'minutes'],
    [
      '二度目には長針が短針を追い越し、さらに90°先にいる。最初の遅れと90°を足して、毎分縮まる角度で割る。',
      'At the second right angle, the minute hand has passed the hour hand and gained another 90 degrees. Add that to its initial deficit.',
    ],
    `(${hour * 30} + 90) ÷ (6 − 0.5) = ${numerator}/11`
  );
}

function symmetricClock(): StudioExercise {
  const hour = randomInt(1, 10);
  const numerator = 720 - 60 * hour;
  return exercise(
    [
      `${hour}時ちょうどのあと、長針と短針が十二時と六時を結ぶ直線に関して初めて線対称になるのは何分後ですか。分数で答えましょう。`,
      `After ${hour} o'clock, how many minutes pass before the hands are first mirror images across the line from twelve to six? Give a fraction.`,
    ],
    `${numerator}/13`,
    ['分', 'minutes'],
    [
      '十二時から時計回りに測った角度の合計が、一周分になる時刻を探す。',
      'The clockwise angles measured from twelve must add to one full turn. They grow at a combined rate of 6.5 degrees per minute.',
    ],
    `(360 − ${hour * 30}) ÷ (6 + 0.5) = ${numerator}/13`
  );
}

export const clockHands = [
  clockAngle,
  clockMeeting,
  secondRightAngle,
  symmetricClock,
] as const;

function tankStep(): StudioExercise {
  const lowArea = randomInt(2, 6) * 10;
  const highArea = lowArea * 2;
  const step = randomInt(2, 6);
  const upperDepth = randomInt(5, 12);

  const volume = lowArea * step + highArea * upperDepth;
  return exercise(
    [
      `空の水そうの水平な断面積は、深さ${step}cmまでは${lowArea}cm²、その上は${highArea}cm²です。容量に余裕がある水そうに${volume}cm³注ぐと、底から何cmの深さになりますか。`,
      `An empty tank has horizontal cross-sectional area ${lowArea} cm² up to a depth of ${step} cm and ${highArea} cm² above that. It can hold all ${volume} cm³ poured in. What is the final depth?`,
    ],
    step + upperDepth,
    ['cm', 'cm'],
    [
      `段の高さまでの水量を引き、残りを上段の断面積で割る。`,
      `Fill the lower section first. Divide the remaining volume by the upper area.`,
    ],
    `${step} + (${volume} − ${lowArea} × ${step}) ÷ ${highArea} = ${step + upperDepth}`
  );
}

function drainingTank(): StudioExercise {
  const area = randomInt(3, 9) * 10;
  const outflow = area * 2;
  const inflow = area * randomInt(3, 5);
  const minutes = randomInt(2, 6);
  const start = randomInt(3, 7);
  return exercise(
    [
      `底面積${area}cm²の直方体の水そうに深さ${start}cmまで水があります。毎分${inflow}cm³注ぎながら毎分${outflow}cm³排水します。あふれないとすると、${minutes}分後の深さは何cmですか。`,
      `Water is ${start} cm deep in a tank with vertical sides and base area ${area} cm². It gains ${inflow} cm³ and drains ${outflow} cm³ per minute. Without overflowing, how deep is it after ${minutes} minutes?`,
    ],
    start + ((inflow - outflow) * minutes) / area,
    ['cm', 'cm'],
    [
      `流入量と排水量の差から増えた体積を求め、底面積で割って深さに直す。`,
      `Use the net inflow to find the added volume, then convert it to depth.`,
    ],
    `${start} + (${inflow} − ${outflow}) × ${minutes} ÷ ${area} = ${start + ((inflow - outflow) * minutes) / area}`
  );
}

function readDepthGraph(): StudioExercise {
  const firstMinute = randomInt(2, 4);
  const laterMinutes = randomInt(3, 6);
  const rise = randomInt(1, 3);
  const firstDepth = firstMinute * 2 * rise;
  const lastDepth = firstDepth + laterMinutes * rise;
  const lastMinute = firstMinute + laterMinutes;
  return exercise(
    [
      `グラフは注水時間（分）と水深（cm）の関係です。${firstMinute}分後から${lastMinute}分後まで、水面は一分あたり何cm上がりましたか。`,
      `The graph shows water depth in cm against time in minutes. From minute ${firstMinute} to minute ${lastMinute}, how many centimetres did the water rise per minute?`,
    ],
    rise,
    ['cm/分', 'cm/min'],
    [
      '後半の両端の水深を読み、その差を経過時間で割る。',
      'Read the two depths on the later segment. Divide the change in depth by the elapsed time.',
    ],
    `(${lastDepth} − ${firstDepth}) ÷ (${lastMinute} − ${firstMinute}) = ${rise}`,
    { kind: 'depth-graph', firstMinute, lastMinute, firstDepth, lastDepth }
  );
}

export const waterDepth = [tankStep, drainingTank, readDepthGraph] as const;

function extraCounter(): StudioExercise {
  const incoming = randomInt(2, 5);
  const old = incoming + randomInt(2, 4);
  const extra = randomInt(2, 4);
  const time = randomInt(2, 6);
  const second = randomInt(3, 8);
  const queue = (old - incoming) * time + (old + extra - incoming) * second;
  return exercise(
    [
      `窓口に${queue}人が並び、毎分${incoming}人が加わります。初めは毎分${old}人を案内し、${time}分後に窓口を増やして毎分${old + extra}人を案内します。列がなくなるのは開始から何分後ですか。`,
      `A queue starts with ${queue} people and grows by ${incoming} arrivals per minute. Staff serve ${old} per minute for ${time} minutes, then ${old + extra} per minute. At these constant rates, how many minutes from the start until the queue clears?`,
    ],
    time + second,
    ['分', 'minutes'],
    [
      `各区間の列の減り方は、案内人数から到着人数を引いたもの。`,
      `Subtract arrivals from service in each stage to find the rate at which the queue shrinks.`,
    ],
    `${time} + (${queue} − (${old} − ${incoming}) × ${time}) ÷ (${old + extra} − ${incoming}) = ${time + second}`
  );
}

function driftingBoat(): StudioExercise {
  const current = randomInt(2, 5) * 10;
  const powered = current * 3;
  const drift = randomInt(3, 7);
  const sailing = randomInt(4, 10);
  const distance = current * drift + powered * sailing;
  return exercise(
    [
      `船が下流へ${distance}m進む途中、エンジンを止めて${drift}分流されました。流れは分速${current}m、エンジン使用中の岸から見た速さは分速${powered}mです。全部で何分かかりましたか。`,
      `On a ${distance} m downstream trip, a boat drifts with its engine off for ${drift} minutes. The current is ${current} m/min and the powered downstream speed relative to the bank is ${powered} m/min. How long is the trip?`,
    ],
    drift + sailing,
    ['分', 'minutes'],
    [
      `流された距離を引いた分だけ、エンジンを使って進む。`,
      `Subtract the drifting distance before calculating the powered travel time.`,
    ],
    `${drift} + (${distance} − ${drift} × ${current}) ÷ ${powered} = ${drift + sailing}`
  );
}

function trainLength(): StudioExercise {
  const speed = randomInt(12, 24);
  const length = speed * randomInt(3, 6);
  const crossing = randomInt(12, 18);
  const hidden = randomInt(4, 9);
  const bridge = speed * crossing - length;
  const tunnel = speed * hidden + length;
  return exercise(
    [
      `一定の速さの列車が長さ${bridge}mの橋を渡ります。先頭が橋に入ってから最後尾が出るまで${crossing}秒です。長さ${tunnel}mのトンネルでは、列車全体が隠れる時間が${hidden}秒です。列車の長さは何mですか。`,
      `A train crosses a ${bridge} m bridge in ${crossing} seconds, from its front entering to its rear leaving. At the same speed it is entirely inside a ${tunnel} m tunnel for ${hidden} seconds. How long is the train?`,
    ],
    length,
    ['m', 'm'],
    [
      '先頭の移動距離は橋では「橋＋列車」、隠れている間は「トンネル−列車」。二つを足すと列車の長さが消える。',
      'The front travels the bridge plus the train length in the first interval and the tunnel minus the train length in the second. Adding cancels the train length.',
    ],
    `(${bridge} + ${tunnel}) ÷ (${crossing} + ${hidden}) = ${speed}, ${speed} × ${crossing} − ${bridge} = ${length}`
  );
}

function secondMeeting(): StudioExercise {
  const slow = randomInt(4, 8) * 10;
  const fast = slow + randomInt(1, 3) * 10;
  const first = randomInt(4, 10);
  const distance = (slow + fast) * first;
  return exercise(
    [
      `長さ${distance}mの一本道の両端から、二人が互いに向かって分速${slow}mと分速${fast}mで同時に出発します。端に着くたびにすぐ折り返すと、出発から何分後に二度目に出会いますか。`,
      `Two walkers start together at opposite ends of a ${distance} m path, walking towards each other at ${slow} and ${fast} m/min. Each turns back immediately at either end. How many minutes after starting do they meet for the second time?`,
    ],
    first * 3,
    ['分', 'minutes'],
    [
      '一度目までに二人で片道分を歩く。そこから二度目までに二人でさらに片道の二倍を歩く。',
      'Together they cover one path length before meeting once. By the next meeting they have covered three path lengths in total.',
    ],
    `3 × ${distance} ÷ (${slow} + ${fast}) = ${first * 3}`
  );
}

function workWithAbsence(): StudioExercise {
  const rateA = randomInt(3, 6);
  const rateB = randomInt(2, 5);
  const days = randomInt(6, 12);
  const absent = randomInt(1, days - 2);
  const whole = rateA * days + rateB * (days - absent);
  return exercise(
    [
      `Aさんは一日に${rateA}台、Bさんは一日に${rateB}台の自転車を点検します。${days}日間で二人が点検したのは${whole}台です。Aさんは毎日働き、Bさんは何日か休みました。Bさんが休んだのは何日ですか。`,
      `A inspects ${rateA} bikes per working day and B inspects ${rateB}. In ${days} days they inspect ${whole} bikes. A works every day, while B takes some full days off. How many days does B miss?`,
    ],
    absent,
    ['日', absent === 1 ? 'day' : 'days'],
    [
      '二人が毎日働いたときとの差は、すべてBさんの休みの分。',
      'Compare the actual count with the count if both worked every day. All missing inspections are due to B’s days off.',
    ],
    `((${rateA} + ${rateB}) × ${days} − ${whole}) ÷ ${rateB} = ${absent}`
  );
}

export const stagedRates = [
  extraCounter,
  driftingBoat,
  trainLength,
  secondMeeting,
  workWithAbsence,
] as const;
