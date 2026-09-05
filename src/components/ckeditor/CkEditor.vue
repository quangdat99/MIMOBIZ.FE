<template>
  <textarea id="editor1" name="editor1"></textarea>
</template>

<script>
import { emit } from "process";
import { ref, onMounted } from "vue";
export default {
  name: "CkEditor",
  props: ["content"],
  setup(props) {
    const context = ref(props.content);
    let ckEditor;
    onMounted(() => {
      ckEditor = window.ckEditor.replace("editor1");

      ckEditor.setData(context.value);

      ckEditor.on("change", () => {
        emit("sendContent", ckEditor.getData());
      });
    });
  },
};
</script>