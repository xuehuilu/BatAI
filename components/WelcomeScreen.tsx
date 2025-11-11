
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
                Welcome to BatAI
            </h1>
            <p className="text-lg text-gray-600 mb-12">
                The Smart Business Inspection Platform - Fewer Alarms, Deeper Insights
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
                <FeatureCard 
                    icon={<ChartBarIcon className="w-8 h-8"/>}
                    title="Dynamic Baseline Learning"
                    description="Automatically learns your business's temporal patterns to intelligently determine 'what is normal'."
                />
                <FeatureCard 
                    icon={<PlugIcon className="w-8 h-8"/>}
                    title="Problem Link Inference"
                    description="Performs intelligent reasoning based on incomplete data to provide a complete analysis chain."
                />
                <FeatureCard
                    icon={<SearchIcon className="w-8 h-8"/>}
                    title="Data Source Traceability"
                    description="Every conclusion can be traced back to its original data source, preventing AI 'hallucinations'."
                />
            </div>

            <button
                onClick={() => setCurrentPage('datasource')}
                className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
                Get Started →
            </button>
        </div>
    );
};

export default WelcomeScreen;
