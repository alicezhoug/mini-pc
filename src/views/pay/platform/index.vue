<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--平台名称搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.name"
                    placeholder="输入平台名称搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <!--是否启用搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.enabled"
              placeholder="输入是否启用搜索"
              allow-search

            >
              <a-option
                v-for="s in dict.yes_no_status"
                :key="s.detailId"
                :value="s.value"
              >
                {{ s.label }}
              </a-option>
            </a-select>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['pay:platform:add']"
          :edit-permission="['pay:platform:edit']"
          :del-permission="['pay:platform:del']"
          :download-permission="['pay:platform:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--平台名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="平台名称"
                  :rules="[{ required: true, message: '平台名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--是否启用-->
              <a-col :span="12">
                <a-form-item
                  field="enabled"
                  label="是否启用"
                  :rules="[{ required: true, message: '是否启用不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.enabled"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--备注-->
              <a-col :span="24">
                <a-form-item
                  field="remak"
                  label="备注"
                >
                  <a-textarea v-model="crud.options.form.remak"/>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
		  <template #right>
		    <a-button
		      v-if="!crud.options.tableInfo.isEdit"
		      v-permission="['pay:platformProperties:list']"
		      type="outline"
		      size="small"
		  	  :disabled="clickPlatformId==''"
		      class="button"
		      @click="propertyVisible = true "
		    >
		      属性设置
		    </a-button>
			<a-button
			  v-if="!crud.options.tableInfo.isEdit"
			  v-permission="['pay:platformCoin:list']"
			  type="outline"
			  size="small"
			  :disabled="clickPlatformId==''"
			  class="button"
			  @click="coinVisible = true "
			>
			  金币支付设置
			</a-button>
		  </template>	
        </CrudOperation>
		<PropertySetting />
		<CoinSetting/>
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
		  @row-click="tableColClick"
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

          <!--平台名称-->
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

          <!--是否启用-->
          <template #enabled="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].enabled
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].enabled"
                :default-value="record.enabled ? '1' : '0'"
                allow-search
              >
                <a-option
                  v-for="s in dict.yes_no_status.map((di) => {
                    if (di.value === 'true') di.value = '1';
                    if (di.value === 'false') di.value = '0';
                    return di;
                  })"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--备注-->
          <template #remak="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.remak }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.remak }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].remak
                    ? crud.options.form[record.id].remak
                    : record.remak
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].remak"
                :default-value="record.remak"
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
  import { Platform } from '@/api/pay/platform';
  import { computed, onMounted, provide, ref,CSSProperties } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import PropertySetting from '@/views/pay/platform/property-setting.vue';
  import CoinSetting from '@/views/pay/platform/coin-setting.vue';
  import { useI18n } from 'vue-i18n';
  import {TableData} from '@arco-design/web-vue/es/table/interface';
  
  import { emitter } from '@/utils/myBus';
  

  const { t } = useI18n();
  const crud = useCrud<Platform>({
    tag: '支付平台',
    url: '/pay/platform',
    title: 'menu.pay.platform',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);


 // 点击行的样式
  const bodyCellStyle = (record: TableData) => {
    const style: CSSProperties = {
      color: 'rgb(var(--arcoblue-5))',
    };
    if (record.click) {
      return style;
    }
    return {};
  };
  

  // 字典
  const dict = useDict('yes_no_status');
 
  // 设置支付平台 columns信息
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
	  bodyCellStyle,
    },
    {
      title: '平台名称',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: 150,
      display: true,
      slotName: 'enabled',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '备注',
      dataIndex: 'remak',
      width: 150,
      display: true,
      slotName: 'remak',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      display: true,
      slotName: 'updateTime',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
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
  
  
  

    let lastClickRecord: TableData = {};
    // 点击表格行，记录平台id&名称
    const clickPlatformName = ref('');
    const clickPlatformId = ref('');
    
    const tableColClick = async (record: TableData) => {
		
      // 编辑状态下不可选择
      if (crud.options.tableInfo.isEdit) return;
	  
	  
	  if (lastClickRecord !== {}) {
	    // 清除上一次点击的对象属性
	    delete lastClickRecord.click;
	  }
	  
      clickPlatformName.value = record.name;
  	  clickPlatformId.value=record.id;
  	  lastClickRecord = record;
      record.click = true;
	  emitter.emit('selectPlatformData', record);
    };
    
  // quartzLog
    const coinVisible = ref(false);
	const propertyVisible = ref(false);
    
    provide('coinVisible', coinVisible);
	provide('propertyVisible', propertyVisible);
	

  
  onMounted(() => {
	
    crud.method.refresh();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Platform',
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