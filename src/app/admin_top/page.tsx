"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminTop() {
  const router = useRouter();

  // コンテスト一覧の状態
  const [contests, setContests] = useState([
    { id: 1, name: "コンテストA", status: "開催中", startDate: "2024/12/01", endDate: "2024/12/10" },
    { id: 2, name: "コンテストB", status: "開催予定", startDate: "2024/12/20", endDate: "2024/12/30" },
    { id: 3, name: "コンテストC", status: "開催済", startDate: "2024/11/01", endDate: "2024/11/10" },
  ]);

  // 選択されたコンテストの状態
  const [selectedContest, setSelectedContest] = useState<{
    id: number;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態

  // 削除ボタンが押された時の処理
  const handleDeleteClick = (contest: {
    id: number;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => {
    setSelectedContest(contest);
    setIsModalOpen(true); // モーダルを開く
  };

  // 削除を確認した時の処理
  const confirmDelete = () => {
    if (!selectedContest) return; // 選択されたコンテストが null の場合は何もしない
    setContests(contests.filter((c) => c.id !== selectedContest.id)); // 対象を削除
    setSelectedContest(null);
    setIsModalOpen(false); // モーダルを閉じる
  };

  // キャンセルした時の処理
  const cancelDelete = () => {
    setSelectedContest(null);
    setIsModalOpen(false); // モーダルを閉じる
  };

  // 「コンテストを作成」ボタン
  const handleCreateContest = () => {
    router.push("/con_cre");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-teal-400 p-5 text-white text-3xl font-bold">
        管理画面
      </header>

      {/* コンテンツ */}
      <main className="flex-grow p-10">
        <h1 className="text-2xl font-bold mb-6">コンテスト一覧</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <div
              key={contest.id}
              className={`p-6 rounded-lg shadow-lg ${
                selectedContest?.id === contest.id ? "bg-gray-300" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{contest.name}</h2>
              <p className="text-gray-600 mb-1">
                {contest.status} ({contest.startDate} ~ {contest.endDate})
              </p>
              {selectedContest?.id === contest.id ? (
                <button
                  onClick={() => handleDeleteClick(contest)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md"
                >
                  削除
                </button>
              ) : (
                <button
                  onClick={() => setSelectedContest(contest)}
                  className="bg-gray-400 text-white py-1 px-3 rounded-md"
                >
                  選択
                </button>
              )}
            </div>
          ))}
        </div>
        {/* 「コンテストを作成」ボタン */}
        <button
          onClick={handleCreateContest}
          className="fixed bottom-10 right-10 bg-teal-400 text-white p-4 rounded-full shadow-lg hover:scale-105"
        >
          コンテストを作成
        </button>
      </main>

      {/* 削除確認モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-4">
              「{selectedContest?.name}」を削除しますか？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-400 text-white py-1 px-4 rounded-md"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
