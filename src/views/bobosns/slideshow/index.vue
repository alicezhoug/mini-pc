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
                  <!--类型搜索框-->
                  <a-col :span="8">
                    <a-form-item field="slideshowType" label="类型">
                      <a-select
                        v-model="crud.options.query.slideshowType"
                        placeholder="输入类型搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.slideshow_type"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="slideshowState" label="状态">
                      <a-select
                        v-model="crud.options.query.slideshowState"
                        placeholder="输入状态搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.comm_status"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--标记搜索框-->
                  <a-col :span="8">
                    <a-form-item field="slideshowTag" label="标记">
                      <a-select
                        v-model="crud.options.query.slideshowTag"
                        placeholder="输入标记搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.slideshow_tag"
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
          :add-permission="['bobosns:slideshow:add']"
          :edit-permission="['bobosns:slideshow:edit']"
          :del-permission="['bobosns:slideshow:del']"
          :download-permission="['bobosns:slideshow:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--标题-->
              <a-col :span="12">
                <a-form-item
                  field="title"
                  label="标题"
                >
                  <a-input v-model="crud.options.form.title" />
                </a-form-item>
              </a-col>
              <!--轮播图-->
              <a-col :span="12">
                <a-form-item
                  field="poster"
                  label="轮播图"
                >
                </a-form-item>
              </a-col>
              <!--排序-->
              <a-col :span="12">
                <a-form-item
                  field="sort"
                  label="排序"
                >
                </a-form-item>
              </a-col>
              <!--跳转ID-->
              <a-col :span="12">
                <a-form-item
                  field="targetId"
                  label="跳转ID"
                >
                </a-form-item>
              </a-col>
              <!--类型-->
              <a-col :span="12">
                <a-form-item
                  field="slideshowType"
                  label="类型"
                >
                  <a-select
                    v-model="crud.options.form.slideshowType"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.slideshow_type"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="slideshowState"
                  label="状态"
                >
                  <a-select
                    v-model="crud.options.form.slideshowState"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.comm_status"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--标记-->
              <a-col :span="12">
                <a-form-item
                  field="slideshowTag"
                  label="标记"
                >
                  <a-select
                    v-model="crud.options.form.slideshowTag"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.slideshow_tag"
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

          <!--轮播图-->
          <template #poster="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.poster }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.poster }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].poster
                    ? crud.options.form[record.id].poster
                    : record.poster
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].poster"
                :default-value="record.poster"
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

          <!--跳转ID-->
          <template #targetId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.targetId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.targetId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].targetId
                    ? crud.options.form[record.id].targetId
                    : record.targetId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].targetId"
                :default-value="record.targetId"
              />
            </div>
          </template>

          <!--类型-->
          <template #slideshowType="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.slideshowType }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.slideshowType }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].slideshowType
                    ? crud.options.form[record.id].slideshowType
                    : record.slideshowType
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].slideshowType"
                :default-value="record.slideshowType"
              >
                <a-option
                  v-for="s in dict.slideshow_type"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--状态-->
          <template #slideshowState="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.slideshowState }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.slideshowState }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].slideshowState
                    ? crud.options.form[record.id].slideshowState
                    : record.slideshowState
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].slideshowState"
                :default-value="record.slideshowState"
              >
                <a-option
                  v-for="s in dict.comm_status"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--标记-->
          <template #slideshowTag="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.slideshowTag }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.slideshowTag }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].slideshowTag
                    ? crud.options.form[record.id].slideshowTag
                    : record.slideshowTag
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].slideshowTag"
                :default-value="record.slideshowTag"
              >
                <a-option
                  v-for="s in dict.slideshow_tag"
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
  import { Slideshow } from '@/api/bobosns/slideshow';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Slideshow>({
    tag: '广告设置',
    url: '/bobosns/slideshow',
    title: 'menu.bobosns.slideshow',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('slideshow_type', 'comm_status', 'slideshow_tag');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置广告设置 columns信息
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
      title: '标题',
      dataIndex: 'title',
      width: 150,
      display: true,
      slotName: 'title',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '轮播图',
      dataIndex: 'poster',
      width: 150,
      display: true,
      slotName: 'poster',
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
      title: '跳转ID',
      dataIndex: 'targetId',
      width: 150,
      display: true,
      slotName: 'targetId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'slideshowType',
      width: 150,
      display: true,
      slotName: 'slideshowType',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'slideshowState',
      width: 150,
      display: true,
      slotName: 'slideshowState',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '标记',
      dataIndex: 'slideshowTag',
      width: 150,
      display: true,
      slotName: 'slideshowTag',
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
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: true,
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
    name: 'Slideshow',
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