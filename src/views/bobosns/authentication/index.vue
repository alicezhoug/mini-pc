<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--认证名称搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.name"
                    placeholder="输入认证名称搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <!--状态搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.authenticationState"
              placeholder="输入状态搜索"
              allow-search

            >
              <a-option
                v-for="s in dict.authentication_status"
                :key="s.detailId"
                :value="s.label"
              >
                {{ s.label }}
              </a-option>
            </a-select>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['bobosns:authentication:add']"
          :edit-permission="['bobosns:authentication:edit']"
          :del-permission="['bobosns:authentication:del']"
          :download-permission="['bobosns:authentication:list']"
		   :show-add="false"
		   :show-download="false"
          style="margin-bottom: 12px"
		  
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--认证名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="认证名称"
                  :rules="[{ required: true, message: '认证名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--介绍-->
              <a-col :span="12">
                <a-form-item
                  field="introduce"
                  label="介绍"
                >
                </a-form-item>
              </a-col>
              <!--联系方式-->
              <a-col :span="12">
                <a-form-item
                  field="contactInformation"
                  label="联系方式"
                >
                </a-form-item>
              </a-col>
              <!--身份信息证明图片-->
              <a-col :span="12">
                <a-form-item
                  field="identityPicture"
                  label="身份信息证明图片"
                >
                </a-form-item>
              </a-col>
              <!--驳回原因-->
              <a-col :span="12">
                <a-form-item
                  field="overruleContent"
                  label="驳回原因"
                >
                </a-form-item>
              </a-col>
              <!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="authenticationState"
                  label="状态"
                >
                  <a-select
                    v-model="crud.options.form.authenticationState"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.authentication_status"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </CrudOperation>

        <!--表格-->
        <a-table
          ref="table"
          v-model:selectedKeys="crud.options.tableInfo.selectKeys"
          row-key="id"
          :columns="tableColumns"
          :data="crud.options.tableInfo.data"
          :pagination="false"
          :scroll="{ y: '100%' }"
          :loading="crud.status.value === CrudStatus.REFRESHING"
          :column-resizable="
            crud.options.tableInfo.componentConfig.colResizable
          "
          :bordered="{
            cell: crud.options.tableInfo.componentConfig.border,
          }"
          :stripe="crud.options.tableInfo.componentConfig.stripe"
          :show-header="crud.options.tableInfo.componentConfig.tableHeader"
          :row-selection="
            crud.options.tableInfo.componentConfig.checkbox
              ? {
                  type: 'checkbox',
                  showCheckedAll: true,
                }
              : undefined
          "
          style="height: calc(100% - 128px); margin-bottom: 12px"
        >
          <!--修改结果-->
          <template #result="{ record }">
            <!--修改完毕并且不完全修改成功的时候展示-->
            <div
              v-show="
                crud.options.tableInfo.selectKeys.includes(record.id) &&
                crud.options.tableInfo.isEdit
              "
            >
              <!--修改成功的行-->
              <div
                v-show="
                  !record.updateErr && typeof record.updateErr === 'boolean'
                "
              >
                <a-popover>
                  <a-tag color="green">
                    <icon-check />
                  </a-tag>

                  <template #title> 更改成功 </template>
                </a-popover>
              </div>
              <!--修改失败的行-->
              <div v-show="record.updateErr !== false">
                <div v-show="record.updateErr === undefined">
                  <a-tag color="blue"> <icon-edit />... </a-tag>
                </div>
                <div v-show="record.updateErr">
                  <a-popover>
                    <a-tag color="red">
                      <icon-close />
                    </a-tag>
                    <template #title> 更改失败 </template>
                    <template #content>
                      <a-list size="small">
                        <a-list-item
                          v-for="(err, index) in record.updateErr"
                          :key="index"
                        >
                          [{{ err.errorField }}]
                          {{ err.errorMsg }}
                          --->[{{ err.errorVal }}]
                        </a-list-item>
                      </a-list>
                    </template>
                  </a-popover>
                </div>
              </div>
            </div>
          </template>

          <!--认证名称-->
          <template #name="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.name }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.name }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].name
                    ? crud.options.form[record.id].name
                    : record.name
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].name"
                :default-value="record.name"
              />
            </div>
          </template>

          <!--介绍-->
          <template #introduce="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.introduce }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.introduce }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].introduce
                    ? crud.options.form[record.id].introduce
                    : record.introduce
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].introduce"
                :default-value="record.introduce"
              />
            </div>
          </template>

          <!--联系方式-->
          <template #contactInformation="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.contactInformation }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.contactInformation }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].contactInformation
                    ? crud.options.form[record.id].contactInformation
                    : record.contactInformation
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].contactInformation"
                :default-value="record.contactInformation"
              />
            </div>
          </template>

          <!--身份信息证明图片-->
          <template #identityPicture="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.identityPicture }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.identityPicture }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].identityPicture
                    ? crud.options.form[record.id].identityPicture
                    : record.identityPicture
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].identityPicture"
                :default-value="record.identityPicture"
              />
            </div>
          </template>

          <!--驳回原因-->
          <template #overruleContent="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.overruleContent }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.overruleContent }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].overruleContent
                    ? crud.options.form[record.id].overruleContent
                    : record.overruleContent
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].overruleContent"
                :default-value="record.overruleContent"
              />
            </div>
          </template>

          <!--状态-->
          <template #authenticationState="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.authenticationState }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.authenticationState }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].authenticationState
                    ? crud.options.form[record.id].authenticationState
                    : record.authenticationState
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].authenticationState"
                :default-value="record.authenticationState"
              >
                <a-option
                  v-for="s in dict.authentication_status"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

        </a-table>
        <Pagination
          style="position: absolute; right: 0; bottom: 0; padding-right: 7px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { Authentication } from '@/api/bobosns/authentication';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Authentication>({
    tag: '用户认证',
    url: '/bobosns/authentication',
    title: 'menu.bobosns.authentication',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('authentication_status');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置用户认证 columns信息
  crud.update.setTableColumns([
    {
      title: t('crud.table.update.result'),
      dataIndex: 'result',
      width: 90,
      display: false,
      fixed: 'left',
      slotName: 'result',
      ignoreSwitch: true,
    },
    {
      title: '',
      dataIndex: 'id',
      width: 150,
      display: true,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '认证名称',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '介绍',
      dataIndex: 'introduce',
      width: 150,
      display: true,
      slotName: 'introduce',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactInformation',
      width: 150,
      display: true,
      slotName: 'contactInformation',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '身份信息证明图片',
      dataIndex: 'identityPicture',
      width: 150,
      display: true,
      slotName: 'identityPicture',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '驳回原因',
      dataIndex: 'overruleContent',
      width: 150,
      display: true,
      slotName: 'overruleContent',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'authenticationState',
      width: 150,
      display: true,
      slotName: 'authenticationState',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '',
      dataIndex: 'updateTime',
      width: 180,
      display: true,
      slotName: 'updateTime',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Authentication',
  };
</script>
<style scoped>
  .container {
    height: 100%;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .panel {
    height: 100%;
    padding: 16px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }
</style>