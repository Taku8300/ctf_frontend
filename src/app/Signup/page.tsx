"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";

const Signup = () => {
  const [showPopup,] = useState(true); // ポップアップ表示のトリガー


  function SignupPopup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
      // ログイン処理
      if (email && password && name) {
        try {
          const response = await fetch('http://localhost/authn/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // クッキーを含める
            body: JSON.stringify({ email, password ,name}),
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert(`新規登録に失敗しました: ${errorData.error}`);
            return;
          }
          const data = await response.json();
          localStorage.setItem('hasLoggedIn', 'true');
          // ログイン成功後にリダイレクト
          router.push('/Login');
        } catch (error) {
          console.error('ログインエラー:', error);
          alert('新規登録にエラーが発生しました');
        }
      } else {
        alert('メールアドレスとパスワードと名前を入力してください');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">SignUp</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700">password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter password"
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            SignUp
          </button>
          <button
            onClick={() => {router.push("/Login")}}
            className="w-full py-2 bg-blue-300 text-white rounded-md hover:bg-blue-400 mt-5"
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
      {showPopup && <SignupPopup />} {/* ポップアップを表示 */}
    </div>
  );
};

export default Signup;
