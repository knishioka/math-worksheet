import type { CalculationPattern, WorksheetSettings } from '../types';
import { isEnglishUnitPattern } from '../lib/generators/templates/en-word-story';
import { getPatternBaseKey } from './pattern-catalog';

export interface LessonVideo {
  id: string;
  title: string;
}

// 日英で同じ解き方を使う教材は、片方の教材IDだけで登録できる。
function video(
  id: string,
  title: string,
  patterns: CalculationPattern[],
  fromGrade = 1
): LessonVideo & { materials: string[]; fromGrade: number } {
  return { id, title, materials: patterns.map(getPatternBaseKey), fromGrade };
}

const lessons = [
  video('BOXMzn8LjIQ', '和差算のしくみ', ['entrance-sum-difference-jap']),
  video(
    'zuGeCkw5yBI',
    '植木算、なぜ1本ずれる？【中学受験 算数】（植木算1 基本編）',
    ['entrance-tree-planting-jap']
  ),
  video('SRtVoQWwXaU', '植木算・応用｜輪になると、端はどこへ？', [
    'entrance-tree-planting-jap',
  ]),
  video('F0maIWrgiA4', 'つるかめ算のしくみ', ['entrance-crane-turtle-jap']),
  video('qACpa5oOntM', '差集め算｜1つあたりの差から、数を求める', [
    'entrance-difference-gathering-jap',
  ]),
  video('bEYJ99L_rF4', '過不足算｜配り方の差から、人数を求める', [
    'entrance-excess-shortage-jap',
  ]),
  video('e8jrxc_XNr4', '消去算｜そろえて引いて、1個の値段を求める', [
    'entrance-elimination-jap',
  ]),
  video(
    'VeZxPVWMKP0',
    '周期算・入門｜くり返す並びの何番目？ 余り0も図で考える',
    ['entrance-cycle-jap']
  ),
  video('NvlX3KkM-Os', '周期算・応用｜2つの周期がそろう番目と丸の合計', [
    'entrance-cycle-jap',
  ]),
  video(
    'tdAjCsjJIbY',
    '数列・入門｜同じ数ずつ増える並びの何番目と和',
    ['entrance-sequence-jap', 'word-unit-patterns-en'],
    4
  ),
  video('dHoehDVgZmc', '数列・入試｜組に区切る群数列と分数の並び', [
    'entrance-sequence-jap',
  ]),
  video('GWcpcvlwFdE', '集合算・入門｜2つの輪で人数を分ける', [
    'entrance-sets-jap',
  ]),
  video('-VpWDBqgDsY', '角度｜三角形の内角・外角と平行線の角', [
    'entrance-polygon-angles-jap',
    'geometry-angle-jap',
  ]),
  video('IhlVKKzTFz0', '角度・応用｜角を移して多角形を分ける', [
    'entrance-polygon-angles-jap',
  ]),
  video('LuWH3cZX1l0', '面積の応用・入門｜複合図形を長方形へ直す', [
    'entrance-composite-area-jap',
  ]),
  video('qsbjlAIF8Vc', '面積の応用・応用｜道の面積と周りの長さ', [
    'entrance-composite-area-jap',
  ]),
  video('kOMSLfbYLTk', 'つるかめ算・応用｜弁償算', [
    'entrance-changing-counts-jap',
  ]),
  video('87zXLr64iLc', '植木算・入試｜分かれ道の木を一度だけ数える', [
    'entrance-changing-counts-jap',
  ]),
  video('RUkp6kP7AD0', '倍数算｜変わらない量で1つ分を求める', [
    'entrance-multiples-jap',
  ]),
  video('lPzrib8zUEw', '比の分配のしかた', [
    'entrance-ratio-sharing-jap',
    'word-unit-ratio-en',
  ]),
  video('TSbMSdflthA', '比の分配・応用｜2つの比を1つにそろえる', [
    'entrance-ratio-sharing-jap',
  ]),
  video('R6hDPA4p68k', '年齢算のしくみ', ['entrance-age-jap']),
  video('sBjozM_RzZQ', '相当算｜残りのページ数から、全体を求める', [
    'entrance-equivalent-jap',
  ]),
  video('aKKyQOH-te0', '売買損益｜原価・定価・売価と利益', [
    'entrance-profit-loss-jap',
  ]),
  video('6P0A8cXR8x4', '食塩水｜水を加えると濃度は？', [
    'entrance-salt-water-jap',
  ]),
  video('3ZARmSyUWiw', '食塩水・応用｜2つ混ぜると何%？', [
    'entrance-salt-water-jap',
  ]),
  video('UVvPJXpLgc4', '旅人算｜向きで足す・引くを決める', [
    'entrance-traveler-jap',
  ]),
  video('uXAP-Mn7pN8', '通過算｜先頭が進む道のりから、時間を求める', [
    'entrance-train-passing-jap',
  ]),
  video('sx16zgY1X64', '通過算・応用｜すれ違い・追い越しにかかる時間', [
    'entrance-train-passing-jap',
  ]),
  video('AxuYMYnJtF8', '流水算｜船と流れの矢印で上り・下りを決める', [
    'entrance-river-jap',
  ]),
  video('wOeSCnflQVg', '仕事算｜1日分の仕事量を合わせる', [
    'entrance-work-jap',
  ]),
  video('kCuU3roaunU', '仕事算・応用｜途中で働く人が変わる', [
    'entrance-work-jap',
  ]),
  video('C1TqmUgrxB8', 'ニュートン算｜差から毎分届く数を求める', [
    'entrance-newton-jap',
  ]),
  video('RwNZPSVxCqk', 'つるかめ算・入試｜3種類を数える', [
    'entrance-advanced-crane-turtle-jap',
  ]),
  video('BdqPM50LDH4', '年齢算・入試｜合計の倍と過去・未来', [
    'entrance-advanced-ratio-age-jap',
  ]),
  video('_bwYaYNz9xE', '旅人算・入試｜ダイヤグラムから時刻と地点を読む', [
    'entrance-advanced-speed-jap',
  ]),
  video('-yAjsgO7a1E', '平均とならし｜棒の高さで考える', [
    'data-average-jap',
    'entrance-averages-jap',
  ]),
  video('BBkQ6um7IJU', '平均とならし・応用｜二組の平均を合わせる', [
    'entrance-averages-jap',
  ]),
  video('uP0juvzJUYM', '平均とならし・入試｜抜けた人と入れ替わった人の点数', [
    'entrance-averages-jap',
  ]),
  video('6wcFNbJ6lD8', '約数と倍数・入門｜タイルと飛び石で見つけよう', [
    'entrance-divisibility-jap',
    'number-gcd-jap',
    'number-lcm-jap',
  ]),
  video('fE8r6LxNNTw', '約数と倍数・応用｜最大公約数と最小公倍数を使い分ける', [
    'entrance-divisibility-jap',
    'number-gcd-jap',
    'number-lcm-jap',
  ]),
  video('mZGMNnbfGws', '割合｜もとにする量を1とみる', ['word-unit-percent-en']),
  video('XLeSia6omQs', '割合｜百分率と歩合で表す', [
    'percent-basic',
    'word-unit-percent-en',
  ]),
  video('Ul6xbLYSubI', '割合と百分率・応用｜もとにする量をつないで考える', [
    'entrance-percent-change-jap',
  ]),
  video('Y9vP1m8-0w8', '割合と百分率・入試｜残りから逆算し、増減のもとを選ぶ', [
    'entrance-percent-change-jap',
  ]),
  video('rrASwKMXgSU', '速さの単位換算｜時間の帯を60に分ける', [
    'entrance-speed-units-jap',
  ]),
  video('OTt2UJF_cCk', '速さの三用法・応用｜往復の平均の速さ', [
    'entrance-speed-units-jap',
  ]),
  video('bfkURZP9uoU', '速さの三用法｜道のりの帯で考える', [
    'speed-time-distance',
    'word-unit-speed-en',
  ]),
  video('A1y0GO9J8go', '等積変形｜底辺と高さで面積を比べる', [
    'entrance-equal-area-jap',
  ]),
  video('cfBDicVi5-Q', '三角形の面積比｜同じ高さなら底辺の比', [
    'entrance-triangle-ratio-jap',
  ]),
  video('ZZTC9uMy8rI', '三角形の面積比・入試｜台形の対角線', [
    'entrance-triangle-ratio-jap',
  ]),
  video('CSATinRVj8k', '売買損益・入試｜全体の利益から定価販売数を求める', [
    'entrance-exchange-jap',
  ]),
  video('pTB68FMhE-Y', '食塩水・入試｜2つの容器でやりとり', [
    'entrance-exchange-jap',
  ]),
  video('F5KcnJmCluQ', '食塩水・応用｜面積図で混ぜる量を求める', [
    'entrance-exchange-jap',
  ]),
  video('bnb-Ii63H3I', '比の分配・入試｜やり取り前後の目もりをそろえる', [
    'entrance-exchange-jap',
  ]),
  video('0UJkraiJnuI', '場合の数と樹形図', ['data-combinations-jap']),
  video('NFlU99fIrwk', '場合の数・応用｜条件で枝が変わる数づくり', [
    'entrance-digit-count-jap',
  ]),
  video('7D0OM7l0sw0', '場合の数・入試｜同じ数字を重ねて数えない', [
    'entrance-digit-count-jap',
  ]),
  video('eW57U9hj3wo', '時計算｜長針と短針が重なる時刻', [
    'entrance-clock-hands-jap',
  ]),
  video('OClHRLStdps', '時計算・応用｜直角は二度現れる', [
    'entrance-clock-hands-jap',
  ]),
  video(
    'WVnMX05n62Q',
    '水そうの水の深さとグラフ・入門｜同じ水量でなぜ傾きが変わる？',
    ['entrance-water-depth-jap']
  ),
  video(
    'sRobuEHOZzQ',
    '水そうの水の深さとグラフ・入試｜排水・流量・階段底・おもり',
    ['entrance-water-depth-jap']
  ),
  video('zrVsKMaZyp8', '相似と面積比｜辺の比と面積の比', [
    'entrance-similar-area-jap',
  ]),
  video('Qt_ppdNd_Rg', '円とおうぎ形｜弧・面積・まわりを求める', [
    'entrance-sectors-jap',
    'geometry-circle-jap',
  ]),
  video('aOJ5dbOpt5o', '円とおうぎ形・入試｜回転して通る部分の面積', [
    'entrance-sectors-jap',
  ]),
  video('TvQg9axe7C8', '図形の移動｜平行移動で対応する点を探す', [
    'entrance-motion-jap',
  ]),
  video('S_t2LplNPQk', '図形の移動｜中心・向き・角度で回転移動を描く', [
    'entrance-motion-jap',
  ]),
  video('POV30BHkidk', '図形の移動｜線対称と点対称を方眼で確かめる', [
    'entrance-motion-jap',
  ]),
  video('7CD5pLOk42c', '体積と展開図｜積み上げて折り上げる', [
    'entrance-solid-nets-jap',
  ]),
  video('bGiPknoij_0', '立方体の切断｜同じ面をたどる', [
    'entrance-cube-section-jap',
  ]),
  video('hCSv3Wj6E8E', 'ニュートン算・入試｜途中で窓口を増やすと何分？', [
    'entrance-staged-rates-jap',
  ]),
  video('4ug-4VM7tMI', '流水算・応用｜エンジンが止まって流される', [
    'entrance-staged-rates-jap',
  ]),
  video('MfW6IOFxmYY', '通過算・入試｜二つの時間から長さと速さを逆算', [
    'entrance-staged-rates-jap',
  ]),
  video('uTXzmuS0NIg', '旅人算・応用｜2回目に出会うのはいつ？', [
    'entrance-staged-rates-jap',
  ]),
  video('9sE1F69qrCY', '仕事算・入試｜3組の条件と休んだ日数を逆算', [
    'entrance-staged-rates-jap',
  ]),
];

export function getLessonVideos({
  problemType,
  calculationPattern,
  grade,
}: WorksheetSettings): LessonVideo[] {
  if (!calculationPattern) return [];
  if (
    problemType !== 'basic' &&
    !(problemType === 'word-en' && isEnglishUnitPattern(calculationPattern))
  )
    return [];

  const material = getPatternBaseKey(calculationPattern);
  return lessons.filter(
    (lesson) => grade >= lesson.fromGrade && lesson.materials.includes(material)
  );
}
