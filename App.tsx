
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WelcomeScreen from './components/WelcomeScreen';
import IntegrationCenter from './components/IntegrationCenter';
import InspectionView from './components/InspectionView';
import { Page, MessageType, DataSourceId } from './types';

function App() {
    const [currentPage, setCurrentPage] = useState<Page>('welcome');
    const [connectedSources, setConnectedSources] = useState<DataSourceId[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const isDataSourceConnected = connectedSources.length > 0;

    const renderPage = () => {
        switch (currentPage) {
            case 'welcome':
                return <WelcomeScreen setCurrentPage={setCurrentPage} />;
            case 'datasource':
                return (
                    <IntegrationCenter
                        connectedSources={connectedSources}
                        setConnectedSources={setConnectedSources}
                    />
                );
            case 'inspection':
                return (
                    <InspectionView
                        messages={messages}
                        setMessages={setMessages}
                        isAnalyzing={isAnalyzing}
                        setIsAnalyzing={setIsAnalyzing}
                    />
                );
            default:
                return <WelcomeScreen setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                dataSourceConnected={isDataSourceConnected}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar
                    currentPage={currentPage}
                    connectedSourcesCount={connectedSources.length}
                />
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

export default App;
