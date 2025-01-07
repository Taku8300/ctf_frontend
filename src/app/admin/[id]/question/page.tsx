"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Admin_header";
import { stringify } from 'querystring';
import { useParams,usePathname } from 'next/navigation';
import AdminHeader from "@/components/AdminHeader";

const Edit_question = () => {
  const params = useParams();
  const { id } = params; // 動的ルートパラメータを取得
  const path = usePathname()


  const router = useRouter();
  const [questions, setQuestions] = useState<
    { id: number; title: string; text: string; score?: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    { id: number; title: string; text: string; score?: string } | null
  >(null);
  const [score, setScore] = useState("");

  useEffect(() => {
    // const storedQuestions = localStorage.getItem("selectedTemplates");
    // if (storedQuestions) {
    //   setQuestions(JSON.parse(storedQuestions));
    // } else {
    //   console.log("localStorageにデータがありません。");
    // }
    const getQuestion = async () => {
      try {
        const response = await fetch('http://localhost/contest/' + id, {
          method: 'GET',
          credentials: 'include', // クッキーを含める
          headers: {
            "X-Frontend-Path": path,
          },
        });
        console.log(response.status)
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`)
          if (response.status == 401) {
            router.push('/Login');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data:  any[] = await response.json();
        const transformedData: Card[]  = data.questions.map(item => ({
          id : item.id,
          title: item.name,
          categoryName: item.category_name,
          score: item.point,
        }));
        console.log(transformedData)
        setQuestions(transformedData);
      } catch (err) {
        // setError('API呼び出し中にエラーが発生しました。');
      } finally {
        // setLoading(false);
      }
    };
    getQuestion()
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };
  const toQuestionTemp = () => {
    const serializedData = encodeURIComponent(JSON.stringify(questions));
    router.push(`/admin/${id}/addquestion?data=${serializedData}`);
  }

  const handleScoreSubmit = async () => {
    if (modalContent) {
      const updatedQuestions = questions.map((q) =>
        q.id === modalContent.id ? { ...q, score } : q
      );
      try {
        const response = await fetch('http://localhost/contest/' + id + '/question/' + modalContent.id , {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // クッキーを含める
          body: JSON.stringify({ point:parseInt(score) }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`pointのアップデートに失敗しました: ${errorData.error}`);
          return;
        }
        const data = await response.json();
      } catch (error) {
        console.error('pointのアップデートに失敗しました:', error);
        alert('pointのアップデートに失敗しました');
      }
      setQuestions(updatedQuestions);
      localStorage.setItem("selectedTemplates", JSON.stringify(updatedQuestions));
    }
    closeModal();
  };

  return (
    <div>
      <AdminHeader contestID={id} isTop={false}/>
      {/* <div className=""> */}
      <div className="flex flex-wrap justify-center items-center p-8 gap-4 mt-5 min-h-screen bg-gray-100">

        <div
          className="grid grid-cols-3 gap-40 p-10  min-h-screen"
          style={{ rowGap: "20px" }}
        >
          {questions.map((card, index) => (
            <div
              key={card.id}
              className="relative bg-white rounded-lg p-8 shadow-lg max-w-xs mx-auto transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              style={{ boxShadow: "8px 8px 0px #FFB6B9", height: "200px", width: "300px" }}
              onClick={() => {
                setModalContent(card);
                setIsModalOpen(true);
                setScore(card.score || ""); // 現在のスコアを入力欄に表示
              }}
            >
              <h2 className="text-2xl font-bold mb-4 text-black">問 {index + 1}</h2>
              <p className="text-lg text-black overflow-y-auto">{card.title}</p>
              {card.score && (
                <div className="absolute bottom-4 left-4 text-sm font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                  スコア: {card.score}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          onClick={toQuestionTemp}
          className="fixed bottom-4 right-4 bg-gray-500 w-16 h-16 flex items-center justify-center rounded-full shadow-lg cursor-pointer transform transition-transform duration-300 hover:bg-teal-600 hover:scale-110"
        >
          <span className="text-4xl font-bold text-white">+</span>
        </div>
      </div>

      {isModalOpen && modalContent && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-[#E7F6F3] rounded-3xl shadow-lg relative p-8 flex flex-col"
            style={{ width: "700px", height: "400px", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="flex items-center space-x-6 mb-4">
              <h3 className="text-3xl font-bold text-left">問題 {modalContent.id}</h3>
              <p className="text-2xl text-gray-700 text-left">{modalContent.title}</p>
            </div>
            <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
              {modalContent.text}
            </div>
            <div className="flex items-center mt-4">
              <label htmlFor={`flag-${modalContent.id}`} className="text-xl text-gray-700 mr-2">
                スコア:
              </label>
              <input
                type="number"
                min="1"
                max="999"
                className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                placeholder="スコアを入力してください"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <button
                className="ml-4 bg-[#33BBAB] text-white px-6 py-2 rounded-full shadow hover:opacity-90"
                onClick={handleScoreSubmit}
              >
                登録
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit_question;
