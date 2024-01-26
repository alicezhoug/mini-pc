<template>
	<div class="container">
		<div class="panel">
			<div style="position: relative; height: 100%">
				<!--查询表单-->
				<a-row>
					<a-col :flex="1">
						<a-form :model="crud.options.query" :label-col-props="{ span: 6 }"
							:wrapper-col-props="{ span: 18 }" label-align="left">
							<a-scrollbar style="height: 104px; overflow: auto">
								<a-row :gutter="16" style="width: 100%">
									<!--商户名称搜索框-->
									<a-col :span="8">
										<a-form-item field="name" label="商户名称">
											<a-input v-model="crud.options.query.name" placeholder="输入商户名称搜索">
												<template #prefix> Like </template>
											</a-input>
										</a-form-item>
									</a-col>
									<!--是否启用搜索框-->
									<a-col :span="8">
										<a-form-item field="enabled" label="是否启用">
											<a-select v-model="crud.options.query.enabled" placeholder="输入是否启用搜索"
												allow-search>
												<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
													:value="s.value">
													{{ s.label }}
												</a-option>
											</a-select>
										</a-form-item>
									</a-col>
									<!--是否官方搜索框-->
									<a-col :span="8">
										<a-form-item field="official" label="是否官方">
											<a-select v-model="crud.options.query.official" placeholder="输入是否官方搜索"
												allow-search>
												<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
													:value="s.value">
													{{ s.label }}
												</a-option>
											</a-select>
										</a-form-item>
									</a-col>
									<!--平台搜索框-->
									<a-col :span="8">
										<a-form-item field="platformId" label="平台">
											<a-select v-model="crud.options.query.platformId" placeholder="输入平台搜索"
												allow-search>
												<a-option v-for="s in platformMap" :key="s.id"
													:value="s.id">
													{{ s.name }}
												</a-option>
											</a-select>
										</a-form-item>
									</a-col>

									<!--是否活跃搜索框-->
									<a-col :span="8">
										<a-form-item field="alive" label="是否活跃">
											<a-select v-model="crud.options.query.alive" placeholder="输入是否活跃搜索"
												allow-search>
												<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
													:value="s.value">
													{{ s.label }}
												</a-option>
											</a-select>
										</a-form-item>
									</a-col>
								</a-row>
							</a-scrollbar>
						</a-form>
					</a-col>
					<a-divider style="height: 84px" direction="vertical" />
					<a-col :flex="'86px'" style="text-align: right">
						<RROperation direction="vertical" />
					</a-col>
				</a-row>
				<a-divider style="margin-top: 0" />
				<CrudOperation :add-permission="['pay:merchant:add']" :edit-permission="['pay:merchant:edit']"
					:del-permission="['pay:merchant:del']" :download-permission="['pay:merchant:list']"
					:show-edit="false"
					:show-save="true"
					style="margin-bottom: 12px">
					<template #addForm>
						<a-row :gutter="12">
							<!--商户名称-->
							<a-col :span="12">
								<a-form-item field="name" label="商户名称"
									:rules="[{ required: true, message: '商户名称不能为空' }]">
									<a-input v-model="crud.options.form.name" />
								</a-form-item>
							</a-col>
							<!--是否启用-->
							<a-col :span="12">
								<a-form-item field="enabled" label="是否启用"
									:rules="[{ required: true, message: '是否启用不能为空' }]">
									<a-radio-group v-model="crud.options.form.enabled" type="button">
										<a-radio v-for="s in dict.yes_no_status" :key="s.detailId"
											:value="s.value">{{ s.label }}</a-radio>
									</a-radio-group>
								</a-form-item>
							</a-col>
							<!--是否官方-->
							<a-col :span="12">
								<a-form-item field="official" label="是否官方"
									:rules="[{ required: true, message: '是否官方不能为空' }]">
									<a-select v-model="crud.options.form.official" placeholder="请选择" allow-search>
										<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
											:value="s.value">{{ s.label }}</a-option>
									</a-select>
								</a-form-item>
							</a-col>
							<!--平台-->
							<a-col :span="12">
								<a-form-item field="platformId" label="平台"
									:rules="[{ required: true, message: '平台不能为空' }]">
									<a-select v-model="crud.options.form.platformId" placeholder="请选择" allow-search>
										<a-option v-for="s in platformMap" :key="s.id"
											:value="s.id">{{ s.name }}</a-option>
									</a-select>
								</a-form-item>
							</a-col>
							<!--是否活跃-->
							<a-col :span="12">
								<a-form-item field="alive" label="是否活跃"
									:rules="[{ required: true, message: '是否活跃不能为空' }]">
									<a-select v-model="crud.options.form.alive" placeholder="请选择" allow-search>
										<a-option v-for="s in dict.yes_no_status" :key="s.detailId"
											:value="s.value">{{ s.label }}</a-option>
									</a-select>
								</a-form-item>
							</a-col>
							<!--每日最大金额-->
							<a-col :span="12">
								<a-form-item field="dayMaxMoney" label="每日允许收款金额">
									<a-input-number v-model="crud.options.form.dayMaxMoney" />
								</a-form-item>
							</a-col>
							<!--收款信用额度-->
							<a-col :span="12">
							  <a-form-item
							    field="creditLimit"
							    label="收款信用额度"
							  >
							    <a-input-number v-model="crud.options.form.creditLimit" />
							  </a-form-item>
							</a-col>					
						</a-row>
					</template>
					<template #right>
						<a-button v-if="!crud.options.tableInfo.isEdit" v-permission="['pay:merchantProperties:list']"
							type="outline" size="small" :disabled="clickMerchantId==''" class="button"
							@click="propertyVisible = true ">
							属性设置
						</a-button>
						<a-button v-if="!crud.options.tableInfo.isEdit" v-permission="['pay:merchantTransaction:list']"
							type="outline" size="small" :disabled="clickMerchantId==''" class="button"
							@click="tranItemVisible = true ">
							交易明细
						</a-button>
					</template>
				</CrudOperation>
				<PropertySetting />
				<TranItem/>
				<!--表格-->
				<a-table ref="table" v-model:selectedKeys="crud.options.tableInfo.selectKeys" row-key="id"
					:columns="tableColumns" :data="crud.options.tableInfo.data" :pagination="false"
					:scroll="{ y: '100%' }" :loading="crud.status.value === CrudStatus.REFRESHING" :column-resizable="
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
          " style="height: calc(100% - 209px); margin-bottom: 12px" @row-click="tableColClick">
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

					<!--商户名称-->
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
							<a-select v-model="crud.options.form[record.id].enabled"
								:default-value="record.enabled ? '1' : '0'" allow-search>
								<a-option v-for="s in dict.yes_no_status.map((di) => {
                    if (di.value === 'true') di.value = '1';
                    if (di.value === 'false') di.value = '0';
                    return di;
                  })" :key="s.detailId" :value="s.value">{{ s.label }}
								</a-option>
							</a-select>
						</div>
					</template>

					<!--是否官方-->
					<template #official="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.official ? '1' : '0') || di.value === (record.official + '')))[0].label : ''}}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.official ? '1' : '0') || di.value === (record.official + '')))[0].label : '' }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].official
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].official ? '1' : '0') || di.value === (record.official + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.official ? '1' : '0') || di.value === (record.official + '')))[0].label : ''
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-select v-model="crud.options.form[record.id].official"
								:default-value="record.official ? '1' : '0'" allow-search>
								<a-option v-for="s in dict.yes_no_status.map((di) => {
                    if (di.value === 'true') di.value = '1';
                    if (di.value === 'false') di.value = '0';
                    return di;
                  })" :key="s.detailId" :value="s.value">{{ s.label }}
								</a-option>
							</a-select>
						</div>
					</template>

					<!--平台-->
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
							<a-select v-model="crud.options.form[record.id].platformId"
								:default-value="record.platformId">
								<a-option v-for="s in platformMap" :key="s.id" :value="s.id">{{ s.name }}
								</a-option>
							</a-select>
						</div>
					</template>
					<!--是否活跃-->
					<template #alive="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.alive ? '1' : '0') || di.value === (record.alive + '')))[0].label : ''}}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.alive ? '1' : '0') || di.value === (record.alive + '')))[0].label : '' }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].alive
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].alive ? '1' : '0') || di.value === (record.alive + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.alive ? '1' : '0') || di.value === (record.alive + '')))[0].label : ''
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-select v-model="crud.options.form[record.id].alive"
								:default-value="record.alive ? '1' : '0'" allow-search>
								<a-option v-for="s in dict.yes_no_status.map((di) => {
                    if (di.value === 'true') di.value = '1';
                    if (di.value === 'false') di.value = '0';
                    return di;
                  })" :key="s.detailId" :value="s.value">{{ s.label }}
								</a-option>
							</a-select>
						</div>
					</template>

				

					<!--每日最大金额-->
					<template #dayMaxMoney="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ record.dayMaxMoney }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							<!--未修改的行-->
							<div v-show="!crud.options.form[record.id]">
								{{ record.dayMaxMoney }}
							</div>
							<!--修改完毕提交后-->
							<div v-if="crud.options.form[record.id]">
								{{
                  crud.options.form[record.id].dayMaxMoney
                    ? crud.options.form[record.id].dayMaxMoney
                    : record.dayMaxMoney
                }}
							</div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
							<a-input-number v-model="crud.options.form[record.id].dayMaxMoney"
								:default-value="record.dayMaxMoney" />
						</div>
					</template>
					<!--收款信用额度-->
					  <template #creditLimit="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
						  {{ record.creditLimit }}
						</div>

						<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
						<div v-if="!record.editable && crud.options.tableInfo.isEdit">
						  <!--未修改的行-->
						  <div v-show="!crud.options.form[record.id]">
							{{ record.creditLimit }}
						  </div>
						  <!--修改完毕提交后-->
						  <div v-if="crud.options.form[record.id]">
							{{
							  crud.options.form[record.id].creditLimit
								? crud.options.form[record.id].creditLimit
								: record.creditLimit
							}}
						  </div>
						</div>

						<!--修改情况下-->
						<div v-if="record.editable">
						  <a-input-number
							v-model="crud.options.form[record.id].creditLimit"
							:default-value="record.creditLimit"
						  />
						</div>
					  </template>
					
				</a-table>
				<Pagination style="position: absolute; right: 0; bottom: 0; padding-right: 7px" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';
	import { Merchant } from '@/api/pay/merchant';
	import { computed, CSSProperties, onMounted, provide, ref } from 'vue';
	import { useDict } from '@/components/dict';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
	import RROperation from '@/components/crud/RROperation.vue'
	import Pagination from '@/components/crud/Pagination.vue';
	import { Platform, PlatformList } from '@/api/pay/platform';
	import { useI18n } from 'vue-i18n';
	import { TableData } from '@arco-design/web-vue/es/table/interface';
	import PropertySetting from '@/views/pay/merchant/property-setting.vue';
	import TranItem from '@/views/pay/merchant/tran-item.vue';
	
	import { emitter } from '@/utils/myBus';

	const { t } = useI18n();
	const crud = useCrud<Merchant>({
		tag: '商户设置',
		url: '/pay/merchant',
		title: 'menu.pay.merchant',
		tableInfo: {
			componentConfig: {
				stripe: false,
			},
		},
	});
	provide('crud', crud);



	// 点击行的样式
	const bodyCellStyle = (record : TableData) => {
		const style : CSSProperties = {
			color: 'rgb(var(--arcoblue-5))',
		};
		if (record.click) {
			return style;
		}
		return {};
	};


	// 字典
	const dict = useDict('yes_no_status');

	// 设置商户设置 columns信息
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
			title: '商户名称',
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
			title: '是否官方',
			dataIndex: 'official',
			width: 150,
			display: true,
			slotName: 'official',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle,
		},
		{
			title: '平台',
			dataIndex: 'platformId',
			width: 150,
			display: true,
			slotName: 'platformId',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle,
		},
		{
			title: '是否活跃',
			dataIndex: 'alive',
			width: 150,
			display: true,
			slotName: 'alive',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle
		},
		{
			title: '充许每日收款额度',
			dataIndex: 'dayMaxMoney',
			width: 150,
			display: true,
			slotName: 'dayMaxMoney',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle
		},
		{
			title: '当日累计收款',
			dataIndex: 'dayMoney',
			width: 150,
			display: true,
			slotName: 'dayMoney',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle
		},
		
		{
			title: '累计收款',
			dataIndex: 'totalMoney',
			width: 150,
			display: true,
			slotName: 'totalMoney',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle
		},
		{
		  title: '当前余额',
		  dataIndex: 'balance',
		  width: 150,
		  display: true,
		  slotName: 'balance',
		  tooltip: true,
		  ellipsis: true,
		  bodyCellStyle
		},
		{
		  title: '收款信用额度',
		  dataIndex: 'creditLimit',
		  width: 150,
		  display: true,
		  slotName: 'creditLimit',
		  tooltip: true,
		  ellipsis: true,
		  bodyCellStyle
		},
		{
		  title: '可用收款余额',
		  dataIndex: 'paymentBalance',
		  width: 150,
		  display: true,
		  slotName: 'paymentBalance',
		  tooltip: true,
		  ellipsis: true,
		  bodyCellStyle
		},
		{
			title: '用户ID',
			dataIndex: 'userId',
			width: 150,
			display: true,
			slotName: 'userId',
			tooltip: true,
			ellipsis: true,
			bodyCellStyle
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


	const platformMap = ref<{ [key : number] : Platform }>({});
	const loadMode = async () => {

		const platformList = await PlatformList();
		platformMap.value = {};
		platformList.data.list.forEach((val) => {
			platformMap.value[val.id] = val;
		});


	};



	let lastClickRecord : TableData = {};
	// 点击表格行，记录商户id&名称
	const clickMerchantName = ref('');
	const clickMerchantId = ref('');

	const tableColClick = async (record : TableData) => {
		// 编辑状态下不可选择
		if (crud.options.tableInfo.isEdit) return;
		if (lastClickRecord !== {}) {
			// 清除上一次点击的对象属性
			delete lastClickRecord.click;
		}

		clickMerchantName.value = record.name;
		clickMerchantId.value = record.id;
		lastClickRecord = record;
		record.click = true;
		emitter.emit('selectPlatformData', record);
	};


	const propertyVisible = ref(false);
	const tranItemVisible = ref(false);

	provide('propertyVisible', propertyVisible);
	provide('tranItemVisible', tranItemVisible);
	

	// region    ↓-------------------------------- switch --------------------------------↓
	// endregion ↑-------------------------------- switch --------------------------------↑

	// region    ↓-------------------------------- rangePicker --------------------------------↓
	// endregion ↑-------------------------------- rangePicker --------------------------------↑

	// region    ↓-------------------------------- 钩子 --------------------------------↓
  
   onMounted(() => {
		loadMode();
		crud.method.refresh();
	});


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
	export default {
		name: 'Merchant',
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