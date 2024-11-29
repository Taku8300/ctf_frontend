'use client';

import React, { useState } from 'react';
import Header from "../../components/Header";

// カード情報（変数化）
const CARD_DATA = [
  { id: 1, status: '解決', title: '大量Pod問題', text: 'kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！kubernetesの中にpod大量発生！！！！',Point:'10' },
  { id: 2, status: '未解決', title: 'スケール問題', text: 'podのスケールが壊れた！どうしよう！',Point:'10' },
  { id: 3, status: '解決', title: 'ノード不足', text: 'ノード不足でクラッシュしたけど直したよ！',Point:'10'},
  { id: 4, status: '解決', title: '新サービス', text: 'kubernetesで新しいサービス作成中！',Point:'10' },
  { id: 5, status: '未解決', title: '負荷テスト', text: '負荷テスト中にエラー発生！',Point:'10' },
  { id: 6, status: '解決', title: 'デプロイ成功', text: 'デプロイに成功しました！',Point:'10' },
];

const QBt_u = () => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // 選択されたカードのIDを保存
  const [flagValues, setFlagValues] = useState<{ [key: number]: string }>({}); // 各カードのFlag値を保存

  const handleCardClick = (id: number): void => {
    setSelectedCardId(id);
  };

  const handleFlagChange = (id: number, value: string): void => {
    setFlagValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCloseModal = (): void => {
    setSelectedCardId(null);
  };

  const handleSubmitFlag = (): void => {
    if (selectedCardId !== null) {
      const flag = flagValues[selectedCardId];
      console.log(`Card ID: ${selectedCardId}, Flag: ${flag}`);
      alert(`Flag submitted for Card ${selectedCardId}: ${flag}`);
      setSelectedCardId(null); // モーダルを閉じる
    }
  };

  // 選択されたカードの詳細を取得
  const selectedCard = CARD_DATA.find((card) => card.id === selectedCardId);

  return (
    <div className="relative">
      <Header />
      {/* 背景ぼかし */}
      {selectedCardId !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"
          onClick={handleCloseModal}
        ></div>
      )}

      {/* カード一覧 */}
      <div className="grid grid-cols-3 gap-6 p-6 bg-[#4fd1c5] min-h-screen">
        {CARD_DATA.map((card) => (
         <div
         key={card.id}
         onClick={() => handleCardClick(card.id)}
         className="relative bg-white rounded-lg p-6 shadow-lg mx-auto transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
         style={{
           width: '300px',
           height: '280px',
           boxShadow: '8px 8px 0px #FFB6B9',
         }}
       >
         <span
           className={`absolute top-4 right-4 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
             card.status === '解決' ? 'bg-green-200 text-green-800' : 'bg-pink-300 text-pink-900'
           }`}
         >
           {card.status}
         </span>
         <h2 className="text-2xl font-bold mb-4 text-black">問 {card.id}</h2>
         <p className="text-lg font-semibold text-black mb-2">{card.title}</p>
         {/* ここで7行制限を適用 */}
         <p className="text-lg text-black line-clamp-7 mt-8">
           {card.text}
         </p>
         <span className="absolute bottom-4 left-4 text-m text-gray-700 font-bold">
           Point: {card.Point}
         </span>
       </div>
       
        ))}
      </div>

      {/* モーダル */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じない
        >
          <div
            className="bg-[#E7F6F3] rounded-3xl shadow-lg relative p-8 flex flex-col"
            style={{ width: '700px', height: '400px', overflow: 'hidden' }}
          >
            {/* モーダルの閉じるボタン */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={handleCloseModal}
            >
              ×
            </button>
            {/* 問題番号とタイトル */}
            <div className="flex items-center space-x-6 mb-4">
              <h3 className="text-3xl font-bold text-left">問 {selectedCard.id}</h3>
              <p className="text-2xl text-gray-700 text-left">{selectedCard.title}</p>
            </div>

            {/* 問題詳細 */}
            <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedCard.text}
            </div>

            {/* Flag入力 */}
            <div className="flex items-center mt-4">
              <label htmlFor={`flag-${selectedCard.id}`} className="text-xl text-gray-700 mr-2">
                Flag :
              </label>
              <input
                id={`flag-${selectedCard.id}`}
                type="text"
                value={flagValues[selectedCard.id] || ''}
                onChange={(e) => handleFlagChange(selectedCard.id, e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                placeholder="フラグを入力してください"
              />
              <button
                onClick={handleSubmitFlag}
                className="ml-4 bg-[#33BBAB] text-white px-6 py-2 rounded-full shadow hover:opacity-90"
              >
                回答
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QBt_u;
