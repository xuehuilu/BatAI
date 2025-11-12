import React from 'react';
import { MessageType, MessageStep, AssistantMessage } from '../types';
import { BatIcon } from './icons/BatIcon';
import TypewriterMarkdown from './TypewriterMarkdown';

// Local Icon Definitions
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

// --- Report Content ---

const reportMarkdownDefault = `## 三、巡检报告总结

### 3.1 整体健康评估

**🎉 综合评分**: ⭐⭐⭐⭐⭐ 优秀 (5.0/5.0)

缴费提交接口运行状态健康，各项指标均在正常范围内。

**核心指标表现**:

| 指标 | 当前值 | 基线范围 | 状态 |
|------|--------|---------|------|
| 可用性 | 99.6% | 99.3%-99.8% | ✅ 优秀 |
| 性能 (P99) | 242ms | 225ms-255ms | ✅ 良好 |
| 日请求量 | 458,234 | 440K-470K | ✅ 正常 |
| 错误率 | 0.4% | 0.2%-0.7% | ✅ 正常 |
| 稳定性 | 7天波动<3% | - | ✅ 稳定 |

**数据来源**: 
- 当前值: [24小时数据查询 query-20241111-143018]
- 基线范围: [7天历史基线 baseline-20241111-143022]

---

### 3.2 业务运行特征

**流量模式** (符合预期的用户行为):

\`\`\`
日均缴费请求: 458,234 次
├─ 峰值时段: 12:00-13:00 (31,234 次/小时)
│   → 午休时间，用户主动缴费高峰
│
├─ 上午高峰: 09:00-12:00 (平均 23,456 次/小时)
│   → 办公时间，稳定缴费流量
│
├─ 晚间高峰: 19:00-22:00 (平均 28,567 次/小时)
│   → 下班后处理个人事务
│
└─ 夜间低谷: 00:00-06:00 (平均 2,345 次/小时)
    → 少量用户使用
\`\`\`

**用户体验评估**:

\`\`\`
响应速度: ✓ 优秀
├─ P50 (50%用户): 89ms  → 体感"秒开"
├─ P95 (95%用户): 167ms → 体感"很快"
└─ P99 (99%用户): 242ms → 体感"流畅"

成功率: ✓ 优秀
└─ 99.6% 成功率意味着: 1000次缴费仅4次需要重试
\`\`\`

**数据来源**: [24小时性能统计]

---

### 3.3 已建立的基线模型

本次巡检已成功为缴费接口建立了行为基线，后续巡检将基于此基线进行异常检测。

**基线模型的价值**:

1. **智能告警**: 不再依赖固定阈值，自动适应业务变化
2. **精准检测**: 能识别"不符合历史模式"的异常，即使数值看起来正常
3. **减少噪音**: 峰值时段的"高负载"不会误报，因为这是正常模式
4. **持续学习**: 基线会随着业务变化而自动调整

---

### 3.4 当前无需处理的问题

✅ **未发现需要立即处理的问题**

所有指标均在健康范围内，系统运行稳定。

**微小波动说明** (属于正常范围):
- **偶发的500错误** (0.027%): 远低于1%的业界标准，无需处理。
- **P99延迟242ms略高于均值240ms**: 在基线范围内的正常波动，无性能问题。

## 四、附录

### 4.1 数据来源汇总

| 数据类型 | 数据源 | 查询ID |
|---------|--------|--------|
| 24小时访问数据 | 阿里云SLS - nginx-access-log | query-20241111-143018-f8a3b5 |
| 7天历史基线 | 阿里云SLS - nginx-access-log | baseline-20241111-143022-g9b4c6 |
| 错误分布分析 | 阿里云SLS - nginx-access-log | error-20241111-143025 |

### 4.2 巡检配置
\`\`\`yaml
巡检配置:
  目标接口: /api/payment/submit
  数据源: nginx_access_log
  分析周期: 24h
  基线窗口: 7d
  置信度: 95%
\`\`\`
---
`;

