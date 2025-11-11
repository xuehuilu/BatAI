import React from 'react';
import { Page } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SearchIcon } from './icons/SearchIcon'; // Using SearchIcon as a stand-in for "Traceability"
import { PlugIcon } from './icons/PlugIcon'; // Using PlugIcon for "Link Inference"

interface WelcomeScreenProps {
    setCurrentPage: (page: Page) => void;
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm text-left">
        <div className="text-3xl mb-4 text-[#667eea]">{icon}</div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setCurrentPage }) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center h-full bg-white">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                欢迎使用 BatAI
            </h1>
            <p className="text-lg text-gray-600 mb-12">
                智能业务巡检平台 - 更少告警，更深洞察
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
                <FeatureCard 
                    icon={<ChartBarIcon className="w-8 h-8"/>}
                    title="动态基线学习"
                    description="自动学习业务的时间规律，智能判断“什么是正常”。"
                />
                <FeatureCard 
                    icon={<PlugIcon className="w-8 h-8"/>}
                    title="问题链路推理"
                    description="基于不完整数据进行智能推理，提供完整的分析链条。"
                />
                <FeatureCard
                    icon={<SearchIcon className="w-8 h-8"/>}
                    title="数据源可追溯"
                    description="每个结论都可以追溯到原始数据源，防止 AI“幻觉”。"
                />
            </div>

            <button
                onClick={() => setCurrentPage('datasource')}
                className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
                开始使用 →
            </button>
        </div>
    );
};

export default WelcomeScreen;