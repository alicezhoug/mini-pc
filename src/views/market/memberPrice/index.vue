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
                  <!--所属会员搜索框-->
                  <a-col :span="8">
                    <a-form-item field="memberId" label="所属会员">
                      <a-select
                        v-model="crud.options.query.memberId"
                        placeholder="输入所属会员搜索"
                        allow-search
                        allow-clear

                      >
                        <a-option
                          v-for="s in itemMemberInfo"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.label }}
                        </a-option>
                        
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--标题搜索框-->
                  <a-col :span="8">
                    <a-form-item field="title" label="标题">
                      <a-input
                        v-model="crud.options.query.title"
                        placeholder="输入标题搜索"
                      >
                        <template #prefix> = </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="status" label="状态">
                      <a-select
                        v-model="crud.options.query.status"
                        placeholder="输入状态搜索"
                        allow-search
                        allow-clear

                      >
                        <a-option
                          v-for="s in dict.yes_no_status"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                        
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--单位(0:天,1:月,2:季,3:年)搜索框-->
                  <a-col :span="8">
                    <a-form-item field="unit" label="周期">
                      <a-select
                        v-model="crud.options.query.unit"
                        placeholder="选择周期搜索"
                        allow-search
                        allow-clear

                      >
                        <a-option
                          v-for="s in dict.period_type"
                          :key="s.detailId"
                          :value="s.value"
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
          :add-permission="['market:memberPrice:add']"
          :edit-permission="['market:memberPrice:edit']"
          :del-permission="['market:memberPrice:del']"
          :download-permission="['market:memberPrice:list']"
          :show-edit="false"
		  :show-save="true"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--所属会员-->
              <a-col :span="12">
                <a-form-item
                  field="memberId"
                  label="所属会员"
                  :rules="[{ required: true, message: '所属会员不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.memberId"
                    placeholder="请选择"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="s in itemMemberInfo"
                      :key="s.id"
                      :value="s.id">
                         {{ s.label }}
                    </a-option>
                  </a-select>
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
              <!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="status"
                  label="启用"
                  :rules="[{ required: true, message: '启用不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.status"
                    placeholder="请选择"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.value">
                        {{ s.label }}
                      </a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--周期-->
              <a-col :span="12">
                <a-form-item
                  field="period"
                  label="周期"
                >
                  <a-input-number v-model="crud.options.form.period" />
                </a-form-item>
              </a-col>
              <!--单位(0:天,1:月,2:季,3:年)-->
              <a-col :span="12">
                <a-form-item
                  field="unit"
                  label="单位"
                >
                  <a-select
                    v-model="crud.options.form.unit"
                    placeholder="请选择"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="s in dict.period_type"
                      :key="s.detailId"
                      :value="s.value">
                        {{ s.label }}
                      </a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--序顺-->
              <a-col :span="12">
                <a-form-item
                  field="ind"
                  label="序顺"
                >
                  <a-input-number v-model="crud.options.form.ind" />
                </a-form-item>
              </a-col>
              <!--金币数-->
              <a-col :span="12">
                <a-form-item
                  field="coin"
                  label="金币数"
                >
                  <a-input-number v-model="crud.options.form.coin" />
                </a-form-item>
              </a-col>
              <!--原金币数-->
              <a-col :span="12">
                <a-form-item
                  field="coin2"
                  label="原金币数"
                >
                  <a-input-number v-model="crud.options.form.coin2" />
                </a-form-item>
              </a-col>
              <!--是否选中-->
              <a-col :span="12">
                <a-form-item
                  field="selected"
                  label="是否选中"
                >
                  <a-select
                    v-model="crud.options.form.selected"
                    placeholder="请选择"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.value">
                        {{ s.label }}
                      </a-option
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
          :column-resizable="crud.options.tableInfo.componentConfig.colResizable"
          :bordered="{cell: crud.options.tableInfo.componentConfig.border}"
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
 

          <!--所属会员-->
          <template #memberId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{itemMemberInfo.filter((di: any) =>di.id === record.memberId)[0].label}}
             
            </div>
            
          </template>

          <!--标题-->
          <template #title="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.title }}
            </div>
          </template>

          <!--状态-->
          <template #status="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === record.status))[0].label : ''}}
             
            </div>
            
          </template>

          <!--周期-->
          <template #period="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.period }}
            </div>
          </template>

          <!--单位(0:天,1:月,2:季,3:年)-->
          <template #unit="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ dict.period_type ? (dict.period_type.filter((di: any) => di.value === record.unit))[0].label : ''}}
             
            </div>
            
          </template>

          <!--序顺-->
          <template #ind="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.ind }}
            </div>
          </template>

          <!--金币数-->
          <template #coin="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.coin }}
            </div>
          </template>

          <!--原金币数-->
          <template #coin2="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.coin2 }}
            </div>
          </template>

          <!--是否选中-->
          <template #selected="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === record.selected))[0].label : ''}}
             
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
  import { MemberPrice } from '@/api/market/memberPrice';
  import { allMember } from '@/api/market/memberPrice';
  
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
 
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<MemberPrice>({
    tag: '会员价格设置',
    url: '/market/memberPrice',
    title: 'menu.market.memberPrice',
    tableInfo: {
      componentConfig: {
        stripe: false,
        colResizable:true
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('yes_no_status', 'period_type');
  
  const itemMemberInfo = ref([]);
  // 加载引用数据
  const loadRefTableData = async () => {
      const allMemberData=await allMember();
	  itemMemberInfo.value=allMemberData.data;
  };
  
  
  
  
  
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置会员价格设置 columns信息
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
      title: '所属会员',
      dataIndex: 'memberId',
      width: 150,
      display: true,
      slotName: 'memberId',
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
      title: '启用',
      dataIndex: 'status',
      width: 150,
      display: true,
      slotName: 'status',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '周期',
      dataIndex: 'period',
      width: 150,
      display: true,
      slotName: 'period',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 150,
      display: true,
      slotName: 'unit',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '序顺',
      dataIndex: 'ind',
      width: 150,
      display: true,
      slotName: 'ind',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '金币数',
      dataIndex: 'coin',
      width: 150,
      display: true,
      slotName: 'coin',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '原金币数',
      dataIndex: 'coin2',
      width: 150,
      display: true,
      slotName: 'coin2',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '是否选中',
      dataIndex: 'selected',
      width: 150,
      display: true,
      slotName: 'selected',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建者ID',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
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
    loadRefTableData();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'MemberPrice',
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