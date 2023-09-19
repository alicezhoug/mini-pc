<template>
  <div ref="rootDiv"></div>
  <a-card
    :style="{ width: '100%' }"
    :bordered="false"
    style="position: relative; height: 100%"
  >
    <!--添加窗口-->
    <a-modal
      v-model:visible="addVisible"
      :mask-closable="false"
      :popup-container="rootDiv"
      :width="650"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
      @before-open="handleBeforeOpen">
      <template #title>
        <a-space>
          <span>{{ $t('crud.add') + $t(crud.options.title) }}:</span>
          <span style="color: rgb(var(--arcoblue-5))">{{ clickDictName }}</span>
        </a-space>
      </template>
      <a-form
        ref="addForm"
        :model="crud.options.form"
        :style="{ marginTop: '10px' }"
        auto-label-width
      >
        <!--字典标签名称-->
        <a-row>
          <a-form-item
            field="key"
            label="键"
            :rules="[{ required: true, message: '键不能为空' }]"
          >
            <a-input v-model="crud.options.form.key" />
          </a-form-item>
        </a-row>
        <!--字典详情值名称-->
        <a-row>
			<a-form-item
			  field="value"
			  label="值"
			    :rules="[
			    { required: true, message: '值不能为空' }
			    ]"
			>
			  <a-textarea v-model="crud.options.form.value"/>
			</a-form-item>
        </a-row>
        <!--详情排序-->
        <a-row>
          <a-form-item
            field="dictSort"
            label="备注"
          >
            <a-input-number v-model="crud.options.form.remark"/>
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>
    <!--标题：字典详情-->
    <template #title>
      <span>渠道配置详情 </span>
      <span style="color: rgb(var(--arcoblue-5))">{{ clickDictName }}</span>
      <span
        v-show="clickDictName === '' && !isEdit"
        style="color: var(--color-neutral-4)"
        >请点击一个渠道
      </span>
      <span
        v-show="clickDictName === '' && isEdit"
        style="color: var(--color-neutral-4)"
        >正在编辑渠道，无法查看详情。
      </span>
    </template>
    <!--操作按钮-->
    <template #extra>
      <a-space>
        <!--确认修改/取消修改-->
        <a-button
          v-if="crud.options.tableInfo.isEdit"
          type="dashed"
          status="success"
          size="mini"
          :loading="crud.status.value === CrudStatus.UPDATING"
          @click="confirmEdit"
        >
          <template #icon>
            <icon-check />
          </template>
          {{ $t('crud.confirmEdit') }}</a-button
        >
        <a-button
          v-if="crud.options.tableInfo.isEdit"
          type="dashed"
          status="warning"
          size="mini"
          @click="cancelEdit"
        >
          <template #icon>
            <icon-close />
          </template>
          {{ $t('crud.cancelEdit') }}</a-button
        >
        <a-button
          v-if="!crud.options.tableInfo.isEdit"
          v-permission="['system:dictDetail:add']"
          :disabled="clickDictName === ''"
          type="outline"
          size="mini"
          @click="addVisible = true"
          ><template #icon><icon-plus /></template>新增</a-button
        >
        <a-button
          v-if="!crud.options.tableInfo.isEdit"
          v-permission="['system:dictDetail:edit']"
          type="outline"
          status="success"
          size="mini"
          :disabled="crud.options.tableInfo.selectKeys.length === 0"
          @click="editClick"
          ><template #icon><icon-edit /></template>修改</a-button
        >
        <a-popconfirm
          content="你确定要删除所选的行吗?"
          @ok="crud.update.setStatus(CrudStatus.NEED_DELETE)"
        >
          <a-button
            v-if="!crud.options.tableInfo.isEdit"
            v-permission="['system:dictDetail:del']"
            type="outline"
            size="mini"
            status="danger"
            :loading="crud.status.value === CrudStatus.DELETING"
            :disabled="crud.options.tableInfo.selectKeys.length === 0"
            ><template #icon><icon-delete /></template>删除</a-button
          >
        </a-popconfirm>

        <a-button
          v-if="!crud.options.tableInfo.isEdit"
          v-permission="['system:dictDetail:list']"
          :disabled="clickDictName === ''"
          status="warning"
          type="outline"
          size="mini"
          @click="crud.method.refresh()"
          ><template #icon><icon-refresh /></template>刷新</a-button
        >
      </a-space>
    </template>
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
	 
	
	   <!--键-->
	   <template #key="{ record }">
		 <!--正常情况下-->
		 <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
		   {{ record.key }}
		 </div>
	 
		 <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
		 <div v-if="!record.editable && crud.options.tableInfo.isEdit">
		   <!--未修改的行-->
		   <div v-show="!crud.options.form[record.id]">
			 {{ record.key }}
		   </div>
		   <!--修改完毕提交后-->
		   <div v-if="crud.options.form[record.id]">
			 {{
			   crud.options.form[record.id].key
				 ? crud.options.form[record.id].key
				 : record.key
			 }}
		   </div>
		 </div>
	 
		 <!--修改情况下-->
		 <div v-if="record.editable">
		   <a-input
			 v-model="crud.options.form[record.id].key"
			 :default-value="record.key"
		   />
		 </div>
	   </template>
	 
	   <!--值-->
	   <template #value="{ record }">
		 <!--正常情况下-->
		 <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
		   {{ record.value }}
		 </div>
	 
		 <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
		 <div v-if="!record.editable && crud.options.tableInfo.isEdit">
		   <!--未修改的行-->
		   <div v-show="!crud.options.form[record.id]">
			 {{ record.value }}
		   </div>
		   <!--修改完毕提交后-->
		   <div v-if="crud.options.form[record.id]">
			 {{
			   crud.options.form[record.id].value
				 ? crud.options.form[record.id].value
				 : record.value
			 }}
		   </div>
		 </div>
	 
		 <!--修改情况下-->
		 <div v-if="record.editable">
		   <a-input
			 v-model="crud.options.form[record.id].value"
			 :default-value="record.value"
		   />
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
</template>

