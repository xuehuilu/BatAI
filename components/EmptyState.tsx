import React from 'react';
import { BatIcon } from './icons/BatIcon';

interface EmptyStateProps {
    onQuickAction: (query: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onQuickAction }) => {
    return (
        <div className="text-center py-16 px-4">
            <div className="inline-block p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl mb-4">
                <BatIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">开始您的智能巡检</h3>
            <p className="text-gray-600 mb-6">告诉我您想巡检什么，我将为您进行深度分析。</p>
            <button
                onClick={() => onQuickAction('巡检核心业务API的健康状况')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#667eea] rounded-lg hover:bg-[#5a67d8]"
            >
                从核心 API 开始
            </button>
        </div>
    );
};

export default EmptyState;