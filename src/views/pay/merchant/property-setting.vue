<template>
	<a-modal :visible="visible" width="80vw" @cancel="visible = false">
		<template #title>设置<span style="color: red">{{merchantName}}</span>属性</template>
		<a-space direction="vertical">
			<!--检索条件栏-->
			<a-row :gutter="24">
				<!--名称搜索框-->

				<a-col :span="6">
					<!--名称搜索框-->
					<a-input v-model="crud.options.query.proName" placeholder="输入属性名称" />
				</a-col>
				<a-col :span="6">
					<RROperation />
				</a-col>
				<a-col :span="12">
					<CrudOperation :add-permission="['pay:platformProperties:add']" :edit-permission="['pay:platformProperties:edit']"
						:del-permission="['pay:platformProperties:del']" :showDownload="false" style="margin-bottom: 12px">

						<template #addForm>

							<a-row :gutter="24">
								<!--名称-->
								<a-col :span="20">
									<a-form-item field="proName" label="属性名"
										:rules="[{ required: true, message: '属性名不能为空' }]">
										<a-input v-model="crud.options.form.proName" />
									</a-form-item>
								</a-col>
	
							</a-row>
							<a-row :gutter="24">
								<!--名称-->
								<a-col :span="20">
									<a-form-item field="proValue" label="属性值"
										:rules="[{ required: true, message: '属性值不能为空' }]">
										<a-input v-model="crud.options.form.proValue" />
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

					<!--平台-->
					<template #merchantId="{ record }">
						{{ merchantMap[record.merchantId]?merchantMap[record.merchantId].name:"" }}
					</template>

					<!--名称-->
					<template #proName="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.proName }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.proName }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].proName
                    ? crud.options.form[record.id].proName
                    : record.proName
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input v-model="crud.options.form[record.id].proName" :default-value="record.proName" />
						</div>
					</template>


					<template #proValue="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.proValue }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.proValue }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].proValue
                    ? crud.options.form[record.id].proValue
                    : record.proValue
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input v-model="crud.options.form[record.id].proValue"
								:default-value="record.proValue" />
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
	import { computed, ref, inject, onMounted, provide } from 'vue';
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';
	import { PlatformProperties } from '@/api/pay/platformProperties';
	import { Merchant, MerchantList } from '@/api/pay/merchant';

	import Pagination from '@/components/crud/Pagination.vue';
	import RROperation from '@/components/crud/RROperation.vue';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
import { emitter } from '@/utils/myBus';

	const visible = inject<boolean>('propertyVisible');
	



	const crud = useCrud<PlatformProperties>({
		tag: '平台属性设置',
		url: '/pay/merchantProperties',
		title: '',
		tableInfo: {
			componentConfig: {
				checkbox: true,
				stripe: true,
				colResizable: true
			},
		},
	});
	
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
			title: '商户',
			dataIndex: 'merchantId',
			width: 160,
			display: true,
			slotName: 'merchantId',
			ellipsis: true,
			tooltip: true,
			fixed: 'left',
		},
		{
			title: '属性名',
			dataIndex: 'proName',
			width: 200,
			display: true,
			slotName: 'proName',
			ellipsis: true,
			tooltip: true,
		},
		{
			title: '属性值',
			dataIndex: 'proValue',
			width: 300,
			display: true,
			slotName: 'proValue',
			ellipsis: true,
			tooltip: true,
		}
	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});



	const merchantMap = ref<{ [key : number] : Merchant }>({});
	const loadMode = async () => {
		const merchantList = await MerchantList();
		merchantMap.value = {};
		merchantList.data.list.forEach((val) => {
			merchantMap.value[val.id] = val;
		});
	};

	onMounted(() => {
		loadMode();
		crud.method.refresh();
	});
	
	let merchantName = "";
	let merchantId = -1;
	
	
	emitter.on("selectPlatformData", (data: any) => {
		
	   merchantId=data.id ;
	   merchantName=data.name;
	   crud.update.setQuery({ merchantId: data.id });
	   crud.update.setStatus(CrudStatus.NEED_REFRESH);
	});
	
	

	crud.hook.beforeOpenAdd = () => {
		crud.options.query.merchantId = merchantId;
		crud.options.form.merchantId = merchantId;
		return true;
	};
	crud.hook.afterResetParams = () => {
		crud.options.query.merchantId = merchantId;
		crud.options.form.merchantId = merchantId;
		return true;
	};
	
</script>

<style scoped></style>