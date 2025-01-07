'use client'
// pages/Score_u.tsx
import React, { useState, useEffect } from "react";
import Chart from "@/components/Chart"; // JavaScriptのChartコンポーネントをインポート
import Header from "@/components/Header"; // Headerコンポーネントをインポート
import { useRouter } from 'next/navigation';

const User_score: React.FC = () => {
  const contestID = 1;
  const router = useRouter();

  // 型定義
  interface Point {
    insert_date: string;
    point: number;
  }

  interface Team {
    team_id: number;
    name: string;
    points: Point[];
  }

  interface TransformedData {
    name: string;
    [key: string]: number | string;
  }

  interface AccessInfo {
    ipAddress: string;
    username: string;
    password: string;
  }

  // 状態管理
  const [chartData, setChartData] = useState<TransformedData[]>([]);

  // 時間をフォーマットする関数
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    // アクセス情報を取得する関数
    const fetchAccessInfo = async () => {
      try {
        const response = await fetch(`http://localhost/contest/${contestID}/point`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`APIエラー: ${errorData.error}`);
          if (response.status === 401) {
            router.push('/Login');
          }
          throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    // チームデータを取得して変換する関数
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`http://localhost/contest/${contestID}/point`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`APIエラー: ${errorData.error}`);
          throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }

        const teams: Team[] = await response.json();
        console.log("取得したチームデータ:", teams);

        // データを変換する
        const transformedData = transformTeamData(teams);
        setChartData(transformedData);
      } catch (error) {
        console.log("チームデータの取得エラー:", error);
        // エラーハンドリング：空のデータを設定
        setChartData([]);
      }
    };

    // データ変換関数
    const transformTeamData = (teams: Team[]): TransformedData[] => {
      // 全てのinsert_dateを収集
      const allDatesSet = new Set<string>();
      teams.forEach(team => {
        if (team.points != null) {
          team.points.forEach(point => {
            allDatesSet.add(point.insert_date);
          });
        } else {
          // pointsが空の場合、特定の処理が必要ならここに追加
        }
      });

      // 日付をソート
      const allDates = Array.from(allDatesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // 挿入日ごとにチームごとのポイントを集計
      const dateToPointsMap: { [key: string]: { [key: string]: number } } = {};

      allDates.forEach(date => {
        dateToPointsMap[date] = {};
        teams.forEach(team => {
          dateToPointsMap[date][`チーム${team.team_id}`] = 0; // 初期値として0を設定
        });
      });

      teams.forEach(team => {
        if (team.points === null) {
          // pointsが空の場合、全て0がすでに設定されている
          return;
        }
        team.points.forEach(point => {
          if (dateToPointsMap[point.insert_date]) {
            dateToPointsMap[point.insert_date][`チーム${team.team_id}`] = point.point;
          } else {
            // もしinsert_dateがallDatesにない場合は追加
            dateToPointsMap[point.insert_date] = { [`チーム${team.team_id}`]: point.point };
          }
        });
      });

      // 変換後のデータ配列を作成
      const transformedData: TransformedData[] = allDates.map(date => ({
        name: formatTime(date),
        ...dateToPointsMap[date],
      }));

      console.log("変換後のデータ:", transformedData);
      return transformedData;
    };

    // データの取得を実行
    fetchAccessInfo();
    fetchTeamData();
  }, [contestID, router]);

  return (
    <div>
      <Header />
      <Chart data={chartData} />
    </div>
  );
}

export default User_score;
