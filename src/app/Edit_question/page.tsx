"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Admin_header";

const Edit_question = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([]);

  // ページ読み込み時にlocalStorageから選択テンプレートを取得
  useEffect(() => {
    const storedQuestions = localStorage.getItem("selectedTemplates");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      console.log("localStorageにデータがありません。");
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-wrap justify-center items-center bg-teal-400 p-8 gap-4 mt-5">
  <div
    className="grid grid-cols-3 gap-40 p-10 bg-[#4fd1c5] min-h-screen"
    style={{ rowGap: "20px" }}
  >
    {questions.map((card) => (
      <div
        key={card.id}
        className="relative bg-white rounded-lg p-8 shadow-lg max-w-xs mx-auto transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
        style={{
          boxShadow: "8px 8px 0px #FFB6B9",
          height: "200px", // 高さを固定
          overflow: "hidden", // 内容が多い場合に隠れる
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-black">問 {card.id}</h2>
        <p className="text-lg text-black overflow-y-auto">
          {card.text}
        </p>
      </div>
    ))}
  </div>

        <div
          onClick={() => router.push("/Question_temp")}
          className="fixed bottom-4 right-4 bg-gray-500 w-16 h-16 flex items-center justify-center rounded-full shadow-lg cursor-pointer transform transition-transform duration-300 hover:bg-teal-600 hover:scale-110"
        >
          <span className="text-4xl font-bold text-white">+</span>
        </div>
      </div>
    </div>
  );
};

export default Edit_question;