<script lang="ts" setup>
  import {
    computed,
    getCurrentInstance,
    inject,
    onMounted,
    onUnmounted,
    provide,
    reactive,
    ref,
    watch,
    watchEffect,
  } from 'vue';
  import { emitter } from '@/utils/myBus';
  import { CRUD, CrudStatus, useCrud } from '@/components/crud/CRUD';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { ChannelProperties } from '@/api/video/channelProperties';

  // 国际化
  const { t } = useI18n();
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  

  const crud = useCrud<ChannelProperties>({
    tag: '视频渠道属性设置',
    url: '/video/channelProperties',
    title: '渠道属性',
    tableInfo: {
      componentConfig: {
        stripe: false,
		colResizable:true
      },
    },
  });
  provide('crud', crud);
  
  // 设置视频渠道属性设置 columns信息
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
    },
    {
      title: '键',
      dataIndex: 'key',
      width: 100,
      display: true,
      slotName: 'key',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 150,
      display: true,
      slotName: 'value',
      
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 50,
      display: true,
      slotName: 'remark',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // endregion ↑-------------------------------- crud --------------------------------↑

  // region    ↓-------------------------------- addForm --------------------------------↓
  const addVisible = ref(false);
  const addForm = ref(null);
  const rootDiv = ref(null);

  const handleBeforeOpen = () => {
    if (!crud.hook.beforeOpenAdd()) {
      addVisible.value = false;
    }
  };

  const handleBeforeOk = async (done: any) => {
    let validate = false;
    await (addForm.value as any).validate(
      (errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) validate = true;
      }
    );
    if (validate) {
      // 发送请求添加
      await crud.method.add();
      if (crud.options.props.addForm.success) {
        global.$notification.success('添加成功');
        done();
      } else {
        global.$notification.warning(
          `添加失败:${crud.options.props.addForm.reason}`
        );
        done(false);
      }
    } else {
      done(false);
    }
  };

  const handleCancel = () => {
    crud.update.setForm({});
    addVisible.value = false;
  };
  // endregion ↑-------------------------------- addForm --------------------------------↑

  // region    ↓-------------------------------- edit --------------------------------↓
  // 点击修改触发
  const editClick = async () => {
    const canEdit = await crud.hook.beforeOpenEdit();
    if (!canEdit) {
      return;
    }
    // 显示数据操作结果列
    crud.update.displayColRes(true);
    // 准备好form容器
    crud.update.setForm({});
    // 让选择的表格列可以编辑,要修改的id进行标注

    crud.update.turnToEditable(crud.options.tableInfo.data as any[]);
    // 准备好保存修改成功列的id数组
    crud.options.props.formUpdateSuccessIds = [];
    // 编辑状态
    crud.update.setTableIsEdit(true);
    // 禁止继续选择列
    crud.update.appendTableConfig({ checkbox: false });

    crud.hook.afterOpenEdit();
  }; // 取消修改
  const cancelEdit = () => {
    crud.update.setTableIsEdit(false);
    crud.update.turnToUnEditable(crud.options.tableInfo.data as any[]);
    crud.update.setTableSelectKeys([]);
    crud.update.appendTableConfig({ checkbox: true });
    crud.update.setForm({});
    delete crud.options.props.formUpdateSuccessIds;
    // 取消结果列显示
    crud.update.displayColRes(false);
    crud.method.refresh();
  };

  // 点击确认修改触发
  const confirmEdit = () => {
    crud.update.setStatus(CrudStatus.NEED_UPDATE);
    console.log('confirm edit');
  };

  // endregion ↑-------------------------------- edit --------------------------------↑

  // region    ↓-------------------------------- emitter --------------------------------↓
  const isEdit = ref(false);
  const clickDictName = ref('');
  const nowDictRecord = ref({});
  const DictTableColClick = 'tableColClick';
  const DictCrud = 'dictCrud';
  const dictCrud = ref({
    options: {
      tableInfo: {
        isEdit: false,
      },
    },
  });
  emitter.on(DictTableColClick, (data: any) => {
    nowDictRecord.value = data;
    clickDictName.value = data.name;
    crud.update.setQuery({ channelId: data.id });
    crud.update.setStatus(CrudStatus.NEED_REFRESH);
  });
  emitter.on(DictCrud, (data: any) => {
    dictCrud.value = data;
  });
  // endregion ↑-------------------------------- emitter --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓

  crud.hook.beforeRefresh = () => {
    crud.options.tableInfo.selectKeys = [];
    return true;
  };

  crud.hook.beforeEdit = () => {
    crud.options.tableInfo.selectKeys.forEach((val) => {
      crud.options.form[val].channelId = (nowDictRecord.value as any).id;
    });

    return true;
  };

  crud.hook.beforeAdd = () => {
    crud.options.form.channelId = (nowDictRecord.value as any).id;
    return true;
  };

  onMounted(() => {
    emitter.emit('dictDetailCrud', crud);
  });

  onUnmounted(() => {
    emitter.off(DictTableColClick);
    emitter.off(DictCrud);
  });

  watchEffect(() => {
    const val = dictCrud.value.options.tableInfo.isEdit;
    isEdit.value = val;
    if (val) {
      clickDictName.value = '';
      crud.options.tableInfo.data = [];
    }
  });
  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<style scoped>
  :deep(.arco-card-body) {
    height: 100%;
  }
</style>
