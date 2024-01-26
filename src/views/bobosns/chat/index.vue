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
                  <!--发送用户搜索框-->
                  <a-col :span="8">
                    <a-form-item field="userId" label="发送用户">
                      <a-input-number
                        v-model="crud.options.query.userId"
                        placeholder="输入发送用户搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                  <!--接收用户搜索框-->
                  <a-col :span="8">
                    <a-form-item field="objectId" label="接收用户">
                      <a-input-number
                        v-model="crud.options.query.objectId"
                        placeholder="输入接收用户搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                  <!--聊天内容搜索框-->
                  <a-col :span="8">
                    <a-form-item field="chatContent" label="聊天内容">
                      <a-input
                        v-model="crud.options.query.chatContent"
                        placeholder="输入聊天内容搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--读状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isRead" label="读状态">
                      <a-select
                        v-model="crud.options.query.isRead"
                        placeholder="输入读状态搜索"
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
          :add-permission="['bobosns:chat:add']"
          :edit-permission="['bobosns:chat:edit']"
          :del-permission="['bobosns:chat:del']"
          :download-permission="['bobosns:chat:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--ID-->
              <a-col :span="12">
                <a-form-item
                  field="id"
                  label="ID"
                  :rules="[{ required: true, message: 'ID不能为空' }]"
                >
                </a-form-item>
              </a-col>
              <!--发送用户-->
              <a-col :span="12">
                <a-form-item
                  field="userId"
                  label="发送用户"
                  :rules="[{ required: true, message: '发送用户不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.userId" />
                </a-form-item>
              </a-col>
              <!--接收用户-->
              <a-col :span="12">
                <a-form-item
                  field="objectId"
                  label="接收用户"
                  :rules="[{ required: true, message: '接收用户不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.objectId" />
                </a-form-item>
              </a-col>
              <!--聊天图片-->
              <a-col :span="12">
                <a-form-item
                  field="chatImage"
                  label="聊天图片"
                >
                  <a-input v-model="crud.options.form.chatImage" />
                </a-form-item>
              </a-col>
              <!--聊天音频-->
              <a-col :span="12">
                <a-form-item
                  field="chatAudioUrl"
                  label="聊天音频"
                >
                  <a-input v-model="crud.options.form.chatAudioUrl" />
                </a-form-item>
              </a-col>
              <!--转发id-->
              <a-col :span="12">
                <a-form-item
                  field="referId"
                  label="转发id"
                >
                </a-form-item>
              </a-col>
              <!--读状态-->
              <a-col :span="12">
                <a-form-item
                  field="isRead"
                  label="读状态"
                  :rules="[{ required: true, message: '读状态不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.isRead"
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
              <!--创建日期-->
              <a-col :span="12">
                <a-form-item
                  field="createTime"
                  label="创建日期"
                >
                </a-form-item>
              </a-col>
              <!--聊天内容-->
              <a-col :span="24">
                <a-form-item
                  field="chatContent"
                  label="聊天内容"
                >
                  <a-textarea v-model="crud.options.form.chatContent"/>
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

          <!--ID-->
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

          <!--发送用户-->
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

          <!--接收用户-->
          <template #objectId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.objectId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.objectId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].objectId
                    ? crud.options.form[record.id].objectId
                    : record.objectId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].objectId"
                :default-value="record.objectId"
              />
            </div>
          </template>

          <!--聊天内容-->
          <template #chatContent="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.chatContent }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.chatContent }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].chatContent
                    ? crud.options.form[record.id].chatContent
                    : record.chatContent
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].chatContent"
                :default-value="record.chatContent"
              />
            </div>
          </template>

          <!--聊天图片-->
          <template #chatImage="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.chatImage }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.chatImage }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].chatImage
                    ? crud.options.form[record.id].chatImage
                    : record.chatImage
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].chatImage"
                :default-value="record.chatImage"
              />
            </div>
          </template>

          <!--聊天音频-->
          <template #chatAudioUrl="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.chatAudioUrl }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.chatAudioUrl }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].chatAudioUrl
                    ? crud.options.form[record.id].chatAudioUrl
                    : record.chatAudioUrl
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].chatAudioUrl"
                :default-value="record.chatAudioUrl"
              />
            </div>
          </template>

          <!--转发id-->
          <template #referId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.referId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.referId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].referId
                    ? crud.options.form[record.id].referId
                    : record.referId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].referId"
                :default-value="record.referId"
              />
            </div>
          </template>

          <!--读状态-->
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
              <a-select
                v-model="crud.options.form[record.id].isRead"
                :default-value="record.isRead"
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

          <!--创建日期-->
          <template #createTime="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.createTime }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.createTime }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].createTime
                    ? crud.options.form[record.id].createTime
                    : record.createTime
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].createTime"
                show-time
                :default-value="record.createTime"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
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
  import { Chat } from '@/api/bobosns/chat';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Chat>({
    tag: '聊天管理',
    url: '/bobosns/chat',
    title: 'bobosns.chat',
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

  // 设置聊天管理 columns信息
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
      title: '发送用户',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '接收用户',
      dataIndex: 'objectId',
      width: 150,
      display: true,
      slotName: 'objectId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '聊天内容',
      dataIndex: 'chatContent',
      width: 150,
      display: true,
      slotName: 'chatContent',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '聊天图片',
      dataIndex: 'chatImage',
      width: 150,
      display: true,
      slotName: 'chatImage',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '聊天音频',
      dataIndex: 'chatAudioUrl',
      width: 150,
      display: true,
      slotName: 'chatAudioUrl',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '聊天音频时长',
      dataIndex: 'chatAudioLength',
      width: 150,
      display: true,
      slotName: 'chatAudioLength',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '转发id',
      dataIndex: 'referId',
      width: 150,
      display: true,
      slotName: 'referId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '读状态',
      dataIndex: 'isRead',
      width: 150,
      display: true,
      slotName: 'isRead',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'chatState',
      width: 150,
      display: true,
      slotName: 'chatState',
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
    name: 'Chat',
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