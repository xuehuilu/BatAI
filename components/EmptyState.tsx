import React from 'react';
import { BatIcon } from './icons/BatIcon';
import { SearchIcon } from './icons/SearchIcon';

interface EmptyStateProps {
    onPromptSuggestion: (prompt: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onPromptSuggestion }) => {
    const suggestions = [
        '巡检‘网上国网APP缴费功能’健康状况',
        '分析近30分钟缴费失败的主要原因',
        '江苏地区营销活动是否影响了缴费接口性能？',
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center mb-6">
                <BatIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">智能巡检</h2>
            <p className="text-gray-600 max-w-md mb-8">
                连接数据源后，您可以开始进行智能巡检。BatAI 会自动学习业务指标，并对问题进行根因分析。
            </p>
            <div className="w-full max-w-md space-y-3">
                {suggestions.map((text, i) => (
                    <button
                        key={i}
                        onClick={() => onPromptSuggestion(text)}
                        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-3"
                    >
                        <SearchIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmptyState;