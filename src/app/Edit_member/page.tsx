"use client";

import React, { useEffect,useState } from "react";
import Header from "../../components/Admin_header";

const Edit_member = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // 新規チーム登録用ポップアップ
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false); // チーム詳細表示用ポップアップ
  const [teams, setTeams] = useState([
    { name: "山崎組", members: ["yamazaki@gmail", "yama"] },
    { name: "木村組", members: ["kimura@gmail", "kimu"] },
    { name: "岸本組", members: ["kishimoto@gmail", "kishi"] },
  ]);
  const [selectedTeam, setSelectedTeam] = useState(null); // 選択されたチーム
  const [newTeamName, setNewTeamName] = useState("");
  const [newMembers, setNewMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState("");

  // 新規登録ポップアップの開閉
  const handleAddClick = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => {
    setIsAddPopupOpen(false);
    setNewTeamName("");
    setNewMembers([]);
    setCurrentMember("");
  };

  // チーム詳細ポップアップの開閉
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setIsViewPopupOpen(true);
  };
  const closeViewPopup = () => {
    setIsViewPopupOpen(false);
    setSelectedTeam(null);
  };

  // 新しいメンバー追加
  const handleAddMember = () => {
    if (currentMember.trim()) {
      setNewMembers((prev) => [...prev, currentMember.trim()]);
      setCurrentMember("");
    }
  };

  // 新しいチームを登録
  const handleRegister = () => {
    if (newTeamName.trim() && newMembers.length > 0) {
      setTeams((prevTeams) => [
        ...prevTeams,
        { name: newTeamName, members: newMembers },
      ]);
      closeAddPopup();
    } else {
      alert("チーム名と少なくとも1人のメンバーを入力してください。");
    }
  };

  // チーム削除
  const handleDeleteTeam = () => {
    if (selectedTeam) {
      setTeams((prevTeams) =>
        prevTeams.filter((team) => team.name !== selectedTeam.name)
      );
      closeViewPopup();
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-wrap justify-center items-center bg-teal-400 p-8 gap-4 mt-5">
        {/* 各チームのカード */}
        {teams.map((team, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-4 w-60 h-60 flex flex-col justify-center items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleTeamClick(team)}
          >
            <h2 className="text-xl font-bold mb-2">{team.name}</h2>
            {team.members.map((member, idx) => (
              <p key={idx} className="text-sm text-gray-600">{member}</p>
            ))}
          </div>
        ))}

        {/* 追加ボタン */}
        <div
          className="fixed bottom-4 right-4 bg-gray-500 w-16 h-16 flex items-center justify-center rounded-full shadow-lg cursor-pointer transform transition-transform duration-300 hover:bg-teal-600 hover:scale-110"
          onClick={handleAddClick}
        >
          <span className="text-4xl font-bold text-white">+</span>
        </div>

        {/* 新規チーム登録ポップアップ */}
        {isAddPopupOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={closeAddPopup}
            ></div>
            <div className="fixed inset-0 flex justify-center items-center z-20">
              <div className="bg-white w-96 h-auto rounded-xl shadow-xl p-6 relative">
                <button
                  className="absolute top-4 right-4 text-gray-600 text-xl"
                  onClick={closeAddPopup}
                >
                  ×
                </button>
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                  新しいチームを追加
                </h2>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-4"
                  placeholder="チーム名"
                />
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={currentMember}
                    onChange={(e) => setCurrentMember(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    placeholder="メンバー名"
                  />
                  <button
                    onClick={handleAddMember}
                    className="bg-teal-400 text-white px-4 py-2 rounded-lg"
                  >
                    ✙
                  </button>
                </div>
                <div>
                  {newMembers.map((member, idx) => (
                    <p key={idx} className="inline-block bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2">
                      {member}
                    </p>
                  ))}
                </div>
                <button
                  onClick={handleRegister}
                  className="bg-teal-400 text-white px-4 py-2 rounded-lg"
                >
                  登録
                </button>
              </div>
            </div>
          </>
        )}

        {/* チーム詳細ポップアップ */}
        {isViewPopupOpen && selectedTeam && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={closeViewPopup}
            ></div>
            <div className="fixed inset-0 flex justify-center items-center z-20">
                <div className="bg-white w-96 max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 pb-16 relative">
                    <button
                    className="absolute top-4 right-4 text-gray-600 text-xl"
                    onClick={closeViewPopup}
                    >
                    ×
                    </button>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">
                    {selectedTeam.name}
                    </h2>
                    <div>
                    {selectedTeam.members.map((member, idx) => (
                        <p
                        key={idx}
                        className="bg-gray-100 rounded-lg px-2 py-1 mb-2"
                        >
                        {member}
                        </p>
                    ))}
                    </div>
                    <button
                    onClick={handleDeleteTeam}
                    className="bg-red-400 text-white px-4 py-2 rounded-lg absolute bottom-4 right-4"
                    >
                    チームを削除
                    </button>
                </div>
                </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Edit_member;
