"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tournament = {
  number: number;
  title: string;
  startDate: string;
  endDate: string;
};

export default function AdminTop() {
  const router = useRouter();

  // トーナメント一覧の状態
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // ローカルストレージからデータを取得
  useEffect(() => {
    const storedTournaments = JSON.parse(
      localStorage.getItem("tournaments") || "[]"
    ) as Tournament[];
    setTournaments(storedTournaments);
  }, []);

  // 選択されたトーナメントの状態
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態

  // 削除ボタンが押された時の処理
  const handleDeleteClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsModalOpen(true); // モーダルを開く
  };

  // 削除を確認した時の処理
  const confirmDelete = () => {
    if (!selectedTournament) return; // 選択されたトーナメントが null の場合は何もしない
    const updatedTournaments = tournaments.filter(
      (t) => t.number !== selectedTournament.number
    );
    setTournaments(updatedTournaments); // 状態を更新
    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments)); // ローカルストレージを更新
    setSelectedTournament(null);
    setIsModalOpen(false); // モーダルを閉じる
  };

  // キャンセルした時の処理
  const cancelDelete = () => {
    setSelectedTournament(null);
    setIsModalOpen(false); // モーダルを閉じる
  };

  // 「トーナメントを作成」ボタン
  const handleCreateTournament = () => {
    router.push("/con_cre"); // 作成ページに遷移
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-teal-400 p-5 text-white text-3xl font-bold">
        管理画面
      </header>

      {/* コンテンツ */}
      <main className="flex-grow p-10">
        <h1 className="text-2xl font-bold mb-6">トーナメント一覧</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.number}
              className={`p-6 rounded-lg shadow-lg ${
                selectedTournament?.number === tournament.number
                  ? "bg-gray-300"
                  : "bg-white"
              }`}
            >
              <h2 className="text-xl font-bold mb-2">
                {tournament.title} ({tournament.number})
              </h2>
              <p className="text-gray-600 mb-1">
                {tournament.startDate} ~ {tournament.endDate}
              </p>
              {selectedTournament?.number === tournament.number ? (
                <button
                  onClick={() => handleDeleteClick(tournament)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md"
                >
                  削除
                </button>
              ) : (
                <button
                  onClick={() => setSelectedTournament(tournament)}
                  className="bg-gray-400 text-white py-1 px-3 rounded-md"
                >
                  選択
                </button>
              )}
            </div>
          ))}
        </div>
        {/* 「トーナメントを作成」ボタン */}
        <button
          onClick={handleCreateTournament}
          className="fixed bottom-10 right-10 bg-teal-400 text-white p-4 rounded-full shadow-lg hover:scale-105"
        >
          トーナメントを作成
        </button>
      </main>

      {/* 削除確認モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-4">
              「{selectedTournament?.title}」を削除しますか？
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
