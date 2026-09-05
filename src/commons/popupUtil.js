import { $vfm } from "@/lib/vueFinalModal"
class PopupUtil {
  _component = {};
  _visible = {};
  show(name, params) {
    if (!name) throw 'name is required';
    let ps = params || {};
    ps.name = name;
    const popup = $vfm.show({ component: name }, ps);
    console.log(`Popup name: ${name}`);
    return popup;
  }

  hideAll() {
    $vfm.hideAll();
  }

  hide(name) {
    if (!name) throw 'name is required';
    const popup = $vfm.hide(name);
    return popup;
  }
}

export default new PopupUtil();