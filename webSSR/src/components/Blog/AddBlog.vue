<script lang="ts">
import {
  ref,
  reactive,
  customRef,
  onMounted,
  watch,
  toRef,
  computed,
} from "vue";
import Dialog from ">/Dialog/Dialog.vue";
import MDEdit from ">/md/MDEdit.vue";
import { AdminApiCon } from "@/http/apiCon/main/AdminApiCon";
import { ElForm } from "element-plus";
import { FormItemRule } from "element-plus/es/components/form/src/form.type";
import { ComVerify } from "com_utils/ComVerify";
import { ComApiCon } from "@/http/apiCon/main/ComApiCon";
import { Mes } from "@/mes/Mes";
import tab2 from ">/tabs/tabs2.vue";
export default {
  components: { Dialog, MDEdit, tab2 },
  props: {
    show: {
      type: Boolean,
    },
    id: {
      type: Number,
      default: -1,
    },
  },
  emits: ["update:show", "change"],
  setup(props, ctx) {
    const addLoading = ref(false);
    /** 一个自定义的ref */
    const show_ = customRef((track, trigger) => {
      return {
        get: () => {
          track();
          return props.show;
        },
        set: (_value) => {
          if (addLoading.value) {
            return;
          }
          ctx.emit("update:show", _value);
          trigger();
        },
      };
    });
    const model = reactive<
      Partial<
        Omit<EN.IBlogE, "theme" | "tabIds" | "createTime"> & {
          theme: {
            md: string;
            code: string;
          };
          tabIds: number[];
          createTime: Date;
        }
      >
    >({
      title: "",
      content: "",
      externalLink: "",
      theme: {
        md: "",
        code: "",
      },
      tabIds: [],
      createTime: new Date(),
    });
    type blogType = "cu" | "link";
    const blogTypes: {
      title: string;
      type: blogType;
    }[] = [
      {
        title: "原创",
        type: "cu",
      },
      {
        title: "外链",
        type: "link",
      },
    ];
    const onBlogType = ref<blogType>("cu");
    const blogTypeIndex = customRef((g, s) => {
      return {
        get() {
          g();
          return blogTypes.findIndex((item) => {
            return item.type == onBlogType.value;
          });
        },
        set(value: number) {
          s();
          onBlogType.value = blogTypes[value].type;
        },
      };
    });
    const loadingData = ref(false);
    const loadingTabs = ref(false);
    const tabs = ref<EN.IBlogTabE[]>([]);
    const formRef = ref<InstanceType<typeof ElForm>>();
    const formRules: Record<
      Extract<"title" | "content" | "externalLink" | "tabIds", keyof EN.IBlogE>,
      FormItemRule
    > = {
      title: {
        required: true,
        validator: (rule, value, callback) => {
          callback(ComVerify.BlogV.title(value) || undefined);
        },
      },
      content: {
        required: true,
        validator: (rule, value, callback) => {
          //如果是外部链接博客则不验证内容
          if (onBlogType.value == "link") {
            callback();
            return;
          }
          callback(ComVerify.BlogV.content(value) || undefined);
        },
      },
      externalLink: {
        required: true,
        validator: (rule, value, callback) => {
          //如果是自定义博客则不验证外部链接
          if (onBlogType.value == "cu") {
            callback();
            return;
          }
          callback(ComVerify.BlogV.externalLink(value) || undefined);
        },
      },
      tabIds: {
        required: true,
        validator: (rule, value, callback) => {
          callback(ComVerify.BlogV.tabIds(value) || undefined);
        },
      },
    };
    const ifEdit = computed(() => {
      return props.id > 0;
    });

    watch(toRef(props, "id"), () => {
      loadData();
    });

    /** 加载数据 */
    function loadData() {
      if (props.id <= 0) {
        model.title = "";
        model.content = "";
        model.externalLink = "";
        model.theme = {
          md: "",
          code: "",
        };
        model.tabIds = [];
        onBlogType.value = "cu";
        return;
      }
      loadingData.value = true;
      ComApiCon.instance
        .getOneBlog(props.id)
        .then((data) => {
          model.title = data.title;
          model.content = data.content;
          model.tabIds =
            data.tabsE?.map((item) => {
              return item.id;
            }) || [];
          model.theme = data.theme as any;
          model.externalLink = data.externalLink;
          onBlogType.value = model.externalLink ? "link" : "cu";
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          loadingData.value = false;
        });
    }

    /** 加载全部标签 */
    function loadAllTabs() {
      loadingTabs.value = true;
      ComApiCon.instance
        .getAllBlogTab()
        .then((list) => {
          tabs.value = list;
        })
        .catch(Mes.handleHttpCatch)
        .finally(() => {
          loadingTabs.value = false;
        });
    }

    /** 添加博客 */
    function addBlog() {
      if (addLoading.value) {
        return;
      }
      formRef.value
        ?.validate()
        ?.then(() => {
          addLoading.value = true;
          let _op = {
            id: props.id,
            title: model.title,
            content: model.content,
            theme: model.theme,
            tabIds: model.tabIds?.join(","),
            externalLink: model.externalLink,
            createTime: model.createTime?.getTime() || 0,
          };
          let p: Promise<EN.IBlogE>;
          if (!ifEdit.value) {
            p = AdminApiCon.instance.addBlog(_op).then((d) => {
              model.title = "";
              model.content = "";
              model.externalLink = "";
              model.theme = {
                md: "",
                code: "",
              };
              model.tabIds = [];
              model.createTime = new Date();
              return d;
            });
          } else {
            p = AdminApiCon.instance.editBlog(_op);
          }
          p.then((d) => {
            ctx.emit("change", {
              type: ifEdit.value ? "edit" : "add",
              data: d,
              id: props.id,
            });
            Mes.success(ifEdit.value ? "保存成功" : "添加成功");
          })
            .finally(() => {
              addLoading.value = false;
            })
            .then(() => {
              show_.value = false;
            })
            .catch(Mes.handleHttpCatch);
        })
        .catch((e) => {
          console.warn(e);
        });
    }

    onMounted(() => {
      loadData();
      loadAllTabs();
    });

    //
    return {
      show_,
      loadingData,
      addLoading,
      blogTypes,
      onBlogType,
      blogTypeIndex,
      loadingTabs,
      tabs,
      model,
      formRef,
      formRules,
      addBlog,
      ifEdit,
    };
  },
};
</script>

