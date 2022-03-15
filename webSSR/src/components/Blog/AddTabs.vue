<script lang="ts">
import { ref, reactive, customRef, computed, watch, toRef } from "vue";
import Dialog from ">/Dialog/Dialog.vue";
import { ElForm } from "element-plus";
import { AdminApiCon } from "@/http/apiCon/main/AdminApiCon";
import { Mes } from "@/mes/Mes";
import { FormItemRule } from "element-plus/es/components/form/src/form.type";
import { ComVerify } from "com_utils/ComVerify";
import ColorPicker from "@/components/ColorPicker/ColorPicker.vue";
import { ComApiCon } from "@/http/apiCon/main/ComApiCon";
export default {
  components: { Dialog, ColorPicker },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    id: Number,
  },
  emits: ["update:show", "change"],
  setup(props, ctx) {
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
    const ifEdit = computed(() => {
      return props.id != -1;
    });
    const addLoading = ref(false);
    const formRef = ref<InstanceType<typeof ElForm>>();
    const model = reactive<Pick<EN.IBlogTabE, "name" | "color">>({
      name: "",
      color: "",
    });
    const formRules: Record<
      Extract<"name" | "color", keyof EN.IBlogTabE>,
      FormItemRule
    > = {
      name: {
        required: true,
        validator: (rule, value, callback) => {
          callback(ComVerify.BlogTabV.name_(value) || undefined);
        },
      },
      color: {
        required: true,
        validator: (rule, value, callback) => {
          callback(ComVerify.BlogTabV.color(value) || undefined);
        },
      },
    };

    watch(toRef(props, "id"), () => {
      if (props.id == -1) {
        model.name = "";
        model.color = "";
        return;
      }
      ComApiCon.instance
        .getOneBlogTab(props.id!)
        .then((d) => {
          model.name = d.name;
          model.color = d.color;
        })
        .catch(Mes.handleHttpCatch);
    });

    /** 添加 */
    function add() {
      if (addLoading.value) {
        return;
      }
      formRef.value
        ?.validate()
        ?.then(() => {
          addLoading.value = true;
          let op = {
            id: props.id,
            name: model.name,
            color: model.color,
          };
          let p: Promise<EN.IBlogTabE>;
          if (ifEdit.value) {
            p = AdminApiCon.instance.editBlogTab(op);
          } else {
            p = AdminApiCon.instance.addBlogTab(op);
          }
          p.then((tab) => {
            ctx.emit("change", {
              id: props.id,
              tab,
            });
            if (ifEdit.value) {
              Mes.success("编辑成功");
            } else {
              Mes.success("添加成功");
            }
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

    //
    return {
      show_,
      addLoading,
      formRef,
      formRules,
      model,
      ifEdit,
      add,
    };
  },
};
</script>

<template>
  <Dialog v-model:show="show_" :title="(ifEdit ? '编辑' : '添加') + '标签'">
    <div class="AddTabs">
      <el-form :model="model" ref="formRef" :rules="formRules">
        <el-form-item label="名字" prop="name">
          <el-input v-model="model.name" placeholder="请输入标签名字" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <ColorPicker v-model:color="model.color" />
        </el-form-item>
      </el-form>
    </div>
    <template #bottom>
      <my-button :loading="addLoading" type="e" @click="add">{{
        ifEdit ? "保存" : "添加"
      }}</my-button>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.AddTabs {
  width: 300px;
}
</style>
