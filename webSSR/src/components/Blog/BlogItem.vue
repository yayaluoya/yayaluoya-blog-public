<script lang="ts">
import { ref, reactive, toRef, computed, onMounted } from "vue";
import tabs2_ from ">/tabs/tabs2.vue";
import { useRouter } from "vue-router";
import MDShow from "../md/MDShow.vue";
import TabItem from "./TabItem.vue";
import anime from "animejs/lib/anime.js";
import moment from "moment";
import { EPage } from "@/router/EPage";
import { EEasing } from "@/_d/EEasing";
import { getObscureQueryStr } from "@/utils/getObscureQueryValue";
import { UserDataProxy } from "@/localData/dataItem/UserDataProxy";
import { Edit, View } from "@element-plus/icons-vue";
interface IProps {
  data?: EN.IBlogE;
}
export default {
  components: { tabs2_, MDShow, TabItem, Edit, View },
  props: ["data"],
  emits: ["edit"],
  setup(props, ctx) {
    const ifLogin = computed(() => {
      return UserDataProxy.instance.ifLogin;
    });
    const data_ = toRef<IProps, keyof IProps>(props, "data");
    const imgs = computed(() => {
      return data_.value?.imgs.split(",").filter(Boolean);
    });
    const router = useRouter();
    const ifTransfrom = ref(false);

    const time = computed(() => {
      return moment(parseInt(data_.value!.createTime + "")).format(
        "YYYY年M月D日"
      );
    });

    const ifLink = computed(() => {
      return !!data_.value?.externalLink;
    });

    /** 获取图片的变换 */
    function getImgTransfrom(index: number) {
      if (!ifTransfrom.value) {
        return {};
      }
      let per = index / (imgs.value!.length - 1);
      let targets = {
        scale: 1,
        translateX: 0,
      };
      anime({
        targets,
        scale: 0.8,
        translateX: 20,
        autoplay: false,
        duration: 100,
        easing: EEasing.linear,
      }).seek(100 * per);
      return {
        transform: `scale(${targets.scale}) translateX(${
          targets.translateX + (200 * (1 - targets.scale)) / 2
        }px)`,
        "z-index": imgs.value!.length - index,
      };
    }

    /** 显示博客 */
    function blogShow() {
      router.push({
        path: EPage.BlogShow,
        query: {
          id: getObscureQueryStr(data_.value!.id + ""),
        },
      });
    }

    /** 编辑 */
    function edit() {
      ctx.emit("edit");
    }

    onMounted(() => {
      setTimeout(() => {
        ifTransfrom.value = true;
      }, 0);
    });

    return {
      ifLogin,
      imgs,
      getImgTransfrom,
      time,
      blogShow,
      ifLink,
      edit,
    };
  },
};
</script>

<template>
  <div
    class="blogItem border-box"
    :class="{
      noImgs: !imgs || imgs.length <= 0,
    }"
  >
    <el-icon v-if="ifLogin" @click="edit"><Edit /></el-icon>
    <div class="title">
      <span class="text-ellipsis" @click="blogShow" :title="data.title">{{
        data.title || "无标题"
      }}</span>
    </div>
    <div class="other">
      <span>{{ time }}</span>
      <el-icon><View /></el-icon>
      <span>{{ data.showNumber }}</span>
    </div>
    <div class="tab" v-if="data.tabsE && data.tabsE.length > 0">
      <TabItem
        class="item"
        v-for="(item, index) in data.tabsE"
        :key="index"
        :data="item"
      />
    </div>
    <div class="content" v-if="!ifLink">
      <div class="imgs" v-if="imgs && imgs.length > 0">
        <div
          class="item"
          v-for="(item, index) in imgs"
          :key="index"
          :style="{
            ...getImgTransfrom(index),
          }"
        >
          <el-image :src="item" fit="cover"></el-image>
        </div>
      </div>
      <div class="content">
        <MDShow
          class="md"
          :content="data.content"
          :md_theme="data.theme.md"
          :code_theme="data.theme.code"
        />
      </div>
    </div>
    <div class="link" v-else>
      <a :href="data.externalLink" target="_blank"
        >前往>{{ data.externalLink }}</a
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.blogItem {
  --imgs-size: 200px;
  --imgs-margin-right: 20px;
  --bottom-size: 6px;
  display: flex;
  flex-direction: column;
  width: calc(100% - 22px);
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  // border: 1px solid #e3e3e3;
  background-color: white;
  position: relative;
  > .el-icon {
    position: absolute;
    font-size: 20px;
    top: 5px;
    cursor: pointer;
    color: #cfcfcf;
  }
  > .title {
    width: 100%;
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    color: var(--color);
    margin-bottom: var(--bottom-size);
    display: flex;
    > span {
      max-width: 100%;
      position: relative;
      cursor: pointer;
      &::after {
        content: "";
        width: 0;
        left: 0;
        bottom: 0;
        height: 10px;
        background: linear-gradient(180deg, transparent, hsl(51deg 100% 50%));
        position: absolute;
        transition: all 0.2s;
        border-radius: 2px;
      }
      &:hover {
        &::after {
          width: 100%;
        }
      }
    }
  }
  > .other {
    width: 100%;
    display: flex;
    align-items: center;
    color: #3a4650;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: var(--bottom-size);
    > span {
      margin-right: 10px;
    }
    > .el-icon {
      margin-right: 3px;
      font-size: 18px;
    }
    > span:nth-last-child(1) {
      margin-right: 0px;
    }
  }
  > .tab {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: calc(var(--bottom-size) - 5px);
    > .item {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
  > .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    > .imgs {
      width: var(--imgs-size);
      height: var(--imgs-size);
      margin-right: var(--imgs-margin-right);
      position: relative;
      > .item {
        width: 100%;
        height: 100%;
        border: 1px solid #ebebeb;
        background-color: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        transition: all 0.2s;
        box-shadow: 0 1px 2px 0 rgba(101, 129, 156, 0.08);
        > .el-image:deep() {
          width: 100%;
          height: 100%;
        }
      }
    }
    > .content {
      display: flex;
      flex-direction: column;
      width: calc(100% - var(--imgs-size) - var(--imgs-margin-right));
      position: relative;
      background-color: #fafafa;
      border-radius: var(--border-radius);
      > .md {
        width: calc(100% - 20px);
        padding: 10px;
        max-height: 160px;
        overflow: hidden;
        border-radius: var(--border-radius);
      }
    }
  }
  > .link {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  &:not(.noImgs) {
    > .el-icon {
      left: 5px;
    }
    > .title {
      text-align: right;
      justify-content: flex-end;
    }
    > .other {
      justify-content: flex-end;
    }
    > .tab {
      justify-content: flex-end;
    }
  }
  &.noImgs {
    > .el-icon {
      right: 5px;
    }
    > .content {
      > .content {
        width: 100%;
        > .md {
          max-height: 300px;
        }
      }
    }
  }
}
</style>
