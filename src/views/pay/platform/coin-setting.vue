<template>
	<a-modal :visible="visible" width="80vw" @cancel="visible = false">
		<template #title><span style="color: red">{{platformName}}</span>金币支付设置</template>
		<a-space direction="vertical">
			<!--检索条件栏-->
			<a-row :gutter="24">
				<!--支付搜索框-->
				<a-col :span="4">
					<a-form-item field="modeId" label="支付">
						<a-select v-model="crud.options.query.modeId" placeholder="输入支付搜索" allow-search>
							<a-option v-for="s in modeMap" :key="s.id" :value="s.id">
								{{ s.name }}
							</a-option>
						</a-select>
					</a-form-item>
				</a-col>
				<!--金币搜索框-->
				<a-col :span="4">
					<a-form-item field="coinId" label="金币">
						<a-select v-model="crud.options.query.coinId" placeholder="输入金币搜索" allow-search>
							<a-option v-for="s in coinMap" :key="s.id" :value="s.id">
								{{ s.quantity }}
							</a-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="4">
					<RROperation />
				</a-col>
				<a-col :span="12">
					<CrudOperation :add-permission="['pay:platformCoin:add']"
						:edit-permission="['pay:platformCoin:edit']" :del-permission="['pay:platformCoin:del']"
						:showDownload="false" style="margin-bottom: 12px">
						<template #addForm>
							<a-row :gutter="12">
								<!--支付-->
								<a-col :span="12">
									<a-form-item field="modeId" label="支付"
										:rules="[{ required: true, message: '支付不能为空' }]">
										<a-select v-model="crud.options.form.modeId" placeholder="请选择" allow-search>
											<a-option v-for="s in modeMap" :key="s.id"
												:value="s.id">{{ s.name }}</a-option>
										</a-select>
									</a-form-item>
								</a-col>
								<!--金币-->
								<a-col :span="12">
									<a-form-item field="coinId" label="金币"
										:rules="[{ required: true, message: '金币不能为空' }]">
										<a-select v-model="crud.options.form.coinId" placeholder="请选择" allow-search>
											<a-option v-for="s in coinMap" :key="s.id"
												:value="s.id">{{ s.quantity }}</a-option>
										</a-select>
									</a-form-item>
								</a-col>
								<!--支付金额-->
								<a-col :span="12">
									<a-form-item field="fee" label="支付金额"
										:rules="[{ required: true, message: '支付金额不能为空' }]">
										<a-input-number v-model="crud.options.form.fee" />
									</a-form-item>
								</a-col>
								<!--有效支付时间(秒)-->
								<a-col :span="12">
									<a-form-item field="validPayTime" label="有效支付时间(秒)" :rules="[
										{ required: true, message: '有效支付时间(秒)不能为空' }
										]">
										<a-input-number v-model="crud.options.form.validPayTime" />
									</a-form-item>
								</a-col>
								<!--货币符号-->
								<a-col :span="12">
									<a-form-item field="symbol" label="货币符号">
										<a-input v-model="crud.options.form.symbol" />
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

					<template #platformId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ platformMap[record.platformId]?platformMap[record.platformId].name:"" }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ platformMap[record.platformId]?platformMap[record.platformId].name:"" }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
							  crud.options.form[record.id].platformId
								? crud.options.form[record.id].platformId
								: record.platformId
							}}
							</div>
						</div>
						<!--修改情况下-->
						<div v-if="record.editable">
							{{ platformMap[record.platformId]?platformMap[record.platformId].name:"" }}
						</div>
					</template>

					<!--支付-->
					<template #modeId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ modeMap[record.modeId]?modeMap[record.modeId].name:"" }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ modeMap[record.modeId]?modeMap[record.modeId].name:"" }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].modeId
                    ? crud.options.form[record.id].modeId
                    : record.modeId
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-select v-model="crud.options.form[record.id].modeId" :default-value="record.modeId">
								<a-option v-for="s in modeMap" :key="s.id" :value="s.id">{{ s.name }}
								</a-option>
							</a-select>
						</div>
					</template>

					<!--金币-->
					<template #coinId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ coinMap[record.coinId]?coinMap[record.coinId].quantity:"" }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ coinMap[record.coinId]?coinMap[record.coinId].quantity:"" }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].coinId
                    ? crud.options.form[record.id].coinId
                    : record.coinId
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-select v-model="crud.options.form[record.id].coinId" :default-value="record.coinId">
								<a-option v-for="s in coinMap" :key="s.id" :value="s.id">{{ s.quantity }}
								</a-option>
							</a-select>
						</div>
					</template>

					<!--支付金额-->
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
					<!--有效支付时间(秒)-->
					<template #validPayTime="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.validPayTime }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.validPayTime }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
						  crud.options.form[record.id].validPayTime
							? crud.options.form[record.id].validPayTime
							: record.validPayTime
						}}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input-number v-model="crud.options.form[record.id].validPayTime"
								:default-value="record.validPayTime" />
						</div>
					</template>
					
					  <!--货币符号-->
					  <template #symbol="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
						  {{ record.symbol }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
						  <!--未修改的行-->
						  <div v-show="!crud.options.form[record.id]">
							{{ record.symbol }}
						  </div>
						  <!--修改完毕提交后-->
						  <div v-if="crud.options.form[record.id]">
							{{
							  crud.options.form[record.id].symbol
								? crud.options.form[record.id].symbol
								: record.symbol
							}}
						  </div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
						  <a-input
							v-model="crud.options.form[record.id].symbol"
							:default-value="record.symbol"
						  />
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
	import { Mode, ModeList } from '@/api/pay/mode';
	import { Coin, CoinList } from '@/api/pay/coin';
	import { Platform, PlatformList } from '@/api/pay/platform';

	import Pagination from '@/components/crud/Pagination.vue';
	import RROperation from '@/components/crud/RROperation.vue';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
	import { emitter } from '@/utils/myBus';

	const visible = inject<boolean>('coinVisible');




	const crud = useCrud<PlatformProperties>({
		tag: '金币支付配置',
		url: '/pay/platformCoin',
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
			title: '平台',
			dataIndex: 'platformId',
			width: 160,
			display: true,
			slotName: 'platformId',
			ellipsis: true,
			tooltip: true,
			fixed: 'left',
		},
		{
			title: '支付',
			dataIndex: 'modeId',
			width: 100,
			display: true,
			slotName: 'modeId',
			ellipsis: true,
			tooltip: true,
		},
		{
			title: '金币',
			dataIndex: 'coinId',
			width: 100,
			display: true,
			slotName: 'coinId',
			ellipsis: true,
			tooltip: true,
		},
		{
			title: '支付金额',
			dataIndex: 'fee',
			width: 100,
			display: true,
			slotName: 'fee',
			ellipsis: true,
			tooltip: true,
		},
		{
			title: '有效支付时间(秒)',
			dataIndex: 'validPayTime',
			width: 150,
			display: true,
			slotName: 'validPayTime',
			tooltip: true,
			ellipsis: true,
		},
		{
		  title: '货币符号',
		  dataIndex: 'symbol',
		  width: 150,
		  display: true,
		  slotName: 'symbol',
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
			title: '创建日期',
			dataIndex: 'createTime',
			width: 180,
			display: false,
			slotName: 'createTime',
			tooltip: true,
			ellipsis: true,
		},
	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});




	const modeMap = ref<{ [key : number] : Mode }>({});
	const coinMap = ref<{ [key : number] : Coin }>({});
	const platformMap = ref<{ [key : number] : Platform }>({});

	const loadMode = async () => {
		const modeList = await ModeList();
		modeMap.value = {};
		modeList.data.list.forEach((val) => {
			modeMap.value[val.id] = val;
		});

		const coinList = await CoinList();
		coinMap.value = {};
		coinList.data.list.forEach((val) => {
			coinMap.value[val.id] = val;
		});


		const platformList = await PlatformList();
		platformMap.value = {};
		platformList.data.list.forEach((val) => {
			platformMap.value[val.id] = val;
		});


	};

	onMounted(() => {
		loadMode();
		crud.method.refresh();
	});

	let platformName = "";
	let platformId = -1;


	emitter.on("selectPlatformData", (data : any) => {

		platformId = data.id;
		platformName = data.name;
		crud.update.setQuery({ platformId: data.id });
		crud.update.setStatus(CrudStatus.NEED_REFRESH);
	});


	crud.hook.beforeOpenAdd = () => {
		crud.options.query.platformId = platformId;
		crud.options.form.platformId = platformId;
		return true;
	};
	crud.hook.afterResetParams = () => {
		crud.options.query.platformId = platformId;
		crud.options.form.platformId = platformId;
		return true;
	};
</script>

<style scoped></style>