
import React from 'react';
import { MessageType, MessageStep } from '../types';
import { BatIcon } from './icons/BatIcon';

// FIX: Define local icon components as new files cannot be added
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const DocumentTextIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

interface MessageProps {
    message: MessageType;
}

const stepContent: Record<MessageStep, { icon: React.ReactNode; title: string; description: string }> = {
    step1: {
        icon: <CheckCircleIcon className="w-5 h-5 text-blue-500" />,
        title: '数据读取',
        description: '已从阿里云 SLS 读取 access.log 数据。',
    },
    step2: {
        icon: <CheckCircleIcon className="w-5 h-5 text-blue-500" />,
        title: '基线学习',
        description: '根据历史数据，计算出 API 成功率的动态基线。',
    },
    step3: {
        icon: <CheckCircleIcon className="w-5 h-5 text-orange-500" />,
        title: '异常检测',
        description: '发现 API 成功率存在显著下降，低于预期基线。',
    },
    step4: {
        icon: <CheckCircleIcon className="w-5 h-5 text-red-500" />,
        title: '根因分析',
        description: '关联 OpenTelemetry 追踪数据，定位到 "user-service" 的数据库连接池问题。',
    },
    step5: {
        icon: <CheckCircleIcon className="w-5 h-5 text-purple-500" />,
        title: '链路推理',
        description: '推断出数据库问题导致用户服务超时，进而影响了上游的登录接口。',
    },
    report: {
        icon: <DocumentTextIcon className="w-5 h-5 text-green-500" />,
        title: '生成报告',
        description: '已生成本次巡检的完整分析报告。',
    },
};

const Message: React.FC<MessageProps> = ({ message }) => {
    if (message.role === 'user') {
        return (
            <div className="flex items-start gap-4 justify-end">
                <div className="bg-[#667eea] text-white rounded-xl p-4 max-w-lg">
                    <p>{message.content}</p>
                </div>
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
            </div>
        );
    }

    // Assistant message
    return (
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
                <BatIcon className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-lg w-full">
                <h3 className="font-semibold text-gray-800 mb-3">智能分析中...</h3>
                <div className="space-y-3">
                    {message.steps.map((stepId, index) => {
                        const content = stepContent[stepId];
                        if (!content) return null;
                        return (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0">{content.icon}</div>
                                <div>
                                    <p className="font-medium text-sm text-gray-700">{content.title}</p>
                                    <p className="text-xs text-gray-500">{content.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Message;
