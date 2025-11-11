
import React, { useState, useEffect, useRef } from 'react';
// FIX: Import GoogleGenAI and Type for API calls
import { GoogleGenAI, Type } from "@google/genai";
import { MessageType, AssistantMessage, MessageStep } from '../types';
import EmptyState from './EmptyState';
import Message from './Message';

// FIX: Define local icon components as new files cannot be added
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

const thoughtProcessText = `**巡检时间**: 2024-11-11 14:30:00  
**分析周期**: 过去24小时 (2024-11-10 14:30 ~ 2024-11-11 14:30)  
**巡检目标**: \`/api/payment/submit\` 缴费提交接口

---

## 一、分析过程

### 思考过程

**目标**: 巡检网上国网APP的核心缴费业务接口健康状态

**分析策略**:
1. 首先连接数据源，获取缴费接口的访问日志
2. 提取关键指标：成功率、响应时间、错误码分布
3. 学习历史基线，识别"什么是正常"
4. 对比当前数据与历史基线，检测异常
5. 深入分析错误分布，寻找根因线索
6. 生成结构化报告并给出操作建议

**数据完整度评估**:
- ✅ 已接入: 应用层访问日志 (access.log)
- ❌ 未接入: 分布式追踪数据
- ❌ 未接入: 数据库监控
- ❌ 未接入: 下游依赖服务监控

**分析能力预期**: 基于单一数据源，可以发现问题表象，但无法精确定位根因。

---

## 二、Skills 调用过程

### Step 1: 连接阿里云 SLS 数据源

**Skill**: \`sls_connector\`

**调用参数**:
\`\`\`yaml
endpoint: cn-beijing.log.aliyuncs.com
project: sgcc-production-logs
logstore: app-access-log
auth_method: access_key
\`\`\`

**执行结果**:
\`\`\`
✓ 连接成功
✓ 凭证验证通过
✓ Logstore 可访问
最新日志时间: 2024-11-11 14:29:45
\`\`\`

---

### Step 2: 构建查询语句并提取关键指标

**Skill**: \`sls_query_builder\`

**调用参数**:
\`\`\`yaml
target_metric: 
  - success_rate
  - response_time_p99
  - error_distribution
time_range:
  start: 2024-11-10 14:30:00
  end: 2024-11-11 14:30:00
filters:
  - field: request_path
    operator: equals
    value: /api/payment/submit
\`\`\`

**生成的 SLS 查询语句**:
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
      APPROX_PERCENTILE(response_time, 0.99) as p99_latency,
      COUNT_IF(http_status = 500) as error_500,
      COUNT_IF(http_status = 504) as error_504,
      COUNT_IF(http_status = 400) as error_400
  | GROUP BY time_bucket
  | ORDER BY time_bucket
\`\`\`

**查询执行结果**:

📊 **数据源**: 阿里云 SLS - \`sgcc-production-logs/app-access-log\`  
📊 **查询时间**: 2024-11-11 14:30:15  
📊 **扫描日志**: 2,847,392 条  
📊 **处理时间**: 3.2 秒

**关键时段数据** (仅展示部分):

| 时间段 | 总请求数 | 成功率 | P99延迟 | 500错误 | 504错误 |
|--------|---------|--------|---------|---------|---------|
| 2024-11-11 08:00 | 98,234 | 99.6% | 245ms | 28 | 12 |
| 2024-11-11 09:00 | 112,456 | 99.5% | 258ms | 34 | 18 |
| 2024-11-11 10:00 | 125,678 | **97.2%** | **892ms** | **2,456** | **1,067** |
| 2024-11-11 11:00 | 134,892 | **96.8%** | **1,024ms** | **2,987** | **1,345** |
| 2024-11-11 12:00 | 129,345 | **97.1%** | **856ms** | **2,234** | **989** |
| 2024-11-11 13:00 | 118,567 | 99.4% | 267ms | 45 | 23 |
| 2024-11-11 14:00 | 102,890 | 99.5% | 252ms | 32 | 19 |

**数据来源标注**: 
- 来源: \`阿里云 SLS\`
- Project: \`sgcc-production-logs\`
- Logstore: \`app-access-log\`
- 查询ID: \`query-20241111-143015-a7f3b2\`

---

### Step 3: 学习历史基线

**Skill**: \`baseline_learning\`

**调用参数**:
\`\`\`yaml
algorithm: time_series_baseline
training_window: 7_days
time_matching: weekday_hour_match
confidence_interval: 0.95
\`\`\`

**历史数据查询语句**:
\`\`\`sql
* | WHERE request_path = '/api/payment/submit'
    AND __time__ >= from_unixtime(1730620200)  -- 7天前
    AND __time__ < from_unixtime(1731225000)
    AND date_format(__time__, '%H') BETWEEN '10' AND '12'
    AND dayofweek(__time__) BETWEEN 2 AND 6  -- 工作日
  | SELECT 
      date_format(__time__, '%Y-%m-%d %H:00') as time_bucket,
      ROUND(COUNT_IF(http_status < 500) * 100.0 / COUNT(*), 2) as success_rate,
      APPROX_PERCENTILE(response_time, 0.99) as p99_latency
  | GROUP BY time_bucket
  | ORDER BY time_bucket
\`\`\`

**历史基线数据** (工作日 10:00-12:00 时段):

| 日期 | 时段 | 成功率 | P99延迟 |
|------|------|--------|---------|
| 2024-11-04 | 10:00-12:00 | 99.4% | 268ms |
| 2024-11-05 | 10:00-12:00 | 99.6% | 255ms |
| 2024-11-06 | 10:00-12:00 | 99.5% | 262ms |
| 2024-11-07 | 10:00-12:00 | 99.7% | 249ms |
| 2024-11-08 | 10:00-12:00 | 99.5% | 271ms |

**数据来源标注**:
- 来源: \`阿里云 SLS\`
- 训练数据: 2024-11-04 ~ 2024-11-10 (7天)
- 样本数量: 35 个时段数据点
- 查询ID: \`query-20241111-143018-b8e4c3\`

**基线计算过程**:

\`\`\`
成功率基线计算:
历史样本: [99.4%, 99.6%, 99.5%, 99.7%, 99.5%, 99.4%, 99.6%]
均值 μ = (99.4 + 99.6 + 99.5 + 99.7 + 99.5 + 99.4 + 99.6) / 7 = 99.53%
标准差 σ = √[Σ(xi - μ)² / n] = 0.11%
正常范围 (95%置信区间) = μ ± 1.96σ = [99.31%, 99.75%]

P99延迟基线计算:
历史样本: [268ms, 255ms, 262ms, 249ms, 271ms, 264ms, 258ms]
均值 μ = 261ms
标准差 σ = 7.2ms
正常范围 (95%置信区间) = μ ± 1.96σ = [247ms, 275ms]
\`\`\`

**基线学习结果**:
- 成功率正常范围: **99.31% ~ 99.75%**
- P99延迟正常范围: **247ms ~ 275ms**

**数据来源标注**:
- 算法: 时序分析 + 统计基线
- 置信度: 95%
- 计算方法: 均值 ± 1.96 * 标准差

---

### Step 4: 异常检测与置信度评估

**Skill**: \`anomaly_detector\`

**调用参数**:
\`\`\`yaml
current_data:
  success_rate: 97.0%
  p99_latency: 924ms
baseline:
  success_rate_range: [99.31%, 99.75%]
  p99_latency_range: [247ms, 275ms]
detection_method: statistical_significance
\`\`\`

**异常检测计算**:

\`\`\`
成功率异常评分:
当前值: 97.0%
基线均值: 99.53%
基线标准差: 0.11%
Z-Score = (99.53 - 97.0) / 0.11 = 23.0σ
→ 远超 3σ 阈值，属于极端异常
→ 统计显著性: p < 0.001 (极显著)

P99延迟异常评分:
当前值: 924ms
基线均值: 261ms
基线标准差: 7.2ms
Z-Score = (924 - 261) / 7.2 = 92.1σ
→ 远超 3σ 阈值，属于极端异常
→ 统计显著性: p < 0.001 (极显著)
\`\`\`

**异常判定结果**:
- ⚠️ **成功率异常**: 当前 97.0% 远低于正常范围 [99.31%, 99.75%]
- ⚠️ **延迟异常**: 当前 924ms 远高于正常范围 [247ms, 275ms]
- 📊 **置信度**: 99.9% (高度确定的异常)
- 🔴 **严重等级**: P0 Critical

**数据来源标注**:
- 检测方法: Z-Score 统计检验
- 显著性水平: α = 0.05
- 异常阈值: 3σ

---

### Step 5: 深度错误分析

**Skill**: \`error_analyzer\`

**调用参数**:
\`\`\`yaml
time_range: [10:00, 12:00]
analysis_type: error_distribution
\`\`\`

**错误分布查询语句**:
\`\`\`sql
* | WHERE request_path = '/api/payment/submit'
    AND __time__ >= from_unixtime(1731294000)  -- 10:00
    AND __time__ < from_unixtime(1731301200)   -- 12:00
    AND http_status >= 400
  | SELECT 
      http_status,
      COUNT(*) as error_count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
      APPROX_DISTINCT(user_id) as affected_users
  | GROUP BY http_status
  | ORDER BY error_count DESC
\`\`\`

**错误分布详情**:

| 错误码 | 错误数量 | 占比 | 影响用户数 | 错误含义 |
|--------|---------|------|-----------|----------|
| 500 | 7,677 | 65.2% | 6,234 | 服务器内部错误 |
| 504 | 3,401 | 28.9% | 2,876 | 网关超时 |
| 503 | 445 | 3.8% | 398 | 服务不可用 |
| 400 | 254 | 2.1% | 231 | 请求参数错误 |

**数据来源标注**:
- 来源: \`阿里云 SLS\`
- 时间段: 2024-11-11 10:00 ~ 12:00
- 总错误数: 11,777 次
- 查询ID: \`query-20241111-143022-c9f5d4\`

**错误时间分布**:
\`\`\`sql
* | WHERE request_path = '/api/payment/submit'
    AND __time__ >= from_unixtime(1731294000)
    AND __time__ < from_unixtime(1731301200)
    AND http_status >= 500
  | SELECT 
      date_format(__time__, '%H:%i') as time_5min,
      COUNT(*) as error_count
  | GROUP BY time_5min
  | ORDER BY time_5min
\`\`\`

| 时间 | 错误数/5分钟 |
|------|-------------|
| 10:00 | 89 |
| 10:05 | 234 |
| 10:10 | **1,456** |
| 10:15 | **2,123** |
| 10:20 | **1,987** |
| 10:25 | **1,765** |
| ... | ... |
| 11:50 | 267 |
| 11:55 | 123 |

**数据来源标注**:
- 来源: \`阿里云 SLS\`
- 粒度: 5分钟
- 查询ID: \`query-20241111-143025-d1a6e5\`

---

### Step 6: 根因线索推理

**Skill**: \`root_cause_reasoner\`

**推理过程**:

**证据1**: 500错误占主导地位 (65.2%)
- 来源: [错误分布查询结果]
- 含义: 指向应用层处理异常，而非网络或客户端问题

**证据2**: 504超时占比较高 (28.9%)
- 来源: [错误分布查询结果]
- 含义: 部分请求在等待响应时超时，暗示后端处理缓慢

**证据3**: P99延迟从正常的261ms激增至924ms
- 来源: [当前数据查询] vs [历史基线]
- 含义: 后端处理性能严重劣化

**证据4**: 错误在10:10开始激增，10:15达到峰值
- 来源: [错误时间分布]
- 含义: 问题有明确的起始时间点，可能与某个触发事件相关

**推理链**:

\`\`\`
500错误(65.2%) + 504超时(28.9%) 
→ 后端处理异常且响应缓慢

P99延迟 924ms (正常261ms, 增长254%)
→ 后端处理性能严重劣化

错误集中在10:10-11:30时段
→ 问题有明确的时间窗口

综合推断:
→ 可能是缴费接口依赖的某个下游服务(如支付网关、账户服务、电费计算服务)
  在10:10左右出现性能问题或故障
→ 导致缴费接口调用超时或返回错误
\`\`\`

**当前分析限制** ⚠️:

由于仅接入应用层日志，当前无法确定:
- ❌ 具体是哪个下游服务出现问题
- ❌ 是数据库慢查询还是外部API响应慢
- ❌ 是否存在资源(CPU/内存/连接池)瓶颈
- ❌ 具体的错误堆栈和异常信息

**建议接入的数据源**:
1. 分布式追踪 (OpenTelemetry/SkyWalking) → 可精确定位慢在哪个环节
2. 应用日志 (application.log) → 可查看详细错误堆栈
3. MySQL/Redis 监控 → 可排查数据库性能问题
4. 下游服务监控 → 可确认支付网关等服务状态`;

const InspectionView: React.FC<{
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    isAnalyzing: boolean;
    setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ messages, setMessages, isAnalyzing, setIsAnalyzing }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAnalyzing]);

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim() || isAnalyzing) return;

        const newUserMessage: MessageType = { role: 'user', content: prompt };
        setInputValue('');

        const assistantMessageTemplate: AssistantMessage = {
            role: 'assistant',
            thoughtProcess: thoughtProcessText,
            steps: [],
        };

        setMessages(prev => [...prev, newUserMessage, assistantMessageTemplate]);
        setIsAnalyzing(true);

        try {
            const allSteps: MessageStep[] = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'report'];
            
            for (let i = 0; i < allSteps.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 600)); // Delay for each step
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                       const updatedMessage = { ...lastMessage, steps: allSteps.slice(0, i + 1) };
                       newMessages[newMessages.length - 1] = updatedMessage;
                    }
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error during analysis:", error);
            setMessages(prev => {
                 const newMessages = [...prev];
                 const lastMessage = newMessages[newMessages.length-1];
                 if(lastMessage.role === 'assistant') {
                    lastMessage.steps = ['report']; // Use report to show error
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