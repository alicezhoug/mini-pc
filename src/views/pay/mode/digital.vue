<template>
	<a-modal :visible="visible" width="80vw" @cancel="visible = false">
		<template #title>设置<span style="color: red">{{modeName}}</span>链类型</template>
		<a-space direction="vertical">
			<!--检索条件栏-->
			<a-row :gutter="24">
				<!--名称搜索框-->
		
				<a-col :span="6">
					<!--名称搜索框-->
					<a-input v-model="crud.options.query.networkName" placeholder="输入名称" />
				</a-col>
				<a-col :span="6">
					<RROperation />
				</a-col>
				<a-col :span="12">
					<CrudOperation :add-permission="['pay:mode:add']" :edit-permission="['pay:mode:edit']"
						:del-permission="['pay:mode:del']" :showDownload="false" style="margin-bottom: 12px">

						<template #addForm>
							
							<a-row :gutter="12">
								<!--名称-->
								<a-col :span="12">
									<a-form-item field="networkName" label="链名称"
										:rules="[{ required: true, message: '链名称不能为空' }]">
										<a-input v-model="crud.options.form.networkName" />
									</a-form-item>
								</a-col>
								<!--名称-->
								<a-col :span="12">
									<a-form-item field="minFee" label="最小交易金额"
										:rules="[{ required: false, message: '最小交易金额不能为空' }]">
										<a-input-number v-model="crud.options.form.minFee" />
									</a-form-item>
								</a-col>
							</a-row>
						</template>

					</CrudOperation>
				</a-col>
			</a-row>
			<!--表格栏-->
			<a-row>
				<a-table v-model:selectedKeys="crud.options.tableInfo.selectKeys" row-key="id" :columns="tableColumns"
					:data="crud.options.tableInfo.data" :pagination="false" :scroll="{ y: '100%' }"
					:loading="crud.status.value === CrudStatus.REFRESHING" :column-resizable="
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
          " style="height: 65vh">

					<!--修改结果-->
					<template #result="{ record }">
						<!--修改完毕并且不完全修改成功的时候展示-->
						<div v-show="
                crud.options.tableInfo.selectKeys.includes(record.id) &&
                crud.options.tableInfo.isEdit
              ">
							<!--修改成功的行-->
							<div v-show="
                  !record.updateErr && typeof record.updateErr === 'boolean'
                ">
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
												<a-list-item v-for="(err, index) in record.updateErr" :key="index">
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

					<!--支付方式-->
					<template #modeId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ modeMap[record.modeId]?modeMap[record.modeId].name:"" }}
						</div>
						<!--修改情况下-->
						<div v-if="record.editable">
							{{ modeMap[record.modeId]?modeMap[record.modeId].name:"" }}
						</div>
					</template>

					<!--网络名称-->
					<template #networkName="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.networkName }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.networkName }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].networkName
                    ? crud.options.form[record.id].networkName
                    : record.networkName
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input v-model="crud.options.form[record.id].networkName"
								:default-value="record.networkName" />
						</div>
					</template>

					<!--最小充值-->
					<template #minFee="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.minFee }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.minFee }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].minFee
                    ? crud.options.form[record.id].minFee
                    : record.minFee
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input-number v-model="crud.options.form[record.id].minFee"
								:default-value="record.minFee" />
						</div>
					</template>

				</a-table>
			</a-row>
		</a-space>

		<template #footer>
			<Pagination :show-page-size="true" />
		</template>
	</a-modal>
</template>

<script lang="ts" setup>
	import { computed, ref, inject, onMounted, provide, reactive } from 'vue';
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';
	import { ModeDigital } from '@/api/pay/modeDigital';
	import { Mode, ModeList } from '@/api/pay/mode';

	import Pagination from '@/components/crud/Pagination.vue';
	import RROperation from '@/components/crud/RROperation.vue';
	import CrudOperation from '@/components/crud/CrudOperation.vue';


	const visible = inject<boolean>('digitalVisible');
	const modeName = inject<String>('modeName');
	const modeId = inject<String>('modeId');
	



	const crud = useCrud<ModeDigital>({
		tag: '数字货币链类型',
		url: '/pay/modeDigital',
		title: '',
		tableInfo: {
			componentConfig: {
				checkbox: true,
				stripe: true,
				colResizable: true
			},
		},
	});
	crud.options.query.modeId=modeId;
	crud.options.form.modeId=modeId;
	provide('crud', crud);

	// 设置表格dept columns信息
	crud.update.setTableColumns([
		{
			title: 'ID',
			dataIndex: 'id',
			width: 80,
			display: false,
		},
		{
			title: '支付方式',
			dataIndex: 'modeId',
			width: 160,
			display: true,
			slotName: 'modeId',
			ellipsis: true,
			tooltip: true,
			fixed: 'left',
		},
		{
			title: '链类型',
			dataIndex: 'networkName',
			width: 100,
			display: true,
			slotName: 'networkName',
			ellipsis: true,
			tooltip: true,
		},
		{
			title: '最小支付金额',
			dataIndex: 'minFee',
			width: 100,
			display: true,
			slotName: 'minFee',
			ellipsis: true,
			tooltip: true,
		}
	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});

	

	const modeMap = ref<{ [key : number] : Mode }>({});
	// 获取国家信息列表
	const loadMode = async () => {
		const modeList = await ModeList();
		modeMap.value = {};
		modeList.data.list.forEach((val) => {
			modeMap.value[val.id] = val;
		});
	};

	onMounted(() => {
		loadMode();
		crud.method.refresh();
	});
	
	crud.hook.beforeOpenAdd = () => {
		crud.options.query.modeId=modeId;
		crud.options.form.modeId=modeId;
		return true;
	};
	crud.hook.afterResetParams = () => {
		crud.options.query.modeId=modeId;
		crud.options.form.modeId=modeId;
		return true;
	};
	
	
</script>

<style scoped></style>