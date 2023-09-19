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
                  <!--平台搜索框-->
                  <a-col :span="8">
                    <a-form-item field="platformId" label="平台">
                      <a-select
                        v-model="crud.options.query.platformId"
                        placeholder="输入平台搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.yes_no_status"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--支付搜索框-->
                  <a-col :span="8">
                    <a-form-item field="modeId" label="支付">
                      <a-select
                        v-model="crud.options.query.modeId"
                        placeholder="输入支付搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.yes_no_status"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--金币搜索框-->
                  <a-col :span="8">
                    <a-form-item field="coinId" label="金币">
                      <a-select
                        v-model="crud.options.query.coinId"
                        placeholder="输入金币搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.yes_no_status"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
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
          :add-permission="['pay:platformCoin:add']"
          :edit-permission="['pay:platformCoin:edit']"
          :del-permission="['pay:platformCoin:del']"
          :download-permission="['pay:platformCoin:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--Id-->
              <a-col :span="12">
                <a-form-item
                  field="id"
                  label="Id"
                  :rules="[{ required: true, message: 'Id不能为空' }]"
                >
                </a-form-item>
              </a-col>
              <!--平台-->
              <a-col :span="12">
                <a-form-item
                  field="platformId"
                  label="平台"
                  :rules="[{ required: true, message: '平台不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.platformId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--支付-->
              <a-col :span="12">
                <a-form-item
                  field="modeId"
                  label="支付"
                  :rules="[{ required: true, message: '支付不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.modeId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--金币-->
              <a-col :span="12">
                <a-form-item
                  field="coinId"
                  label="金币"
                  :rules="[{ required: true, message: '金币不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.coinId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--支付金额-->
              <a-col :span="12">
                <a-form-item
                  field="fee"
                  label="支付金额"
                  :rules="[{ required: true, message: '支付金额不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.fee" />
                </a-form-item>
              </a-col>
              <!--用户Id-->
              <a-col :span="12">
                <a-form-item
                  field="userId"
                  label="用户Id"
                  :rules="[{ required: true, message: '用户Id不能为空' }]"
                >
                </a-form-item>
              </a-col>
              <!--有效支付时间(秒)-->
              <a-col :span="24">
                <a-form-item
                  field="validPayTime"
                  label="有效支付时间(秒)"
                    :rules="[
                    { required: true, message: '有效支付时间(秒)不能为空' }
                    ]"
                >
                  <a-textarea v-model="crud.options.form.validPayTime"/>
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

          <!--Id-->
          <template #id="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.id }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.id }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].id
                    ? crud.options.form[record.id].id
                    : record.id
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].id"
                :default-value="record.id"
              />
            </div>
          </template>

          <!--平台-->
          <template #platformId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.platformId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.platformId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].platformId
                    ? crud.options.form[record.id].platformId
                    : record.platformId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].platformId"
                :default-value="record.platformId"
              >
                <a-option
                  v-for="s in dict.yes_no_status"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--支付-->
          <template #modeId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.modeId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.modeId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].modeId
                    ? crud.options.form[record.id].modeId
                    : record.modeId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].modeId"
                :default-value="record.modeId"
              >
                <a-option
                  v-for="s in dict.yes_no_status"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--金币-->
          <template #coinId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.coinId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.coinId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].coinId
                    ? crud.options.form[record.id].coinId
                    : record.coinId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].coinId"
                :default-value="record.coinId"
              >
                <a-option
                  v-for="s in dict.yes_no_status"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--支付金额-->
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

          <!--有效支付时间(秒)-->
          <template #validPayTime="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.validPayTime }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.validPayTime }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].validPayTime
                    ? crud.options.form[record.id].validPayTime
                    : record.validPayTime
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].validPayTime"
                :default-value="record.validPayTime"
              />
            </div>
          </template>

          <!--用户Id-->
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
  import { PlatformCoin } from '@/api/pay/platformCoin';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<PlatformCoin>({
    tag: '平台金币设置',
    url: '/pay/platformCoin',
    title: 'pay.platformCoin',
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

  // 设置平台金币设置 columns信息
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
      display: true,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '平台',
      dataIndex: 'platformId',
      width: 150,
      display: true,
      slotName: 'platformId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '支付',
      dataIndex: 'modeId',
      width: 150,
      display: true,
      slotName: 'modeId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '金币',
      dataIndex: 'coinId',
      width: 150,
      display: true,
      slotName: 'coinId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '支付金额',
      dataIndex: 'fee',
      width: 150,
      display: true,
      slotName: 'fee',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '有效支付时间(秒)',
      dataIndex: 'validPayTime',
      width: 150,
      display: true,
      slotName: 'validPayTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户Id',
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
    name: 'PlatformCoin',
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