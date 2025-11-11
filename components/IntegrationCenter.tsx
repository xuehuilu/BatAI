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
            name: 'Alibaba Cloud SLS',
            icon: 'sls',
            desc: 'Ingest access.log files from business entry points to analyze API success rates, response times, and error distributions.',
            features: ['Success Rate Analysis', 'Response Time', 'Error Code Distribution'],
            category: 'required'
        },
        {
            id: 'opentelemetry',
            name: 'OpenTelemetry',
            icon: 'trace',
            desc: 'Distributed tracing data used for cross-service problem link inference and root cause analysis.',
            features: ['Call Chain Tracing', 'Cross-Service Analysis'],
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
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Data Integration Center</h2>
                <p className="text-gray-600">Connect your data sources to give BatAI more comprehensive analytical capabilities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-4xl font-bold text-[#667eea] mb-1">{connectedSources.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Connected Sources</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-4xl font-bold text-gray-700 mb-1">{dataSources.length - connectedSources.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Available Sources</p>
                </div>
            </div>

            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-500" />
                    Required Data Sources (MVP)
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
                    Recommended Data Sources
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