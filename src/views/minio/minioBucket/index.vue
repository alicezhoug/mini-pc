<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--服务器搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.minioConfigId"
              placeholder="输入服务器搜索"
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
          </a-col>

          <!--名称搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.bucketName"
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
          :add-permission="['minio:minioBucket:add']"
          :edit-permission="['minio:minioBucket:edit']"
          :del-permission="['minio:minioBucket:del']"
          :download-permission="['minio:minioBucket:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--服务器-->
              <a-col :span="12">
                <a-form-item
                  field="minioConfigId"
                  label="服务器"
                >
                  <a-select
                    v-model="crud.options.form.minioConfigId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in minioConfigMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--名称-->
              <a-col :span="12">
                <a-form-item
                  field="bucketName"
                  label="名称"
                  :rules="[{ required: true, message: '名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.bucketName" />
                </a-form-item>
              </a-col>
              <!--充许最大值-->
              <a-col :span="12">
                <a-form-item
                  field="maxSize"
                  label="充许最大值"
                >
                  <a-input-number v-model="crud.options.form.maxSize" />
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


          <!--服务器-->
          <template #minioConfigId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
               {{ minioConfigMap[record.minioConfigId]?minioConfigMap[record.minioConfigId].name:"" }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
				{{ minioConfigMap[record.minioConfigId]?minioConfigMap[record.minioConfigId].name:"" }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].minioConfigId
                    ? crud.options.form[record.id].minioConfigId
                    : record.minioConfigId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].minioConfigId"
                :default-value="record.minioConfigId"
              >
                <a-option
                  v-for="s in minioConfigMap"
                  :key="s.id"
                  :value="s.id"
                  >{{ s.name }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--名称-->
          <template #bucketName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.bucketName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.bucketName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].bucketName
                    ? crud.options.form[record.id].bucketName
                    : record.bucketName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].bucketName"
                :default-value="record.bucketName"
              />
            </div>
          </template>

          <!--充许最大值-->
          <template #maxSize="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.maxSize }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.maxSize }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].maxSize
                    ? crud.options.form[record.id].maxSize
                    : record.maxSize
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].maxSize"
                :default-value="record.maxSize"
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
  import { MinioBucket } from '@/api/minio/minioBucket';
   import { MinioConfigList,MinioConfig } from '@/api/minio/minioConfig';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';

  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<MinioBucket>({
    tag: 'Bucket设置',
    url: '/minio/minioBucket',
    title: 'minio.minioBucket',
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

  // 设置Bucket设置 columns信息
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
      title: '服务器',
      dataIndex: 'minioConfigId',
      width: 150,
      display: true,
      slotName: 'minioConfigId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'bucketName',
      width: 150,
      display: true,
      slotName: 'bucketName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '充许最大值',
      dataIndex: 'maxSize',
      width: 150,
      display: true,
      slotName: 'maxSize',
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
 
 
 const minioConfigMap = ref<{ [key : number] : MinioConfig }>({});
 const loadMinioConfig = async () => {
 	const minioConfigListList = await MinioConfigList();
 	minioConfigMap.value = {};
 	minioConfigListList.data.list.forEach((val) => {
 		minioConfigMap.value[val.id] = val;
 	});
 };
 
 
 
  onMounted(() => {
	loadMinioConfig();
    crud.method.refresh();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'MinioBucket',
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