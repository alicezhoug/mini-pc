<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="crud.options.query"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-scrollbar style="height: 104px; overflow: auto">
                <a-row :gutter="16" style="width: 100%">
                  <!--交易名称搜索框-->
                  <a-col :span="8">
                    <a-form-item field="name" label="交易名称">
                      <a-input
                        v-model="crud.options.query.name"
                        placeholder="输入交易名称搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--交易类型搜索框-->
                  <a-col :span="8">
                    <a-form-item field="kind" label="交易类型">
                      <a-select
                        v-model="crud.options.query.kind"
                        placeholder="输入交易类型搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.tran_status"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--交易用户搜索框-->
                  <a-col :span="8">
                    <a-form-item field="userId" label="交易用户">
                      <a-input-number
                        v-model="crud.options.query.userId"
                        placeholder="输入交易用户搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-scrollbar>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <RROperation direction="vertical"/>
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <CrudOperation
          :add-permission="['pay:transaction:add']"
          :edit-permission="['pay:transaction:edit']"
          :del-permission="['pay:transaction:del']"
          :download-permission="['pay:transaction:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--交易名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="交易名称"
                  :rules="[{ required: true, message: '交易名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--交易类型-->
              <a-col :span="12">
                <a-form-item
                  field="kind"
                  label="交易类型"
                  :rules="[{ required: true, message: '交易类型不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.kind"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.tran_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--金币-->
              <a-col :span="12">
                <a-form-item
                  field="fee"
                  label="金币"
                  :rules="[{ required: true, message: '金币不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.fee" />
                </a-form-item>
              </a-col>
              <!--交易用户-->
              <a-col :span="12">
                <a-form-item
                  field="userId"
                  label="交易用户"
                  :rules="[{ required: true, message: '交易用户不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.userId" />
                </a-form-item>
              </a-col>
              <!--关联业务ID-->
              <a-col :span="12">
                <a-form-item
                  field="refId"
                  label="关联业务ID"
                >
                  <a-input-number v-model="crud.options.form.refId" />
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
          style="height: calc(100% - 209px); margin-bottom: 12px"
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

          <!--交易名称-->
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

          <!--交易类型-->
          <template #kind="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
			  {{ dict.tran_status ? (dict.tran_status.filter((di: any) => di.value === record.kind || di.value === (record.kind + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
				 {{ dict.tran_status ? (dict.tran_status.filter((di: any) => di.value === record.kind || di.value === (record.kind + '')))[0].label : ''}}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].kind
                    ? crud.options.form[record.id].kind
                    : record.kind
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].kind"
                :default-value="record.kind+''"
              >
                <a-option
                  v-for="s in dict.tran_status"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--金币-->
          <template #fee="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.fee }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.fee }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].fee
                    ? crud.options.form[record.id].fee
                    : record.fee
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].fee"
                :default-value="record.fee"
              />
            </div>
          </template>

          <!--交易用户-->
          <template #userId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.userId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.userId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].userId
                    ? crud.options.form[record.id].userId
                    : record.userId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].userId"
                :default-value="record.userId"
              />
            </div>
          </template>

          <!--关联业务ID-->
          <template #refId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.refId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.refId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].refId
                    ? crud.options.form[record.id].refId
                    : record.refId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].refId"
                :default-value="record.refId"
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
  import { Transaction } from '@/api/pay/transaction';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
 
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Transaction>({
    tag: '交易明细',
    url: '/pay/transaction',
    title: '',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('tran_status');
  const instance = getCurrentInstance();
 
  // 设置交易明细 columns信息
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
	  title: '交易用户',
	  dataIndex: 'userId',
	  width: 150,
	  display: true,
	  slotName: 'userId',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '交易名称',
      dataIndex: 'name',
      width: 200,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '交易类型',
      dataIndex: 'kind',
      width: 150,
      display: true,
      slotName: 'kind',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '金币',
      dataIndex: 'fee',
      width: 150,
      display: true,
      slotName: 'fee',
      tooltip: true,
      ellipsis: true,
    },
    
    {
      title: '关联业务ID',
      dataIndex: 'refId',
      width: 150,
      display: true,
      slotName: 'refId',
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
    name: 'Transaction',
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