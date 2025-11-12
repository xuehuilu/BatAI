import React from 'react';
import { DataSource } from '../types';
import { SlsIcon } from './icons/SlsIcon';
import { ElasticsearchIcon } from './icons/ElasticsearchIcon';

interface DataSourceItemProps {
    source: DataSource & { status: 'connected' | 'available' };
    onConfigure: () => void;
}

const iconMap = {
    sls: <SlsIcon className="w-6 h-6 text-white" />,
    es: <ElasticsearchIcon className="w-6 h-6 text-white" />,
};

const iconBgMap = {
    sls: 'bg-gradient-to-br from-orange-500 to-red-500',
    es: 'bg-gradient-to-br from-teal-500 to-cyan-600',
};

const DataSourceItem: React.FC<DataSourceItemProps> = ({ source, onConfigure }) => {
    const isConnected = source.status === 'connected';

    return (
        <div className="py-5 px-6 flex items-center justify-between border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start gap-4 flex-1 pr-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgMap[source.icon]}`}>
                    {iconMap[source.icon]}
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">{source.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">{source.desc}</p>
                    <div className="flex flex-wrap gap-2">
                        {source.features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <button
                    onClick={onConfigure}
                    className={`w-32 text-center px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${isConnected ? 'bg-white text-green-700 border border-green-300 hover:bg-green-50' : 'bg-[#667eea] hover:bg-[#5a67d8] text-white'}`}
                >
                    {isConnected ? '✓ 已连接' : '配置连接'}
                </button>
            </div>
        </div>
    );
};

export default DataSourceItem;