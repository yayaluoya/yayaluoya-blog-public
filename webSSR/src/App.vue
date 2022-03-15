<script lang="ts">
import { ref, reactive, computed } from "vue";
import { cssValue } from "@/const/cssValue";
export default {
  components: {},
  setup() {
    const cssValue_ = computed(() => {
      return Object.keys(cssValue).reduce((a: any, b: string) => {
        a[b] = (cssValue as any)[b].tem.replace(
          "$",
          (cssValue as any)[b].value
        );
        return a;
      }, {});
    });

    return {
      cssValue_,
    };
  },
};
</script>

<template>
  <div class="root">
    <router-view v-slot="{ Component }">
      <!-- 注意：这里加缓存有些不好形容的问题，跟vue-router的工作原理有关系 -->
      <!-- <keep-alive> -->
      <component :is="Component" />
      <!-- </keep-alive> -->
    </router-view>
  </div>
</template>

<style scoped lang="scss">
.root {
  --head-heigin: v-bind("cssValue_.headHeight");
  --content-width: v-bind("cssValue_.contentWidth");
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
