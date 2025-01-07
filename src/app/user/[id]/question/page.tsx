'use client';

import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import { useRouter } from 'next/navigation';

interface Card {
  id: number;
  title: string;
  status: string;
  text: string;
  categoryName: string;
  point: number;
  ipAddress: string;    // Added field
  username: string;     // Added field
  password: string;     // Added field
}

// アクセス情報のインターフェース
interface AccessInfo {
  ipAddress: string;
  username: string;
  password: string;
}

// カード情報（変数化）
// If you are using static data, ensure these fields are included.
// However, since you're fetching data from an API, ensure the API returns these fields.
const CARD_DATA = [
  { id: 1, status: '解決', title: '大量Pod問題', text: 'kubernetesの中にpod大量発生！！！！', point: 10, ipAddress: '192.168.1.1', username: 'user1', password: 'pass1' },
  { id: 2, status: '未解決', title: 'スケール問題', text: 'podのスケールが壊れた！どうしよう！', point: 10, ipAddress: '192.168.1.2', username: 'user2', password: 'pass2' },
  { id: 3, status: '解決', title: 'ノード不足', text: 'ノード不足でクラッシュしたけど直したよ！', point: 10, ipAddress: '192.168.1.3', username: 'user3', password: 'pass3' },
  { id: 4, status: '解決', title: '新サービス', text: 'kubernetesで新しいサービス作成中！', point: 10, ipAddress: '192.168.1.4', username: 'user4', password: 'pass4' },
  { id: 5, status: '未解決', title: '負荷テスト', text: '負荷テスト中にエラー発生！', point: 10, ipAddress: '192.168.1.5', username: 'user5', password: 'pass5' },
  { id: 6, status: '解決', title: 'デプロイ成功', text: 'デプロイに成功しました！', point: 10, ipAddress: '192.168.1.6', username: 'user6', password: 'pass6' },
];

const QBt_u = () => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // 選択されたカードのIDを保存
  const [flagValues, setFlagValues] = useState<{ [key: number]: string }>({}); // 各カードのFlag値を保存
  const [cards, setCards] = useState<Card[]>([]);
  const [accessInfo, setAccessInfo] = useState<{ [key: number]: AccessInfo }>({}); // アクセス情報を保存
  const router = useRouter();
  // 仮の数値
  const contestID = 1;

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch(`http://localhost/contest/${contestID}`, {
          method: 'GET',
          credentials: 'include', // クッキーを含める
        });
        console.log(response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`);
          if (response.status === 401) {
            router.push('/Login');
          }else if (response.status === 403) {
            alert("どのチームにも所属していません。管理者に参加申請をしてください。")
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: any = await response.json();
        const transformedData: Card[] = data.questions.map((item: any) => ({
          id: item.id,
          text: item.name,
          status: item.point === item.current_point ? "解決" : "未解決",
          categoryName: item.category_name,
          point: item.point,
          ipAddress: item.ip_address || 'N/A', // Adjust according to your API response
          username: item.username || 'N/A',     // Adjust according to your API response
          password: item.password || 'N/A',     // Adjust according to your API response
        }));
        console.log(data);
        setCards(transformedData);
      } catch (err) {
        console.error(err);
        // setError('API呼び出し中にエラーが発生しました。');
      } finally {
        // setLoading(false);
      }
    };

    fetchAPI();
  }, [contestID, router]);


  useEffect(() => {
    if (selectedCardId !== null) {
      const fetchAccessInfo = async () => {
        try {
          const response = await fetch(`http://localhost/contest/${contestID}/cloudinit/${selectedCardId}`, {
            method: 'GET',
            credentials: 'include',
          });
          console.log(response);
          if (!response.ok) {
            const errorData = await response.json();
            console.log(`api error: ${errorData.error}`);
            if (response.status === 401) {
              router.push('/Login');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: AccessInfo = await response.json();
          console.log(data)
          const transformedData:AccessInfo = {
            ipAddress: data.ips.eth0[0],
            username:"user",
            password:data.access,
          }
          setAccessInfo(transformedData)
          console.log(transformedData)
        } catch (err) {
          console.error(err);
          const transformedData:AccessInfo = {
            ipAddress: "can't get ip",
            username:"can't get username",
            password:"can't get password",
          }
          setAccessInfo(transformedData)
          // エラーハンドリングを追加
        }
      };

      fetchAccessInfo();
    }else{
      const transformedData:AccessInfo = {
        ipAddress: "getting info",
        username:"getting info",
        password:"getting info"
      }
      setAccessInfo(transformedData)
    }

  }, [selectedCardId, contestID, router]);


  const handleCardClick = (id: number): void => {
    setSelectedCardId(id);
  };

  const handleFlagChange = (id: number, value: string): void => {
    setFlagValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCloseModal = (): void => {
    setSelectedCardId(null);
  };

  const handleSubmitFlag = async (id: number): Promise<void> => {
    if (selectedCardId !== null) {
      try {
        const request = {
          "answer": flagValues[id],
          "question_id": id
        };
        const response = await fetch(`http://localhost/contest/${contestID}/answer`, {
          method: 'POST',
          credentials: 'include', // クッキーを含める
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });
        console.log(request);
        console.log(response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`);
          if (response.status === 401) {
            router.push('/Login');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: any = await response.json();
        if (data.correct) {
          console.log("answer is true");
        } else {
          console.log("answer is false");
        }
        console.log(data);
        // Refresh the cards or update the specific card's status
        // For example, refetch the data
        // Alternatively, update the card's status locally
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === id
              ? { ...card, status: data.correct ? '解決' : '未解決' }
              : card
          )
        );
      } catch (err) {
        console.error(err);
        // setError('API呼び出し中にエラーが発生しました。');
      } finally {
        // setLoading(false);
      }

      const flag = flagValues[selectedCardId];
      console.log(`Card ID: ${selectedCardId}, Flag: ${flag}`);
      alert(`Flag submitted for Card ${selectedCardId}: ${flag}`);
      setSelectedCardId(null); // モーダルを閉じる
    }
  };

  // 選択されたカードの詳細を取得
  const selectedCard = cards.find((card) => card.id === selectedCardId);

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
        {cards.map((card) => (
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
              Point: {card.point}
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
            style={{ width: '700px', height: '600px', overflow: 'auto' }} // Increased height to accommodate new fields
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

            {/* 追加情報: IPアドレス, ユーザー名, パスワード */}
            <div className="mb-6 p-4 bg-gray-100 rounded-xl shadow-inner border border-gray-300">
              <h4 className="text-2xl font-semibold mb-2">アクセス情報</h4>
              <p className="text-lg">
                <span className="font-bold">IPアドレス:</span> {accessInfo.ipAddress}
              </p>
              <p className="text-lg">
                <span className="font-bold">ユーザー名:</span> {accessInfo.username}
              </p>
              <p className="text-lg">
                <span className="font-bold">パスワード:</span> {accessInfo.password}
              </p>
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
                onClick={() => handleSubmitFlag(selectedCard.id)}
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
