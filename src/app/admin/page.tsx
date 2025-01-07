"use client";

import React, { useEffect, useState } from "react";
import { useRouter,usePathname } from "next/navigation";
import "@/components/AdminHeader"
import AdminHeader from "@/components/AdminHeader";
import path from "path";

type Tournament = {
  number: number;
  title: string;
  startDate: string;
  endDate: string;
};

export default function AdminTop() {
  const router = useRouter();
  const path = usePathname()

  // トーナメント一覧の状態
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // ローディング状態を管理するための状態を追加
  const [loadingStartStates, setLoadingStartStates] = useState<{ [key: number]: boolean }>({});
  const [loadingStopStates, setLoadingStopStates] = useState<{ [key: number]: boolean }>({});
  
  // 削除確認モーダル内のローディング状態
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // ローカルストレージからデータを取得
  useEffect(() => {
    const getContest = async () => {
      try {
        const response = await fetch("http://localhost/contest", {
          method: "GET",
          credentials: "include", // クッキーを含める
          headers: {
            "X-Frontend-Path": path,
          },
        });
        console.log(response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`);
          if (response.status == 401) {
            router.push("/Login");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: any[] = await response.json();
        const transformedData: Tournament[] = data.map((item) => ({
          number: item.id,
          title: item.name,
          startDate: item.start_date,
          endDate: item.end_date,
        }));
        console.log(data);
        setTournaments(transformedData);
      } catch (err) {
        console.error("コンテスト取得中にエラーが発生しました:", err);
        // setError('API呼び出し中にエラーが発生しました。');
      } finally {
        // setLoading(false);
      }
    };
    getContest();

    // const storedTournaments = JSON.parse(
    //   localStorage.getItem("tournaments") || "[]"
    // ) as Tournament[];
    // setTournaments(storedTournaments);
  }, [router]);

  // 選択されたトーナメントの状態
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態

  // 削除ボタンが押された時の処理
  const handleDeleteClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsModalOpen(true); // モーダルを開く
  };

  // 削除を確認した時の処理
  const confirmDelete = async () => {
    if (!selectedTournament) return; // 選択されたトーナメントが null の場合は何もしない

    setIsDeleting(true); // 削除処理開始

    try {
      const response = await fetch(`http://localhost/contest/${selectedTournament.number}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Frontend-Path": path,
        },
        credentials: "include", // クッキーを含める
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`コンテスト削除に失敗しました: ${errorData.error}`);
        return;
      }
      // const data = await response.json(); // 必要に応じてデータを使用

      alert(`コンテスト「${selectedTournament.title}」を削除しました。`);
      const updatedTournaments = tournaments.filter(
        (t) => t.number !== selectedTournament.number
      );
      setTournaments(updatedTournaments); // 状態を更新
      localStorage.setItem("tournaments", JSON.stringify(updatedTournaments)); // ローカルストレージを更新
    } catch (error) {
      console.error("コンテスト削除中にエラーが発生しました:", error);
      alert("コンテスト削除中にエラーが発生しました");
    } finally {
      setIsDeleting(false); // 削除処理終了
      setSelectedTournament(null);
      setIsModalOpen(false); // モーダルを閉じる
    }
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

  const onStart = async (t: Tournament) => {
    // 現在のトーナメントのローディング状態を true に設定
    setLoadingStartStates((prev) => ({ ...prev, [t.number]: true }));

    try {
      const response = await fetch(`http://localhost/contest/${t.number}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // クッキーを含める
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`コンテスト開始に失敗しました: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      alert(`コンテスト「${t.title}」を開始しました。`);
      // 必要に応じてステータスの更新や他の処理を行う
    } catch (error) {
      console.error("コンテスト開始に失敗しました:", error);
      alert("コンテスト開始中にエラーが発生しました。");
    } finally {
      // ローディング状態を false に設定
      setLoadingStartStates((prev) => ({ ...prev, [t.number]: false }));
    }
  };

  const onStop = async (t: Tournament) => {
    // 現在のトーナメントのローディング状態を true に設定
    setLoadingStopStates((prev) => ({ ...prev, [t.number]: true }));

    try {
      const response = await fetch(`http://localhost/contest/${t.number}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          
        },
        credentials: "include", // クッキーを含める
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`コンテスト停止に失敗しました: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      alert(`コンテスト「${t.title}」を停止しました。`);
      // 必要に応じてステータスの更新や他の処理を行う
    } catch (error) {
      console.error("コンテスト停止に失敗しました:", error);
      alert("コンテスト停止中にエラーが発生しました。");
    } finally {
      // ローディング状態を false に設定
      setLoadingStopStates((prev) => ({ ...prev, [t.number]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      {/* <header className="bg-teal-400 p-5 text-white text-3xl font-bold">
        管理画面
      </header> */}
      <AdminHeader contestID={null} isTop={true}/>

      {/* コンテンツ */}
      <main className="flex-grow p-10">
        <h1 className="text-2xl font-bold mb-6">コンテスト一覧</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.number}
              className={`p-6 rounded-lg shadow-lg cursor-pointer ${
                selectedTournament?.number === tournament.number
                  ? "bg-gray-300"
                  : "bg-white"
              }`}
              onClick={() => router.push(`/admin/${tournament.number}/question`)}
            >
              <h2 className="text-xl font-bold mb-2">
                {tournament.title} ({tournament.number})
              </h2>
              <p className="text-gray-600 mb-1">
                {tournament.startDate} ~ {tournament.endDate}
              </p>
              <div className="flex space-x-3 mt-4">
                {selectedTournament?.number === tournament.number ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 親の onClick を防ぐ
                      handleDeleteClick(tournament);
                    }}
                    className="bg-red-500 text-white py-1 px-3 rounded-md"
                  >
                    削除
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 親の onClick を防ぐ
                      setSelectedTournament(tournament);
                    }}
                    className="bg-gray-400 text-white py-1 px-3 rounded-md"
                  >
                    選択
                  </button>
                )}
                {/* 「開始」ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 親の onClick を防ぐ
                    onStart(tournament);
                  }}
                  className={`bg-blue-400 text-white py-1 px-3 rounded-md flex items-center justify-center ${
                    loadingStartStates[tournament.number]
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={loadingStartStates[tournament.number]}
                >
                  {loadingStartStates[tournament.number] ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    "開始"
                  )}
                </button>
                {/* 「停止」ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 親の onClick を防ぐ
                    onStop(tournament);
                  }}
                  className={`bg-yellow-400 text-white py-1 px-3 rounded-md flex items-center justify-center ${
                    loadingStopStates[tournament.number]
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={loadingStopStates[tournament.number]}
                >
                  {loadingStopStates[tournament.number] ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    "停止"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* 「コンテストを作成」ボタン */}
        <button
          onClick={handleCreateTournament}
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
              「{selectedTournament?.title}」を削除しますか？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className={`bg-gray-400 text-white py-1 px-4 rounded-md ${
                  isDeleting ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isDeleting}
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className={`bg-red-500 text-white py-1 px-4 rounded-md flex items-center justify-center ${
                  isDeleting ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    削除中...
                  </>
                ) : (
                  "削除"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
