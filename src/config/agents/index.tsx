import { YEAR1_ROLES } from './year1';
import { YEAR2_ROLES } from './year2';
import { YEAR3_ROLES } from './year3';

export { SYSTEM_INSTRUCTION_SUFFIX } from './shared';
export type { AgentRole, EducationLevel } from './shared';

export const ROLES = [...YEAR1_ROLES, ...YEAR2_ROLES, ...YEAR3_ROLES];
