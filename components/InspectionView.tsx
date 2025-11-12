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

// --- Scenario 2: SLS Only (Abnormal/Failure Check) ---
const thoughtProcessPreambleAbnormal = `收到用户关于“缴费失败”的巡检请求，开始进行根因分析...

**分析目标**:
- 定位缴费接口成功率下降的根本原因
- 识别故障影响范围
- 提出解决方案建议

**数据评估**:
- ✅ 已接入: Nginx 访问日志 (sgcc-production-logs/nginx-access-log)
- ✅ 已接入: 应用日志 (sgcc-production-logs/app-logs-*)
- ❌ 未接入: 分布式追踪
- ❌ 未接入: 数据库监控

**当前分析能力**: 基于访问日志和应用日志，可以进行API入口->微服务节点的关联分析。虽然没有完整的调用链，但通过时间和错误模式匹配，可以推断问题根源。

---

## 二、Skills 调用过程`;

const thoughtProcessStepsAbnormal = [
    {
        input: `### Step 1: 评估入口 API 健康状况

**Skill**: \`sls_query_builder\`

**查询目标**: 提取缴费接口近30分钟的成功率、响应时间、流量分布

**生成的查询语句**:
\`\`\`sql
* | WHERE request_path = '/api/payment/submit'
    AND __time__ >= from_unixtime(1731309600) -- 30分钟前
    AND __time__ < from_unixtime(1731311400)
  | SELECT 
      ROUND(COUNT_IF(http_status < 500) * 100.0 / COUNT(*), 2) as success_rate,
      APPROX_PERCENTILE(response_time, 0.99) as p99_latency,
      COUNT_IF(http_status >= 500) as error_count
\`\`\``,
        output: `**查询执行**:
\`\`\`
扫描日志: 215,789 条
处理时间: 1.2 秒
匹配记录: 48,234 条
\`\`\`

**查询结果**:

| 指标 | 当前值 |
|------|--------|
| 成功率 | 92.1% |
| P99延迟 | 857ms |
| 500错误数 | 3812 |

**初步结论**: 🔴 **服务严重异常**。成功率从日常的99.6%暴跌至92.1%，P99延迟从240ms飙升至857ms。问题真实存在。`
    },
    {
        input: `### Step 2: 当前数据与基线对比

**Skill**: \`baseline_comparator\``,
        output: `**对比分析**:

| 指标 | 当前值 | 基线范围 | 评估 | 说明 |
|------|--------|---------|------|------|
| 成功率 | 92.1% | 99.3%-99.8% | ❌ 严重偏离 | 下降了 7.5 个百分点 |
| P99延迟 | 857ms | 225ms-255ms | ❌ 严重偏离 | 延迟增加了 257% |
| 错误率 | 7.9% | 0.2%-0.7% | ❌ 严重偏离 | 错误率增加了 10 倍以上 |

**结论**: 指标全面劣化，系统处于故障状态。`
    },
    {
        input: `### Step 3: 筛选异常时间段的错误日志

**Skill**: \`sls_multi_logstore_search\`

**分析逻辑**: 由于没有链路追踪，BatAI 将在故障发生的时间窗口（14:00 - 14:30）内，在**所有**微服务的应用日志中搜索 ERROR 级别的日志，以找出异常源头。

**生成的查询语句**:
\`\`\`sql
* | WHERE __logstore__ LIKE 'app-logs-%'
    AND __time__ >= from_unixtime(1731309600)
    AND __time__ < from_unixtime(1731311400)
    AND level = 'ERROR'
  | SELECT 
      __logstore__ as service_name,
      COUNT(*) as error_count,
      arbitrary(error_message) as sample_error
  | GROUP BY service_name
  | ORDER BY error_count DESC
  | LIMIT 5
\`\`\``,
        output: `**查询结果**:
\`\`\`
错误日志聚合 (Top 5):

| 服务名 | 错误数 | 错误示例 |
|------------------|--------|----------------------------------------------------------------|
| app-logs-payment | 3689 | java.sql.SQLTransientConnectionException: Connection is not available... |
| app-logs-coupon | 178 | java.sql.SQLTransientConnectionException: Connection is not available... |
| app-logs-user | 5 | NullPointerException at com.sgcc.user.service.impl... |
| app-logs-order | 2 | Feign client timeout exception for payment-service |
| app-logs-gateway | 0 | - |
\`\`\`
**发现**:
- 绝大多数错误集中在 \`payment-service\` 和 \`coupon-service\`。
- 两种服务都报出了相同的数据库连接异常。
- 其他服务的错误数量极少，可判断为次生问题或无关问题。`
    },
    {
        input: `### Step 4: 深入分析核心故障服务

**Skill**: \`sls_log_metric_extractor\`

**分析目标**: 提取 \`payment-service\` 的内部性能指标（错误率、RT）

**生成的查询语句**:
\`\`\`sql
* | WHERE __logstore__ = 'app-logs-payment'
    AND __time__ >= from_unixtime(1731309600)
  | SELECT 
      SUM(CASE WHEN success = 'false' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as internal_error_rate,
      APPROX_PERCENTILE(response_time, 0.99) as internal_p99_latency
\`\`\``,
        output: `**payment-service 内部指标**:
\`\`\`
├─ 内部错误率: 15.6%
└─ 内部P99延迟: 2100ms
\`\`\`
**结论**: \`payment-service\` 内部错误率远高于入口的7.9%，且内部延迟极高。**故障根源锁定在 \`payment-service\` 及其下游依赖**。`
    },
    {
        input: `### Step 5: 综合推理与根因定位

**Skill**: \`root_cause_synthesizer\`

**输入信息**:
1.  **现象**: API网关 \`/api/payment/submit\` 成功率暴跌，延迟飙升。
2.  **证据 1**: \`payment-service\` 和 \`coupon-service\` 同时出现大量数据库连接超时错误。
3.  **证据 2**: \`payment-service\` 内部监控指标严重劣化。
4.  **知识库**: \`payment-service\` 和 \`coupon-service\` 共享同一个数据库集群 \`mysql-prod-cluster-01\`。

**推理过程**:
- 多个服务同时出现同一种数据库错误，指向共享的下游依赖出现问题。
- 错误类型为“连接不可用”，表明数据库无法处理新的连接请求。
- 这通常由数据库自身高负载（CPU、IO）、慢查询或连接数耗尽导致。`,
        output: `**推断结论**:
\`\`\`
- **直接原因**: 'payment-service' 和 'coupon-service' 无法从数据库连接池获取连接。
- **根本原因 (高置信度)**: 共享数据库集群 'mysql-prod-cluster-01' 出现性能瓶颈或连接数耗尽。

---

分析完成。正在生成最终报告...
\`\`\``
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
        
        const isAbnormal = prompt.includes('异常');
        const thoughtProcessPreamble = isAbnormal ? thoughtProcessPreambleAbnormal : thoughtProcessPreambleDefault;
        const thoughtProcessSteps = isAbnormal ? thoughtProcessStepsAbnormal : thoughtProcessStepsDefault;

        const assistantMessageTemplate: AssistantMessage = {
            role: 'assistant',
            thoughtProcess: thoughtProcessPreamble,
            steps: [],
            analysisContext: {
                dataSources: connectedSources,
                resultType: isAbnormal ? 'abnormal' : 'healthy'
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