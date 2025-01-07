"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Admin_header";
import { useSearchParams, useParams } from 'next/navigation';
import AdminHeader from "@/components/AdminHeader";

interface Templates {
  id: number;
  status: string;
  title: string;
  text: string;
  categoryName: string;
  point: number;
  vmid: number;
  ip: string;
  username: string;
  password: string;
  answer: string;
}

interface Question {
  id: number;
  title: string;
  text: string;
  score?: string;
}

interface JsonReq {
  qid: number;
  point: number;
}

const Question_temp = () => {
  const params = useParams();
  const { id } = params; // 動的ルートパラメータを取得
  const searchParams = useSearchParams();
  const router = useRouter();
  const [templates, setTemplates] = useState<Templates[]>([]);
  const contestID = id; // 仮置き

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<Templates | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    ID: "",
    title: "",
    text: "",
    os: "",
    ip: "",
    gateway: "",
    cpu: "",
    memory: "",
    disk: "",
    category_id: "",
    ssh: "",
    user: "",
    pass: "",
  });
  const categories = [
    { id: 1, name: 'Crypto' },
    { id: 2, name: 'Reverse Engineering' },
    { id: 3, name: 'Web' },
    { id: 4, name: 'Forensics' },
  ];
  const vms = [
    {id: 9000,name:"alma linux 9"}
  ]
  // 編集モードの状態
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // 編集モードの管理
  const [editedTitle, setEditedTitle] = useState<string>(""); // 編集中のタイトル
  const [editedText, setEditedText] = useState<string>(""); // 編集中のテキスト
  const [editedAnswer, setEditedAnswer] = useState<string>(""); // 編集中のテキスト


  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openModal = async(template: Templates) => {
    setModalContent(template);
    setIsModalOpen(true);
    const fetchAccessInfo = async () => {
      try {
        const response = await fetch(`http://localhost/question/ip/${template.vmid}`, {
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
        const data: Templates = await response.json();
        console.log()
        const transformedData:Templates = {
          ...template,
          ip: data.data.eth0[0],
          username: "user",
          password: "まだ無理",
        }
        console.log(transformedData)
        setModalContent(transformedData)
      } catch (err) {
        console.error(err);
        const transformedData:Templates = {
          ...template,
          ip: "can't get ip",
          username:"can't get username",
          password:"can't get password",
        }
        setModalContent(transformedData)
      // エラーハンドリングを追加
      }
    };

    fetchAccessInfo();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setIsEditMode(false);
  };

  const handleConfirm = async () => {
    const selectedTemplates = templates.filter((t) => selectedIds.includes(t.id));
    const jsonParam: JsonReq[] = selectedIds.map((id) => ({ qid: id, point: 1 }));
    console.log(JSON.stringify({ jsonParam }));
    try {
      const response = await fetch(`http://localhost/contest/${contestID}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // クッキーを含める
        body: JSON.stringify(jsonParam),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
        return;
      }
      const data = await response.json();
      
    } catch (error) {
      console.error('questionの追加に失敗しました:', error);
      alert('questionの追加に失敗しました');
    }
    localStorage.setItem("selectedTemplates", JSON.stringify(selectedTemplates));
    router.push(`/admin/${id}/question`);
  };

  const validateInputs = () => {
    const ipWithCidrRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\/([0-2]?\d|3[0-2]))?$/;
    const noHiraganaRegex = /^[^\u3040-\u309F]*$/;

    console.log(newTemplate.ip )
    // if (!ipWithCidrRegex.test(newTemplate.ip) || newTemplate.ip != "") {
    //   alert("有効なIPアドレスを入力してください。");
    //   return false;
    // }
    if (!noHiraganaRegex.test(newTemplate.user) || !noHiraganaRegex.test(newTemplate.pass)) {
      alert("ユーザー名とパスワードにはひらがなを使用できません。");
      return false;
    }
    return true;
  };
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost/question/${modalContent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // クッキーを含める
        body: JSON.stringify({
          name:editedTitle,
          description:editedText,
          answer:editedAnswer,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
        return;
      }
      const data = await response.json();
    } catch (error) {
      console.error('question編集に失敗しました:', error);
      alert('question編集に失敗しました');
    }
    closeModal()
  }

  const handleAddTemplate = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch('http://localhost/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // クッキーを含める
        body: JSON.stringify({
          ID: parseInt(newTemplate.ID),
          name: newTemplate.title,
          category_id: parseInt(newTemplate.category_id),
          description: newTemplate.text,
          memory: parseInt(newTemplate.memory) * 1024,
          cpu: parseInt(newTemplate.cpu),
          disk: parseInt(newTemplate.disk),
          ip: newTemplate.ip,
          gateway: newTemplate.gateway,
          username: newTemplate.user,
          password: newTemplate.pass,
          sshkeys: [newTemplate.ssh]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
        return;
      }
      const data = await response.json();
    } catch (error) {
      console.error('question作成に失敗しました:', error);
      alert('question作成に失敗しました');
    }
    const newId = templates.length + 1;
    setTemplates((prev) => [...prev, { id: newId, status: "未解決", ...newTemplate }]);
    setIsAddModalOpen(false);
  };

  const handleDelete = async() => {
    // できたけど現状だと期間システムのvmも削除してしまう危険性があるので、コメントアウト
    try {
      const response = await fetch(`http://localhost/question/${modalContent.id}`, {
        method: 'DELETE',
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
    } catch (error) {
      console.error('question削除に失敗しました:', error);
      alert('question削除に失敗しました');
    }
    closeModal()
  }

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetch('http://localhost/question', {
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
        const data: any[] = await response.json();
        
        const transformedData: Templates[] = data.map(item => ({
          id: item.id,
          title: item.name,
          status: item.status,
          text: item.description,
          categoryName: item.category_name,
          point: item.point,
          vmid: item.vmid,
          answer: item.answer,
        }));
        console.log(data)
        setTemplates(transformedData);
      } catch (err) {
        console.error('API呼び出し中にエラーが発生しました。', err);
      } finally {
        // setLoading(false);
      }
    };
    getQuestions();

    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        // JSON文字列をデコードしてオブジェクトに戻す
        const parsedData: Question[] = JSON.parse(decodeURIComponent(dataParam));
        const quesids: number[] = parsedData.map(e => e.id);
        setSelectedIds(quesids);
      } catch (error) {
        console.error('データのパースエラー:', error);
      }
    }

    const storedTemplates = localStorage.getItem("selectedTemplates");
    if (storedTemplates) {
      console.log("Selected Templates:", JSON.parse(storedTemplates));
    }
  }, [router, searchParams]);

  return (
    <div className="h-screen bg-gray-100">
      <AdminHeader contestID={id} isTop={false}/>
      <div className="flex flex-wrap justify-center items-center p-8 gap-4 mt-5">
        <div
          className="grid grid-cols-3 gap-8 p-10 min-h-screen"
          style={{ rowGap: "20px" }}
        >
          {/* プラスマークのカード */}
          <div
            className="relative bg-white rounded-lg p-8 shadow-lg max-w-xs mx-auto transition-transform transform cursor-pointer flex items-center justify-center"
            style={{ boxShadow: "8px 8px 0px #FFB6B9", height: "200px", width: "300px" }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className="text-8xl text-gray-500">+</span>
          </div>

          {templates.map((template) => (
            <div
              key={template.id}
              className="relative bg-white rounded-lg p-8 shadow-lg max-w-xs mx-auto transition-transform transform cursor-pointer"
              style={{ boxShadow: "8px 8px 0px #FFB6B9", height: "200px", width: "300px" }}
              onClick={() => openModal(template)}

            >
              <div
                className={`absolute top-2 left-2 w-6 h-6 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  selectedIds.includes(template.id) ? "bg-teal-500 text-white" : "bg-white text-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelection(template.id)

                }}
              >
                {selectedIds.includes(template.id) && "✔"}
              </div>
              <h2
                className="text-2xl font-bold mb-4 text-black"
                onClick={() => openModal(template)}
              >
                {template.title}
              </h2>
              <p
                className="text-lg text-black"
                onClick={() => openModal(template)}
              >
                {template.text}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="fixed bottom-4 right-4 bg-teal-500 px-6 py-3 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:bg-teal-600 hover:scale-105"
        >
          決定
        </button>
      </div>

      {/* 詳細モーダル */}
      {isModalOpen && modalContent && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal} // 背景クリックで閉じる
        >
          <div
            className="bg-[#E7F6F3] rounded-3xl shadow-lg relative p-8 flex flex-col overflow-y-auto max-h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()} // モーダル内のクリックを伝播させない
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="flex items-center space-x-6 mb-4">
              <h3 className="text-3xl font-bold text-left">問題{modalContent.id}</h3>
              <p className="text-2xl text-gray-700 text-left">{modalContent.title}</p>
            </div>
            {!isEditMode ? (
              <>
                <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
                  {modalContent.text}
                </div>
                <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
                  ip:{modalContent.ip}
                </div>
                <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
                  username: {modalContent.username}
                </div>
                <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
                  password: {modalContent.password}
                </div>

                <button
                  onClick={() => {
                    setIsEditMode(true);
                    setEditedTitle(modalContent.title);
                    setEditedText(modalContent.text);
                  }}
                  className="bg-blue-400 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-500"
                >
                  編集
                </button>
                <button
                  onClick={() => {
                    handleDelete()
                  }}
                  className="bg-red-400 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-500 mt-3"
                >
                  削除
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="タイトル"
                />
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="内容"
                  rows={4}
                />
              <input
                  type="text"
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="アンサー"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-lg hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {handleSaveEdit()}}
                    className="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-teal-600"
                  >
                    保存
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 追加モーダル */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            className="bg-[#E7F6F3] rounded-3xl shadow-lg relative p-8 flex flex-col overflow-y-auto max-h-[80vh] w-full max-w-3xl"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setIsAddModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">新しい問題を追加</h3>
            
            <input
              type="text"
              placeholder="タイトル"
              value={newTemplate.title}
              onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <textarea
              placeholder="内容"
              value={newTemplate.text}
              onChange={(e) => setNewTemplate({ ...newTemplate, text: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
              rows={4}
            />
            {/* <input
              type="text"
              placeholder="カテゴリ"
              value={newTemplate.category_id}
              onChange={(e) => setNewTemplate({ ...newTemplate, category_id: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            /> */}
            {/* カテゴリー選択用セレクトボックス（動的取得） */}
            <select
              value={newTemplate.category_id}
              onChange={(e) => setNewTemplate({ ...newTemplate, category_id: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            >
              <option value="" disabled>カテゴリを選択してください</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={newTemplate.os}
              onChange={(e) => setNewTemplate({ ...newTemplate, os: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            >
              <option value="" disabled>カテゴリを選択してください</option>
              {vms.map((vm) => (
                <option key={vm.id} value={vm.id}>
                  {vm.name}
                </option>
              ))}
            </select>

            {/* <input
              type="text"
              placeholder="os(今はVMID)"
              value={newTemplate.os}
              onChange={(e) => setNewTemplate({ ...newTemplate, os: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            /> */}
            <input
              type="text"
              placeholder="コア数"
              value={newTemplate.cpu}
              onChange={(e) => setNewTemplate({ ...newTemplate, cpu: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="メモリ(GB)"
              value={newTemplate.memory}
              onChange={(e) => setNewTemplate({ ...newTemplate, memory: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="disk(GB)"
              value={newTemplate.disk}
              onChange={(e) => setNewTemplate({ ...newTemplate, disk: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="IPアドレス(空の場合dhcp)"
              value={newTemplate.ip}
              onChange={(e) => setNewTemplate({ ...newTemplate, ip: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="デフォルトゲートウェイ(空の場合dhcp)"
              value={newTemplate.gateway}
              onChange={(e) => setNewTemplate({ ...newTemplate, gateway: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="SSH"
              value={newTemplate.ssh}
              onChange={(e) => setNewTemplate({ ...newTemplate, ssh: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="ユーザー名"
              value={newTemplate.user}
              onChange={(e) => setNewTemplate({ ...newTemplate, user: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={newTemplate.pass}
              onChange={(e) => setNewTemplate({ ...newTemplate, pass: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <button
              onClick={handleAddTemplate}
              className="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-teal-600"
            >
              追加
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question_temp;
