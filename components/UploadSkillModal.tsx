import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { FolderPlusIcon } from './icons/FolderPlusIcon';

interface UploadSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadSkillModal: React.FC<UploadSkillModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-900">上传技能</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                <div className="px-6 pb-8 flex-1 flex flex-col">
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors w-full">
                        <input type="file" className="hidden" />
                        <FolderPlusIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600">拖放或点击上传</p>
                    </label>

                    <div className="mt-6 text-sm">
                        <h4 className="font-semibold text-gray-800 mb-2">文件要求</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>ZIP 文件，根目录中必须只包含一个 SKILL.md 文件。</li>
                            <li>SKILL.md 文件中包含 YAML 格式的技能名称和描述。</li>
                        </ul>
                    </div>
                    
                    <div className="mt-4 text-sm">
                        <a href="#" className="text-blue-600 hover:underline">阅读更多关于创建技能的信息</a>
                        <span className="text-gray-500 mx-1">或</span>
                        <a href="#" className="text-blue-600 hover:underline">查看示例</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadSkillModal;