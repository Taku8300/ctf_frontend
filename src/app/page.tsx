"use client"; // クライアントコンポーネントとしてマーク

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../components/Header";
import Tournament from '../components/Tornament';



export default function Page() {
  const router = useRouter();

  const tournaments = [
    {
      number: 88,
      title: '大擂台賽',
      startDate: '2024/12/25',
      endDate: '2025/1/05',
    },
    {
      number: 87,
      title: '天下一武道会',
      startDate: '2024/11/01',
      endDate: '2024/12/25',
    },
    {
      number: 86,
      title: '暗黒武術会',
      startDate: '2024/11/01',
      endDate: '2024/11/03',
    },
    {
      number: 85,
      title: '天空闘技場',
      startDate: '2024/06/01',
      endDate: '2024/06/03',
    },
    {
      number: 84,
      title: '武闘会',
      startDate: '2024/04/01',
      endDate: '2024/04/03',
    },
  ];

  useEffect(() => {
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    if (!hasLoggedIn) {
      router.push('/Login');
    }
  }, [router]);

  return (
    <div>

      <Header />
      {tournaments.map((tournament) => (
        <Tournament
          key={tournament.number}
          number={tournament.number}
          title={tournament.title}
          startDate={tournament.startDate}
          endDate={tournament.endDate}
        />
      ))}
    </div>
  );
}
