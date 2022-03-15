<script lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import TabItem from ">/Blog/TabItem.vue";
import { ComApiCon } from "@/http/apiCon/main/ComApiCon";
import { Mes } from "@/mes/Mes";
import { Edit } from "@element-plus/icons-vue";
import { UserDataProxy } from "@/localData/dataItem/UserDataProxy";
import AddTabs from "./AddTabs.vue";
import { AdminApiCon } from "@/http/apiCon/main/AdminApiCon";
import Dialog from ">/Dialog/Dialog.vue";

export default {
  components: { TabItem, Edit, AddTabs, Dialog },
  setup() {
    const loadingTabs = ref(false);
    const tabsList = ref<EN.IBlogTabE[]>([]);
    const ifLogin = computed(() => {
      return UserDataProxy.instance.ifLogin;
    });
    const ifAdd = ref(false);
    const ifEdit = ref(false);
    const editId = ref(-1);
    const removeId = ref(-1);
    const removeDialog = ref(false);
    const removeItemData = computed(() => {
      return (
        tabsList.value.find((item) => {
          return item.id == removeId.value;
        }) || {}
      );
    });
    /** 加载全部标签 */
    function loadAllTabs() {
      loadingTabs.value = true;
      ComApiCon.instance
        .getAllBlogTab()
        .then((list) => {
          tabsList.value.push(...list);
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          loadingTabs.value = false;
        });
    }

    onMounted(() => {
      loadAllTabs();
    });

    /** 添加标签改变 */
    function addTabChange(op: { id: number; tab: EN.IBlogTabE }) {
      let index = tabsList.value.findIndex((item) => {
        return item.id == op.id;
      });
      if (index != -1) {
        tabsList.value.splice(index, 1, op.tab);
      } else {
        tabsList.value.push(op.tab);
      }
    }

    /** 添加 */
    function add(id: number = -1) {
      ifAdd.value = true;
      editId.value = id;
    }

    /** 删除标签 */
    function removeItem(id: number) {
      removeDialog.value = true;
      removeId.value = id;
    }
    /** 标签删除点击 */
    function removeItemClick() {
      if (loadingTabs.value) {
        return;
      }
      removeDialog.value = false;
      loadingTabs.value = true;
      AdminApiCon.instance
        .remoteBlogTab(removeId.value)
        .then(() => {
          let i = tabsList.value.findIndex((_item) => {
            return removeId.value == _item.id;
          });
          tabsList.value.splice(i, 1);
          removeId.value = -1;
          Mes.success("标签删除成功");
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          loadingTabs.value = false;
        });
    }

    /** 标签编辑点击 */
    function editItem(id: number) {
      add(id);
    }

    return {
      loadingTabs,
      tabsList,
      ifLogin,
      ifAdd,
      ifEdit,
      editId,
      removeId,
      addTabChange,
      add,
      editItem,
      removeItem,
      removeItemClick,
      removeDialog,
      removeItemData,
    };
  },
};
</script>

<template>
  <div class="allBlogTabs border-box" v-loading="loadingTabs">
    <el-icon
      :class="{
        on: ifEdit,
      }"
      v-if="ifLogin"
      @click="ifEdit = !ifEdit"
      ><Edit
    /></el-icon>
    <span>所有标签</span>
    <div class="list">
      <TabItem
        class="item"
        v-for="(item, index) in tabsList"
        :key="index"
        :data="item"
        :edit="ifEdit"
        @editClick="editItem"
        @removeClick="removeItem"
      />
    </div>
    <my-button v-if="ifLogin" type="e" @click="add()">添加标签</my-button>
    <AddTabs v-model:show="ifAdd" :id="editId" @change="addTabChange" />
    <Dialog v-model:show="removeDialog" title="删除标签">
      <div class="dialog">
        <span
          >确定删除标签
          <span
            :style="{
              color: removeItemData.color,
            }"
            >@{{ removeItemData.name }}</span
          ></span
        >
      </div>
      <template #bottom>
        <my-button type="e" @click="removeItemClick">删除</my-button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.allBlogTabs {
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: white;
  > .el-icon {
    position: absolute;
    font-size: 20px;
    top: 5px;
    right: 5px;
    cursor: pointer;
    color: #cfcfcf;
    &.on {
      color: var(--color);
    }
  }
  > span {
    font-size: 16px;
    font-weight: bold;
    color: var(--color);
    margin-bottom: 10px;
  }
  > .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: -10px;
    > .item {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  > button {
    width: 100%;
    margin-top: 10px;
  }
}
.dialog {
  width: 300px;
  font-size: 16px;
  color: var(--color);
  > span > span {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
