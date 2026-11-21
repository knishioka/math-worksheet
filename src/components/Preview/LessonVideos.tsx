import { useId, useState } from 'react';
import type { LessonVideo } from '../../config/lesson-videos';

export function LessonVideos({
  videos,
}: {
  videos: LessonVideo[];
}): React.ReactElement | null {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const current = videos.find((video) => video.id === selectedId) ?? videos[0];
  if (!current) return null;

  return (
    <section
      aria-label="解説動画"
      className="mt-4 border-t border-slate-200 pt-3"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          className="secondary-button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true">{open ? '▴' : '▶'} </span>
          {open ? '動画を閉じる' : '解説動画を見る（日本語）'}
        </button>
        <a
          href={`https://www.youtube.com/watch?v=${current.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-800 underline underline-offset-2"
        >
          YouTubeで開く
        </a>
      </div>
      <div id={panelId} hidden={!open}>
        {open && (
          <div className="mt-3 max-w-3xl space-y-2">
            {videos.length > 1 ? (
              <label className="block text-sm font-medium text-slate-700">
                解説動画を選ぶ
                <select
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                  value={current.id}
                  onChange={(event) => setSelectedId(event.target.value)}
                >
                  {videos.map((video) => (
                    <option key={video.id} value={video.id}>
                      {video.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="text-sm font-medium text-slate-800">
                {current.title}
              </p>
            )}
            <iframe
              key={current.id}
              className="block aspect-video min-h-[200px] w-full rounded-lg bg-black"
              src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&playsinline=1`}
              title={`日本語の解説動画「${current.title}」`}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  );
}
