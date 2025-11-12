// Fix: Moved Page type here from App.tsx to resolve a circular dependency and import conflict.
export type Page = 'welcome' | 'datasource' | 'inspection' | 'skills';

export type DataSourceId = 'sls' | 'elasticsearch';

export type DataSource = {
  id: DataSourceId;
  name: string;
  icon: 'sls' | 'es';
  desc: string;
  features: string[];
  category: 'required' | 'recommended';
};

export type MessageStep = 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'report';

export type UserMessage = {
  role: 'user';
  content: string;
};

export type AssistantMessage = {
  role: 'assistant';
  steps: MessageStep[];
  thoughtProcess?: string;
  analysisContext?: {
    dataSources: DataSourceId[];
  };
};

export type MessageType = UserMessage | AssistantMessage;