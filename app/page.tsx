"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY || "",
});

interface VideoType {
  id: string;
  title: string;
  video_id: string;
  thumbnail?: { url: string; };
  key_phrase?: string;
  related_links?: string;
  view_ai?: string;
  view_labor?: string;
  view_future?: string;
  score_x?: number; 
  score_y?: number;
}

interface GlossaryType {
  id: string;
  word: string;
  description: string;
}

export default function Home() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [glossary, setGlossary] = useState<GlossaryType[]>([]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 【新機能】Netflix風スライドのための連動用リファレンス
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      client.get({ endpoint: "title" }),
      client.get({ endpoint: "glossary" }).catch(() => ({ contents: [] }))
    ])
      .then(([videoRes, glossaryRes]) => {
        setVideos(videoRes.contents);
        setGlossary(glossaryRes.contents);
        setCheckedIds(videoRes.contents.map((v: any) => v.id));
        setLoading(false);
      })
      .catch((err) => {
        console.error("データ取得失敗:", err);
        setLoading(false);
      });
  }, []);

  // 【新機能】横スクロールボタンの処理
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // 横幅の約80%分だけスクロールさせる（Netflixと同じような動き）
      const scrollAmount = container.clientWidth * 0.8; 
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth" // 滑らかに動かす
      });
    }
  };

  const handleCheck = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((item) => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const getYouTubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const selectedVideos = videos.filter((v) => checkedIds.includes(v.id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">研究データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 🌐 ナビゲーションバー */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">AI時代の労働分析アーカイブ</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-500">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-5 pt-5">HOME</a>
            <a href="#archive" className="hover:text-slate-900 transition">動画一覧</a>
            <a href="#compare" className="hover:text-slate-900 transition">比較分析</a>
            <a href="#glossary" className="hover:text-slate-900 transition">用語集</a>
          </div>
        </div>
      </nav>

      {/* 🚀 メインヒーローセクション */}
      <header className="bg-white border-b border-slate-200/60 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AI時代における<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">労働環境の変化</span>
            </h2>
            <p className="text-blue-600 font-bold tracking-widest text-xs uppercase">Video Analysis Archive</p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl pt-2">
              客観的な動画記録（事実）をもとに、AI観・労働観・未来への態度をマトリクス化し、社会構造の変容を実証的に考察・比較する学術アーカイブ。
            </p>
          </div>

          {/* 分析フレームワーク */}
          <div className="mt-12 pt-8 border-t border-slate-100 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">分析フレームワーク</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl">
              {[
                { label: "AI観", desc: "技術への信頼度", icon: "🤖" },
                { label: "労働環境", desc: "雇用の流動性", icon: "💼" },
                { label: "人間観", desc: "主体性と価値", icon: "👤" },
                { label: "自由と規律", desc: "働き方の変容", icon: "🔒" },
                { label: "生産性", desc: "効率性と成果", icon: "📊" },
                { label: "適応力", desc: "リスキリング", icon: "🎓" },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50/60 border border-slate-200/40 rounded-xl p-3 flex flex-col items-center text-center space-y-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  <span className="text-[9px] text-slate-400 font-medium">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="py-16 space-y-24 overflow-hidden">

        {/* 🎬 Video Archive セクション（★Netflix風の横スクロールに変更） */}
        <section id="archive" className="space-y-6 scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-blue-600 text-lg">📹</span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Video Dataset <span className="text-slate-400 font-normal text-xs ml-2">対象動画と客観的事実データ</span></h3>
            </div>
            
            {/* カルーセル操作用左右ボタン */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleScroll("left")}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition"
                title="左にスクロール"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={() => handleScroll("right")}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition"
                title="右にスクロール"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* 横スクロールする外枠のコンテナ */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video) => {
              const yId = getYouTubeId(video.video_id);
              return (
                <div 
                  key={video.id} 
                  className="w-[290px] sm:w-[360px] shrink-0 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition duration-300 snap-start"
                >
                  <div className="aspect-video w-full bg-slate-950 relative border-b border-slate-100">
                    {yId ? (
                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${yId}`} title={video.title} allowFullScreen></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">動画URL未登録</div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <span className="inline-block bg-slate-100 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">Source Fact</span>
                        <h4 className="font-bold text-slate-900 leading-snug text-sm sm:text-base line-clamp-2 min-h-[44px]">{video.title}</h4>
                      </div>
                      
                      {video.key_phrase && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 whitespace-pre-wrap leading-relaxed line-clamp-5 hover:line-clamp-none transition-all duration-300">
                          <p className="font-bold text-slate-400 text-[9px] uppercase tracking-wider mb-1">📝 動画内の事実・トピック要約</p>
                          {video.key_phrase}
                        </div>
                      )}
                    </div>
                    {video.related_links && (
                      <div className="pt-3 border-t border-slate-100">
                        <a href={video.related_links} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-bold py-2 px-3 rounded-xl text-[11px] transition duration-200">
                          🔗 外部関係一次資料
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ⚖️ Compare Analysis ＆ ポジションマップセクション */}
        <section id="compare" className="space-y-6 scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-blue-600 text-lg">⚖️</span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Analytical Insights <span className="text-slate-400 font-normal text-xs ml-2">主観・解釈に基づく比較分析結果</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">分析対象の選択</p>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {videos.map((video) => (
                  <label key={video.id} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition">
                    <input type="checkbox" checked={checkedIds.includes(video.id)} onChange={() => handleCheck(video.id)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/30" />
                    <span className="truncate">{video.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-600 min-w-[480px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/60">
                    <tr>
                      <th className="p-4 w-28 border-r border-slate-100 text-slate-800">独自の分析軸</th>
                      {selectedVideos.map((video) => (
                        <th key={video.id} className="p-4 border-r border-slate-100 min-w-[160px] align-top text-slate-900 font-bold bg-blue-50/20">{video.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="bg-blue-50/5">
                      <td className="p-4 font-bold bg-blue-50/10 text-blue-900 border-r border-blue-100/60 flex items-center gap-1">
                        <span>🤖</span> AI観点
                      </td>
                      {selectedVideos.map((video) => (
                        <td key={video.id} className="p-4 border-r border-slate-100 align-top whitespace-pre-wrap leading-relaxed text-slate-700">{video.view_ai || "ー"}</td>
                      ))}
                    </tr>
                    <tr className="bg-indigo-50/5">
                      <td className="p-4 font-bold bg-indigo-50/10 text-indigo-900 border-r border-indigo-100/60 flex items-center gap-1">
                        <span>💼</span> 労働観点
                      </td>
                      {selectedVideos.map((video) => (
                        <td key={video.id} className="p-4 border-r border-slate-100 align-top whitespace-pre-wrap leading-relaxed text-slate-700">{video.view_labor || "ー"}</td>
                      ))}
                    </tr>
                    <tr className="bg-violet-50/5">
                      <td className="p-4 font-bold bg-violet-50/10 text-violet-900 border-r border-violet-100/60 flex items-center gap-1">
                        <span>🔮</span> 未来への態度
                      </td>
                      {selectedVideos.map((video) => (
                        <td key={video.id} className="p-4 border-r border-slate-100 align-top whitespace-pre-wrap leading-relaxed text-slate-700">{video.view_future || "ー"}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                <div className="w-full aspect-square bg-[#fafafa] border border-slate-200/80 rounded-xl relative overflow-hidden shadow-inner">
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-300"></div>
                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-300"></div>
                  <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 bg-white/90 border border-slate-200/40 px-1.5 py-0.5 rounded shadow-sm">AIに肯定的</span>
                  <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 bg-white/90 border border-slate-200/40 px-1.5 py-0.5 rounded shadow-sm">AIに警戒的</span>
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 bg-white/90 border border-slate-200/40 px-1.5 py-0.5 rounded shadow-sm">個人視点</span>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 bg-white/90 border border-slate-200/40 px-1.5 py-0.5 rounded shadow-sm">社会視点</span>

                  {selectedVideos.map((video, index) => {
                    const x = video.score_x !== undefined ? video.score_x : (index % 2 === 0 ? 35 : -35);
                    const y = video.score_y !== undefined ? video.score_y : (index % 3 === 0 ? 45 : -25);
                    const leftPosition = 50 + (x / 2);
                    const topPosition = 50 - (y / 2);
                    const colors = ["bg-indigo-600 ring-indigo-100", "bg-blue-600 ring-blue-100", "bg-violet-600 ring-violet-100"];
                    return (
                      <div key={video.id} className="absolute group z-20" style={{ left: `${leftPosition}%`, top: `${topPosition}%` }}>
                        <div className={`w-3 h-3 ${colors[index % 3]} rounded-full ring-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-sm`}></div>
                        <div className="absolute left-3.5 -top-3 bg-slate-900/95 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-30 pointer-events-none">
                          {video.title.length > 8 ? `${video.title.substring(0, 8)}...` : video.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📖 用語集（Glossary）セクション */}
        <section id="glossary" className="space-y-6 scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-blue-600 text-lg">📖</span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Glossary <span className="text-slate-400 font-normal text-xs ml-2">研究背景の基本用語解説</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {glossary.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-2 hover:border-blue-500/30 transition">
                <h4 className="font-bold text-xs tracking-tight border-b border-slate-100 pb-1.5 text-blue-600">
                  {item.word}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <p>© 2026 Work & AI Archive Project</p>
        </div>
      </footer>

    </div>
  );
}