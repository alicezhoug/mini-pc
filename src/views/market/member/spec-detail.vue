<template>
	<a-modal :visible="visible" width="50vw" height="60vw" @cancel="visible = false">
		<template #title><span style="color: red">{{memberName}}</span>会员项设置</template>

		<a-row :gutter="24">
			<CrudOperation :add-permission="['market:memberBenefits:add']"
				:edit-permission="['market:memberBenefits:edit']" :del-permission="['market:memberBenefits:del']"
				:download-permission="['market:memberBenefits:list']" :show-edit="false" :show-save="true"
				style="margin-bottom: 12px">
				<template #addForm>
					<a-row :gutter="12">

						<!--名称-->
						<a-col :span="12">
							<a-form-item field="text" label="名称" :rules="[{ required: true, message: '名称不能为空' }]">
								<a-input v-model="crud.options.form.text" />
							</a-form-item>
						</a-col>

						<!--描述-->
						<a-col :span="24">
							<a-form-item field="remark" label="描述">
								<a-textarea v-model="crud.options.form.remark" />
							</a-form-item>
						</a-col>
					</a-row>
				</template>
			</CrudOperation>
		</a-row>
		<!--表格栏-->
		<a-row>
			<!--表格-->
			<a-table ref="table" v-model:selectedKeys="crud.options.tableInfo.selectKeys" row-key="id"
				:columns="tableColumns" :data="crud.options.tableInfo.data" :pagination="false" :scroll="{ y: '100%' }"
				:loading="crud.status.value === CrudStatus.REFRESHING"
				:column-resizable="crud.options.tableInfo.componentConfig.colResizable"
				:bordered="{cell: crud.options.tableInfo.componentConfig.border}"
				:stripe="crud.options.tableInfo.componentConfig.stripe"
				@row-click="tableColClick"
				:show-header="crud.options.tableInfo.componentConfig.tableHeader" :row-selection="
				crud.options.tableInfo.componentConfig.checkbox
				  ? {
					  type: 'checkbox',
					  showCheckedAll: true,
					}
				  : undefined
			  " style="height: calc(100% - 128px); margin-bottom: 12px">
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
			</a-table>
		</a-row>
		<template #footer>
			<Pagination :show-page-size="true" />
		</template>
	</a-modal>
</template>

<script lang="ts" setup>
	import { computed, ref, inject, onMounted, provide } from 'vue';
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';
	import Pagination from '@/components/crud/Pagination.vue';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
	import { useI18n } from 'vue-i18n';
	import { emitter } from '@/utils/myBus';
	import { allMember, iconUpload, MemberBenefits } from '@/api/market/memberBenefits';
	import {TableData} from '@arco-design/web-vue/es/table/interface';


	import {
		RequestOption,
	} from '@arco-design/web-vue/es/upload/interfaces';

	const visible = inject<boolean>('isVisible');




	const { t } = useI18n();
	const crud = useCrud<MemberBenefits>({
		tag: '会员权益',
		url: '/market/memberBenefits',
		title: 'menu.market.memberBenefits',
		tableInfo: {
			componentConfig: {
				stripe: false,
				colResizable: true
			},
		},
	});
	provide('crud', crud);



	const itemMemberInfo = ref([]);
	// 加载引用数据
	const loadRefTableData = async () => {
		const allMemberData = await allMember();
		itemMemberInfo.value = allMemberData.data;
	};



	// 设置返佣详情 columns信息
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
			title: '名称',
			dataIndex: 'text',
			width: 150,
			display: true,
			slotName: 'text',
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
			title: '描述',
			dataIndex: 'remark',
			width: 150,
			display: true,
			slotName: 'remark',
			tooltip: true,
			ellipsis: true,
		},


	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});



	// 点击表格行，记录Id
	const clickDataId = ref('');
	const tableColClick = async (record : TableData) => {
		// 编辑状态下不可选择
		if (crud.options.tableInfo.isEdit) return;
		clickDataId.value = record.id;
	};


	onMounted(() => {
		crud.method.refresh();
		loadRefTableData();
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

	const memberName = ref();
	const memberId = ref();


	emitter.on("childData", (data : any) => {
		memberName.value = data.memberName;
		memberId.value = data.id;


		crud.update.setQuery({ memberId: memberId.value });
		crud.update.setStatus(CrudStatus.NEED_REFRESH);
	});


	crud.hook.beforeOpenAdd = () => {
		crud.options.form.memberId = memberId.value;
		return true;
	};
	crud.hook.afterResetParams = () => {
		crud.options.form.memberId = memberId.value;
		return true;
	};
</script>

<style scoped></style>