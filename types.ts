
export type Page = 'welcome' | 'datasource' | 'inspection';

export type DataSourceId = 'sls' | 'opentelemetry';

export type DataSource = {
  id: DataSourceId;
  name: string;
  icon: 'sls' | 'trace';
  desc: string;
  features: string[];
  category: 'required' | 'recommended';
};

export type MessageStep = 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'report';

export type UserMessage = {
  role: 'user';
  content: string;
};

export type AssistantMessage = {
  role: 'assistant';
  steps: MessageStep[];
};

export type MessageType = UserMessage | AssistantMessage;
