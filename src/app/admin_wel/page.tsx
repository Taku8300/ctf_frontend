"use client"; // クライアントコンポーネントとして宣言

import React from "react";
import Header from "@/components/Header_Admin"; // ヘッダーコンポーネントをインポート
import { useRouter } from "next/navigation"; // ルーターをインポート
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter(); // useRouter を使ってルーターを初期化

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch('http://localhost/contest', {
          method: 'GET',
          credentials: 'include', // クッキーを含める
          headers: {
            "X-Frontend-Path": "/admin",
          },
        });
        console.log(response.status)
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`)
          if (response.status == 401) {
            router.push('/Login');
          }else if(response.status == 403) {
            router.push("/user")
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
      } catch (err) {
        console.log(err)

      } finally {
      }
    };

    fetchAPI();
  }, []);

  // ボタンがクリックされたときのハンドラー
  const handleJoinContest = () => {
    router.push("/user"); // top画面 (page.js) に遷移
  };

  const handleEditContest = () => {
    router.push("/admin"); // admin_topページに遷移
  };

  return (
    <div className="min-h-screen bg-teal-400 flex flex-col items-center justify-center">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">ようこそ</h2>
          <div className="flex justify-center space-x-6">
            {/* コンテスト参加ボタン */}
            <button
              className="bg-teal-400 text-white text-xl py-3 px-6 rounded-full shadow-md hover:opacity-90"
              onClick={handleJoinContest} // コンテスト参加用の遷移
            >
              コンテスト参加
            </button>
            {/* コンテスト編集ボタン */}
            <button
              className="bg-red-300 text-white text-xl py-3 px-6 rounded-full shadow-md hover:opacity-90"
              onClick={handleEditContest} // コンテスト編集用の遷移
            >
              コンテスト編集
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
