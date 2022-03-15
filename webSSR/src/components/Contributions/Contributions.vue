<script lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ComApiCon } from "@/http/apiCon/main/ComApiCon";
import { Mes } from "@/mes/Mes";
import moment from "moment";
import Item from "./Item.vue";
import { getContributionIntensityColor } from "./getContributionIntensityColor";

type itemType = {
  /** 是否是填充的内容 */
  f: boolean;
  /** 年 */
  y?: number;
  /** 月 */
  m: number;
  /** 日 */
  d?: number;
  /** 星期 */
  week: number;
  /** 贡献 */
  cb?: EN.IContributionsE[];
};

const weekList = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default {
  components: { Item },
  emits: ["itemClick"],
  setup(props, ctx) {
    const listRef = ref<HTMLDivElement>();
    const listElWidht = ref(0);
    const yList = ref<number[]>([]);
    const onY = ref(0);
    const loadingY = ref(false);
    const alertList = [0, 10, 50, 100, 1000];
    const contributions = reactive<
      Record<
        number,
        {
          loading: boolean;
          list: EN.IContributionsE[];
        }
      >
    >({});
    const onContribution = computed(() => {
      return (
        contributions[onY.value] || {
          loading: false,
          list: [],
        }
      );
    });
    const getShowList = computed(() => {
      if (onY.value == 0) {
        return [];
      }
      let _onY = onY.value;
      let list: itemType[] = [];
      let onMoment = moment(_onY + "");
      //递归获取这一年每一天的时间信息
      while (onMoment.year() == _onY) {
        let time = {
          y: onMoment.year(),
          m: onMoment.month() + 1,
          d: onMoment.date(),
        };
        list.push({
          ...time,
          f: false,
          //day()方法获取的是1~60，要把最后的0转出7
          week: onMoment.day() || 7,
          cb: onContribution.value.list.filter((item) => {
            return item.y == time.y && item.m == time.m && item.d == time.d;
          }),
        });
        //递增一天
        onMoment.add(1, "days");
      }
      //转换成周列表
      let dList: itemType[][] = [];
      while (list.length > 0) {
        if (!dList[dList.length - 1]) {
          dList.push([]);
          let onD = dList[dList.length - 1];
          let item = list.shift()!;
          //根据之前的偏差注入填充元素
          for (let i = 1; i < item.week; i++) {
            onD.push({
              m: item.m,
              week: i,
              f: true,
            });
          }
          onD.push(item);
        }
        let onD = dList[dList.length - 1];
        if (onD.length < 7) {
          let item = list.shift()!;
          onD.push(item);
          if (list.length == 0) {
            for (let i = item.week + 1; i <= 7; i++) {
              onD.push({
                m: item.m,
                week: i,
                f: true,
              });
            }
          }
        } else {
          dList.push([]);
        }
      }
      //转换成月列表
      let mList: {
        m: number;
        week: itemType[][];
      }[] = [];
      dList.forEach((item) => {
        //获取这周是属于哪月，规则是这周最后一天是哪月就是哪月
        let m = item[6].m;
        let onMlist = mList.find((_) => {
          return _.m == m;
        });
        if (!onMlist) {
          onMlist =
            mList[
              mList.push({
                m,
                week: [],
              }) - 1
            ];
        }
        onMlist.week.push(item);
      });
      //
      return mList;
    });
    /** 月份水平显示列表 */
    const monthLevelShowList = ref<
      {
        m: number;
        x: number;
      }[]
    >([]);
    const mNumber = computed(() => {
      return getShowList.value.reduce((a, b) => {
        return a + b.week.length;
      }, 0);
    });
    const itemSize = computed(() => {
      if (!listRef.value || mNumber.value == 0) {
        return {
          width: 0,
          height: 0,
          spacing: 0,
        };
      }
      let size = {
        width: 0,
        height: 0,
        spacing: 0,
      };
      size.spacing = 3;
      size.width =
        (listElWidht.value - (mNumber.value - 1) * size.spacing) /
        mNumber.value;
      size.height = size.width;
      return size;
    });

    /** 设置月份水平显示的列表 */
    function setMonthLevelShowList(item: { $el: HTMLDivElement }, m: number) {
      setTimeout(() => {
        let index = monthLevelShowList.value.findIndex((_) => {
          return _.m == m;
        });
        if (index == -1) {
          monthLevelShowList.value.push({
            m,
            x:
              item.$el.getBoundingClientRect().x -
              item.$el.parentElement!.getBoundingClientRect().x,
          });
        }
      }, 0);
    }

    /** 设置列表宽度 */
    function setListWidth() {
      listElWidht.value = listRef.value!.getBoundingClientRect().width;
    }

    /** 获取某月份前存在多少周 */
    function getMBeforWeek(i: number): number {
      return getShowList.value.reduce((a, b, index) => {
        if (index < i) {
          a += b.week.length;
        }
        return a;
      }, 0);
    }

    /** 加载年份列表 */
    function loadYList() {
      loadingY.value = true;
      ComApiCon.instance
        .getContributionY()
        .then((list) => {
          yList.value = list;
          if (list.length > 0) {
            let _onY = moment().year();
            if (list.includes(_onY)) {
              yChange(_onY);
            } else {
              yChange(list[0]);
            }
          }
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          loadingY.value = false;
        });
    }
    /** 加载贡献列表 */
    function loadContributions() {
      let _onContribution = contributions[onY.value];
      if (_onContribution) {
        return;
      }
      _onContribution = {
        loading: true,
        list: [],
      };
      contributions[onY.value] = _onContribution;
      //TODO 这里必须转换一下，因为vue3使用Proxy，所以在原对象上修改并不会触发监听
      _onContribution = contributions[onY.value];
      //加载数据
      ComApiCon.instance
        .getContributionList({
          y: onY.value,
        })
        .then((list) => {
          _onContribution.list = list;
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          _onContribution.loading = false;
        });
    }

    /** 切换年份 */
    function yChange(y: number) {
      onY.value = y;
      //加载这一年的贡献列表
      loadContributions();
    }

    /** item点击 */
    function itemClick(item: itemType) {
      if (!item.cb || item.cb.length <= 0) {
        return;
      }
      ctx.emit("itemClick", item);
    }

    onMounted(() => {
      loadYList();
      listRef.value!.addEventListener("resize", () => {
        setListWidth();
      });
      setListWidth();
    });

    return {
      getContributionIntensityColor,
      listRef,
      loadingY,
      onY,
      yList,
      contributions,
      yChange,
      onContribution,
      getShowList,
      mNumber,
      itemSize,
      getMBeforWeek,
      alertList,
      itemClick,
      weekList,
      monthLevelShowList,
      setMonthLevelShowList,
    };
  },
};
</script>

