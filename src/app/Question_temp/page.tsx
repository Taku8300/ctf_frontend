"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestionContext } from "../../context/QuestionContext";
import Header from "../../components/Admin_header";

const Question_temp = () => {
  const router = useRouter();
  const { addQuestions } = useQuestionContext();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const templates = [
    { id: 1, text: "テンプレート 1" },
    { id: 2, text: "テンプレート 2" },
    { id: 3, text: "テンプレート 3" },
    { id: 4, text: "テンプレート 4" },
  ];

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedTemplates = templates.filter((t) => selectedIds.includes(t.id));
    addQuestions(selectedTemplates); // 状態を更新
    router.push("/Edit_question"); // ページ遷移
  };

  return (
    <div>
      <Header />
      <div className="flex flex-wrap justify-center items-center bg-teal-400 p-8 gap-4 mt-5">
        <div
          className="grid grid-cols-3 gap-40 p-10 bg-[#4fd1c5] min-h-screen"
          style={{ rowGap: "20px" }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => toggleSelection(template.id)}
              className={`relative bg-white rounded-lg p-8 shadow-lg max-w-xs mx-auto transition-transform transform cursor-pointer ${
                selectedIds.includes(template.id) ? "border-4 border-teal-500" : ""
              }`}
              style={{ boxShadow: "8px 8px 0px #FFB6B9" }}
            >
              <h2 className="text-2xl font-bold mb-4 text-black">
                テンプレート {template.id}
              </h2>
              <p className="text-lg text-black">{template.text}</p>
            </div>
          ))}
        </div>

        {/* 決定ボタン */}
        <button
          onClick={handleConfirm}
          className="fixed bottom-4 right-4 bg-teal-500 px-6 py-3 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:bg-teal-600 hover:scale-105"
        >
          決定
        </button>
      </div>
    </div>
  );
};

export default Question_temp;
