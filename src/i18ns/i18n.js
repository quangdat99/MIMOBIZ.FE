

import {createI18n} from 'vue-i18n';
import i18nData from './i18nData.js';

const i18n = createI18n({
    locale: 'vi',
    messages: i18nData,
});

export default i18n;