<template>
  <div class="Contributions box-shadow">
    <div class="left" v-loading="onContribution.loading">
      <div class="top">
        <span>{{ onY }}年共{{ onContribution.list.length }}次贡献</span>
      </div>
      <div class="m">
        <span
          v-for="(item, index) in monthLevelShowList"
          :key="index"
          :style="{
            left: item.x + 'px',
          }"
          >{{ item.m }}月</span
        >
      </div>
      <div class="content">
        <div class="left">
          <span v-for="(item, index) in weekList" :key="index">{{ item }}</span>
        </div>
        <div
          class="list"
          ref="listRef"
          :style="{
            'grid-template-columns': `repeat(${mNumber},auto)`,
            'grid-template-rows': `repeat(7, auto)`,
            'grid-gap': `${itemSize.spacing}px`,
          }"
        >
          <template v-for="(m, m_i) in getShowList" :key="m_i">
            <template v-for="(w, w_i) in m.week" :key="w_i">
              <Item
                v-for="(d, d_i) in w"
                :key="d_i"
                class="item"
                :class="{
                  f: d.f,
                }"
                :time="`${d.m}月${d.d}日`"
                :cb_list="d.cb"
                :style="{
                  'grid-row-start': d_i + 1,
                  'grid-row-end': d_i + 2,
                  'grid-column-start': getMBeforWeek(m_i) + w_i,
                  'grid-column-end': getMBeforWeek(m_i) + w_i + 1,
                  width: `${itemSize.width}px`,
                  height: `${itemSize.height}px`,
                }"
                @click="itemClick(d)"
                :ref="
                  (e) => {
                    setMonthLevelShowList(e, m.m);
                  }
                "
              ></Item>
            </template>
          </template>
        </div>
      </div>
      <div class="bottom">
        <div class="left"></div>
        <div class="right">
          <span>Less</span>
          <div
            v-for="(item, index) in alertList"
            :key="index"
            class="item"
            :style="{
              'background-color': getContributionIntensityColor(item),
              width: `${itemSize.width}px`,
              height: `${itemSize.height}px`,
            }"
          ></div>
          <span>More</span>
        </div>
      </div>
    </div>
    <div class="right" v-loading="loadingY">
      <div class="list">
        <div
          class="item"
          :class="{
            on: item == onY,
          }"
          v-for="(item, index) in yList"
          :key="index"
        >
          <span class="title" @click="yChange(item)">{{ item }}</span>
          <span class="pun"></span>
        </div>
      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Contributions {
  --right-width: 50px;
  --right-padding: 20px;
  --right-margin-left: 20px;
  width: calc(100% - 40px);
  display: flex;
  flex-direction: row;
  padding: 20px;
  border-radius: var(--border-radius);
  background-color: white;
  > .left {
    --list-right-margin: 40px;
    width: calc(
      100% - var(--right-width) - var(--right-padding) -
        var(--right-margin-left)
    );
    display: flex;
    flex-direction: column;
    > .top {
      color: var(--color);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    > .m {
      margin-left: var(--list-right-margin);
      position: relative;
      margin-bottom: 10px;
      height: 12px;
      > span {
        position: absolute;
        top: 0;
        font-size: 12px;
        font-weight: bold;
        color: #888897;
      }
    }
    //月列表
    > .content {
      display: flex;
      flex-direction: row;
      > .left {
        width: var(--list-right-margin);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        color: #888897;
        justify-content: space-between;
        font-weight: bold;
      }
      > .list {
        display: grid;
        width: calc(100% - var(--list-right-margin));
        > .item {
          &.f {
            visibility: hidden;
          }
        }
      }
    }
    > .bottom {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      color: var(--color);
      font-size: 12px;
      > .right {
        display: flex;
        flex-direction: row;
        align-items: center;
        > span:nth-child(1) {
          margin-right: 5px;
        }
        > .item {
          margin-right: 5px;
          border-radius: 2px;
        }
      }
    }
  }
  > .right {
    width: var(--right-width);
    margin-left: var(--right-margin-left);
    display: flex;
    flex-direction: column;
    position: relative;
    padding: var(--right-padding);
    padding-right: 0;
    > .list {
      display: flex;
      flex-direction: column;
      > .item {
        margin-bottom: 10px;
        position: relative;
        > .title {
          margin-bottom: 10px;
          line-height: 14px;
          font-size: 14px;
          font-weight: bold;
          color: var(--color);
          cursor: pointer;
        }
        > .pun {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: 1px;
          left: -26px;
          z-index: 1;
          background-color: var(--color);
          border: 2px solid white;
        }
        &.on {
          > .pun {
            background-color: #0084ff;
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
      background-color: #f2f1f6;
      left: -1px;
    }
  }
}
</style>
