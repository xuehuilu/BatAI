import React from 'react';
import { MessageType, MessageStep } from '../types';
import { BatIcon } from './icons/BatIcon';
import TypewriterMarkdown from './TypewriterMarkdown';

// Local Icon Definitions
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const DocumentTextIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-5 h-5"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


interface MessageProps {
    message: MessageType;
}

const stepContent: Record<MessageStep, { icon: React.ReactNode; title: string; description: string }> = {
    step1: {
        icon: <CheckCircleIcon className="w-5 h-5 text-blue-500" />,
        title: 'Step 1: 连接阿里云 SLS 数据源',
        description: '调用 `sls_connector` Skill，验证凭证并建立数据连接。',
    },
    step2: {
        icon: <CheckCircleIcon className="w-5 h-5 text-blue-500" />,
        title: 'Step 2: 构建查询并提取指标',
        description: '调用 `sls_query_builder` Skill，生成SLS查询并获取数据。',
    },
    step3: {
        icon: <CheckCircleIcon className="w-5 h-5 text-indigo-500" />,
        title: 'Step 3: 学习历史基线',
        description: '调用 `baseline_learning` Skill，分析历史数据建立正常范围。',
    },
    step4: {
        icon: <CheckCircleIcon className="w-5 h-5 text-orange-500" />,
        title: 'Step 4: 异常检测与评估',
        description: '调用 `anomaly_detector` Skill，对比当前值与基线，判定异常。',
    },
    step5: {
        icon: <CheckCircleIcon className="w-5 h-5 text-red-500" />,
        title: 'Step 5: 深度错误分析',
        description: '调用 `error_analyzer` Skill，下钻分析错误分布与时间模式。',
    },
    step6: {
        icon: <CheckCircleIcon className="w-5 h-5 text-purple-500" />,
        title: 'Step 6: 根因线索推理',
        description: '调用 `root_cause_reasoner` Skill，综合证据形成结论。',
    },
    report: {
        icon: <DocumentTextIcon className="w-5 h-5 text-green-500" />,
        title: '生成巡检报告',
        description: '已生成本次巡检的详细分析报告。',
    },
};

