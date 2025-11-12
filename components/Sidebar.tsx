import React from 'react';
import { Page } from '../types';
import { BatIcon } from './icons/BatIcon';
import { HomeIcon } from './icons/HomeIcon';
import { PlugIcon } from './icons/PlugIcon';
import { SearchIcon } from './icons/SearchIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, disabled }) => (
    <div
        onClick={!disabled ? onClick : undefined}
        className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
            disabled
                ? 'cursor-not-allowed text-gray-500'
                : 'cursor-pointer hover:bg-gray-700'
        } ${isActive ? 'bg-[#667eea] text-white' : ''}`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    
    const handleInspectionClick = () => {
        setCurrentPage('inspection');
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-[#1a1a1a] text-gray-200 flex flex-col p-4">
            <div className="flex items-center gap-3 p-4 mb-4 border-b border-gray-700">
                <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-2 rounded-lg">
                    <BatIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">BatAI</h1>
            </div>
            <nav>
                <NavItem
                    icon={<HomeIcon className="w-5 h-5" />}
                    label="首页"
                    isActive={currentPage === 'welcome'}
                    onClick={() => setCurrentPage('welcome')}
                />
                <NavItem
                    icon={<PlugIcon className="w-5 h-5" />}
                    label="数据集成"
                    isActive={currentPage === 'datasource'}
                    onClick={() => setCurrentPage('datasource')}
                />
                <NavItem
                    icon={<SearchIcon className="w-5 h-5" />}
                    label="智能巡检"
                    isActive={currentPage === 'inspection'}
                    onClick={handleInspectionClick}
                />
                <NavItem
                    icon={<WrenchScrewdriverIcon className="w-5 h-5" />}
                    label="技能中心"
                    isActive={currentPage === 'skills'}
                    onClick={() => setCurrentPage('skills')}
                />
            </nav>
        </aside>
    );
};

export default Sidebar;