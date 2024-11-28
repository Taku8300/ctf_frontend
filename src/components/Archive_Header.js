"use client"; // クライアントコンポーネントとしてマーク

import React, { useState } from 'react';
import Wavy from '../../public/wavy.png';
import User from '../../public/user.svg';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 現在のパスを取得

  const handleUserIconClick = () => {
    setIsPopupVisible((prevState) => !prevState);
  };

  const closePopup = () => {
    setIsPopupVisible(false); // ポップアップを閉じる関数
  };

  const navigateToScore = () => {
    router.push('/Archive_score'); // 遷移先のパス
  };

  const navigateToTop = () => {
    router.push('/'); // 遷移先のパス
  };

  const navigateToQuestion = () => {
    router.push('/Archive_ques'); // 遷移先のパス
  };

  const handleLogout = () => {
    // ログアウト処理（必要に応じて認証状態をリセット）
    router.push('/Login'); // ログイン画面に遷移
  };

  // パスが root の場合、非表示にするフラグ
  const shouldHideMenu = pathname === '/';

  return (
    <div className="w-full bg-red-50"> {/* 全幅を指定 */}
      <div alt="title" className="relative bg-white py-8 w-full"> {/* 全幅を指定 */}
        <div className="text-left relative top-[-15px] left-5 w-full">
          <h1 className="text-6xl font-bold text-gray-800" onClick={navigateToTop}>ECON</h1>
        </div>

        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {!shouldHideMenu && ( /* root パスでない場合に表示 */
            <>
              <div
                className="text-2xl text-gray-800 hover:text-3xl hover:underline cursor-pointer transition duration-300"
                onClick={navigateToQuestion}
              >
                question
              </div>
              <div
                className="text-2xl text-gray-800 hover:text-3xl hover:underline cursor-pointer transition duration-300"
                onClick={navigateToScore}
              >
                score
              </div>
            </>
          )}
          <div className="relative">
            <Image
              src={User}
              alt="User Icon"
              width={50}
              height={50}
              className="cursor-pointer"
              onClick={handleUserIconClick}
            />
            {isPopupVisible && (
              <>
                <div className="fixed inset-0 bg-black opacity-50 z-40" /> {/* 背景のぼかし */}
                <div className="fixed inset-0 flex items-center justify-center z-50"> {/* ポップアップを中央に配置 */}
                  <div className="relative w-80 h-60 bg-white rounded-lg shadow-lg p-6"> {/* ポップアップのサイズを調整 */}
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 bold"
                      onClick={closePopup} // ✕ボタンのクリックハンドラ
                    >
                      ✕
                    </button>
                    {/* Team Name at the Top Left */}
                    <p className="text-xl font-bold text-gray-800 absolute top-4 left-4">team</p>
                    
                    {/* Centered Mail Text */}
                    <p className="text-gray-800 flex items-center justify-center h-full">mail: takuanben082@gmail.com</p>
                    
                    {/* Logout Button at the Bottom Right */}
                    <button
                      className="absolute bottom-4 right-4 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                      onClick={handleLogout} // ログアウトボタンのクリックハンドラ
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Image src={Wavy} className="absolute bottom-0 w-full" alt=""/> {/* 画像も全幅 */}
      </div>
    </div>
  );
};

export default Header;
