<template>
	<div class="container">
		<div class="panel">
			<a-row :gutter="14" style="height: 100%">
				<!--左侧部门树控件-->
				<a-col :xs="24" :sm="8" :md="8" :lg="8" :xl="5" :xxl="5" style="height: 100%">
					<div
					  style="
					    width: 100%;
					    height:100%;
					    overflow-y: auto;
					  "
					>
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
						<!--类型搜索框-->
						<a-col :span="8">
							<a-form-item field="showApp" label="类型">
								<a-select v-model="crud.options.query.category" placeholder="输入类型搜索" allow-search>
									<a-option v-for="s in dict.data_category" :key="s.detailId" :value="s.value">
										{{ s.label }}
									</a-option>
								</a-select>
							</a-form-item>
						</a-col>

						
					<!--状态搜索框-->
					  <a-col :span="8">
						<a-form-item field="status" label="停用">
							<a-select
							  v-model="crud.options.query.status"
							  placeholder="输入状态搜索"
							  allow-search

							>
							  <a-option
								v-for="s in dict.yes_no_status"
								:key="s.detailId"
								:value="s.value"
							  >
								{{ s.label }}
							  </a-option>
							</a-select>
						</a-form-item>
					  </a-col>
					  <!--是否显示前端搜索框-->
					  <a-col :span="8">
						<a-form-item field="showApp" label="显示前端">
						  <a-select
							v-model="crud.options.query.showApp"
							placeholder="输入是否显示前端搜索"
							allow-search
							allow-clear

						  >
							<a-option
							  v-for="s in dict.yes_no_status"
							  :key="s.detailId"
							  :value="s.value"
							
							>
							  {{ s.label }}
							</a-option>
						  </a-select>
						</a-form-item>
					  </a-col>
					  <!--资源key搜索框-->
					  <a-col :span="16">
					    <a-form-item field="msgKey" label="名称">
					      <a-input
					        v-model="crud.options.query.msgKey"
					        placeholder="输入资源key搜索"
					      >
					        <template #prefix> Like </template>
					      </a-input>
					    </a-form-item>
					  </a-col>
						<a-col :span="6">
							<RROperation />
						</a-col>
					</a-row>
					<div style="position: relative; height: 100%">

						<CrudOperation 
						    :add-permission="['bobosns:config:add']"
							:edit-permission="['bobosns:config:edit']" 
							:del-permission="['bobosns:config:del']"
							:download-permission="['bobosns:config:list']"
							:showDownload="false"
							:show-edit="false" 
							:show-save="true"
							 style="margin-bottom: 12px">
							<template #addForm>
								<a-row :gutter="12">
								    <!--键名-->
									<a-col :span="12">
										<a-form-item field="proLabel" label="键名"
											:rules="[{ required: true, message: '键名不能为空' }]">
											<a-input v-model="crud.options.form.proLabel" />
										</a-form-item>
									</a-col>									
									<!--类型-->
									<a-col :span="12">
										<a-form-item field="category" label="类型"
											:rules="[{ required: true, message: '类型不能为空' }]">
											<a-select v-model="crud.options.form.category" placeholder="请选择"
												allow-clear
												allow-search>
												<a-option v-for="s in dict.data_category" :key="s.detailId"
													:value="s.value">{{ s.label }}</a-option>
											</a-select>
										</a-form-item>
									</a-col>
                                   								
									<!--状态-->
									<a-col :span="12">
									  <a-form-item
									    field="status"
									    label="是否停用"
										:rules="[{ required: true, message: '类型不能为空' }]"
									  >
									    <a-select
									      v-model="crud.options.form.status"
									      placeholder="请选择"
									      allow-search
										  allow-clear
									    >
									      <a-option
									        v-for="s in dict.yes_no_status"
									        :key="s.detailId"
									        :value="s.value"
									        >{{ s.label }}</a-option
									      >
									    </a-select>
									  </a-form-item>
									</a-col>
								  <!--是否显示前端-->
								  <a-col :span="12">
									<a-form-item
									  field="showApp"
									  label="前端显示"
									  :rules="[{ required: true, message: '前端显示不能为空' }]"
									>
									  <a-select
										v-model="crud.options.form.showApp"
										placeholder="请选择"
										allow-search
										allow-clear
									  >
										<a-option
										  v-for="s in dict.yes_no_status"
										  :key="s.detailId"
										  :value="s.value"
										  >{{ s.label }}</a-option
										>
									  </a-select>
									</a-form-item>
								  </a-col>									
									<!--资源key-->
									<a-col :span="24">
										<a-form-item
											field="msgKey"
											label="资源key">
											<a-input v-model="crud.options.form.msgKey" />
										</a-form-item>
									</a-col>	
									<!--键值-->
									<a-col :span="24">
										<a-form-item field="proValue" label="键值"
											:rules="[{ required: false, message: '键值不能为空' }]">
											<a-textarea v-model="crud.options.form.proValue" />
										</a-form-item>
									</a-col>
									<!--图标Id-->
									<a-col :span="24">
									  <a-form-item
										field="iconsId"
										label="图标Id"
									  >
										<a-select
										  v-model="crud.options.form.iconsId"
										  placeholder="请选择"
										  allow-search
										>
										  <a-option
											v-for="s in iconsMap"
											:key="s.id"
											:value="s.id"
											>{{ s.name }}</a-option
										  >
										</a-select>
									  </a-form-item>
									</a-col>								
									
								<!--备注-->
								<a-col :span="24">
								  <a-form-item
									field="desc"
									label="备注"
								  >
									<a-textarea v-model="crud.options.form.desc"/>
								  </a-form-item>
								</a-col>								
									<!--父ID-->
									<a-col :span="12" v-show="false">
									  <a-form-item
									    field="parentId"
									    label="父ID"
									  >
									   <a-input v-model="crud.options.form.parentId"  />
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
														<a-list-item v-for="(err, index) in record.updateErr"
															:key="index">
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

							<!--类型-->
							<template #category="{ record }">
								<!--正常情况下-->
								<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
								
									{{ dict.data_category ? (dict.data_category.filter((di: any) => di.value === record.category || di.value === (record.category + '')))[0].label : ''}}
											 
								</div>
							</template>

							<!--键名-->
							<template #proLabel="{ record }">
								<!--正常情况下-->
								<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
									{{ record.proLabel }}
								</div>

								<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
								<div v-if="!record.editable && crud.options.tableInfo.isEdit">
									<!--未修改的行-->
									<div v-show="!crud.options.form[record.id]">
										{{ record.proLabel }}
									</div>
									<!--修改完毕提交后-->
									<div v-if="crud.options.form[record.id]">
										{{
                  crud.options.form[record.id].proLabel
                    ? crud.options.form[record.id].proLabel
                    : record.proLabel
                }}
									</div>
								</div>

								<!--修改情况下-->
								<div v-if="record.editable">
									<a-input v-model="crud.options.form[record.id].proLabel"
										:default-value="record.proLabel" />
								</div>
							</template>

							<!--键值-->
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
						  <!--图标Id-->
						  <template #iconsId="{ record }">
							<!--正常情况下-->
							<div v-show="!record.editable && !crud.options.tableInfo.isEdit">					
							    {{ iconsMap[record.iconsId]?iconsMap[record.iconsId].name:"" }}
							</div>

							<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
							<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							  <!--未修改的行-->
							  <div v-show="!crud.options.form[record.id]">
								{{ iconsMap[record.iconsId]?iconsMap[record.iconsId].name:"" }}
							  </div>
							  <!--修改完毕提交后-->
							  <div v-if="crud.options.form[record.id]">
								{{
								  crud.options.form[record.id].iconsId
									? crud.options.form[record.id].iconsId
									: record.iconsId
								}}
							  </div>
							</div>

							<!--修改情况下-->
							<div v-if="record.editable">
							  <a-select
								v-model="crud.options.form[record.id].iconsId"
								:default-value="record.iconsId"
								 allow-search
							  >
								<a-option
								  v-for="s in iconsMap"
								  :key="s.id"
								  :value="s.id"
								  >{{ s.name }}
								</a-option>
							  </a-select>
							</div>
						  </template>
						  <!--资源key-->
						  <template #msgKey="{ record }">
							<!--正常情况下-->
							<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							  {{ record.msgKey }}
							</div>

							<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
							<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							  <!--未修改的行-->
							  <div v-show="!crud.options.form[record.id]">
								{{ record.msgKey }}
							  </div>
							  <!--修改完毕提交后-->
							  <div v-if="crud.options.form[record.id]">
								{{
								  crud.options.form[record.id].msgKey
									? crud.options.form[record.id].msgKey
									: record.msgKey
								}}
							  </div>
							</div>

							<!--修改情况下-->
							<div v-if="record.editable">
							  <a-input
								v-model="crud.options.form[record.id].msgKey"
								:default-value="record.msgKey"
							  />
							</div>
						  </template>
						  <!--备注-->
						  <template #desc="{ record }">
							<!--正常情况下-->
							<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							  {{ record.desc }}
							</div>

							<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
							<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							  <!--未修改的行-->
							  <div v-show="!crud.options.form[record.id]">
								{{ record.desc }}
							  </div>
							  <!--修改完毕提交后-->
							  <div v-if="crud.options.form[record.id]">
								{{
								  crud.options.form[record.id].desc
									? crud.options.form[record.id].desc
									: record.desc
								}}
							  </div>
							</div>

							<!--修改情况下-->
							<div v-if="record.editable">
							  <a-input
								v-model="crud.options.form[record.id].desc"
								:default-value="record.desc"
							  />
							</div>
						  </template>		  
						  <!--状态-->
						  <template #status="{ record }">
							<!--正常情况下-->
							<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							  {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.status ? '1' : '0') || di.value === (record.status + '')))[0].label : ''}}
							</div>

							<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
							<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							  <!--未修改的行-->
							  <div v-show="!crud.options.form[record.id]">
								{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.status ? '1' : '0') || di.value === (record.status + '')))[0].label : '' }}
							  </div>
							  <!--修改完毕提交后-->
							  <div v-if="crud.options.form[record.id]">
								{{
								  crud.options.form[record.id].status
								   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].status ? '1' : '0') || di.value === (record.status + '')))[0].label : ''
								   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.status ? '1' : '0') || di.value === (record.status + '')))[0].label : ''
								}}
							  </div>
							</div>

							<!--修改情况下-->
							<div v-if="record.editable">
							  <a-select
								v-model="crud.options.form[record.id].status"
								:default-value="record.status ? '1' : '0'"
								allow-search
							  >
								<a-option
								  v-for="s in dict.yes_no_status.map((di) => {
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
						  
						  <!--是否显示前端-->
						  <template #showApp="{ record }">
							<!--正常情况下-->
							<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							  {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.showApp ? '1' : '0') || di.value === (record.showApp + '')))[0].label : ''}}
							</div>

							<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
							<div v-if="!record.editable && crud.options.tableInfo.isEdit">
							  <!--未修改的行-->
							  <div v-show="!crud.options.form[record.id]">
								{{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.showApp ? '1' : '0') || di.value === (record.showApp + '')))[0].label : '' }}
							  </div>
							  <!--修改完毕提交后-->
							  <div v-if="crud.options.form[record.id]">
								{{
								  crud.options.form[record.id].showApp
								   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].showApp ? '1' : '0') || di.value === (record.showApp + '')))[0].label : ''
								   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.showApp ? '1' : '0') || di.value === (record.showApp + '')))[0].label : ''
								}}
							  </div>
							</div>

							<!--修改情况下-->
							<div v-if="record.editable">
							  <a-select
								v-model="crud.options.form[record.id].showApp"
								:default-value="record.showApp ? '1' : '0'"
								allow-search
							  >
								<a-option
								  v-for="s in dict.yes_no_status.map((di) => {
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
	import { Config,getConfigTree } from '@/api/bobosns/config';
	import { Icons,IconsList} from '@/api/bobosns/icons';
	import { computed, onMounted, provide, ref } from 'vue';
	import { useDict } from '@/components/dict';
	import CrudOperation from '@/components/crud/CrudOperation.vue';
	import RROperation from '@/components/crud/RROperation.vue'
	import Pagination from '@/components/crud/Pagination.vue';
	
	
	import { useI18n } from 'vue-i18n';

	const { t } = useI18n();
	const crud = useCrud<Config>({
		tag: '系统配置',
		url: '/bobosns/config',
		title: '',
		tableInfo: {
			componentConfig: {
				stripe: false,
				colResizable:true
			},
		},
	});
	provide('crud', crud);



	const iconsMap = ref<{ [key : number] : Icons }>({});
	const loadData = async () => {

		const coinList = await IconsList();
		iconsMap.value = {};
		coinList.data.list.forEach((val) => {
			iconsMap.value[val.id] = val;
		});
		

	};
	

	// 字典
	const dict = useDict('yes_no_status','data_category');
	

	// 设置系统配置 columns信息
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
		},
		
		{
			title: '键名',
			dataIndex: 'proLabel',
			width: 150,
			display: true,
			slotName: 'proLabel',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '键值',
			dataIndex: 'proValue',
			width: 200,
			display: true,
			slotName: 'proValue',
			tooltip: true,
			ellipsis: true,
		},
		{
		  title: '图标Id',
		  dataIndex: 'iconsId',
		  width: 150,
		  display: true,
		  slotName: 'iconsId',
		  tooltip: true,
		  ellipsis: true,
		},
		{
			title: '类型',
			dataIndex: 'category',
			width: 200,
			display: true,
			slotName: 'category',
			tooltip: true,
			ellipsis: true,
		},
		{
		  title: '是否停用',
		  dataIndex: 'status',
		  width: 150,
		  display: true,
		  slotName: 'status',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '资源key',
		  dataIndex: 'msgKey',
		  width: 150,
		  display: true,
		  slotName: 'msgKey',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '是否显示前端',
		  dataIndex: 'showApp',
		  width: 150,
		  display: true,
		  slotName: 'showApp',
		  tooltip: true,
		  ellipsis: true,
		},
		{
		  title: '备注',
		  dataIndex: 'desc',
		  width: 150,
		  display: true,
		  slotName: 'desc',
		  tooltip: true,
		  ellipsis: true,
		},
		{
			title: '父ID',
			dataIndex: 'parentId',
			width: 150,
			display: true,
			slotName: 'parentId',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '用户ID',
			dataIndex: 'userId',
			width: 150,
			display: true,
			slotName: 'userId',
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
			title: '创建日期',
			dataIndex: 'createTime',
			width: 180,
			display: true,
			slotName: 'createTime',
			tooltip: true,
			ellipsis: true,
		},
	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});


	const originTreeData = ref([]);
	const searchKey = ref('');
  
  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: any[] = [];
      data.forEach((item: any) => {
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
   function getMatchIndex(title: any) {
    if (!searchKey.value) return -1;
    return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
    }
	  const treeData = computed(() => {
		if (!searchKey.value) return originTreeData.value;
		return searchData(searchKey.value);
	  });
	  
	 async function loadConfigTree() {
	   const response = await getConfigTree();
	   originTreeData.value = response.data as any;
	 } 
	 
	 function treeSelect(selectedKeys: Array<string | number>, data: any) {
	   crud.options.form.parentId=selectedKeys[0].toString();
	   crud.update.appendQueryParams({ configIds: selectedKeys[0] });
	   crud.update.setStatus(CrudStatus.NEED_REFRESH);
	   crud.update.setTableSelectKeys([]);
	 }
  
	// region    ↓-------------------------------- switch --------------------------------↓
	// endregion ↑-------------------------------- switch --------------------------------↑

	// region    ↓-------------------------------- rangePicker --------------------------------↓
	// endregion ↑-------------------------------- rangePicker --------------------------------↑

	// region    ↓-------------------------------- 钩子 --------------------------------↓
	onMounted(() => {
		loadData();
		crud.method.refresh();
	});
    crud.hook.afterLoad =() =>{
		
		crud.options.form.category=String(crud.options.form.category);
		return true;
	};

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