const reportMarkdownAbnormal = `## 三、巡检报告总结

### 3.1 整体健康评估

**🚨 综合评分**: ⭐☆☆☆☆ 严重告警 (1.2/5.0)

缴费提交接口出现严重故障，服务可用性大幅下降，用户体验受到严重影响。

**核心指标表现**:

| 指标 | 当前值 | 基线范围 | 状态 |
|------|--------|---------|------|
| 可用性 | 92.1% | 99.3%-99.8% | ❌ 严重 |
| 性能 (P99) | 857ms | 225ms-255ms | ❌ 严重 |
| 500错误数 | 3,812 | < 50 | ❌ 严重 |

**数据来源**: 
- 当前值: [30分钟数据查询 query-20241111-1430-abnormal]
- 基线范围: [7天历史基线 baseline-20241111-143022]

---

### 3.2 根因分析 (有限数据推断)

尽管缺乏完整的链路追踪数据，BatAI 通过对SLS中的访问日志和应用日志进行交叉分析，得出以下推断：

**故障现象**:

\`\`\`
入口API '/api/payment/submit'
├─ 成功率: 92.1% (暴跌 📉)
└─ P99延迟: 857ms (飙升 📈)
\`\`\`

**故障传播链 (推断)**:

\`\`\`
1. **[根本原因] 数据库瓶颈** 🔴
   ├─ 共享数据库集群 'mysql-prod-cluster-01' 疑似出现性能问题或连接数耗尽。
   │
2. **[直接原因] 微服务节点故障** 🔴
   ├─ 'payment-service' (核心服务)
   │  └─ 抛出大量 "java.sql.SQLTransientConnectionException" 错误。
   ├─ 'coupon-service' (依赖服务)
   │  └─ 同样受数据库影响，抛出相同错误。
   │
3. **[最终现象] API网关错误** 🔴
   └─ 'payment-service' 无法正常响应，导致网关向用户返回大量 500 内部服务器错误。
\`\`\`

**核心证据**:
- 在故障时间窗口内，\`payment-service\` 和 \`coupon-service\` 的应用日志中均出现了**超过 3000 次**的数据库连接超时错误。
- \`payment-service\` 内部统计的错误率高达 **15.6%**，P99延迟超过 **2秒**。

---

### 3.3 待办事项和建议

**🔥 立即行动 (P0)**:
1.  **检查数据库监控**: 立即检查 \`mysql-prod-cluster-01\` 的监控指标，重点关注 **CPU使用率、活跃连接数、慢查询数量**。
2.  **联系DBA**: 如果数据库指标异常，请立即通知DBA团队介入。

**后续排查**:
1.  **检查服务连接池**: 检查 \`payment-service\` 和 \`coupon-service\` 的数据库连接池配置（如 \`max-pool-size\`），确认是否配置过低。
2.  **分析慢查询**: 如果DBA发现慢查询，与开发团队一起进行SQL优化。

## 四、附录

### 4.1 数据来源汇总

| 数据类型 | 数据源 | 查询ID |
|---------|--------|--------|
| 30分钟访问数据 | 阿里云SLS - nginx-access-log | query-20241111-1430-abnormal |
| 错误日志聚合 | 阿里云SLS - app-logs-* | error-agg-20241111-1432 |

### 4.2 巡检配置
\`\`\`yaml
巡检配置:
  目标接口: /api/payment/submit
  数据源: [nginx_access_log, app-logs-*]
  分析周期: 30m
  基线窗口: 7d
\`\`\`
---
`;

const AnalysisReport: React.FC<{ context?: AssistantMessage['analysisContext'] }> = ({ context }) => {
    const reportContent = context?.resultType === 'abnormal' 
        ? reportMarkdownAbnormal 
        : reportMarkdownDefault;
    
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-green-600" />
                智能巡检分析报告
            </h3>
            <TypewriterMarkdown content={reportContent} />
        </div>
    );
};


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

                {showReport && <AnalysisReport context={message.analysisContext} />}
            </div>
        </div>
    );
};

export default Message;