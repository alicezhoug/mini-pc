<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--用户id搜索框-->
          <a-col :span="6">
            <a-input-number
                    v-model="crud.options.query.userId"
                    placeholder="输入用户id搜索"
            >
              <template #prefix> Like </template>
            </a-input-number>
          </a-col>

          <!--用户关注用户ID搜索框-->
          <a-col :span="6">
            <a-input-number
                    v-model="crud.options.query.userFollowId"
                    placeholder="输入用户关注用户ID搜索"
            >
              <template #prefix> Like </template>
            </a-input-number>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['bobosns:userFollow:add']"
          :edit-permission="['bobosns:userFollow:edit']"
          :del-permission="['bobosns:userFollow:del']"
          :download-permission="['bobosns:userFollow:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--用户关注用户ID-->
              <a-col :span="12">
                <a-form-item
                  field="userFollowId"
                  label="用户关注用户ID"
                  :rules="[{ required: true, message: '用户关注用户ID不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.userFollowId" />
                </a-form-item>
              </a-col>
              <!--读(0未读，1已读)-->
              <a-col :span="12">
                <a-form-item
                  field="isRead"
                  label="读(0未读，1已读)"
                  :rules="[{ required: true, message: '读(0未读，1已读)不能为空' }]"
                >
                </a-form-item>
              </a-col>
              <!--状态(0正常，1用户取消关注)-->
              <a-col :span="12">
                <a-form-item
                  field="userFollowState"
                  label="状态(0正常，1用户取消关注)"
                  :rules="[{ required: true, message: '状态(0正常，1用户取消关注)不能为空' }]"
                >
                </a-form-item>
              </a-col>
              <!--用户id-->
              <a-col :span="24">
                <a-form-item
                  field="userId"
                  label="用户id"
                    :rules="[
                    { required: true, message: '用户id不能为空' }
                    ]"
                >
                  <a-textarea v-model="crud.options.form.userId"/>
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

          <!--用户id-->
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

          <!--用户关注用户ID-->
          <template #userFollowId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.userFollowId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.userFollowId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].userFollowId
                    ? crud.options.form[record.id].userFollowId
                    : record.userFollowId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].userFollowId"
                :default-value="record.userFollowId"
              />
            </div>
          </template>

          <!--读(0未读，1已读)-->
          <template #isRead="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.isRead }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.isRead }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].isRead
                    ? crud.options.form[record.id].isRead
                    : record.isRead
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].isRead"
                :default-value="record.isRead"
              />
            </div>
          </template>

          <!--状态(0正常，1用户取消关注)-->
          <template #userFollowState="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.userFollowState }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.userFollowState }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].userFollowState
                    ? crud.options.form[record.id].userFollowState
                    : record.userFollowState
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].userFollowState"
                :default-value="record.userFollowState"
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
  import { UserFollow } from '@/api/bobosns/userFollow';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<UserFollow>({
    tag: '用户关注明细',
    url: '/bobosns/userFollow',
    title: 'menu.bobosns.userFollow',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置用户关注明细 columns信息
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
      title: '用户id',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户关注用户ID',
      dataIndex: 'userFollowId',
      width: 150,
      display: true,
      slotName: 'userFollowId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '读(0未读，1已读)',
      dataIndex: 'isRead',
      width: 150,
      display: true,
      slotName: 'isRead',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态(0正常，1用户取消关注)',
      dataIndex: 'userFollowState',
      width: 150,
      display: true,
      slotName: 'userFollowState',
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
    name: 'UserFollow',
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