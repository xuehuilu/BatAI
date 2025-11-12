import React, { useState } from 'react';
import { MoreHorizontalIcon } from './icons/MoreHorizontalIcon';
import UploadSkillModal from './UploadSkillModal';

interface Skill {
    id: string;
    title: string;
    description: string;
    author: string;
    enabled: boolean;
}

const initialSkills: Skill[] = [
    {
        id: 'sls-data-connector',
        title: 'sls-data-connector',
        description: 'SLS数据获取技能，可以从SLS中获取访问日志、获取TPS、RT、错误率等数据',
        author: 'BatAI Team',
        enabled: true,
    },
    {
        id: 'artifacts-builder',
        title: 'artifacts-builder',
        description: '用于创建复杂HTML产物的工具套件，使用现代前端技术（React, Tailwind CSS）。适用于需要状态管理、路由等的复杂产物。',
        author: 'Anthropic',
        enabled: true,
    },
    {
        id: 'brand-guidelines',
        title: 'brand-guidelines',
        description: '将Anthropic的官方品牌颜色和排版应用于任何可能受益于Anthropic外观和感觉的产物。在需要品牌颜色或风格指南时使用。',
        author: 'Anthropic',
        enabled: true,
    },
    {
        id: 'canvas-design',
        title: 'canvas-design',
        description: '使用设计哲学在.png和.pdf文档中创作精美的视觉艺术。当用户要求创建海报、艺术品、设计或其他静态作品时，应使用此技能。',
        author: 'Anthropic',
        enabled: true,
    }
];

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);


const SkillItem = ({ skill, onToggle }: { skill: Skill, onToggle: (id: string) => void }) => {
    return (
        <div className="py-5 px-6 flex items-start justify-between border-b border-gray-200 last:border-b-0">
            <div className="flex-1 pr-6">
                <h3 className="text-base font-medium text-gray-900 mb-1">{skill.title}</h3>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">{skill.description}</p>
                <p className="text-xs text-gray-500">{skill.author}</p>
            </div>
            <div className="flex items-center gap-4 pt-1">
                <button className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
                <ToggleSwitch enabled={skill.enabled} onChange={() => onToggle(skill.id)} />
            </div>
        </div>
    );
};

const SkillsCenter: React.FC = () => {
    const [skills, setSkills] = useState(initialSkills);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleToggleSkill = (id: string) => {
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.id === id ? { ...skill, enabled: !skill.enabled } : skill
            )
        );
    };

    return (
        <>
            <div className="p-8 bg-gray-50 h-full overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-6 flex justify-between items-start">
                        <div>
                             <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                技能
                                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">预览</span>
                            </h2>
                            <p className="text-gray-600">
                                可复用的、可定制的指令，Claude 可以在任何聊天中遵循。 <a href="#" className="text-blue-600 hover:underline">了解更多。</a>
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0">
                            上传技能
                        </button>
                    </header>
                    
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        {skills.map(skill => (
                            <SkillItem key={skill.id} skill={skill} onToggle={handleToggleSkill} />
                        ))}
                    </div>
                </div>
            </div>
            <UploadSkillModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </>
    );
};

export default SkillsCenter;