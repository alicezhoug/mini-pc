<template>
  <div style="height: 100%">
	 <!--查询表单-->
	 <a-row :gutter="24" style="margin-bottom: 12px">
	   <!--分类名称搜索框-->
	   <a-col :span="8">
		 <a-input
				 v-model="crud.options.query.name"
				 placeholder="输入渠道名称搜索"
		 >
		   <template #prefix> Like </template>
		 </a-input>
	   </a-col>
	 
	   <!--状态：1启用、0禁用搜索框-->
	   <a-col :span="4">
		 <a-select
		   v-model="crud.options.query.enabled"
		   placeholder="状态"
		   allow-search
	 
		 >
		   <a-option
			 v-for="s in dict.comm_status"
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
		:add-permission="['video:channel:add']"
		:edit-permission="['video:channel:edit']"
		:del-permission="['video:channel:del']"
		:download-permission="['video:channel:list']"
		style="margin-bottom: 12px"
	  >
    <template #addForm>
      <a-row :gutter="12">
        <!--分类名称-->
        <a-col :span="12">
          <a-form-item
            field="name"
            label="渠道名称"
            :rules="[{ required: true, message: '渠道名称不能为空' }]"
          >
            <a-input v-model="crud.options.form.name" />
          </a-form-item>
        </a-col>
        <!--状态：1启用、0禁用-->
        <a-col :span="12">
          <a-form-item
            field="enabled"
            label="状态"
            :rules="[{ required: true, message: '状态不能为空' }]"
          >
            <a-select
              v-model="crud.options.form.enabled"
              placeholder="请选择"
              allow-search
            >
              <a-option
                v-for="s in dict.comm_status"
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
            field="remark"
            label="备注"
              :rules="[
              { required: false, message: '备注不能为空' }
              ]"
          >
            <a-textarea v-model="crud.options.form.remark"/>
          </a-form-item>
        </a-col>
      </a-row>
    </template>
  </CrudOperation>
    <!--表格-->
    <a-card
      title="渠道列表"
      :style="{ width: '100%' }"
      :bordered="false"
      style="position: relative; height: calc(100% - 84px)"
    >
      <a-table
        v-model:selectedKeys="crud.options.tableInfo.selectKeys"
        row-key="id"
        :columns="tableColumns"
        :data="crud.options.tableInfo.data"
        :pagination="false"
        :scroll="{ y: '100%' }"
        :loading="crud.status.value === CrudStatus.REFRESHING"
        :column-resizable="crud.options.tableInfo.componentConfig.colResizable"
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
        style="height: calc(100% - 80px); margin-bottom: 12px"
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
		 
		 <!--分类名称-->
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
		 
		 <!--状态：1启用、0禁用-->
		 <template #enabled="{ record }">
		   <!--正常情况下-->
		   <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
			 {{ dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (record.enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : ''}}
		   </div>
		 
		   <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
		   <div v-if="!record.editable && crud.options.tableInfo.isEdit">
			 <!--未修改的行-->
			 <div v-show="!crud.options.form[record.id]">
			   {{ dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (record.enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : '' }}
			 </div>
			 <!--修改完毕提交后-->
			 <div v-if="crud.options.form[record.id]">
			   {{
				 crud.options.form[record.id].enabled
				  ? dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (crud.options.form[record.id].enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : ''
				  : dict.comm_status ? (dict.comm_status.filter((di: any) => di.value === (record.enabled ? '1' : '0') || di.value === (record.enabled + '')))[0].label : ''
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
				 v-for="s in dict.comm_status.map((di) => {
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
		 <template #remark="{ record }">
		   <!--正常情况下-->
		   <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
			 {{ record.remark }}
		   </div>
		 
		   <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
		   <div v-if="!record.editable && crud.options.tableInfo.isEdit">
			 <!--未修改的行-->
			 <div v-show="!crud.options.form[record.id]">
			   {{ record.remark }}
			 </div>
			 <!--修改完毕提交后-->
			 <div v-if="crud.options.form[record.id]">
			   {{
				 crud.options.form[record.id].remark
				   ? crud.options.form[record.id].remark
				   : record.remark
			   }}
			 </div>
		   </div>
		 
		   <!--修改情况下-->
		   <div v-if="record.editable">
			 <a-input
			   v-model="crud.options.form[record.id].remark"
			   :default-value="record.remark"
			 />
		   </div>
		 </template>
      </a-table>
      <Pagination
        style="position: absolute; right: 0; bottom: 0; padding-right: 16px"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // crud组件
  import { useCrud, CrudStatus, CRUD } from '@/components/crud/CRUD';
  import {
    computed,
    CSSProperties,
    inject,
    onMounted,
    onUnmounted,
    provide,
    ref,
    unref,
    watchEffect,
	getCurrentInstance
  } from 'vue';
  import { useI18n } from 'vue-i18n';

  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { TableData } from '@arco-design/web-vue/es/table/interface';
  import { emitter } from '@/utils/myBus';
 
  import { Channel } from '@/api/video/channel';
  import { useDict } from '@/components/dict';


  const crud = useCrud<Channel>({
    tag: '视频渠道设置',
    url: '/video/channel',
    title: 'menu.video.kind',
    tableInfo: {
      componentConfig: {
        stripe: false,
		colResizable:true
      },
    },
  });
  provide('crud', crud);
  
  
  // 国际化
  const { t } = useI18n();

 // 字典
  const dict = useDict('comm_status');
  
  
  // region    ↓-------------------------------- 左侧字典 --------------------------------↓
  const dictDetailIsEdit = ref(false);
  // 点击行的样式
  const bodyCellStyle = (record: TableData) => {
    const style: CSSProperties = {
      color: 'rgb(var(--arcoblue-5))',
      cursor: 'pointer',
    };
    if (record.click) {
      return style;
    }
    return { cursor: 'pointer' };
  };
  // 设置视频渠道设置 columns信息
  crud.update.setTableColumns([
   {
     title: t('crud.table.update.result'),
     dataIndex: 'result',
     width: 50,
     display: false,
     fixed: 'left',
     slotName: 'result',
     ignoreSwitch: true,
   },
   {
     title: 'ID',
     dataIndex: 'id',
     width: 50,
     display: false,
     slotName: 'id',
     tooltip: true,
     ellipsis: true,
	 bodyCellStyle
   },
   {
     title: '渠道名称',
     dataIndex: 'name',
     width: 180,
     display: true,
     slotName: 'name',
     tooltip: true,
     ellipsis: true,
	  bodyCellStyle
	 
   },
   {
     title: '状态',
     dataIndex: 'enabled',
     width: 100,
     display: true,
     slotName: 'enabled',
     tooltip: true,
     ellipsis: true,
	  bodyCellStyle
   },
   {
     title: '备注',
     dataIndex: 'remark',
     width: 280,
     display: true,
     slotName: 'remark',
     tooltip: true,
     ellipsis: true,
	  bodyCellStyle
   },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // 点击表格行，显示该角色对应的菜单
  const clickDictName = ref('');
  let lastClickRecord: TableData = {};
  // 取消点击选择菜单
  function removeNowSelectMenu() {
    delete lastClickRecord.click;
    lastClickRecord = {};
    clickDictName.value = '';
  }
  const tableColClick = (record: TableData) => {
    if (!crud.options.tableInfo.isEdit && !dictDetailIsEdit.value) {
      emitter.emit('tableColClick', record);
    }

    // 编辑状态下不可选择角色所对应的菜单
    if (crud.options.tableInfo.isEdit) return;

    // 字典详情正在编辑的时候不能选择
    if (dictDetailIsEdit.value) return;

    if (lastClickRecord !== {}) {
      // 清除上一次点击的对象属性
      delete lastClickRecord.click;
    }
    clickDictName.value = record.name;
    lastClickRecord = record;
    record.click = true;
  };
  // endregion ↑-------------------------------- 左侧字典 --------------------------------↑

  // region    ↓-------------------------------- emitter --------------------------------↓

  const dictDetailName = 'dictDetailCrud';
  const dictDetailCrud = ref({
    options: {
      tableInfo: {
        isEdit: false,
      },
    },
  });

  emitter.on(dictDetailName, (data: any) => {
    dictDetailCrud.value = data;
  });

  // endregion ↑-------------------------------- emitter --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓

  crud.hook.beforeOpenEdit = async () => {
    (dictDetailCrud.value.options.tableInfo as any).data = [];
    (dictDetailCrud.value.options.tableInfo as any).selectKeys = [];
    return true;
  };

  crud.hook.afterRefresh = () => {
    const record = {
      id: -1,
      name: '',
    };
    emitter.emit('tableColClick', record);
  };

  watchEffect(() => {
    const val = dictDetailCrud.value.options.tableInfo.isEdit;
    dictDetailIsEdit.value = val;
  });

  onMounted(() => {
    crud.method.refresh();
    emitter.emit('dictCrud', crud);
  });

  onUnmounted(() => {
    emitter.off(dictDetailName);
  });

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<style scoped>
  :deep(.arco-card-body) {
    height: 100%;
  }
</style>
