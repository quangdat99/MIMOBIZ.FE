import { createApp } from 'vue';
import App from './App.vue';
import router from '@/routers/router.js';
import FloatingVue from 'floating-vue';
// import VTooltip from 'v-tooltip';
import { vfmPlugin } from "@/lib/vueFinalModal";
import store from '@/store/store.js';
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Toaster from '@meforma/vue-toaster';
import BaseDropdown from '@/components/dropdown/BaseDropdown.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import FilterGrid from '@/components/gridView/FilterGrid.vue';
import BaseNumber from '@/components/number/BaseNumber.vue';
import MsNumber from '@/components/number/MsNumber.vue';
import BaseCheckbox from '@/components/checkbox/BaseCheckbox.vue';
import BaseRadio from '@/components/radio/BaseRadio.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import MsButton from '@/components/button/MsButton.vue';
import BaseTextarea from '@/components/textarea/BaseTextarea.vue';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import CKEditor from '@ckeditor/ckeditor5-vue';
import Datepicker from '@vuepic/vue-datepicker';
import MsDatepicker from '@/components/datepicker/MsDatePicker.vue';
import '@vuepic/vue-datepicker/dist/main.css';
import {PromiseDialog} from 'vue3-promise-dialog';

const app = createApp(App);

import { register } from '@/commons/globalPopup.js';

import '@/commons/prototype';
register(app);

import { pluginInstall } from '@/commons/globalPlugin';
pluginInstall(app);

/* Styles */
import "@/assets/scss/main.scss";
import "@/assets/scss/app.scss";
import '@/assets/css/flexbox.css';
import '@/assets/scss/icons.scss';
import '@/assets/scss/control.scss';
import '@/assets/scss/override.scss';
import 'floating-vue/dist/style.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'vue3-easy-data-table/dist/style.css';
/* Khai báo thành phần dùng global */

app.use(store);
app.use(router);
app.use(CKEditor);
// app.use(VTooltip);
app.use(FloatingVue);
// app.use(FloatingVue, {
//   themes: {
//     menu: {
//       delay: {
//         show: 0,
//         hide: 40000,
//       },
//     }
//   }
// })
app.use(PrimeVue);
// app.use(Dropdown);
app.use(ToastService);
app.use(ConfirmationService);
app.use(Toaster, { position: 'top' });
app.use(vfmPlugin);
app.use(PromiseDialog);

app.component('Dialog', Dialog);
app.component('BaseDropdown', BaseDropdown);
app.component('Dropdown', Dropdown);
app.component('BaseInput', BaseInput);
app.component('FilterGrid', FilterGrid);
app.component('BaseNumber', BaseNumber);
app.component('MsDatepicker', MsDatepicker);
app.component('MsNumber', MsNumber);
app.component('BaseCheckbox', BaseCheckbox);
app.component('BaseRadio', BaseRadio);
app.component('BaseButton', BaseButton);
app.component('MsButton', MsButton);
app.component('BaseTextarea', BaseTextarea);
app.component('EasyDataTable', Vue3EasyDataTable);
app.component('Datepicker', Datepicker);

app.mixin({
  mounted() {
    const me = this;
    if (me.$el && !me.$el.getVueInstance) {
      me.$el.getVueInstance = () => {
        return this;
      }
    }
  },
})
app.mount('#app');

