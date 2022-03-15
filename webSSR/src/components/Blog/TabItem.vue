<script lang="ts">
import { ref, reactive, toRef, computed } from "vue";
import { lighten } from "@/utils/color";
import { CloseBold } from "@element-plus/icons-vue";
import Dialog from ">/Dialog/Dialog.vue";
import { PageTool } from "@/router/PageTool";
interface IProps {
  data?: EN.IBlogTabE;
}
export default {
  components: { CloseBold, Dialog },
  props: ["data", "edit"],
  emits: ["editClick", "removeClick"],
  setup(props, ctx) {
    const data_ = toRef<IProps, keyof IProps>(props, "data");
    const lightColor = computed(() => {
      return lighten(data_.value!.color, 80);
    });

    /** 点击 */
    function click() {
      if (props.edit) {
        ctx.emit("editClick", data_.value?.id);
        return;
      }
      //去博客页面
      PageTool.toBlogPage(data_.value?.name);
    }

    /** 删除点击 */
    function remove() {
      ctx.emit("removeClick", data_.value?.id);
    }

    return {
      lightColor,
      click,
      remove,
    };
  },
};
</script>

<template>
  <div
    class="tabItem"
    :style="{
      backgroundColor: data.color,
    }"
    @click="click"
  >
    <el-icon v-if="edit" @click.stop="remove"><CloseBold /></el-icon>
    <span>{{ data.name }}</span>
  </div>
</template>

<style scoped lang="scss">
.tabItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 12px;
  padding: 5px 7px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  position: relative;
  > .el-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 14px;
    line-height: 14px;
    background-color: white;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    color: #ef3f61;
  }
}
</style>
