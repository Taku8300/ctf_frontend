"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../../components/Header";

const Login = () => {
  const [showPopup,] = useState(true); // ポップアップ表示のトリガー

  function LoginPopup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setName] = useState('');

    const handleLogin = async () => {
      // ログイン処理
      if (email && password) {
        try {
          const response = await fetch('http://localhost/authn/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // クッキーを含める
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert(`ログインに失敗しました: ${errorData.error}`);
            return;
          }
          const data = await response.json();
          localStorage.setItem('hasLoggedIn', 'true');
          // ログイン成功後にリダイレクト
          router.push('/');
        } catch (error) {
          console.error('ログインエラー:', error);
          alert('ログイン中にエラーが発生しました');
        }
      } else {
        alert('メールアドレスとパスワードを入力してください');
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
              value={password}
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
