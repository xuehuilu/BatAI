import React, { useState } from 'react';
import { DataSource, DataSourceId } from '../types';
import ConfigModal from './ConfigModal';
import { StarIcon } from './icons/StarIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import DataSourceItem from './DataSourceItem';

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
            id: 'elasticsearch',
            name: 'Elasticsearch',
            icon: 'es',
            desc: '接入应用日志、错误堆栈等非结构化数据，用于深度错误分析和关键字搜索。',
            features: ['日志搜索', '错误聚合', '关键字分析'],
            category: 'recommended'
        }
    ];

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
        <>
            <div className="p-8 bg-gray-50 h-full overflow-y-auto">
                 <div className="max-w-4xl mx-auto">
                    <header className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">数据集成中心</h2>
                        <p className="text-gray-600">连接您的数据源，赋予 BatAI 更全面的分析能力。</p>
                    </header>
                    
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <StarIcon className="w-5 h-5 text-yellow-500" />
                                核心数据源 (MVP)
                            </h3>
                        </div>
                        {requiredSources.map(source => (
                            <DataSourceItem key={source.id} source={source} onConfigure={() => setConfigModalSource(source)} />
                        ))}
                        
                        <div className="p-4 bg-gray-50 border-t border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-blue-500" />
                                推荐数据源
                            </h3>
                        </div>
                        {recommendedSources.map(source => (
                            <DataSourceItem key={source.id} source={source} onConfigure={() => setConfigModalSource(source)} />
                        ))}
                    </div>
                </div>
            </div>

            {configModalSource && (
                <ConfigModal
                    source={configModalSource}
                    onClose={() => setConfigModalSource(null)}
                    onConnect={handleConnect}
                />
            )}
        </>
    );
};

export default IntegrationCenter;