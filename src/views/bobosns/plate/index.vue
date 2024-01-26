<template>
	<div class="container">
		<div class="panel">
			<a-row :gutter="14" style="height: 100%">
				<!--左侧部门树控件-->
				<a-col :xs="24" :sm="8" :md="8" :lg="8" :xl="5" :xxl="5" style="height: 100%">
					<div style="
					    width: 100%;
					    height:100%;
					    overflow-y: auto;
					  ">
						<a-input-search v-model="searchKey" style="margin-bottom: 8px"
							:placeholder="$t('menu.bobosns.config.search')" />
						<a-tree v-show="!crud.options.tableInfo.isEdit" :data="treeData" show-line @select="treeSelect">
							<template #title="nodeData">
								<template
									v-if="((index = getMatchIndex(nodeData?.title)), index < 0)">{{ nodeData?.title }}</template>
								<span v-else>
									{{ nodeData?.title?.substr(0, index) }}
									<span style="color: var(--color-primary-light-4)">
										{{ nodeData?.title?.substr(index, searchKey.length) }}
									</span>{{ nodeData?.title?.substr(index + searchKey.length) }}
								</span>
							</template>
						</a-tree>
						<a-alert v-show="crud.options.tableInfo.isEdit">你正在修改数据,无法选择数据</a-alert>
					</div>
				</a-col>
				<!--右侧用户表格-->
				<a-col style="position: relative; height: 100%; padding-left: 10px" :xs="24" :sm="16" :md="16" :lg="16"
					:xl="19" :xxl="19">
					<!--查询表单-->
					<a-row :gutter="24" style="margin-bottom: 12px">
						<!--板块名称搜索框-->
						<a-col :span="6">
							<a-input v-model="crud.options.query.plateName" placeholder="输入板块名称搜索">
								<template #prefix> Like </template>
							</a-input>
						</a-col>

						<!--状态搜索框-->
						<a-col :span="6">
							<a-select v-model="crud.options.query.plateState" placeholder="输入状态搜索" allow-search>
								<a-option v-for="s in dict.yes_no_status" :key="s.detailId" :value="s.value">
									{{ s.label }}
								</a-option>
							</a-select>
						</a-col>
						<a-col :span="6">
							<RROperation />
						</a-col>
					</a-row>
					<div style="position: relative; height: 100%">

						<CrudOperation :add-permission="['bobosns:plate:add']" :edit-permission="['bobosns:plate:edit']"
							:del-permission="['bobosns:plate:del']" :download-permission="['bobosns:plate:list']"
							:show-edit="false" :show-save="true" style="margin-bottom: 12px">
							<template #addForm>
								<a-row :gutter="12">
									<!--板块名称-->
									<a-col :span="12">
										<a-form-item field="plateName" label="板块名称"
											:rules="[{ required: true, message: '板块名称不能为空' }]">
											<a-input v-model="crud.options.form.plateName" />
										</a-form-item>
									</a-col>
									<!--状态-->
									<a-col :span="12">
										<a-form-item field="plateState" label="状态"
											:rules="[{ required: true, message: '状态不能为空' }]">
											<a-select v-model="crud.options.form.plateState" placeholder="请选择"
												allow-clear
												allow-search>
												<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
													:value="s.value">{{ s.label }}</a-option>
											</a-select>
										</a-form-item>
									</a-col>
									<!--状态-->
									<a-col :span="12">
										<a-form-item field="type" label="类别">
											<a-select v-model="crud.options.form.type" placeholder="请选择"
												allow-clear
												allow-search>
												<a-option v-for="s in dict.plate_type" :key="s.detailId"
													:value="s.value">{{ s.label }}</a-option>
											</a-select>
										</a-form-item>
									</a-col>
									
									<!--状态-->
									<a-col :span="12">
										<a-form-item field="waterfall" label="瀑布显示">
											<a-select v-model="crud.options.form.waterfall" placeholder="请选择"
												allow-search>
												<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
													:value="s.value">{{ s.label }}</a-option>
											</a-select>
										</a-form-item>
									</a-col>
									
									<!--排序-->
									<a-col :span="12">
										<a-form-item field="sort" label="排序">
											<a-input-number v-model="crud.options.form.sort" />
										</a-form-item>
									</a-col>

									<!--板块介绍-->
									<a-col :span="24">
										<a-form-item field="plateIntroduce" label="板块介绍">
											<a-textarea v-model="crud.options.form.plateIntroduce" />
										</a-form-item>
									</a-col>
								</a-row>
							</template>
						</CrudOperation>

						<!--表格-->
						<a-table ref="table" v-model:selectedKeys="crud.options.tableInfo.selectKeys" row-key="id"
							:columns="tableColumns" :data="crud.options.tableInfo.data" :pagination="false"
							:scroll="{ y: '100%' }" :loading="crud.status.value === CrudStatus.REFRESHING"
							:column-resizable="
	    crud.options.tableInfo.componentConfig.colResizable
	  " :bordered="{
	    cell: crud.options.tableInfo.componentConfig.border,
	  }" :stripe="crud.options.tableInfo.componentConfig.stripe"
							:show-header="crud.options.tableInfo.componentConfig.tableHeader" :row-selection="
	    crud.options.tableInfo.componentConfig.checkbox
	      ? {
	          type: 'checkbox',
	          showCheckedAll: true,
	        }
	      : undefined
	  " style="height: calc(100% - 128px); margin-bottom: 12px">
							
							<!--状态-->
							<template #plateState="{ record }">
								<!--正常情况下-->
								<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
									{{ (dict.yes_no_status.filter((di: any) => di.value === (record.plateState + '')))[0].label }}
								</div>
							</template>
							
							<!--状态-->
							<template #waterfall="{ record }">
								<!--正常情况下-->
								<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
									{{ (dict.yes_no_status.filter((di: any) => di.value === (record.waterfall + '')))[0].label }}
								</div>
							</template>
							
							<!--状态-->
							<template #type="{ record }">
								<!--正常情况下-->
								<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
									{{ dict.plate_type.filter((di: any) => di.value === (record.type + ''))[0] ? dict.plate_type.filter((di: any) => di.value === (record.type + ''))[0].label:'' }}
								</div>
							</template>

						</a-table>
						<Pagination style="position: absolute; right: 0; bottom: 0; padding-right: 7px" />
					</div>
				</a-col>
			</a-row>

		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';

	import { Plate, getPlateTree } from '@/api/bobosns/plate';
	import { computed, onMounted, provide, ref } from 'vue';
	import { useDict } from '@/components/dict';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
	import RROperation from '@/components/crud/RROperation.vue'
	import Pagination from '@/components/crud/Pagination.vue';


	import { useI18n } from 'vue-i18n';

	const { t } = useI18n();
	const crud = useCrud<Plate>({
		tag: '板块配置',
		url: '/bobosns/plate',
		title: '',
		tableInfo: {
			componentConfig: {
				stripe: false,
				colResizable: true
			},
		},
	});
	provide('crud', crud);

	// 字典
	const dict = useDict('yes_no_status','plate_type');

	// 设置板块设置 columns信息
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
			title: '板块名称',
			dataIndex: 'plateName',
			width: 150,
			display: true,
			slotName: 'plateName',
			tooltip: true,
			ellipsis: true,
		},
		
		{
			title: '板块介绍',
			dataIndex: 'plateIntroduce',
			width: 150,
			display: true,
			slotName: 'plateIntroduce',
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
			title: '类别',
			dataIndex: 'type',
			width: 150,
			display: true,
			slotName: 'type',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '状态',
			dataIndex: 'plateState',
			width: 150,
			display: true,
			slotName: 'plateState',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '瀑布显示',
			dataIndex: 'waterfall',
			width: 150,
			display: true,
			slotName: 'waterfall',
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
		{
			title: '创建时间',
			dataIndex: 'createTime',
			width: 180,
			display: false,
			slotName: 'createTime',
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
	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});

	const originTreeData = ref([]);
	const searchKey = ref('');

	function searchData(keyword : string) {
		const loop = (data : any) => {
			const result : any[] = [];
			data.forEach((item : any) => {
				if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
					result.push({ ...item });
				} else if (item.children) {
					const filterData = loop(item.children);
					if (filterData.length) {
						result.push({
							...item,
							children: filterData,
						});
					}
				}
			});
			return result;
		};

		return loop(originTreeData.value);
	}
	function getMatchIndex(title : any) {
		if (!searchKey.value) return -1;
		return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
	}
	const treeData = computed(() => {
		if (!searchKey.value) return originTreeData.value;
		return searchData(searchKey.value);
	});

	async function loadConfigTree() {
		const response = await getPlateTree();
		originTreeData.value = response.data as any;
	}

	function treeSelect(selectedKeys : Array<string | number>, data : any) {
		crud.options.form.parentId = selectedKeys[0].toString();
		crud.update.appendQueryParams({ plateIds: selectedKeys[0] });
		crud.update.setStatus(CrudStatus.NEED_REFRESH);
		crud.update.setTableSelectKeys([]);
	}

	// region    ↓-------------------------------- switch --------------------------------↓
	// endregion ↑-------------------------------- switch --------------------------------↑

	// region    ↓-------------------------------- rangePicker --------------------------------↓
	// endregion ↑-------------------------------- rangePicker --------------------------------↑

	// region    ↓-------------------------------- 钩子 --------------------------------↓
	onMounted(() => {

		crud.method.refresh();
	});


	crud.hook.afterRefresh = () => {
		loadConfigTree();
		return true;
	};


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
	export default {
		name: 'Config',
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