<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--板块名称搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.plateName"
                    placeholder="输入板块名称搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <!--状态搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.plateState"
              placeholder="输入状态搜索"
              allow-search

            >
              <a-option
                v-for="s in dict.comm_status"
                :key="s.detailId"
                :value="s.value"
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
          :add-permission="['bobosns:plate:add']"
          :edit-permission="['bobosns:plate:edit']"
          :del-permission="['bobosns:plate:del']"
          :download-permission="['bobosns:plate:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--板块名称-->
              <a-col :span="12">
                <a-form-item
                  field="plateName"
                  label="板块名称"
                  :rules="[{ required: true, message: '板块名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.plateName" />
                </a-form-item>
              </a-col>
              <!--排序-->
              <a-col :span="12">
                <a-form-item
                  field="sort"
                  label="排序"
                >
                  <a-input-number v-model="crud.options.form.sort" />
                </a-form-item>
              </a-col>
              <!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="plateState"
                  label="状态"
                  :rules="[{ required: true, message: '状态不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.plateState"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.comm_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--板块介绍-->
              <a-col :span="24">
                <a-form-item
                  field="plateIntroduce"
                  label="板块介绍"
                >
                  <a-textarea v-model="crud.options.form.plateIntroduce"/>
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

          <!--板块名称-->
          <template #plateName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.plateName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.plateName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].plateName
                    ? crud.options.form[record.id].plateName
                    : record.plateName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].plateName"
                :default-value="record.plateName"
              />
            </div>
          </template>

          <!--排序-->
          <template #sort="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.sort }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.sort }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].sort
                    ? crud.options.form[record.id].sort
                    : record.sort
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].sort"
                :default-value="record.sort"
              />
            </div>
          </template>

          <!--板块介绍-->
          <template #plateIntroduce="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.plateIntroduce }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.plateIntroduce }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].plateIntroduce
                    ? crud.options.form[record.id].plateIntroduce
                    : record.plateIntroduce
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].plateIntroduce"
                :default-value="record.plateIntroduce"
              />
            </div>
          </template>

          <!--状态-->
          <template #plateState="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (record.plateState ? '1' : '0') || di.value === (record.plateState + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (record.plateState ? '1' : '0') || di.value === (record.plateState + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].plateState
                   ? dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (crud.options.form[record.id].plateState ? '1' : '0') || di.value === (record.plateState + '')))[0].label : ''
                   : dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (record.plateState ? '1' : '0') || di.value === (record.plateState + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].plateState"
                :default-value="record.plateState ? '1' : '0'"
                allow-search
              >
                <a-option
                  v-for="s in dict.comm_status.map((di) => {
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
  import { Plate } from '@/api/bobosns/plate';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Plate>({
    tag: '板块设置',
    url: '/bobosns/plate',
    title: '',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('comm_status');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置板块设置 columns信息
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
      display: false,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '板块名称',
      dataIndex: 'plateName',
      width: 150,
      display: true,
      slotName: 'plateName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 150,
      display: true,
      slotName: 'sort',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '板块介绍',
      dataIndex: 'plateIntroduce',
      width: 150,
      display: true,
      slotName: 'plateIntroduce',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'plateState',
      width: 150,
      display: true,
      slotName: 'plateState',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '更新者',
      dataIndex: 'updateBy',
      width: 150,
      display: true,
      slotName: 'updateBy',
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
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: true,
      slotName: 'createBy',
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
    name: 'Plate',
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