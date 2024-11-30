"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContestCreate() {
  const router = useRouter();

  // フォームの状態
  const [contestName, setContestName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault();

    // バリデーションチェック
    if (!contestName || !startDate || !endDate) {
      alert("全ての項目を入力してください。");
      return;
    }

    // 仮のデータ保存処理 (localStorage などを使用して実装する)
    const newContest = {
      id: Date.now(),
      name: contestName,
      status: "開催予定",
      startDate: startDate,
      endDate: endDate,
    };

    const contests = JSON.parse(localStorage.getItem("contests") || "[]");
    contests.push(newContest);
    localStorage.setItem("contests", JSON.stringify(contests));

    // admin_top に遷移
    router.push("/admin_top");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-teal-400 p-5 text-white text-3xl font-bold">
        コンテスト作成
      </header>

      {/* フォーム */}
      <main className="flex-grow p-10 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
        >
          <h1 className="text-2xl font-bold mb-6">新しいコンテストを作成</h1>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">コンテスト名</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">開始日</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">終了日</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-4 rounded-md hover:opacity-90"
          >
            登録
          </button>
        </form>
      </main>
    </div>
  );
}
