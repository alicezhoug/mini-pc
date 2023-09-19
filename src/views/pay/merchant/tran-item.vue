<template>
	<a-modal :visible="visible" width="80vw" @cancel="visible = false">
		<template #title><span style="color: red">{{merchantName}}</span>交易明细</template>
		<a-space direction="vertical">
			<!--检索条件栏-->
			<a-row :gutter="24">

				<!--交易名称搜索框-->
				<a-col :span="6">
					<a-form-item field="name" label="交易名称">
						<a-input v-model="crud.options.query.name" placeholder="输入交易名称搜索">
							<template #prefix> Like </template>
						</a-input>
					</a-form-item>
				</a-col>
				<!--交易类型(0:充值,1:收款)搜索框-->
				<a-col :span="6">
					<a-form-item field="kind" label="交易类型">
						<a-select v-model="crud.options.query.kind" placeholder="输入交易类型搜索" allow-search>
							<a-option v-for="s in dict.payment_tran_status" :key="s.detailId" :value="s.value">
								{{ s.label }}
							</a-option>
						</a-select>
					</a-form-item>
				</a-col>
				<!--用户ID搜索框-->
				<a-col :span="6">
					<a-form-item field="userId" label="用户ID">
						<a-input-number v-model="crud.options.query.userId" placeholder="输入用户ID搜索">
							<template #prefix> = </template>
						</a-input-number>
					</a-form-item>
				</a-col>
				<!--关联业务搜索框-->
				<a-col :span="6">
					<a-form-item field="refId" label="关联业务">
						<a-input-number v-model="crud.options.query.refId" placeholder="输入关联业务搜索">
							<template #prefix> = </template>
						</a-input-number>
					</a-form-item>
				</a-col>

				<a-col :span="6">
					<RROperation />
				</a-col>
				<a-col :span="12">
					<CrudOperation :add-permission="['pay:platformProperties:add']"
						:edit-permission="['pay:platformProperties:edit']"
						:del-permission="['pay:platformProperties:del']" :showDownload="false"
						style="margin-bottom: 12px">

						<template #addForm>
							<a-row :gutter="12">
								<!--交易名称-->
								<a-col :span="12">
									<a-form-item field="name" label="交易名称"
										:rules="[{ required: true, message: '交易名称不能为空' }]">
										<a-input v-model="crud.options.form.name" />
									</a-form-item>
								</a-col>
								<!--交易类型(0:充值,1:收款)-->
								<a-col :span="12">
									<a-form-item field="kind" label="交易类型"
										:rules="[{ required: true, message: '交易类型不能为空' }]">
										<a-select v-model="crud.options.form.kind" placeholder="请选择" allow-search>
											<a-option v-for="s in dict.payment_tran_status" :key="s.detailId"
												:value="s.value">{{ s.label }}</a-option>
										</a-select>
									</a-form-item>
								</a-col>
								<!--金币-->
								  <a-col :span="12">
									<a-form-item
									  field="fee"
									  label="金币"
									  :rules="[{ required: true, message: '交易金币不能为空' }]"
									>
									  <a-input-number v-model="crud.options.form.fee" />
									</a-form-item>
								  </a-col>
								  <!--用户ID-->
								  <a-col :span="12">
									<a-form-item
									  field="userId"
									  label="用户"
									  :rules="[{ required: true, message: '用户不能为空' }]"
									>
									  <a-input-number v-model="crud.options.form.userId" />
									</a-form-item>
								  </a-col>
							</a-row>

						</template>

					</CrudOperation>
				</a-col>
			</a-row>
			<!--表格栏-->
			<a-row>
				<!--表格-->
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
					<!--商户-->
					<template #merchantId="{ record }">
						{{ merchantMap[record.merchantId]?merchantMap[record.merchantId].name:"" }}
					</template>
					<!--交易名称-->
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
							<a-input v-model="crud.options.form[record.id].name" :default-value="record.name" />
						</div>
					</template>

					<!--交易类型(0:充值,1:收款)-->
					<template #kind="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							 {{ dict.payment_tran_status ? (dict.payment_tran_status.filter((di: any) => di.value === record.kind || di.value === (record.kind + '')))[0].label : ''}}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.kind }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].kind
                    ? crud.options.form[record.id].kind
                    : record.kind
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-select v-model="crud.options.form[record.id].kind" :default-value="record.kind">
								<a-option v-for="s in dict.payment_tran_status" :key="s.detailId"
									:value="s.label">{{ s.label }}
								</a-option>
							</a-select>
						</div>
					</template>

					<!--金币-->
					<template #fee="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.fee }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.fee }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].fee
                    ? crud.options.form[record.id].fee
                    : record.fee
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input-number v-model="crud.options.form[record.id].fee" :default-value="record.fee" />
						</div>
					</template>

					<!--用户ID-->
					<template #userId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.userId }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.userId }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].userId
                    ? crud.options.form[record.id].userId
                    : record.userId
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input-number v-model="crud.options.form[record.id].userId"
								:default-value="record.userId" />
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
	import { useDict } from '@/components/dict';

	const visible = inject<boolean>('tranItemVisible');


  // 字典
  const dict = useDict('payment_tran_status');
  
	const crud = useCrud<PlatformProperties>({
		tag: '平台属性设置',
		url: '/pay/merchantTransaction',
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
			width: 150,
			display: true,
			slotName: 'merchantId',
			ellipsis: true,
			tooltip: true,
			fixed: 'left',
		},
		{
		  title: '交易名称',
		  dataIndex: 'name',
		  width: 100,
		  display: true,
		  slotName: 'name',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '交易类型',
		  dataIndex: 'kind',
		  width: 100,
		  display: true,
		  slotName: 'kind',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '金币',
		  dataIndex: 'fee',
		  width: 100,
		  display: true,
		  slotName: 'fee',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '关联业务',
		  dataIndex: 'refId',
		  width: 150,
		  display: true,
		  slotName: 'refId',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '用户ID',
		  dataIndex: 'userId',
		  width: 100,
		  display: true,
		  slotName: 'userId',
		  tooltip: true,
		  ellipsis: true,
		},
		
		{
		  title: '创建日期',
		  dataIndex: 'createTime',
		  width: 100,
		  display: true,
		  slotName: 'createTime',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '更新时间',
		  dataIndex: 'updateTime',
		  width: 100,
		  display: true,
		  slotName: 'updateTime',
		  tooltip: true,
		  ellipsis: true,
		},
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


	emitter.on("selectPlatformData", (data : any) => {

		merchantId = data.id;
		merchantName = data.name;
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