<template>
  <Dialog v-model:show="show_" :title="(ifEdit ? '编辑' : '添加') + '博客'">
    <div class="addBlog" v-loading="loadingData || addLoading">
      <tab2 class="tab" :list="blogTypes" v-model:index="blogTypeIndex" />
      <el-form
        :model="model"
        ref="formRef"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="请输入博客标题" />
        </el-form-item>
        <el-form-item v-if="onBlogType == 'cu'" label="内容" prop="content">
          <MDEdit
            v-model:md="model.content"
            v-model:md_theme="model.theme.md"
            v-model:code_theme="model.theme.code"
          />
        </el-form-item>
        <el-form-item
          v-if="onBlogType == 'link'"
          label="链接"
          prop="externalLink"
        >
          <el-input
            v-model="model.externalLink"
            placeholder="请输入外部博客链接"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tabIds">
          <el-select
            multiple
            clearable
            v-model="model.tabIds"
            placeholder="选择博客标签"
            :style="{
              width: '100%',
            }"
          >
            <el-option
              v-for="item in tabs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" v-if="!ifEdit">
          <el-date-picker
            v-model="model.createTime"
            type="date"
            placeholder="创建时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <template #bottom>
      <my-button type="e" @click="addBlog">{{
        ifEdit ? "保存" : "添加"
      }}</my-button>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.addBlog {
  width: 800px;
  > .tab {
    margin-bottom: 10px;
  }
}
</style>
