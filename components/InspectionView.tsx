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


// --- Scenario 1: SLS Only (Healthy Check) ---
const thoughtProcessPreambleDefault = `开始对缴费提交接口进行日常健康巡检...

**分析目标**:
- 评估接口整体健康状态
- 学习业务的正常行为模式
- 建立性能基线
- 识别潜在的优化空间

**数据评估**:
- ✅ 已接入: Nginx 访问日志
- ❌ 未接入: 分布式追踪
- ❌ 未接入: 应用详细日志
- ❌ 未接入: 数据库监控

**当前分析能力**: 基于访问日志，可以分析接口的可用性、性能表现和流量特征。无法深入到服务内部和下游依赖分析。

---

## 二、Skills 调用过程`;

const thoughtProcessStepsDefault = [
    {
        input: `### Step 1: 连接数据源

**Skill**: \`sls_connector\`

**执行过程**:
\`\`\`
正在连接阿里云 SLS...
Endpoint: cn-beijing.log.aliyuncs.com
Project: sgcc-production-logs
Logstore: nginx-access-log
\`\`\``,
        output: `**连接结果**:
\`\`\`
✓ 连接成功
✓ 数据源可访问
✓ 最新日志时间: 2024-11-11 14:29:58
✓ 日志格式验证通过
\`\`\``
    },
    {
        input: `### Step 2: 提取关键业务指标

**Skill**: \`sls_query_builder\`

**查询目标**: 提取缴费接口的成功率、响应时间、流量分布

**生成的查询语句**:
\`\`\`sql
* | WHERE request_path = '/api/payment/submit'
    AND __time__ >= from_unixtime(1731225000)
    AND __time__ < from_unixtime(1731311400)
  | SELECT 
      date_format(__time__, '%Y-%m-%d %H:00') as time_bucket,
      COUNT(*) as total_requests,
      COUNT_IF(http_status < 500) as success_requests,
      ROUND(COUNT_IF(http_status < 500) * 100.0 / COUNT(*), 2) as success_rate,
      APPROX_PERCENTILE(response_time, 0.50) as p50_latency,
      APPROX_PERCENTILE(response_time, 0.95) as p95_latency,
      APPROX_PERCENTILE(response_time, 0.99) as p99_latency,
      COUNT_IF(http_status = 500) as error_500,
      COUNT_IF(http_status = 502) as error_502,
      COUNT_IF(http_status = 504) as error_504
  | GROUP BY time_bucket
  | ORDER BY time_bucket
\`\`\``,
        output: `**查询执行**:
\`\`\`
扫描日志: 2,456,789 条
处理时间: 2.8 秒
匹配记录: 458,234 条
\`\`\`

**24小时数据概览** (每小时统计):

| 时间段 | 请求量 | 成功率 | P50延迟 | P95延迟 | P99延迟 | 500错误 |
|--------|--------|--------|---------|---------|---------|---------|
| 11-10 15:00 | 12,345 | 99.6% | 87ms | 156ms | 234ms | 8 |
| 11-10 16:00 | 14,567 | 99.5% | 92ms | 168ms | 245ms | 12 |
| ... | ... | ... | ... | ... | ... | ... |
| 11-11 12:00 | 31,234 | 99.6% | 91ms | 170ms | 243ms | 11 |
| 11-11 13:00 | 26,890 | 99.6% | 88ms | 164ms | 236ms | 9 |
| 11-11 14:00 | 21,123 | 99.5% | 92ms | 172ms | 244ms | 12 |

**数据来源**: 阿里云 SLS - \`sgcc-production-logs/nginx-access-log\`  
**查询ID**: \`query-20241111-143018-f8a3b5\``
    },
    {
        input: `### Step 3: 学习历史基线

**Skill**: \`baseline_learning\`

**学习目标**: 分析最近7天的工作日数据，建立正常行为基线

**学习参数**:
\`\`\`yaml
algorithm: time_series_baseline
training_window: 7_days
time_matching: weekday_hour_match
confidence_interval: 0.95
exclude_anomalies: true
\`\`\``,
        output: `**历史数据查询**:
\`\`\`sql
* | WHERE request_path = '/api/payment/submit'
    AND __time__ >= from_unixtime(1730620200)  -- 7天前
    AND __time__ < from_unixtime(1731225000)
    AND dayofweek(__time__) BETWEEN 2 AND 6  -- 工作日
  | SELECT 
      date_format(__time__, '%Y-%m-%d %H:00') as time_bucket,
      ROUND(COUNT_IF(http_status < 500) * 100.0 / COUNT(*), 2) as success_rate,
      APPROX_PERCENTILE(response_time, 0.99) as p99_latency,
      COUNT(*) as request_count
  | GROUP BY time_bucket
  | ORDER BY time_bucket
\`\`\`
**基线学习结果**:
\`\`\`
全天整体基线:
├─ 成功率: 99.6% (范围: 99.3% - 99.8%)
├─ P99延迟: 240ms (范围: 225ms - 255ms)
└─ 日均请求量: 458,234 次
\`\`\`

**基线特征分析**:
✓ **稳定性良好**: 成功率始终保持在 99.3% 以上  
✓ **性能稳定**: P99延迟波动范围小 (±15ms)  
✓ **流量规律**: 明显的工作时段高峰模式`
    },
    {
        input: `### Step 4: 当前数据与基线对比

**Skill**: \`baseline_comparator\``,
        output: `**对比分析**:

**整体健康度评分**: ⭐⭐⭐⭐⭐ 5.0/5.0

| 指标 | 当前值 | 基线范围 | 评估 | 说明 |
|------|--------|---------|------|------|
| 成功率 | 99.6% | 99.3%-99.8% | ✅ 正常 | 在预期范围内 |
| P99延迟 | 242ms | 225ms-255ms | ✅ 正常 | 略高于均值但在范围内 |
| 请求量 | 458,234 | 440,000-470,000 | ✅ 正常 | 符合工作日流量预期 |
| 错误率 | 0.4% | 0.2%-0.7% | ✅ 正常 | 在正常波动范围 |

**结论**: 表现与历史基线高度一致 ✓`
    },
    {
        input: `### Step 5: 流量特征分析

**Skill**: \`traffic_pattern_analyzer\``,
        output: `**请求量时间分布**:
\`\`\`
高峰时段识别:
├─ 上午高峰: 10:00-12:00 (平均 26,890 请求/小时)
├─ 午间峰值: 12:00-13:00 (平均 31,234 请求/小时) 🔝
└─ 晚间高峰: 19:00-21:00 (平均 29,456 请求/小时)

周中模式:
工作日流量稳定，午间12-13点是全天峰值
符合"用户午休时间缴费"的行为特征
\`\`\`
**数据来源**: 基于24小时请求量统计`
    },
    {
        input: `### Step 6: 性能趋势分析

**Skill**: \`performance_trend_analyzer\``,
        output: `**P99延迟趋势 (近7天)**:
\`\`\`
日期         平均P99延迟   变化
2024-11-05   242ms       +1.7%
2024-11-06   236ms       -0.8%
...
2024-11-11   242ms       +1.7%
\`\`\`
**趋势**: 稳定 (波动 < 3%)
**评估**: ✓ 性能表现一致，无劣化趋势

---

**成功率趋势 (近7天)**:
\`\`\`
日期         平均成功率   变化
2024-11-05   99.5%       -0.1%
2024-11-06   99.7%       +0.1%
...
2024-11-11   99.6%       持平
\`\`\`
**趋势**: 稳定 (波动 < 0.2%)
**评估**: ✓ 可用性持续稳定
`
    }
];