const reportMarkdown = `## 三、巡检报告总结

### 3.1 核心发现

**⚠️ 严重异常：网上国网APP缴费接口在 2024-11-11 10:00-12:00 期间出现严重故障**

- **成功率骤降**: 从正常的 99.53% 降至 97.0%，下降 2.53 个百分点
  - 数据来源: [当前数据查询 vs 历史基线计算]
  - 偏离度: 23.0 个标准差 (极显著异常)

- **响应延迟激增**: P99延迟从 261ms 激增至 924ms，增长 254%
  - 数据来源: [当前数据查询 vs 历史基线计算]
  - 偏离度: 92.1 个标准差 (极显著异常)

- **大量用户受影响**: 2小时内约 9,508 名用户缴费失败
  - 数据来源: [错误分布查询 - affected_users 字段]
  - 影响范围: 约占该时段总用户数的 2.4%

### 3.2 关键指标对比

| 指标 | 正常基线 | 当前值 | 偏差 | 数据来源 |
|------|---------|--------|------|----------|
| 成功率 | 99.31%~99.75% | 97.0% | -2.53% | SLS查询 query-20241111-143015 vs 基线计算 |
| P99延迟 | 247ms~275ms | 924ms | +663ms | SLS查询 query-20241111-143015 vs 基线计算 |
| 总请求数 | ~389,915 | 389,915 | - | SLS查询 query-20241111-143015 |
| 失败请求 | ~1,948 | 11,777 | +9,829 | SLS查询 query-20241111-143015 |
| 500错误 | ~145 | 7,677 | +7,532 | SLS查询 query-20241111-143022 |
| 504超时 | ~62 | 3,401 | +3,339 | SLS查询 query-20241111-143022 |

### 3.3 业务影响评估

**用户影响**:
- 受影响用户数: **约 9,508 人** 无法完成缴费
  - 数据来源: [错误分布查询 - 500和504错误的 affected_users 之和]
- 影响时长: **约 2 小时** (10:00-12:00)
  - 数据来源: [错误时间分布查询]
- 用户体验: 部分用户遭遇支付超时，部分收到错误提示

**潜在财务影响**:
- 假设平均缴费金额 200元/笔
  - 假设来源: 业界电费缴费平均值估算
- 延迟收入: 11,777 笔 × 200元 = **约 235万元**
  - 注意: 这是延迟收入而非损失，用户可能稍后重试

**品牌影响**:
- 高峰时段故障影响用户信任度
- 可能增加客服咨询量

### 3.4 错误特征分析

**错误类型分布**:

\`\`\`
服务器错误 (5xx): 95.9%
├─ 500 内部错误: 65.2% (7,677次)
├─ 504 网关超时: 28.9% (3,401次)
└─ 503 服务不可用: 3.8% (445次)

客户端错误 (4xx): 4.1%
└─ 400 参数错误: 2.1% (254次)
\`\`\`
- 数据来源: [错误分布查询 query-20241111-143022]

**错误时间模式**:
- 故障起始: 10:10 左右错误数开始上升
  - 数据来源: [错误时间分布查询 query-20241111-143025]
- 峰值时段: 10:15-10:30
- 恢复时间: 12:00 后恢复正常
- 持续时长: 约 2 小时

### 3.5 根因分析

**高置信度推断**:

1. **后端服务性能问题** (置信度: 95%)
   - 证据: 500错误占65.2% + P99延迟增长254%
   - 数据来源: [错误分布查询] + [当前数据查询]

2. **下游服务响应超时** (置信度: 85%)
   - 证据: 504超时占28.9% + 延迟激增
   - 数据来源: [错误分布查询] + [当前数据查询]

3. **可能涉及的下游服务** (推测):
   - 支付网关接口
   - 账户查询服务
   - 电费计算服务
   - 注意: 因缺少调用链数据，无法确定具体服务

**当前分析局限** ⚠️:

基于现有数据(仅应用层日志)，我们能够:
- ✅ 确认问题的存在和严重程度
- ✅ 确定问题发生的时间范围
- ✅ 分析错误的类型和分布

但无法回答:
- ❌ 具体是哪个下游服务导致的问题
- ❌ 是数据库、缓存还是外部API的问题
- ❌ 具体的错误原因和堆栈信息

**数据来源标注**: 本节推断基于 [错误分布查询] 和 [异常检测计算] 的综合分析

### 3.6 操作建议

**立即行动 (P0 - 紧急)**:

1. **回溯分析应用日志**
   - 时间范围: 2024-11-11 10:00-12:00
   - 关键字: "PaymentException", "Timeout", "500"
   - 目的: 查找详细错误堆栈和异常信息

2. **检查下游服务健康状态**
   - 人工排查: 支付网关、账户服务、电费计算服务
   - 检查项: 响应时间、错误率、资源使用率
   - 时间范围: 聚焦 10:10-12:00 时段

3. **核实是否有变更部署**
   - 检查 10:00 前后是否有代码发布、配置变更
   - 如有变更，评估回滚可能性

**短期改进 (P1 - 1周内)**:

1. **接入分布式追踪系统**
   - 工具: OpenTelemetry / SkyWalking / Zipkin
   - 目的: 下次能够自动定位慢在哪个环节
   - 预期提升: 问题定位时间从小时级降至分钟级

2. **完善应用日志**
   - 确保缴费接口记录详细的错误堆栈
   - 记录关键调用链耗时(账户查询耗时、支付调用耗时等)

3. **建立实时告警**
   - 告警条件: 成功率 < 99.0% 或 P99延迟 > 500ms
   - 告警渠道: 钉钉/企业微信/PagerDuty

**长期优化 (P2 - 1个月内)**:

1. **完善监控体系**
   - 接入数据库慢查询日志
   - 接入Redis性能监控
   - 接入基础设施监控(CPU/内存/网络)

2. **建立性能基线库**
   - 为所有核心接口建立动态基线
   - 支持按时段、按节假日的差异化基线

3. **开发降级预案**
   - 设计缴费接口的降级方案
   - 当检测到异常时自动触发限流/熔断

---

## 四、附录

### 4.1 数据来源汇总

本报告所有数据均来自以下可验证的数据源:

| 数据项 | 数据源 | 查询ID | 时间戳 |
|--------|--------|--------|--------|
| 当前指标数据 | 阿里云SLS - sgcc-production-logs/app-access-log | query-20241111-143015-a7f3b2 | 2024-11-11 14:30:15 |
| 历史基线数据 | 阿里云SLS - sgcc-production-logs/app-access-log | query-20241111-143018-b8e4c3 | 2024-11-11 14:30:18 |
| 错误分布数据 | 阿里云SLS - sgcc-production-logs/app-access-log | query-20241111-143022-c9f5d4 | 2024-11-11 14:30:22 |
| 错误时间分布 | 阿里云SLS - sgcc-production-logs/app-access-log | query-20241111-143025-d1a6e5 | 2024-11-11 14:30:25 |

### 4.2 置信度说明

**异常检测置信度: 99.9%**
- 基于统计学Z-Score检验
- 成功率偏离基线 23.0 个标准差
- P99延迟偏离基线 92.1 个标准差
- 统计显著性: p < 0.001

**根因推断置信度: 中 (无法精确定位)**
- 基于错误特征和延迟模式的推断
- 受限于数据完整度(仅应用日志)
- 需要更多数据源验证假设

### 4.3 查询语句归档

所有SLS查询语句已归档至:
- 路径: \`/analysis/queries/20241111/\`
- 文件: \`payment_inspection_queries.sql\`
- 可用于复现分析或审计
`;

const AnalysisReport: React.FC = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <TypewriterMarkdown content={reportMarkdown} />
    </div>
);


const Message: React.FC<MessageProps> = ({ message }) => {
    if (message.role === 'user') {
        return (
            <div className="flex items-start gap-4 justify-end fade-in">
                <div className="bg-[#667eea] text-white rounded-xl p-4 max-w-lg">
                    <p>{message.content}</p>
                </div>
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
            </div>
        );
    }

    const showReport = message.steps.includes('report');

    return (
        <div className="flex items-start gap-4 fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
                <BatIcon className="w-5 h-5 text-white" />
            </div>
            <div className="w-full max-w-2xl space-y-4">
                {message.thoughtProcess && (
                    <details className="border border-gray-200 rounded-xl overflow-hidden bg-white" open={!showReport}>
                        <summary className="px-4 py-3 bg-gray-50 cursor-pointer font-semibold text-sm text-gray-700 flex justify-between items-center hover:bg-gray-100 list-none group">
                            <span>Thought Process</span>
                            <ChevronDownIcon className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform"/>
                        </summary>
                        <div className="p-4 border-t border-gray-200 text-sm text-gray-700">
                           <TypewriterMarkdown content={message.thoughtProcess} />
                        </div>
                    </details>
                )}

                {showReport && <AnalysisReport />}
            </div>
        </div>
    );
};

export default Message;
