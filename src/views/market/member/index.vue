<template>
	<div class="container">
		<div class="panel">
			<div style="position: relative; height: 100%">
				<!--查询表单-->
				<a-row :gutter="24" style="margin-bottom: 12px">
					<!--标题搜索框-->
					<a-col :span="6">
						<a-input v-model="crud.options.query.title" placeholder="输入标题搜索">
							<template #prefix> Like </template>
						</a-input>
					</a-col>

					<!--状态搜索框-->
					<a-col :span="6">
						<a-select v-model="crud.options.query.status" placeholder="输入状态搜索" allow-search allow-clear>
							<a-option v-for="s in dict.yes_no_status" :key="s.detailId" :value="s.value">
								{{ s.label }}
							</a-option>

						</a-select>
					</a-col>

					<a-col :span="6">
						<RROperation />
					</a-col>
				</a-row>
				<CrudOperation :add-permission="['market:member:add']" :edit-permission="['market:member:edit']"
					:del-permission="['market:member:del']" :download-permission="['market:member:list']"
					:show-edit="false" :show-save="true" style="margin-bottom: 12px">
					<template #addForm>
						<a-row :gutter="12">
							<!--标题-->
							<a-col :span="12">
								<a-form-item field="title" label="标题" :rules="[{ required: true, message: '标题不能为空' }]">
									<a-input v-model="crud.options.form.title" />
								</a-form-item>
							</a-col>
							<!--状态-->
							<a-col :span="12">
								<a-form-item field="status" label="是否启用" :rules="[{ required: true, message: '状态不能为空' }]">
									<a-select v-model="crud.options.form.status" placeholder="请选择" allow-search
										allow-clear>
										<a-option v-for="s in dict.yes_no_status" :key="s.detailId" :value="s.value">
											{{ s.label }}
										</a-option>
									</a-select>
								</a-form-item>
							</a-col>
						
							<a-col :span="12">
								<a-form-item field="ind" label="邀请好友(位)">
									<a-input v-model="crud.options.form.inviteesUserCount" />
								</a-form-item>
								
							</a-col>
							<!--金币数-->
							<a-col :span="12">
								<a-form-item field="ind" label="赠送会员(天)">
									<a-input v-model="crud.options.form.inviteesMemberDays" />
								</a-form-item>
							</a-col>
							
						</a-row>
					</template>
				</CrudOperation>
				<SpecDetail />
				<!--表格-->
				<a-table ref="table" v-model:selectedKeys="crud.options.tableInfo.selectKeys" row-key="id"
					:columns="tableColumns" :data="crud.options.tableInfo.data" :pagination="false"
					:scroll="{ y: '100%' }" :loading="crud.status.value === CrudStatus.REFRESHING"
					:column-resizable="crud.options.tableInfo.componentConfig.colResizable"
					:bordered="{cell: crud.options.tableInfo.componentConfig.border}"
					@row-click="tableColClick"
					:stripe="crud.options.tableInfo.componentConfig.stripe"
					:show-header="crud.options.tableInfo.componentConfig.tableHeader" :row-selection="
            crud.options.tableInfo.componentConfig.checkbox
              ? {
                  type: 'checkbox',
                  showCheckedAll: true,
                }
              : undefined
          " style="height: calc(100% - 128px); margin-bottom: 12px">


					<!--状态-->
					<template #status="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === record.status))[0].label : ''}}

						</div>

					</template>

				<!--图片-->
				<template #domainImg="{ record }">
					<a-upload :custom-request="customRequest" list-type="picture-card" :show-upload-button="true"
						:show-file-list="false">
						<template #upload-button>
							<a-avatar :size="50" class="info-avatar">
								<template #trigger-icon>
									<icon-camera />
								</template>
								<img v-if="record.domainImg" :src="record.domainImg" />
							</a-avatar>
						</template>
					</a-upload>
				</template>

					<template #optional="{ record }">
						<a-space>
							<a-button @click="handSpecSetting(record.id,record.title)">权益设置</a-button>
						</a-space>
					</template>

				</a-table>
				<Pagination style="position: absolute; right: 0; bottom: 0; padding-right: 7px" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';
	import { Member,iconUpload} from '@/api/market/member';

	import { computed, onMounted, provide, ref, reactive } from 'vue';
	import { useDict } from '@/components/dict';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
	import RROperation from '@/components/crud/RROperation.vue'
	import Pagination from '@/components/crud/Pagination.vue';
	import {TableData} from '@arco-design/web-vue/es/table/interface';

	import { emitter } from '@/utils/myBus';
	import SpecDetail from '@/views/market/member/spec-detail.vue';

	import { useI18n } from 'vue-i18n';
	
	import {
		RequestOption,
	} from '@arco-design/web-vue/es/upload/interfaces';

	const { t } = useI18n();
	const crud = useCrud<Member>({
		tag: '会员设置',
		url: '/market/member',
		title: 'menu.market.member',
		tableInfo: {
			componentConfig: {
				stripe: false,
				colResizable: true
			},
		},
	});
	provide('crud', crud);


	// 显示comm-detail子窗口
	const visibleCommDetailDialog = ref(false);
	provide('isVisible', visibleCommDetailDialog);


	const handSpecSetting = (id : number, memberName : string) => {
		visibleCommDetailDialog.value = true;

		// 传递到子组件数据
		const childData = reactive({
			id: -1,
			memberName: ''
		});
		childData.memberName = memberName;
		childData.id = id;

		emitter.emit('childData', childData);
	};

	// 字典
	const dict = useDict('yes_no_status', 'period_type');






	// 设置会员设置 columns信息
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
			title: '图标',
			dataIndex: 'domainImg',
			width: 150,
			display: true,
			slotName: 'domainImg',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '邀请用户（位）',
			dataIndex: 'inviteesUserCount',
			width: 150,
			display: true,
			slotName: 'inviteesUserCount',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '赠送会员（天）',
			dataIndex: 'inviteesMemberDays',
			width: 150,
			display: true,
			slotName: 'inviteesMemberDays',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '是否启用',
			dataIndex: 'status',
			width: 150,
			display: true,
			slotName: 'status',
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
		{
			title: '操作',
			width: 250,
			display: true,
			align: 'center',
			slotName: 'optional',
			tooltip: true,
			ellipsis: true,
			fixed: 'right',
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
	
	
	// 点击表格行，记录Id
	const clickDataId = ref('');
	const tableColClick = async (record : TableData) => {
		// 编辑状态下不可选择
		if (crud.options.tableInfo.isEdit) return;
		clickDataId.value = record.id;
	};
	
	
	
	onMounted(() => {
		crud.method.refresh();
	});



	const customRequest = (options : RequestOption) => {
		// docs: https://axios-http.com/docs/cancellation
		const controller = new AbortController();

		(async function requestWrap() {
			const {
				onProgress,
				onError,
				onSuccess,
				fileItem,
				name = 'file',
			} = options;
			onProgress(20);
			const formData = new FormData();
			formData.append(name as string, fileItem.file as Blob);
			const onUploadProgress = (event : ProgressEvent) => {
				let percent;
				if (event.total > 0) {
					percent = (event.loaded / event.total) * 100;
				}
				onProgress(parseInt(String(percent), 10), event);
			};
			try {
				const res = await iconUpload(formData, clickDataId.value as string, {
					controller,
					onUploadProgress,
				});
				crud.method.refresh();
				onSuccess(res);
			} catch (error) {
				onError(error);
			}
		})();
		return {
			abort() {
				controller.abort();
			},
		};
	};


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
	export default {
		name: 'Member',
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