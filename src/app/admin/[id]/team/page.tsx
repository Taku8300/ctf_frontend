"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Select, { SingleValue } from "react-select";
import { useParams, useRouter } from 'next/navigation';

// ユーザータイプの定義
interface User {
  id: number;
  email: string;
  name: string;
}

// チームタイプの定義
interface Team {
  id: number;
  name: string;
  members: User[];
}

// react-selectのオプションタイプ
interface OptionType {
  value: string;
  label: string;
  id: number;
}

const EditMember: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // 動的ルートパラメータを取得

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]); // 初期値を空配列に変更

  const [isAddPopupOpen, setIsAddPopupOpen] = useState<boolean>(false); // 新規チーム登録用ポップアップ
  const [isViewPopupOpen, setIsViewPopupOpen] = useState<boolean>(false); // チーム詳細表示用ポップアップ
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null); // 選択されたチーム
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [newMembers, setNewMembers] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<OptionType | null>(null);

  // 編集モード用の状態
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // 編集モードの管理
  const [editedTeamName, setEditedTeamName] = useState<string>(""); // 編集中のチーム名
  const [editedMembers, setEditedMembers] = useState<User[]>([]); // 編集中のメンバー
  const [selectedEditMember, setSelectedEditMember] = useState<OptionType | null>(null); // 編集用の選択メンバー

  useEffect(() => {
    // ユーザー一覧を取得
    const getAllUser = async () => {
      try {
        const response = await fetch(`http://localhost/team/users`, {
          method: 'GET',
          credentials: 'include', // クッキーを含める
        });
        console.log(response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`api error: ${errorData.error}`);
          if (response.status === 401) {
            router.push('/Login');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: any[] = await response.json();
        const transformedData: User[] = data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
        }));
        console.log(transformedData);
        setAllUsers(transformedData);
      } catch (err) {
        console.error('API呼び出し中にエラーが発生しました。', err);
      }
    };
    getAllUser();

    // チーム一覧を取得
    const getTeamUser = async () => {
      try {
        const response = await fetch(`http://localhost/team/${id}/user`, {
          method: 'GET',
          credentials: 'include', // クッキーを含める
        });
        console.log(response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(`APIエラー: ${errorData.error}`);
          if (response.status === 401) {
            router.push('/Login');
          }
          throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }
        const data: any[] = await response.json();
        const transformedData: Team[] = data.map((team) => ({
          id: team.id,
          name: team.name,
          members: team.users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          })),
        }));
        console.log(transformedData);
        setTeams(transformedData);
      } catch (err) {
        console.error('API呼び出し中にエラーが発生しました。', err);
      }
    };
    getTeamUser();
  }, [router, id]); // `id` を依存配列に追加

  // react-select用のオプションに変換
  const userOptions: OptionType[] = allUsers.map((user) => ({
    value: user.id.toString(),
    label: `${user.name} (${user.email})`,
    id: user.id,
  }));

  // メンバーを削除する関数
  const removeMember = (memberId: number) => {
    setNewMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  // 新規登録ポップアップの開閉
  const handleAddClick = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => {
    setIsAddPopupOpen(false);
    setNewTeamName("");
    setNewMembers([]);
    setSelectedMember(null);
  };

  // チーム詳細ポップアップの開閉
  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsViewPopupOpen(true);
  };
  const closeViewPopup = () => {
    setIsViewPopupOpen(false);
    setSelectedTeam(null);
    setIsEditMode(false); // ポップアップを閉じる際に編集モードをリセット
  };

  // 新しいメンバー追加
  const handleAddMember = () => {
    if (selectedMember) {
      const user = allUsers.find((u) => u.id === Number(selectedMember.value));
      if (user) {
        // 重複を防ぐ
        if (!newMembers.some((m) => m.id === user.id)) {
          setNewMembers((prev) => [...prev, { id: user.id, email: user.email, name: user.name }]);
          setSelectedMember(null);
        } else {
          alert("このメンバーは既に追加されています。");
        }
      }
    }
  };

  // チームをコンテストに参加させる関数（必要に応じて）
  const joinTeamInContest = async (tid: number) => {
    try {
      const response = await fetch(`http://localhost/contest/${id}/team/${tid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // クッキーを含める
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      // 必要に応じてデータを使用
      console.log('コンテストへの参加が成功しました:', data);
    } catch (error) {
      console.error('コンテストにチームの参加が失敗しました:', error);
      alert('コンテストにチームの参加が失敗しました');
    }
  };

  // 新しいチームを登録
  const handleRegister = async () => {
    if (newTeamName.trim() && newMembers.length > 0) {
      try {
        const response = await fetch('http://localhost/team', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // クッキーを含める
          body: JSON.stringify({
            name: newTeamName.trim(),
            user_ids: newMembers.map((member) => member.id),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`エラー: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        console.log('チーム作成成功:', data);

        // APIから返された新しいチームのIDを使用して状態を更新
        const addedTeam: Team = {
          id: data.team_id, // APIから返されたID
          name: newTeamName.trim(),
          members: newMembers,
        };

        setTeams((prevTeams) => [...prevTeams, addedTeam]);
        console.log(data);
        joinTeamInContest(data.team_id);
        closeAddPopup();
      } catch (error) {
        console.error('チーム作成に失敗しました:', error);
        alert('チーム作成に失敗しました');
      }
    } else {
      alert("チーム名と少なくとも1人のメンバーを入力してください。");
    }
  };

  // チーム削除
  const handleDeleteTeam = async () => {
    if (selectedTeam) {
      try {
        const response = await fetch(`http://localhost/team/${selectedTeam.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`エラー: ${errorData.error}`);
          return;
        }

        console.log('チーム削除成功');
      } catch (error) {
        console.error('チーム削除に失敗しました:', error);
        alert('チーム削除に失敗しました');
        return;
      }

      setTeams((prevTeams) =>
        prevTeams.filter((team) => team.id !== selectedTeam.id)
      );
      closeViewPopup();
    }
  };

  // 編集モードの保存
  const handleSaveEdit = async () => {
    if (editedTeamName.trim() && editedMembers.length > 0 && selectedTeam) {
      try {
        const response = await fetch(`http://localhost/team/${selectedTeam.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // クッキーを含める
          body: JSON.stringify({
            name: editedTeamName.trim(),
            user_ids: editedMembers.map((member) => member.id),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`エラー: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        console.log('チーム更新成功:', data);

        // 更新後のチームデータを使用して状態を更新
        const updatedTeam: Team = {
          id: selectedTeam.id,
          name: editedTeamName.trim(),
          members: editedMembers,
        };

        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === selectedTeam.id ? updatedTeam : team
          )
        );

        setSelectedTeam(updatedTeam);
        setIsEditMode(false);
        closeViewPopup();
      } catch (error) {
        console.error('チーム更新に失敗しました:', error);
        alert('チーム更新に失敗しました');
      }
    } else {
      alert("チーム名と少なくとも1人のメンバーを入力してください。");
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <AdminHeader contestID={id} isTop={false} />
      <div className="flex flex-wrap justify-center items-center p-8 gap-4 mt-5">
        {/* 各チームのカード */}
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow-lg p-4 w-60 h-60 flex flex-col justify-center items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleTeamClick(team)}
          >
            <h2 className="text-xl font-bold mb-2">{team.name}</h2>
            {team.members.map((member) => (
              <p key={member.id} className="text-sm text-gray-600 truncate w-full text-center">
                {member.name} ({member.email})
              </p>
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
                  <div className="w-full">
                    <Select
                      value={selectedMember}
                      onChange={(option: SingleValue<OptionType>) =>
                        setSelectedMember(option)
                      }
                      options={userOptions.filter(
                        (user) => !newMembers.some((member) => member.id === user.id)
                      )}
                      placeholder="メンバーを選択"
                      isClearable
                    />
                  </div>
                  <button
                    onClick={handleAddMember}
                    className="bg-teal-400 text-white px-4 py-2 rounded-lg"
                    disabled={!selectedMember}
                    title={
                      selectedMember
                        ? "メンバーを追加"
                        : "メンバーを選択してください"
                    }
                  >
                    追加
                  </button>
                </div>
                <div>
                  {newMembers.map((member) => (
                    <div
                      key={member.id}
                      className="inline-flex items-center bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2"
                    >
                      <span className="mr-1">{member.name} ({member.email})</span>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 font-bold focus:outline-none"
                        aria-label={`Remove ${member.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleRegister}
                  className="bg-teal-400 text-white px-4 py-2 rounded-lg mt-4 w-full"
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
              <div className="bg-white w-96 max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
                <button
                  className="absolute top-4 right-4 text-gray-600 text-xl"
                  onClick={closeViewPopup}
                >
                  ×
                </button>

                {/* 編集モード */}
                {isEditMode ? (
                  <>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">
                      チームを編集
                    </h2>
                    <input
                      type="text"
                      value={editedTeamName}
                      onChange={(e) => setEditedTeamName(e.target.value)}
                      className="w-full border rounded-lg p-2 mb-4"
                      placeholder="チーム名"
                    />
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-full">
                        <Select
                          value={selectedEditMember}
                          onChange={(option: SingleValue<OptionType>) =>
                            setSelectedEditMember(option)
                          }
                          options={userOptions.filter(
                            (option) => !editedMembers.some((m) => m.id === option.id)
                          )}
                          placeholder="メンバーを選択"
                          isClearable
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (selectedEditMember) {
                            const user = allUsers.find((u) => u.id === Number(selectedEditMember.value));
                            if (user) {
                              if (!editedMembers.some((m) => m.id === user.id)) {
                                setEditedMembers((prev) => [...prev, { id: user.id, email: user.email, name: user.name }]);
                                setSelectedEditMember(null);
                              } else {
                                alert("このメンバーは既に追加されています。");
                              }
                            }
                          }
                        }}
                        className="bg-teal-400 text-white px-4 py-2 rounded-lg"
                        disabled={!selectedEditMember}
                        title={
                          selectedEditMember
                            ? "メンバーを追加"
                            : "メンバーを選択してください"
                        }
                      >
                        追加
                      </button>
                    </div>
                    <div>
                      {editedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="inline-flex items-center bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2"
                        >
                          <span className="mr-1">{member.name} ({member.email})</span>
                          <button
                            onClick={() => {
                              setEditedMembers((prev) => prev.filter((m) => m.id !== member.id));
                            }}
                            className="text-red-500 font-bold focus:outline-none"
                            aria-label={`Remove ${member.name}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-teal-400 text-white px-4 py-2 rounded-lg"
                      >
                        保存
                      </button>
                    </div>
                  </>
                ) : (
                  // 編集モードでない場合の表示
                  <>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">
                      {selectedTeam.name}
                    </h2>
                    <div>
                      {selectedTeam.members.map((member) => (
                        <p
                          key={member.id}
                          className="bg-gray-100 rounded-lg px-2 py-1 mb-2"
                        >
                          {member.name} ({member.email})
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between mt-10">
                      {/* 編集モード切替ボタン */}
                      {!isEditMode && (
                        <button
                          className="bg-blue-400 text-white px-4 py-2 rounded-lg"
                          onClick={() => {
                            setIsEditMode(true);
                            setEditedTeamName(selectedTeam.name);
                            setEditedMembers(selectedTeam.members);
                          }}
                        >
                          編集
                        </button>
                      )}

                      <button
                        onClick={handleDeleteTeam}
                        className="bg-red-400 text-white px-4 py-2 rounded-lg"
                      >
                        チームを削除
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditMember;
