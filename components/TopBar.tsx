
import React from 'react';
import { Page } from '../types';

interface TopBarProps {
    currentPage: Page;
    connectedSourcesCount: number;
}

const TopBar: React.FC<TopBarProps> = ({ currentPage, connectedSourcesCount }) => {
    const pageTitles: Record<Page, string> = {
        welcome: 'Welcome to BatAI',
        datasource: 'Data Integration Center',
        inspection: 'Smart Inspection'
    };

    return (
        <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-gray-800">{pageTitles[currentPage]}</h2>
            {connectedSourcesCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>{connectedSourcesCount} data source{connectedSourcesCount > 1 ? 's' : ''} connected</span>
                </div>
            )}
        </header>
    );
};

export default TopBar;
