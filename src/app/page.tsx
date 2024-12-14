"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../components/Header";
import Tournament from '../components/Tornament';

interface Data {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export default function Page() {
  const router = useRouter();
  const [tournaments, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得のための useEffect
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch('http://localhost/contest', {
          method: 'GET',
          credentials: 'include', // クッキーを含める
        });
        console.log(response.status)
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`)
          if (response.status == 401) {
            router.push('/Login');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data:  any[] = await response.json();
        const transformedData: Data[] = data.map(item => ({
          ...item,
          startDate: item.start_date,
          endDate:  item.end_date,
        }));
        console.log(typeof(data[0].end_date))
        setData(transformedData);
      } catch (err) {
        setError('API呼び出し中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchAPI();
  }, []);

  // ログイン状態の確認
  useEffect(() => {
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    if (!hasLoggedIn) {
      router.push('/Login');
    }
  }, [router]);

  // ローディング状態の表示
  if (loading) return <p>読み込み中...</p>;
  // エラーの表示
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      <Header />
      {tournaments.map((tournament) => (
        <Tournament
          key={tournament.id}
          number={tournament.id}
          title={tournament.name}
          startDate={tournament.startDate}
          endDate={tournament.endDate}
        />
      ))}
      <h1></h1>
    </div>
  );
}
