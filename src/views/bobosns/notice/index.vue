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
                  <!--用户ID搜索框-->
                  <a-col :span="8">
                    <a-form-item field="userId" label="用户ID">
                      <a-input-number
                        v-model="crud.options.query.userId"
                        placeholder="输入用户ID搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                  <!--帖子ID搜索框-->
                  <a-col :span="8">
                    <a-form-item field="postsId" label="帖子ID">
                      <a-input-number
                        v-model="crud.options.query.postsId"
                        placeholder="输入帖子ID搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                  <!--订单ID搜索框-->
                  <a-col :span="8">
                    <a-form-item field="orderId" label="订单ID">
                      <a-input-number
                        v-model="crud.options.query.orderId"
                        placeholder="输入订单ID搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                  <!--标题搜索框-->
                  <a-col :span="8">
                    <a-form-item field="title" label="标题">
                      <a-input
                        v-model="crud.options.query.title"
                        placeholder="输入标题搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--是否已读(0未读，1已读)搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isRead" label="是否已读">
                      <a-select
                        v-model="crud.options.query.isRead"
                        placeholder="输入是否已读搜索"
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
                  <!--类型(0系统通知，1活动通知，2帖子点赞通知，3帖子收藏通知，4帖子评论通知，5评论点赞通知，6打赏通知，7帖子审核通知，8订单通知)搜索框-->
                  <a-col :span="8">
                    <a-form-item field="noticeType" label="通知类型">
                      <a-select
                        v-model="crud.options.query.noticeType"
                        placeholder="输入通知类型搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.notice_type"
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
          :add-permission="['bobosns:notice:add']"
          :edit-permission="['bobosns:notice:edit']"
          :del-permission="['bobosns:notice:del']"
          :download-permission="['bobosns:notice:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--用户ID-->
              <a-col :span="12">
                <a-form-item
                  field="userId"
                  label="用户ID"
                  :rules="[{ required: true, message: '用户ID不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.userId" />
                </a-form-item>
              </a-col>
              
              <!--标题-->
              <a-col :span="12">
                <a-form-item
                  field="title"
                  label="标题"
                  :rules="[{ required: true, message: '标题不能为空' }]"
                >
                  <a-input v-model="crud.options.form.title" />
                </a-form-item>
              </a-col>
              <!--是否已读(0未读，1已读)-->
              <a-col :span="12">
                <a-form-item
                  field="isRead"
                  label="是否已读"
                  :rules="[{ required: true, message: '是否已读不能为空' }]"
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
              <!--类型(0系统通知，1活动通知，2帖子点赞通知，3帖子收藏通知，4帖子评论通知，5评论点赞通知，6打赏通知，7帖子审核通知，8订单通知)-->
              <a-col :span="12">
                <a-form-item
                  field="noticeType"
                  label="通知类型"
                  :rules="[{ required: true, message: '通知类型不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.noticeType"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.notice_type"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--内容-->
              <a-col :span="24">
                <a-form-item
                  field="content"
                  label="内容"
                    :rules="[
                    { required: true, message: '内容不能为空' }
                    ]"
                >
                  <a-textarea v-model="crud.options.form.content"/>
                </a-form-item>
              </a-col>
			  <!--帖子ID-->
			  <a-col :span="12">
			    <a-form-item
			      field="postsId"
			      label="帖子ID"
			    >
			      <a-input-number v-model="crud.options.form.postsId" />
			    </a-form-item>
			  </a-col>
			  <!--订单ID-->
			  <a-col :span="12">
			    <a-form-item
			      field="orderId"
			      label="订单ID"
			    >
			      <a-input-number v-model="crud.options.form.orderId" />
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

          <!--用户ID-->
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

          <!--帖子ID-->
          <template #postsId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.postsId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.postsId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].postsId
                    ? crud.options.form[record.id].postsId
                    : record.postsId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].postsId"
                :default-value="record.postsId"
              />
            </div>
          </template>

          <!--订单ID-->
          <template #orderId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.orderId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.orderId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].orderId
                    ? crud.options.form[record.id].orderId
                    : record.orderId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].orderId"
                :default-value="record.orderId"
              />
            </div>
          </template>

          <!--标题-->
          <template #title="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.title }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.title }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].title
                    ? crud.options.form[record.id].title
                    : record.title
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].title"
                :default-value="record.title"
              />
            </div>
          </template>

          <!--内容-->
          <template #content="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.content }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.content }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].content
                    ? crud.options.form[record.id].content
                    : record.content
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].content"
                :default-value="record.content"
              />
            </div>
          </template>

          <!--是否已读(0未读，1已读)-->
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

          <!--类型(0系统通知，1活动通知，2帖子点赞通知，3帖子收藏通知，4帖子评论通知，5评论点赞通知，6打赏通知，7帖子审核通知，8订单通知)-->
          <template #noticeType="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.noticeType }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.noticeType }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].noticeType
                    ? crud.options.form[record.id].noticeType
                    : record.noticeType
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].noticeType"
                :default-value="record.noticeType"
              >
                <a-option
                  v-for="s in dict.notice_type"
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
  import { Notice } from '@/api/bobosns/notice';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Notice>({
    tag: '通知管理',
    url: '/bobosns/notice',
    title: 'menu.bobosns.notice',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('yes_no_status', 'notice_type');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置通知管理 columns信息
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
      width: 100,
      display: true,
      slotName: 'id',
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
      title: '标题',
      dataIndex: 'title',
      width: 150,
      display: true,
      slotName: 'title',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: 150,
      display: true,
      slotName: 'content',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '是否已读',
      dataIndex: 'isRead',
      width: 150,
      display: true,
      slotName: 'isRead',
      tooltip: true,
      ellipsis: true,
    },
	{
	  title: '帖子ID',
	  dataIndex: 'postsId',
	  width: 150,
	  display: true,
	  slotName: 'postsId',
	  tooltip: true,
	  ellipsis: true,
	},
	{
	  title: '订单ID',
	  dataIndex: 'orderId',
	  width: 150,
	  display: true,
	  slotName: 'orderId',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '通知类型',
      dataIndex: 'noticeType',
      width: 150,
      display: true,
      slotName: 'noticeType',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: false,
      slotName: 'createBy',
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
      display: false,
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
    name: 'Notice',
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