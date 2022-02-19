import { Logger } from '@rxpm/logger';
import { ENABLE_DEBUG_LOGS } from './env.js';

export default new Logger('iamone', {
   enable: ENABLE_DEBUG_LOGS
});
