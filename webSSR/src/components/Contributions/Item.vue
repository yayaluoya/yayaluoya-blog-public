<script lang="ts">
import { ref, reactive, computed } from "vue";
import { getContributionIntensityColor } from "./getContributionIntensityColor";

export default {
  components: {},
  props: {
    time: {
      type: String,
      default: "",
    },
    cb_list: {
      type: Array,
      default: [],
    },
  },
  setup(props, ctx) {
    const elRef = ref<HTMLDivElement>();
    const loading = ref(false);
    const com = ref(false);
    const dList = ref<EN.IContributionsE[]>([]);

    return {
      getContributionIntensityColor,
      elRef,
      loading,
      com,
      dList,
    };
  },
};
</script>

<template>
  <i
    ref="elRef"
    class="cbItem"
    :class="{
      cb: cb_list.length > 0,
    }"
    :style="{
      'background-color': getContributionIntensityColor(cb_list.length),
    }"
  >
    <el-popover
      v-if="cb_list.length > 0"
      placement="top"
      :width="200"
      trigger="hover"
    >
      <div class="alert">
        <span class="title"> {{ time }}有{{ cb_list.length }}次贡献 </span>
      </div>
      <template #reference>
        <div class="content"></div>
      </template>
    </el-popover>
  </i>
</template>

<style scoped lang="scss">
.cbItem {
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  &.cb {
    cursor: pointer;
  }
  .alert {
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
