import React, { useState, useEffect } from 'react';
import { DataSource, DataSourceId } from '../types';
import { XIcon } from './icons/XIcon';

interface ConfigModalProps {
    source: DataSource;
    onClose: () => void;
    onConnect: (sourceId: DataSourceId) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ source, onClose, onConnect }) => {
    const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleTest = () => {
        setTestStatus('loading');
        setTimeout(() => {
            setTestStatus('success');
        }, 1500);
    };

    const handleConnect = () => {
        if (testStatus === 'success') {
            onConnect(source.id);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">配置 {source.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto">
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">接入点 (Endpoint)</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#667eea] focus:border-transparent outline-none" placeholder="cn-hangzhou.log.aliyuncs.com" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">访问密钥 ID</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#667eea] focus:border-transparent outline-none" placeholder="LTAI..."/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">访问密钥 Secret</label>
                            <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#667eea] focus:border-transparent outline-none" />
                        </div>
                    </div>
                    
                    {testStatus === 'success' && (
                        <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                            ✅ 连接成功！已发现 access.log 数据。
                        </div>
                    )}
                     {testStatus === 'error' && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                            ❌ 连接失败。请检查您的凭据。
                        </div>
                    )}
                </div>

                <footer className="p-6 border-t border-gray-200 flex justify-end items-center gap-3 bg-gray-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        取消
                    </button>
                    <button onClick={handleTest} disabled={testStatus === 'loading'} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-wait">
                        {testStatus === 'loading' ? '测试中...' : '测试连接'}
                    </button>
                    <button onClick={handleConnect} disabled={testStatus !== 'success'} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#667eea] rounded-lg hover:bg-[#5a67d8] disabled:bg-gray-300 disabled:cursor-not-allowed">
                        保存并连接
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ConfigModal;