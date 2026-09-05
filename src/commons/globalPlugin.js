import commonFn from '@/commons/commonFunction';
import { MSConstant } from '@/commons/wildcards';

export function pluginInstall(app) {
  app.config.globalProperties.$ms = app.config.globalProperties.$ms || {};
  app.config.globalProperties.$ms.constant = MSConstant;
  app.config.globalProperties.$ms.commonFn = commonFn;
}