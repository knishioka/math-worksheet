import { useMemo, useRef, useState, type ReactElement } from 'react';
import { WORD_TOPICS, type WordTopic } from '../config/word-topics';
import {
  EMPTY_FILTERS,
  countWordTopics,
  filterWorksheetCatalog,
  type CatalogFilters,
  type CatalogMaterial,
} from '../config/worksheet-catalog';

const languages = ['ja', 'en'] as const;
type Language = (typeof languages)[number];
const labels = { ja: '日本語', en: '英語' };

export function WordTopicCoverage({
  catalog,
  grade,
  course,
  onChoose,
}: {
  catalog: CatalogMaterial[];
  grade: CatalogFilters['grade'];
  course: CatalogFilters['course'];
  onChoose: (topic: WordTopic, language: Language) => void;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const summary = useRef<HTMLElement>(null);
  const counts = useMemo(
    () =>
      open
        ? languages.map((language) =>
            countWordTopics(
              filterWorksheetCatalog(catalog, {
                ...EMPTY_FILTERS,
                grade,
                course,
                language,
                practice: 'unit',
              })
            )
          )
        : [],
    [open, catalog, grade, course]
  );
  return (
    <details
      className="catalog-coverage"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary ref={summary}>単元ごとの日英の教材数</summary>
      {open && (
        <>
          <p>
            選んだ学年・コースで集計しています。件数を選ぶと、その単元の教材が開きます。
          </p>
          <table aria-label="単元と言語ごとの教材数">
            <thead>
              <tr>
                <th scope="col">単元</th>
                {languages.map((lang) => (
                  <th scope="col" key={lang}>
                    {labels[lang]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(WORD_TOPICS) as WordTopic[]).map((topic) => (
                <tr key={topic}>
                  <th scope="row">{WORD_TOPICS[topic].ja}</th>
                  {languages.map((lang, i) => {
                    const count = counts[i].get(topic) ?? 0;
                    return (
                      <td key={lang}>
                        {count ? (
                          <button
                            type="button"
                            aria-label={`${WORD_TOPICS[topic].ja}・${labels[lang]}の${count}件を表示`}
                            onClick={() => {
                              onChoose(topic, lang);
                              setOpen(false);
                              summary.current?.focus();
                            }}
                          >
                            {count}件
                          </button>
                        ) : (
                          '0件'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </details>
  );
}
