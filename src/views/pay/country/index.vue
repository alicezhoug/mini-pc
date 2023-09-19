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
                  <!--英文名称搜索框-->
                  <a-col :span="8">
                    <a-form-item field="enName" label="英文名称">
                      <a-input
                        v-model="crud.options.query.enName"
                        placeholder="输入英文名称搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--电话区号搜索框-->
                  <a-col :span="8">
                    <a-form-item field="phoneCode" label="电话区号">
                      <a-input
                        v-model="crud.options.query.phoneCode"
                        placeholder="输入电话区号搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--地区代码搜索框-->
                  <a-col :span="8">
                    <a-form-item field="areaCode" label="地区代码">
                      <a-input
                        v-model="crud.options.query.areaCode"
                        placeholder="输入地区代码搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
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
          :add-permission="['pay:country:add']"
          :edit-permission="['pay:country:edit']"
          :del-permission="['pay:country:del']"
          :download-permission="['pay:country:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--英文名称-->
              <a-col :span="12">
                <a-form-item
                  field="enName"
                  label="英文名称"
                  :rules="[{ required: true, message: '英文名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.enName" />
                </a-form-item>
              </a-col>
              <!--电话区号-->
              <a-col :span="12">
                <a-form-item
                  field="phoneCode"
                  label="电话区号"
                  :rules="[{ required: true, message: '电话区号不能为空' }]"
                >
                  <a-input v-model="crud.options.form.phoneCode" />
                </a-form-item>
              </a-col>
              <!--货币符号-->
              <a-col :span="12">
                <a-form-item
                  field="symbol"
                  label="货币符号"
                  :rules="[{ required: true, message: '货币符号不能为空' }]"
                >
                  <a-input v-model="crud.options.form.symbol" />
                </a-form-item>
              </a-col>
              <!--地区代码-->
              <a-col :span="12">
                <a-form-item
                  field="areaCode"
                  label="地区代码"
                  :rules="[{ required: true, message: '地区代码不能为空' }]"
                >
                  <a-input v-model="crud.options.form.areaCode" />
                </a-form-item>
              </a-col>
              <!--金币兑换率-->
              <a-col :span="12">
                <a-form-item
                  field="coinRate"
                  label="金币兑换率"
                  :rules="[{ required: true, message: '金币兑换率不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.coinRate" />
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

          <!--英文名称-->
          <template #enName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.enName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.enName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].enName
                    ? crud.options.form[record.id].enName
                    : record.enName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].enName"
                :default-value="record.enName"
              />
            </div>
          </template>

          <!--电话区号-->
          <template #phoneCode="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.phoneCode }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.phoneCode }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].phoneCode
                    ? crud.options.form[record.id].phoneCode
                    : record.phoneCode
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].phoneCode"
                :default-value="record.phoneCode"
              />
            </div>
          </template>

          <!--货币符号-->
          <template #symbol="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.symbol }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.symbol }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].symbol
                    ? crud.options.form[record.id].symbol
                    : record.symbol
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].symbol"
                :default-value="record.symbol"
              />
            </div>
          </template>

          <!--地区代码-->
          <template #areaCode="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.areaCode }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.areaCode }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].areaCode
                    ? crud.options.form[record.id].areaCode
                    : record.areaCode
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].areaCode"
                :default-value="record.areaCode"
              />
            </div>
          </template>

          <!--金币兑换率-->
          <template #coinRate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.coinRate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.coinRate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].coinRate
                    ? crud.options.form[record.id].coinRate
                    : record.coinRate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].coinRate"
                :default-value="record.coinRate"
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
  import { Country } from '@/api/pay/country';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Country>({
    tag: '国家设置',
    url: '/pay/country',
    title: 'pay.country',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置国家设置 columns信息
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
      title: 'Id',
      dataIndex: 'id',
      width: 150,
      display: false,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '英文名称',
      dataIndex: 'enName',
      width: 150,
      display: true,
      slotName: 'enName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '电话区号',
      dataIndex: 'phoneCode',
      width: 150,
      display: true,
      slotName: 'phoneCode',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '货币符号',
      dataIndex: 'symbol',
      width: 150,
      display: true,
      slotName: 'symbol',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '地区代码',
      dataIndex: 'areaCode',
      width: 150,
      display: true,
      slotName: 'areaCode',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '金币兑换率',
      dataIndex: 'coinRate',
      width: 150,
      display: true,
      slotName: 'coinRate',
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
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      display: true,
      slotName: 'updateTime',
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
    name: 'Country',
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