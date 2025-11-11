import React, { useState, useEffect, useRef } from 'react';
import { MessageType, AssistantMessage, MessageStep, DataSourceId } from '../types';
import EmptyState from './EmptyState';
import Message from './Message';

// Local icon components
const SendIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 10l-2 2-2.828-2.828a1 1 0 010-1.414L7.464 5.464A1 1 0 018.172 5H9m6 6l2 2 2.828-2.828a1 1 0 000-1.414L17.536 10.5a1 1 0 00-1.414 0L15 12zm-4.879 4.879l-2 2-2.828-2.828a1 1 0 010-1.414L7.586 12.5a1 1 0 011.414 0L10.121 13.5z" />
    </svg>
);


// --- Scenario 1: SLS Only ---
const thoughtProcessPreambleDefault = `**巡检时间**: 2024-11-11 14:30:00  
**分析周期**: 过去24小时 (2024-11-10 14:30 ~ 2024-11-11 14:30)  
**巡检目标**: \`/api/payment/submit\` 缴费提交接口

---

## 一、分析过程

### 思考过程

**目标**: 巡检网上国网APP的核心缴费业务接口健康状态

**分析策略**:
1.  首先连接数据源，获取缴费接口的访问日志
2.  提取关键指标：成功率、响应时间、错误码分布
3.  学习历史基线，识别"什么是正常"
4.  对比当前数据与历史基线，检测异常
5.  深入分析错误分布，寻找根因线索
6.  生成结构化报告并给出操作建议

**数据完整度评估**:
- ✅ 已接入: 应用层访问日志 (access.log)
- ❌ 未接入: 分布式追踪数据
- ❌ 未接入: 数据库监控
- ❌ 未接入: 下游依赖服务监控

**分析能力预期**: 基于单一数据源，可以发现问题表象，但无法精确定位根因。

---

## 二、Skills 调用过程
`;

const thoughtProcessStepsDefault = [
    { 
        input: `### Step 1: 连接阿里云 SLS 数据源...`,
        output: `**执行结果**: ✓ 连接成功...`
    },
    {
        input: `### Step 2: 构建查询语句并提取关键指标...`,
        output: `**查询执行结果**: 关键时段数据...`
    },
    {
        input: `### Step 3: 学习历史基线...`,
        output: `**历史基线数据**: 成功率正常范围: **99.31% ~ 99.75%**...`
    },
    {
        input: `### Step 4: 异常检测与置信度评估...`,
        output: `**异常判定结果**: ⚠️ **成功率异常**, ⚠️ **延迟异常**...`
    },
    {
        input: `### Step 5: 深度错误分析...`,
        output: `**错误分布详情**: 500错误占65.2%...`
    },
    {
        input: `### Step 6: 根因线索推理...`,
        output: `**综合推断**: 可能是缴费接口依赖的某个下游服务出现性能问题或故障...`
    }
];


// --- Scenario 2: SLS + OpenTelemetry ---
const thoughtProcessPreambleWithTrace = `**巡检时间**: 2024-11-11 14:30:00  
**分析周期**: 过去24小时 (2024-11-10 14:30 ~ 2024-11-11 14:30)  
**巡检目标**: \`/api/payment/submit\` 缴费提交接口

---

## 一、分析过程

### 思考过程

**目标**: 巡检网上国网APP的核心缴费业务接口健康状态

**分析策略**:
1.  连接SLS数据源，获取访问日志，检测宏观指标异常
2.  **连接OpenTelemetry数据源，获取分布式追踪数据**
3.  **通过 TraceID 关联日志和追踪数据**
4.  基于日志发现的异常时间段，筛选出问题Trace
5.  深入分析问题Trace的耗时分布，**精确定位问题根因**
6.  生成包含**调用链证据**的结构化报告

**数据完整度评估**:
- ✅ 已接入: 应用层访问日志 (access.log)
- ✅ 已接入: 分布式追踪数据 (OpenTelemetry)
- ❌ 未接入: 数据库监控
- ❌ 未接入: 下游依赖服务监控

**分析能力预期**: 基于日志和调用链，可以发现问题并精确定位到具体服务和接口。

---

## 二、Skills 调用过程
`;

