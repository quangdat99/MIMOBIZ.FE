import TimeSheetDetail from '@/views/admin/timesheet/popup/TimeSheetDetail.vue';
import CustomerDetail from '@/views/admin/customer/popup/CustomerDetail.vue';
import DossierDetail from '@/views/admin/dossier/popup/DossierDetail.vue';
import ManufacturerDetail from '@/views/admin/manufacturer/popup/ManufacturerDetail.vue';
import BookmarkTypeDetail from '@/views/admin/bookmarkType/popup/BookmarkTypeDetail.vue';
import CheckerDetail from '@/views/admin/checker/popup/CheckerDetail.vue';
import TaiLieuGocDetail from '@/views/admin/taiLieuGoc/popup/TaiLieuGocDetail.vue';
import CalculatorX2Popup from '@/views/admin/calculator/CalculatorX2Popup.vue';

export function register(app) {
  app.component('TimeSheetDetail', TimeSheetDetail);
  app.component('CustomerDetail', CustomerDetail);
  app.component('DossierDetail', DossierDetail);
  app.component('ManufacturerDetail', ManufacturerDetail);
  app.component('BookmarkTypeDetail', BookmarkTypeDetail);
  app.component('CheckerDetail', CheckerDetail);
  app.component('TaiLieuGocDetail', TaiLieuGocDetail);
  app.component('CalculatorX2Popup', CalculatorX2Popup);
}
