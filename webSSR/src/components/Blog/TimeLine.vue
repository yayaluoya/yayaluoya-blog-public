<script lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ComApiCon } from "@/http/apiCon/main/ComApiCon";
import { Mes } from "@/mes/Mes";
import moment from "moment";
import { useRouter } from "vue-router";
import { EPage } from "@/router/EPage";
import { getObscureQueryStr } from "@/utils/getObscureQueryValue";
export default {
  components: {},
  props: {
    on_blog_id: Number,
    size: {
      type: Number,
      default: 5,
    },
  },
  setup(props, ctx) {
    const loading = ref(false);
    const list = ref<EN.IBlogE[]>([]);
    const router = useRouter();

    /** 加载数据 */
    function loadData() {
      loading.value = true;
      ComApiCon.instance
        .getTimeLineBlog(props.on_blog_id!, props.size)
        .then((_list) => {
          list.value.push(..._list);
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          loading.value = false;
        });
    }

    /** 显示博客 */
    function blogShow(id: number) {
      router.push({
        path: EPage.BlogShow,
        query: {
          id: getObscureQueryStr(id + ""),
        },
      });
    }

    /** 获取时间 */
    function getTime(createTime: string | number) {
      return moment(parseInt(createTime + "")).format("YYYY年M月D日");
    }

    onMounted(() => {
      loadData();
    });

    return {
      getTime,
      loading,
      list,
      blogShow,
    };
  },
};
</script>

<template>
  <div class="blogTimeLine">
    <!-- <span>最近的博客</span> -->
    <div class="list">
      <div
        class="item"
        :class="{
          on: item.id == on_blog_id,
        }"
        v-for="(item, index) in list"
        :key="index"
      >
        <span class="pun"></span>
        <span class="title" @click="blogShow(item.id)">{{ item.title }}</span>
        <span class="time">{{ getTime(item.createTime) }}</span>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>

<style scoped lang="scss">
.blogTimeLine {
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  position: relative;
  > span {
    font-size: 14px;
    font-weight: bold;
    color: #b5b5b5;
    margin-bottom: 10px;
  }
  > .list {
    display: flex;
    flex-direction: column;
    > .item {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      position: relative;
      > .pun {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        top: 4px;
        left: -26px;
        z-index: 1;
        background-color: var(--color);
        border: 2px solid white;
      }
      > .title {
        margin-bottom: 10px;
        line-height: 20px;
        font-size: 15px;
        font-weight: bold;
        color: var(--color);
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      > .time {
        width: 100%;
        text-align: right;
        font-size: 12px;
        color: #b5b5b5;
      }
      &.on {
        > .pun {
          background-color: #0084ff;
        }
        > .title {
          color: #0084ff;
        }
      }
    }
    > .item:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  > .line {
    position: absolute;
    width: 2px;
    border-radius: 2px;
    height: 100%;
    top: 0px;
    background-color: white;
    left: -1px;
  }
}
</style>
