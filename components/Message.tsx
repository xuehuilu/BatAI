
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageType } from '../types';
import { BatIcon } from './icons/BatIcon';

interface MessageProps {
    message: MessageType;
}

const chartData = Array.from({ length: 24 }, (_, i) => {
    const hour = `${i}:00`;
    const baseValue = 99.2 + Math.sin((i - 6) * Math.PI / 12) * 0.3;
    let currentValue = baseValue + (Math.random() - 0.5) * 0.1;
    if (i >= 10 && i <= 14) {
        currentValue = 97.5 + Math.random() * 0.5;
    }
    return {
        hour,
        baseline: parseFloat(baseValue.toFixed(2)),
        current: parseFloat(currentValue.toFixed(2)),
    };
});

const Message: React.FC<MessageProps> = ({ message }) => {

    if (message.role === 'user') {
        return (
            <div className="mb-8 flex justify-end">
                <div className="max-w-xl">
                     <div className="flex items-center gap-3 mb-2 justify-end">
                        <span className="text-sm font-semibold text-gray-700">You</span>
                        <div className="w-8 h-8 rounded-full bg-[#667eea] text-white flex items-center justify-center font-bold text-sm">
                            U
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl rounded-tr-none text-gray-800 text-sm leading-relaxed">
                        {message.content}
                    </div>
                </div>
            </div>
        );
    }

    const { steps } = message;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center">
                    <BatIcon className="w-5 h-5"/>
                </div>
                <span className="text-sm font-semibold text-gray-700">BatAI</span>
            </div>
            
            <div className="bg-white p-5 rounded-xl rounded-tl-none border border-gray-200 text-gray-800 text-sm leading-relaxed">
                {steps.length > 0 && (
                    <div className="pb-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-600 mb-3 text-sm">Analysis Process</h4>
                        {steps.includes('step1') && (
                            <div className="mb-4 fade-in">
                                <p className="font-semibold mb-1">1. Connecting Data Source</p>
                                <p className="text-gray-600 text-xs">Connecting to Alibaba Cloud SLS... ✓ Success</p>
                            </div>
                        )}
                         {steps.includes('step2') && (
                            <div className="mb-4 fade-in">
                                <p className="font-semibold mb-1">2. Querying Access Log Data</p>
                                <pre className="bg-gray-50 text-gray-700 p-2 rounded-md text-xs leading-normal mt-1 overflow-x-auto">
                                    <code>* | WHERE request_path = '/api/order/create'<br/>  | SELECT ... GROUP BY hour</code>
                                </pre>
                            </div>
                        )}
                         {steps.includes('step3') && (
                            <div className="mb-4 fade-in">
                                <p className="font-semibold mb-1">3. Learning Historical Baseline</p>
                                <p className="text-gray-600 text-xs">Calculated baseline: μ=99.4%, σ=0.13%</p>
                            </div>
                        )}
                        {steps.includes('step4') && (
                             <div className="mb-4 fade-in">
                                <p className="font-semibold mb-1">4. Anomaly Detection</p>
                                <p className="text-gray-600 text-xs">Current success rate <span className="text-red-500 font-bold">97.8%</span> is below baseline threshold <span className="font-bold">99.15%</span>. Anomaly detected.</p>
                            </div>
                        )}
                         {steps.includes('step5') && (
                            <div className="fade-in">
                                <p className="font-semibold mb-1">5. Error Analysis</p>
                                 <p className="text-gray-600 text-xs">Dominant error code: <span className="font-bold">500</span> (68% of errors).</p>
                            </div>
                        )}
                    </div>
                )}

                {steps.includes('report') && (
                    <div className="pt-5 fade-in">
                        <h3 className="font-bold text-base mb-3">Inspection Report</h3>
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
                            <strong>Key Finding:</strong> The order creation API success rate dropped significantly to 97.8% (baseline ~99.4%) between 10:00-14:00, primarily due to an increase in 500 errors.
                        </div>

                        <div className="grid grid-cols-3 gap-4 my-5 text-center">
                            <div>
                                <p className="text-xs text-gray-500">Success Rate</p>
                                <p className="text-2xl font-bold text-red-500">97.8%</p>
                                <p className="text-xs text-red-500 font-semibold">↓ 1.6% vs Baseline</p>
                            </div>
                             <div>
                                <p className="text-xs text-gray-500">P99 Latency</p>
                                <p className="text-2xl font-bold">342ms</p>
                                <p className="text-xs text-red-500 font-semibold">↑ 89ms vs Baseline</p>
                            </div>
                             <div>
                                <p className="text-xs text-gray-500">Affected Requests</p>
                                <p className="text-2xl font-bold">2,847</p>
                                <p className="text-xs text-gray-500">Past 1 hour</p>
                            </div>
                        </div>

                        <div className="h-56 mt-4">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                                    <YAxis domain={['dataMin - 1', 'dataMax + 0.5']} tick={{ fontSize: 10 }} />
                                    <Tooltip wrapperClassName="text-xs !bg-white !border-gray-300 !rounded-md" />
                                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                                    <Line type="monotone" dataKey="baseline" stroke="#8884d8" strokeWidth={2} dot={false} name="Historical Baseline" />
                                    <Line type="monotone" dataKey="current" stroke="#ef4444" strokeWidth={2} dot={false} name="Current Data" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-5">
                            <h4 className="font-bold mb-1">Recommended Actions:</h4>
                            <ol className="list-decimal list-inside text-gray-700 space-y-1">
                                <li>Immediately investigate 500 error logs for the order service.</li>
                                <li>Check the health status of downstream dependencies.</li>
                                <li>Consider integrating distributed tracing for precise problem localization.</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
