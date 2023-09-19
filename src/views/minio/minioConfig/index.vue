<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--名称搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.name"
                    placeholder="输入名称搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['minio:minioConfig:add']"
          :edit-permission="['minio:minioConfig:edit']"
          :del-permission="['minio:minioConfig:del']"
          :download-permission="['minio:minioConfig:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="名称"
                  :rules="[{ required: true, message: '名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--地址-->
              <a-col :span="12">
                <a-form-item
                  field="endpoint"
                  label="endpoint"
                  :rules="[{ required: true, message: 'endpoint不能为空' }]"
                >
                  <a-input v-model="crud.options.form.endpoint" />
                </a-form-item>
              </a-col>
              <!--accessKey-->
              <a-col :span="12">
                <a-form-item
                  field="accessKey"
                  label="accessKey"
                >
                  <a-input v-model="crud.options.form.accessKey" />
                </a-form-item>
              </a-col>
              <!--secretKey-->
              <a-col :span="12">
                <a-form-item
                  field="secretKey"
                  label="secretKey"
                >
                  <a-input v-model="crud.options.form.secretKey" />
                </a-form-item>
              </a-col>
              <!--secure-->
              <a-col :span="12">
                <a-form-item
                  field="secure"
                  label="secure"
                >
                  <a-select
                    v-model="crud.options.form.secure"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--port-->
              <a-col :span="12">
                <a-form-item
                  field="port"
                  label="port"
                  :rules="[{ required: true, message: 'port不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.port" />
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

          <!--名称-->
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

          <!--地址-->
          <template #endpoint="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.endpoint }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.endpoint }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].endpoint
                    ? crud.options.form[record.id].endpoint
                    : record.endpoint
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].endpoint"
                :default-value="record.endpoint"
              />
            </div>
          </template>

          <!--accessKey-->
          <template #accessKey="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.accessKey }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.accessKey }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].accessKey
                    ? crud.options.form[record.id].accessKey
                    : record.accessKey
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].accessKey"
                :default-value="record.accessKey"
              />
            </div>
          </template>

          <!--secretKey-->
          <template #secretKey="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.secretKey }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.secretKey }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].secretKey
                    ? crud.options.form[record.id].secretKey
                    : record.secretKey
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].secretKey"
                :default-value="record.secretKey"
              />
            </div>
          </template>

          <!--secure-->
          <template #secure="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.secure ? '1' : '0') || di.value === (record.secure + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.secure ? '1' : '0') || di.value === (record.secure + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].secure
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].secure ? '1' : '0') || di.value === (record.secure + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.secure ? '1' : '0') || di.value === (record.secure + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].secure"
                :default-value="record.secure ? '1' : '0'"
                allow-search
              >
                <a-option
                  v-for="s in dict.yes_no_status.map((di) => {
                    if (di.value === 'true') di.value = '1';
                    if (di.value === 'false') di.value = '0';
                    return di;
                  })"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--port-->
          <template #port="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.port }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.port }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].port
                    ? crud.options.form[record.id].port
                    : record.port
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].port"
                :default-value="record.port"
              />
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
  import { MinioConfig } from '@/api/minio/minioConfig';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<MinioConfig>({
    tag: 'Minio服务设置',
    url: '/minio/minioConfig',
    title: 'minio.minioConfig',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('yes_no_status');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置Minio服务设置 columns信息
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
      title: 'ID',
      dataIndex: 'id',
      width: 150,
      display: true,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '地址',
      dataIndex: 'endpoint',
      width: 150,
      display: true,
      slotName: 'endpoint',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'accessKey',
      dataIndex: 'accessKey',
      width: 150,
      display: true,
      slotName: 'accessKey',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'secretKey',
      dataIndex: 'secretKey',
      width: 150,
      display: true,
      slotName: 'secretKey',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'secure',
      dataIndex: 'secure',
      width: 150,
      display: true,
      slotName: 'secure',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'port',
      dataIndex: 'port',
      width: 150,
      display: true,
      slotName: 'port',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '更新时间',
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
    name: 'MinioConfig',
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