// components/Header.js
import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="flex justify-between items-center px-8 py-4">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-gray-700">ECC CTF</h1>

        {/* ナビゲーションリンク
        <nav className="flex space-x-6">
          <a href="#" className="text-lg text-gray-600 hover:text-gray-800">
            Edit member
          </a>
          <a href="#" className="text-lg text-gray-600 hover:text-gray-800">
            Edit question
          </a>
        </nav> */}

        {/* ユーザーアイコン
        <div className="w-12 h-12 rounded-full bg-gray-300"></div> */}
      </div>
    </header>
  );
}