// --- Scenario 2: SLS + OpenTelemetry (Failure) ---
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
    {
        input: `### Step 1-4: 日志分析与异常检测
**Skill**: \`log_analyzer_pipeline\`
**调用参数**: 
\`\`\`yaml
target: /api/payment/submit
time_window: 24h
baseline_window: 14d
\`\`\`
`,
        output: `**执行结果**:
- ⚠️ **严重异常**: 在 10:10 - 11:30 期间检测到核心指标严重偏离基线
  - **成功率**: 从 99.5% 骤降至 97.0%
  - **P99延迟**: 从 261ms 激增至 924ms`
    },
    {
        input: `### Step 5: 深度错误分析
**Skill**: \`sls_query\`
**调用参数**:
\`\`\`yaml
query: >
  request_uri:"/api/payment/submit" and status >= 500
  and time in [10:10, 11:30] | 
  select status, count(1) as error_count...
\`\`\`
`,
        output: `**错误分布详情**:
- **500 Internal Server Error**: 4,281次 (占比 65.2%)
- **504 Gateway Timeout**: 1,895次 (占比 28.9%)`
    },
    { 
        input: `### Step 6: 关联 TraceID 并查询调用链
**Skill**: \`trace_analyzer\`
**调用参数**:
\`\`\`yaml
source: opentelemetry_backend
query_type: find_slow_traces
time_range: [10:10, 11:30]
service_name: payment-api
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
    { 
        input: `### Step 7: 根因定位与证据确认
**Skill**: \`root_cause_reasoner\``,
        output: `**证据1 (日志)**: 500/504错误激增，P99延迟飙升
- 来源: [SLS日志分析]
- 指向: 后端服务处理缓慢

**证据2 (调用链)**: 92.8%的请求耗时集中在 \`get_bill_details\` 调用
- 来源: [Trace 分析]
- 指向: \`billing-service\` 服务是性能瓶颈

**结论**:
- **高置信度定位**: 问题根因是下游 **电费计算服务(billing-service)** 的数据库查询性能问题。
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
        const thoughtProcessSteps = isTraceConnected ? thoughtProcessStepsWithTrace : thoughtProcessStepsDefault;

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
            const baseStepDelay = 1500;
            const randomStepDelay = 1500;

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
                await delay(500 + Math.random() * 500);

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