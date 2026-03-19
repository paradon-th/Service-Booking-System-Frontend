export const ServiceFunction = {
  Tag: 1,
  TagGroup: 2,
  Data: 3,
  Interface: 4,
  IntegrationProvider: 6,
  SecurityUser: 7,
  LogSecurity: 8,
  DataRelation: 10,
  Scheduler: 11,
  Overview: 12,
  InterfaceMapping: 14,
  IntegrationPublisher: 15,
  LogApplication: 16,
  LogSystem: 17,
  LogError: 18,
  SecurityGroup: 19,
  SecurityRole: 20,
  SecurityToken: 21,
  Event: 22
} as const;

export type ServiceFunctionKey = keyof typeof ServiceFunction;
export type ServiceFunctionId = (typeof ServiceFunction)[ServiceFunctionKey];
