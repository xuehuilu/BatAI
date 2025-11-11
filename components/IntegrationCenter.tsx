import React, { useState } from 'react';
import { DataSource, DataSourceId } from '../types';
import DataSourceCard from './DataSourceCard';
import ConfigModal from './ConfigModal';
import { StarIcon } from './icons/StarIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface IntegrationCenterProps {
    connectedSources: DataSourceId[];
    setConnectedSources: React.Dispatch<React.SetStateAction<DataSourceId[]>>;
}

const IntegrationCenter: React.FC<IntegrationCenterProps> = ({ connectedSources, setConnectedSources }) => {
    const [configModalSource, setConfigModalSource] = useState<DataSource | null>(null);

    const dataSources: DataSource[] = [
        {
            id: 'sls',
            name: '阿里云SLS',
            icon: 'sls',
            desc: '接入业务入口的 access.log 文件，用于分析 API 成功率、响应时间和错误分布。',
            features: ['成功率分析', '响应时间', '错误码分布'],
            category: 'required'
        },
        {
            id: 'opentelemetry',
            name: 'OpenTelemetry',
            icon: 'trace',
            desc: '分布式追踪数据，用于跨服务的问题链路推理和根因分析。',
            features: ['调用链追踪', '跨服务分析'],
            category: 'recommended'
        }
    ];

    // Fix: Explicitly type `allDataSources` to ensure `status` is typed as 'connected' | 'available' instead of string.
    const allDataSources: (DataSource & { status: 'connected' | 'available' })[] = dataSources.map(ds => ({
        ...ds,
        status: connectedSources.includes(ds.id) ? 'connected' : 'available',
    }));
    
    const requiredSources = allDataSources.filter(s => s.category === 'required');
    const recommendedSources = allDataSources.filter(s => s.category === 'recommended');

    const handleConnect = (sourceId: DataSourceId) => {
        if (!connectedSources.includes(sourceId)) {
            setConnectedSources(prev => [...prev, sourceId]);
        }
        setConfigModalSource(null);
    };

    return (
        <div className="p-8 bg-gray-50 h-full">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">数据集成中心</h2>
                <p className="text-gray-600">连接您的数据源，赋予 BatAI 更全面的分析能力。</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-4xl font-bold text-[#667eea] mb-1">{connectedSources.length}</p>
                    <p className="text-sm text-gray-600 font-medium">已连接源</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-4xl font-bold text-gray-700 mb-1">{dataSources.length - connectedSources.length}</p>
                    <p className="text-sm text-gray-600 font-medium">可用源</p>
                </div>
            </div>

            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-500" />
                    核心数据源 (MVP)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requiredSources.map(source => (
                        <DataSourceCard key={source.id} source={source} onConfigure={() => setConfigModalSource(source)} />
                    ))}
                </div>
            </section>
            
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-blue-500" />
                    推荐数据源
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendedSources.map(source => (
                        <DataSourceCard key={source.id} source={source} onConfigure={() => setConfigModalSource(source)} />
                    ))}
                </div>
            </section>

            {configModalSource && (
                <ConfigModal
                    source={configModalSource}
                    onClose={() => setConfigModalSource(null)}
                    onConnect={handleConnect}
                />
            )}
        </div>
    );
};

export default IntegrationCenter;