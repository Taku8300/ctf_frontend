// pages/index.tsx
"use client"; // クライアントコンポーネントとしてマーク

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  
  return (
    <div className="shapedividers_com-9747 w-full flex flex-col min-h-screen">
      {/* ナビゲーションバー */}
      <header className="flex items-center justify-between px-6 py-4 bg-blue-700/90 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-wide">CTF Service</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-blue-200">Home</a></li>
            <li><a href="#" className="hover:text-blue-200">Challenges</a></li>
            <li><a href="#" className="hover:text-blue-200">Ranking</a></li>
            <li><a href="#" className="hover:text-blue-200">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="flex flex-col items-center justify-center text-center py-24 px-6 mx-auto my-3">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Join Our <span className="text-blue-900">CTF</span> Now!
          </h2>
          <p className="text-white max-w-xl mb-8 text-xl">
            学びながら楽しめるオンラインセキュリティコンテスト。
            多種多様な問題に挑戦してスキルを磨き、ランキング上位を目指しましょう！
          </p>
          <button
            onClick={() => {router.push("/Login")}}
            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-full shadow hover:bg-blue-700 hover:text-white transition-colors"
          >
            Get Started
          </button>
        </section>

        {/* 特徴紹介セクション */}
        <section
          id="features"
          className="bg-blue-50/60 mx-6 md:mx-12 mt-8 p-8 rounded-lg shadow-lg"
        >
          <h3 className="text-3xl font-semibold text-center text-blue-700 mb-10">
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-md p-6 shadow-md text-center">
              <h4 className="text-xl font-bold text-blue-700 mb-2">
                Variety of Challenges
              </h4>
              <p className="text-sm text-gray-700">
                Web、Cryptography、Pwn、Forensics など幅広いジャンルを用意。
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-md p-6 shadow-md text-center">
              <h4 className="text-xl font-bold text-blue-700 mb-2">
                Real-Time Ranking
              </h4>
              <p className="text-sm text-gray-700">
                提出した問題の結果に応じて即時にランキングを更新。  
                友達と競い合いながら学べます。
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-md p-6 shadow-md text-center">
              <h4 className="text-xl font-bold text-blue-700 mb-2">
                Hints & Community
              </h4>
              <p className="text-sm text-gray-700">
                詰まった時はヒントやコミュニティフォーラムを活用可能。  
                仲間と交流しながら力を伸ばそう！
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-blue-700/90 text-white py-6 text-center">
        <p className="text-sm">&copy; 2024 My CTF Service. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
