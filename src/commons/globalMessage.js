import { openDialog } from 'vue3-promise-dialog';
import MsMessageBox from '@/components/messageBox/MsMessageBox.vue';

function getMsgOption(type, message, title, width, textBtn) {
  if (message && typeof message === 'object' && message.message) {
    return { ...message, ...{ type } };
  } else {
    return {
      type,
      message: message,
      title: title,
      width,
      textBtn,
    };
  }
}
function getMsgOptionCustom(type, message, title, customButton, width, customLabelCheckbox) {
  if (message && typeof message === 'object' && message.message) {
    return { ...message, ...{ type } };
  } else {
    return {
      type,
      message: message,
      title: title,
      customButton,
      width,
      customLabelCheckbox,
    };
  }
}

export function showAlert(message, title, width) {
  return openDialog(MsMessageBox, getMsgOption(0, message, title, width));
}

export function showInfo(message, title, width, textBtn) {
  return openDialog(MsMessageBox, getMsgOption(0, message, title, width, textBtn));
}

export function showSuccess(message, title, width) {
  return openDialog(MsMessageBox, getMsgOption(0, message, title, width));
}

export function showError(message, title, width, textBtn, type = 0) {
  return openDialog(MsMessageBox, getMsgOption(type, message, title, width, textBtn));
}

export function showConfirm(message, title, width, textBtn) {
  return openDialog(MsMessageBox, getMsgOption(1, message, title, width, textBtn));
}
export function showConfirmCancel(message, title, width) {
  return openDialog(MsMessageBox, getMsgOption(2, message, title, width));
}

export function showConfirmDelete(message, title, width) {
  return openDialog(MsMessageBox, getMsgOption(3, message, title, width));
}

export function showErrorCustom(message, title, type, width) {
  return openDialog(MsMessageBox, getMsgOption(type, message, title, width));
}