const thoughtProcessStepsWithTrace = [
    ...thoughtProcessStepsDefault.slice(0, 5), // Reuse first 5 steps
    { // Step 6 - Replaces the original Step 6
        input: `### Step 6: 关联 TraceID 并查询调用链

**Skill**: \`trace_analyzer\`

**调用参数**:
\`\`\`yaml
source: opentelemetry_backend
query_type: find_slow_traces
time_range: [10:10, 11:30]
service_name: payment-api
operation_name: /api/payment/submit
tags:
  - http.status_code: 500
  - error: true
\`\`\``,
        output: `**查询执行结果**:
- 发现 **6,834** 条与500错误相关的Trace
- 随机抽取 5 条进行分析...

**Trace 分析 (TraceID: a1b2c3d4e5f6)**:
\`\`\`
payment-api: /api/payment/submit (总耗时: 1024ms)
  ├── pre-check (耗时: 5ms)
  ├── get_user_info (耗时: 30ms)
  │   └── user-service: /getUser (耗时: 25ms)
  ├── get_bill_details (耗时: 950ms)  <--- ⚠️ **耗时占比 92.8%**
  │   └── billing-service: /getBill (耗时: 945ms)
  │       └── billing-db: SELECT ... (耗时: 940ms) <--- ⚠️ **慢查询**
  └── create_payment_order (耗时: 39ms)
      └── order-service: /create (耗时: 32ms)
\`\`\`
`
    },
    { // Step 7
        input: `### Step 7: 根因定位与证据确认

**Skill**: \`root_cause_reasoner\`

**推理过程**:`,
        output: `**证据1 (日志)**: 500/504错误激增，P99延迟飙升
- 来源: [SLS日志分析]
- 指向: 后端服务处理缓慢

**证据2 (调用链)**: 92.8%的请求耗时集中在 \`get_bill_details\` 调用
- 来源: [Trace 分析]
- 指向: \`billing-service\` 服务是性能瓶颈

**证据3 (调用链)**: \`billing-service\` 的 \`/getBill\` 接口耗时主要在数据库查询
- 来源: [Trace Span 分析]
- 指向: billing-db 的慢查询是根因

**结论**:
- **高置信度定位**: 问题根因是下游 **电费计算服务(billing-service)** 的数据库查询性能问题，导致缴费接口超时和失败。
`
    }
];


const InspectionView: React.FC<{
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    isAnalyzing: boolean;
    setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
    connectedSources: DataSourceId[];
}> = ({ messages, setMessages, isAnalyzing, setIsAnalyzing, connectedSources }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAnalyzing]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim() || isAnalyzing) return;

        const newUserMessage: MessageType = { role: 'user', content: prompt };
        setInputValue('');
        
        const isTraceConnected = connectedSources.includes('opentelemetry');
        const thoughtProcessPreamble = isTraceConnected ? thoughtProcessPreambleWithTrace : thoughtProcessPreambleDefault;
        const thoughtProcessSteps = isTraceConnected ? thoughtProcessStepsWithTrace : thoughtProcessStepsDefault.map(s => ({...s, input: '...', output: '...'})); // Use full steps for trace, simplified for default for demo

        const assistantMessageTemplate: AssistantMessage = {
            role: 'assistant',
            thoughtProcess: thoughtProcessPreamble,
            steps: [],
            analysisContext: {
                dataSources: connectedSources
            }
        };

        setMessages(prev => [...prev, newUserMessage, assistantMessageTemplate]);
        setIsAnalyzing(true);

        try {
             // Simulate a more complex analysis when trace is connected
            const baseStepDelay = isTraceConnected ? 2000 : 3000;
            const randomStepDelay = isTraceConnected ? 2000 : 3000;

            for (const step of thoughtProcessSteps) {
                // Show Input
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                        const updatedMessage = {
                            ...lastMessage,
                            thoughtProcess: (lastMessage.thoughtProcess || '') + '\n\n' + step.input,
                        };
                        newMessages[newMessages.length - 1] = updatedMessage;
                    }
                    return newMessages;
                });
                await delay(1000 + Math.random() * 1000);

                // Show Output
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                         const updatedMessage = {
                            ...lastMessage,
                            thoughtProcess: (lastMessage.thoughtProcess || '') + '\n\n' + step.output,
                        };
                       newMessages[newMessages.length - 1] = updatedMessage;
                    }
                    return newMessages;
                });

                await delay(baseStepDelay + Math.random() * randomStepDelay);
            }
            
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                   const updatedMessage = { ...lastMessage, steps: ['report' as MessageStep] };
                   newMessages[newMessages.length - 1] = updatedMessage;
                }
                return newMessages;
            });

        } catch (error) {
            console.error("Error during analysis:", error);
            setMessages(prev => {
                 const newMessages = [...prev];
                 const lastMessage = newMessages[newMessages.length-1];
                 if(lastMessage.role === 'assistant') {
                    const updatedMessage = { ...lastMessage, steps: ['report' as MessageStep] };
                    newMessages[newMessages.length - 1] = updatedMessage;
                 }
                 return newMessages;
            });

        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };
    
    const handlePromptSuggestion = (prompt: string) => {
        handleSendMessage(prompt);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <EmptyState onPromptSuggestion={handlePromptSuggestion} />
                ) : (
                    messages.map((msg, index) => <Message key={index} message={msg} />)
                )}
                {isAnalyzing && messages[messages.length-1]?.role !== 'assistant' && (
                     <div className="flex items-start gap-4 fade-in">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4 animate-pulse w-full max-w-lg">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleFormSubmit} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="巡检‘网上国网APP缴费功能’在过去15分钟内的健康状况..."
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#667eea] focus:border-transparent outline-none transition"
                        disabled={isAnalyzing}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isAnalyzing}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#667eea] text-white hover:bg-[#5a67d8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InspectionView;
