<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--会员套餐搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.memberPriceId"
              placeholder="输入会员套餐搜索"
              allow-search
              allow-clear

            >
                    <a-option
                      v-for="s in itemMemberPriceInfo"
                      :key="s.id"
                      :value="s.id">
                         {{ s.label }}
                    </a-option>
              
            </a-select>
          </a-col>

          <!--所属用户搜索框-->
          <a-col :span="6">
            <a-input-number
                    v-model="crud.options.query.userId"
                    placeholder="输入所属用户搜索"
            >
              <template #prefix> = </template>
            </a-input-number>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['market:memberUser:add']"
          :edit-permission="['market:memberUser:edit']"
          :del-permission="['market:memberUser:del']"
          :download-permission="['market:memberUser:list']"
          :show-edit="false"
		  :show-save="true"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
             
              <!--会员套餐-->
              <a-col :span="12">
                <a-form-item
                  field="memberPriceId"
                  label="会员套餐"
                  :rules="[{ required: true, message: '会员套餐不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.memberPriceId"
                    placeholder="请选择"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="s in itemMemberPriceInfo"
                      :key="s.id"
                      :value="s.id">
                         {{ s.label }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
			  <!--所属用户-->
			  <a-col :span="12">
			    <a-form-item
			      field="userId"
			      label="所属用户"
			      :rules="[{ required: true, message: '所属用户不能为空' }]"
			    >
			      <a-input-number v-model="crud.options.form.userId" />
			    </a-form-item>
			  </a-col>
              <!--开始时间-->
              <a-col :span="12">
                <a-form-item
                  field="beginDate"
                  label="开始时间"
                  :rules="[{ required: true, message: '开始时间不能为空' }]"
                >
                  <a-date-picker
                    v-model="crud.options.form.beginDate"
          
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--结束时间-->
              <a-col :span="12">
                <a-form-item
                  field="endDate"
                  label="结束时间"
                  :rules="[{ required: true, message: '结束时间不能为空' }]"
                >
                  <a-date-picker
                    v-model="crud.options.form.endDate"
               
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
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
          style="height: calc(100% - 128px); margin-bottom: 12px"
        >
 

          <!--ID-->
          <template #id="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.id }}
            </div>
          </template>

          <!--会员套餐-->
          <template #memberPriceId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{itemMemberPriceInfo.filter((di: any) =>di.id === record.memberPriceId)[0].label}}
             
            </div>
            
          </template>

          <!--开始时间-->
          <template #beginDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.beginDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.beginDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].beginDate
                    ? crud.options.form[record.id].beginDate
                    : record.beginDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].beginDate"        
                :default-value="record.beginDate"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </div>
          </template>

          <!--结束时间-->
          <template #endDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.endDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.endDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].endDate
                    ? crud.options.form[record.id].endDate
                    : record.endDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].endDate"
                :default-value="record.endDate"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </div>
          </template>

          <!--所属用户-->
          <template #userId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.userId }}
            </div>
          </template>

          <!--创建者-->
          <template #createBy="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.createBy }}
            </div>
          </template>

          <!--更新者-->
          <template #updateBy="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.updateBy }}
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
  import { MemberUser } from '@/api/market/memberUser';
  import { allMemberPrice } from '@/api/market/memberUser';
  
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<MemberUser>({
    tag: '会员用户',
    url: '/market/memberUser',
    title: 'menu.market.memberUser',
    tableInfo: {
      componentConfig: {
        stripe: false,
        colResizable:true
      },
    },
  });
  provide('crud', crud);



  
  const itemMemberPriceInfo = ref([]);
  // 加载引用数据
  const loadRefTableData = async () => {
      const allMemberPriceData=await allMemberPrice();
	  itemMemberPriceInfo.value=allMemberPriceData.data;
  };
  
  
  
  
  
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置会员用户 columns信息
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
	  title: '用户昵称',
	  dataIndex: 'createBy',
	  width: 150,
	  display: true,
	  slotName: 'createBy',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '会员套餐',
      dataIndex: 'memberPriceId',
      width: 150,
      display: true,
      slotName: 'memberPriceId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      width: 180,
      display: true,
      slotName: 'beginDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      width: 180,
      display: true,
      slotName: 'endDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '所属用户',
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
      display: false,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '更新者',
      dataIndex: 'updateBy',
      width: 150,
      display: false,
      slotName: 'updateBy',
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
    loadRefTableData();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'MemberUser',
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