"use client"; // クライアントコンポーネントとしてマーク

import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// 時間をフォーマットする関数
const formatTime = (timeString) => {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// データベースからチームデータを取得する関数（仮データ）
const fetchTeamData = async () => {
  return [
    { name: formatTime('2024-11-10T08:00:00'), チーム1: 100, チーム2: 150, チーム3: 400, チーム4: 300  },
    { name: formatTime('2024-11-11T09:00:00'), チーム1: 200, チーム2: 132, チーム3: 510, チーム4: 400  },
    { name: formatTime('2024-11-12T10:00:00'), チーム1: 300, チーム2: 234, チーム3: 690, チーム4: 500  },
    { name: formatTime('2024-11-10T11:00:00'), チーム1: 400, チーム2: 250, チーム3: 700, チーム4: 600  },
    { name: formatTime('2024-11-11T12:00:00'), チーム1: 500, チーム2: 252, チーム3: 810, チーム4: 700  },
    { name: formatTime('2024-11-12T13:00:00'), チーム1: 600, チーム2: 284, チーム3: 990, チーム4: 800  },
  ];
};

const Chart = () => {
  const [data, setData] = useState([]);

  // データベースからチーム情報を取得
  useEffect(() => {
    const loadTeamData = async () => {
      const fetchedData = await fetchTeamData();
      setData(fetchedData);
    };
    loadTeamData();
  }, []);

  // 最新のスコアを取得する関数
  const latestScores = data.length > 0 ? data[data.length - 1] : {};

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center mt-5">
        <h2 className="text-4xl font-bold mb-4 text-white">スコア</h2>
        <div className="text-xl text-white ml-2">（各チーム）</div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} className="bg-white p-6 rounded-lg shadow-lg">
          {Object.keys(data[0] || {}).filter(key => key !== "name").map((team) => (
            <Line
              key={team}
              type="monotone"
              dataKey={team}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              strokeWidth={3}
              name={team}
            />
          ))}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" tick={{ fontSize: 16 }} padding={{ left: 20, right: 20 }}>
            <Label value="開催時間" offset={-5} position="insideBottomRight" />
          </XAxis>
          <YAxis tick={{ fontSize: 16 }}>
            <Label value="スコア" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip contentStyle={{ fontSize: 16 }} />
          <Legend verticalAlign="bottom" align="center" iconSize={20} />
        </LineChart>
      </ResponsiveContainer>

      <table className="table-auto mt-5 w-full text-left border-collapse rounded-lg overflow-hidden mb-10">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 text-center border border-blue-500">チーム</th>
            <th className="px-4 py-2 text-center border border-blue-500">スコア</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(latestScores).filter(([key]) => key !== "name").map(([team, score]) => (
            <tr key={team} className="border-b border-black bg-white">
              <td className="px-4 py-2 ml-2 border-x border-black">{team}</td>
              <td className="px-4 py-2 ml-2 border-x border-black">{score}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Chart;
