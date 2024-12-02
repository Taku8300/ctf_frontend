"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../../components/Header";

const Login = () => {
  const [showPopup,] = useState(true); // ポップアップ表示のトリガー

  function LoginPopup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleLogin = () => {
      // ログイン処理（例: 入力チェックなど）
      if (email && name) {
        // ログインが完了した場合、フラグをセット
        localStorage.setItem('hasLoggedIn', 'true');
        // ルートページにリダイレクト
        router.push('/');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your name"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {showPopup && <LoginPopup />} {/* ポップアップを表示 */}
    </div>
  );
};

export default Login;
