import React from 'react';
import { DataSource } from '../types';
import { SlsIcon } from './icons/SlsIcon';
import { TraceIcon } from './icons/TraceIcon';

interface DataSourceCardProps {
    source: DataSource & { status: 'connected' | 'available' };
    onConfigure: () => void;
}

const iconMap = {
    sls: <SlsIcon className="w-7 h-7 text-white" />,
    trace: <TraceIcon className="w-7 h-7 text-white" />,
};

const iconBgMap = {
    sls: 'bg-gradient-to-br from-orange-500 to-red-500',
    trace: 'bg-gradient-to-br from-blue-500 to-indigo-600',
};

const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, onConfigure }) => {
    const isConnected = source.status === 'connected';

    return (
        <div className={`bg-white rounded-xl p-6 flex flex-col transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 border-2 ${isConnected ? 'border-green-500' : 'border-transparent'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${iconBgMap[source.icon]}`}>
                        {iconMap[source.icon]}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{source.name}</h3>
                </div>
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {isConnected ? '已连接' : '可用'}
                </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">{source.desc}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {source.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {feature}
                    </span>
                ))}
            </div>

            <button
                onClick={onConfigure}
                className={`w-full mt-auto px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${isConnected ? 'bg-green-600 text-white' : 'bg-[#667eea] hover:bg-[#5a67d8] text-white'}`}
            >
                {isConnected ? '✓ 已连接' : '配置连接'}
            </button>
        </div>
    );
};

export default DataSourceCard;