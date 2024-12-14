"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Admin_header";

const Question_temp = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState([
    { id: 1, status: '解決', title: '大量Pod問題', text: 'kubernetesの中にpod大量発生！！！！', Point: '10' },
    { id: 2, status: '未解決', title: 'スケール問題', text: 'podのスケールが壊れた！どうしよう！', Point: '10' },
    { id: 3, status: '解決', title: 'ノード不足', text: 'ノード不足でクラッシュしたけど直したよ！', Point: '10' },
    { id: 4, status: '解決', title: '新サービス', text: 'kubernetesで新しいサービス作成中！', Point: '10' },
    { id: 5, status: '未解決', title: '負荷テスト', text: '負荷テスト中にエラー発生！', Point: '10' },
    { id: 6, status: '解決', title: 'デプロイ成功', text: 'デプロイに成功しました！', Point: '10' },
  ]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    text: "",
    ip: "",
    ssh: "",
    user: "",
    pass: "",
  });

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openModal = (template: any) => {
    setModalContent(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleConfirm = () => {
    const selectedTemplates = templates.filter((t) => selectedIds.includes(t.id));
    localStorage.setItem("selectedTemplates", JSON.stringify(selectedTemplates));
    router.push("/Edit_question");
  };

  const validateInputs = () => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    const noHiraganaRegex = /^[^\u3040-\u309F]*$/;

    if (!ipRegex.test(newTemplate.ssh)) {
      alert("有効なIPアドレスを入力してください。");
      return false;
    }
    if (!noHiraganaRegex.test(newTemplate.user) || !noHiraganaRegex.test(newTemplate.pass)) {
      alert("ユーザー名とパスワードにはひらがなを使用できません。");
      return false;
    }
    return true;
  };

  const handleAddTemplate = () => {
    if (!validateInputs()) return;

    const newId = templates.length + 1;
    setTemplates((prev) => [...prev, { id: newId, status: "未解決", ...newTemplate }]);
    setNewTemplate({ title: "", text: "", Point: "10", ssh: "", user: "", pass: "" });
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    const storedTemplates = localStorage.getItem("selectedTemplates");
    if (storedTemplates) {
      console.log("Selected Templates:", JSON.parse(storedTemplates));
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-wrap justify-center items-center bg-teal-400 p-8 gap-4 mt-5">
        <div
          className="grid grid-cols-3 gap-8 p-10 bg-[#4fd1c5] min-h-screen"
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
            >
              <div
                className={`absolute top-2 left-2 w-6 h-6 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  selectedIds.includes(template.id) ? "bg-teal-500 text-white" : "bg-white text-gray-500"
                }`}
                onClick={() => toggleSelection(template.id)}
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
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#E7F6F3] rounded-3xl shadow-lg relative p-8 flex flex-col"
            style={{ width: "800px", height: "500px", overflow: "hidden" }}
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
            <div className="flex-1 overflow-y-auto mb-6 p-4 text-lg text-gray-800 bg-white rounded-xl shadow-inner border border-gray-300 whitespace-pre-wrap leading-relaxed">
              {modalContent.text}
            </div>
          </div>
        </div>
      )}

      {/* 追加モーダル */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            className="bg-[#E7F6F3] rounded-3xl shadow-lg relative p-8 flex flex-col"
            style={{ width: "700px", height: "600px" }}
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
            <input
              type="text"
              placeholder="IPアドレス"
              value={newTemplate.ip}
              onChange={(e) => setNewTemplate({ ...newTemplate, ip: e.target.value })}
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
