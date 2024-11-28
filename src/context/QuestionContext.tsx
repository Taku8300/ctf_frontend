"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// 問題データ型
export type Question = {
  id: number;
  text: string;
};

// Context 型定義
interface QuestionContextType {
  questions: Question[];
  addQuestions: (newQuestions: Question[]) => void;
}

// Context 初期値
const QuestionContext = createContext<QuestionContextType>({
  questions: [],
  addQuestions: () => {},
});

export const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  // 初回レンダリング時に localStorage から質問リストを読み込む
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedQuestions = localStorage.getItem("questions");
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions);
        console.log("localStorage から読み込んだ質問リスト:", parsedQuestions); // デバッグ
        setQuestions(parsedQuestions);
      } else {
        console.log("localStorage に質問リストがありません。");
      }
    }
  }, []);

  // questions を更新するたびに localStorage に保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("questions", JSON.stringify(questions));
      console.log("localStorage に保存された質問リスト:", questions); // デバッグ
    }
  }, [questions]);

  const addQuestions = (newQuestions: Question[]) => {
    setQuestions((prev) => [...prev, ...newQuestions]);
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestions }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);
