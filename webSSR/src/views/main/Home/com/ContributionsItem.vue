<script lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { EPage } from "@/router/EPage";
import { getObscureQueryStr } from "@/utils/getObscureQueryValue";
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const item: EN.IContributionsE = props.item as any;
    const type = computed(() => {
      switch (item.type) {
        case "blog":
          let data: EN.IBlogE = item.data;
          if (data.externalLink) {
            return "一篇外链博客";
          } else {
            return "一篇博客";
          }
        case "memo":
          return "一条便签";
        case "diary":
          return "一篇日记";
        case "bullet":
          return "一条弹幕";
      }
    });
    const conType = computed(() => {
      return item.conType == "add" ? "添加" : "修改";
    });
    const time = computed(() => {
      return `${item.y}年${item.m}月${item.d}日`;
    });
    const content = computed(() => {
      switch (item.type) {
        case "blog":
          let blogD = item.data as EN.IBlogE;
          return blogD.title;
        case "memo":
          let memoD = item.data as EN.IMemoE;
          return memoD.title;
        case "diary":
          let diaryD = item.data as EN.IDiaryE;
          return diaryD.title;
        case "bullet":
          let bulletD = item.data as EN.IBulletCommentE;
          return bulletD.content;
      }
    });

    /** 去对应页面 */
    function to() {
      switch (item.type) {
        case "blog":
          router.push({
            path: EPage.BlogShow,
            query: {
              id: getObscureQueryStr(item.targetId + ""),
            },
          });
          break;
        case "memo":
          break;
        case "diary":
          break;
        case "bullet":
          break;
      }
    }

    return {
      type,
      time,
      conType,
      content,
      to,
    };
  },
};
</script>

<template>
  <div class="ContributionsItem">
    <span>{{ conType }}了{{ type }}</span>
    <span @click="to" class="content">{{ content }}</span>
  </div>
</template>

<style scoped lang="scss">
.ContributionsItem {
  font-size: 18px;
  color: #b3b3c5;
  > span:nth-child(1) {
  }
  > span:nth-child(2) {
    margin-left: 10px;
    color: var(--color);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
