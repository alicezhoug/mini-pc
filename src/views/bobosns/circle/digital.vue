<template>
	<a-modal :visible="visible" width="80vw" @cancel="visible = false" >
		<template #title>设置<span style="color: red">{{circleName}}</span>关联视频</template>
		<a-space direction="vertical">
			<!--检索条件栏-->
			<a-row :gutter="24">
                  <!--视频类型搜索框-->
                  <a-col :span="8">
                    <a-form-item field="videoType" label="视频类型">
                      <a-select
                        v-model="crud.options.query.videoType"
						@change="loadKindData"
                        placeholder="输入视频类型搜索"
                        allow-search
						allow-clear
                      >
                        <a-option
                          v-for="s in dict.video_type"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--视频大分类搜索框-->
                  <a-col :span="8">
                    <a-form-item field="videoKindId" label="视频大分类">
                      <a-select
                        v-model="crud.options.query.videoKindId"
                        placeholder="输入视频大分类搜索"
                        allow-search
						allow-clear
       
                      >
                        <a-option
                          v-for="s in kindMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--视频小分类搜索框-->
                  <a-col :span="8">
                    <a-form-item field="videoCategoryId" label="视频小分类">
                      <a-select
                        v-model="crud.options.query.videoCategoryId"
                        placeholder="输入视频小分类搜索"
						
                        allow-search
                        allow-clear
                      >
                        <a-option
                          v-for="s in categoryMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--发贴用户ID搜索框-->
                  <a-col :span="8">
                    <a-form-item field="postsUserId" label="发贴用户ID">
                      <a-input-number
                        v-model="crud.options.query.postsUserId"
                        placeholder="输入发贴用户ID搜索"
                      >
                        <template #prefix> = </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
				<a-col :span="6">
					<RROperation />
				</a-col>
				<a-col :span="12">
					<CrudOperation :add-permission="['bobosns:circleVideo:add']" :edit-permission="['bobosns:circleVideo:edit']"
						:del-permission="['bobosns:circleVideo:del']" :showDownload="false" style="margin-bottom: 12px">
						  <template #addForm>
							<a-row :gutter="12">
							  <!--视频类型搜索框-->
							  <a-col :span="12">
								<a-form-item field="videoType" label="视频类型"  :rules="[{ required: true, message: '视频类型不能为空' }]">
								  <a-select
									v-model="crud.options.form.videoType"
									placeholder="输入视频类型搜索"
									@change="loadKindData"
									allow-clear
									allow-search

								  >
									<a-option
									  v-for="s in dict.video_type"
									  :key="s.detailId"
									  :value="s.value"
									>
									  {{ s.label }}
									</a-option>
								  </a-select>
								</a-form-item>
							  </a-col>								
							  <!--视频大分类-->
							  <a-col :span="12">
								<a-form-item
								  field="videoKindId"
								  label="视频大分类"
								  :rules="[{ required: true, message: '视频大分类不能为空' }]"
								>
								  <a-select
									v-model="crud.options.form.videoKindId"
									
									placeholder="请选择"
									allow-clear
									allow-search
								  >
									<a-option
									  v-for="s in kindMap"
									  :key="s.id"
									  :value="s.id"
									  >{{ s.name }}</a-option
									>
								  </a-select>
								</a-form-item>
							  </a-col>
							  <!--视频小分类-->
							  <a-col :span="12">
								<a-form-item
								  field="videoCategoryId"
								  label="视频小分类"
								  :rules="[{ required: true, message: '视频小分类不能为空' }]"
								>
								  <a-select
									v-model="crud.options.form.videoCategoryId"
									placeholder="请选择"
									allow-clear
									allow-search
								  >
									<a-option
									  v-for="s in categoryMap"
									  :key="s.id"
									  :value="s.id"
									  >{{ s.name }}</a-option
									>
								  </a-select>
								</a-form-item>
							  </a-col>
							  <!--发贴用户ID-->
							  <a-col :span="12">
								<a-form-item
								  field="postsUserId"
								  label="发贴用户ID"
								  :rules="[{ required: true, message: '发贴用户ID不能为空' }]"
								>
								  <a-input-number v-model="crud.options.form.postsUserId" />
								</a-form-item>
							  </a-col>
							</a-row>
						  </template>

					</CrudOperation>
				</a-col>
			</a-row>
			<!--表格栏-->
			<a-row>
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
				  style="height: 55vh"
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
				 <!--Video类型-->
				  <template #videoType="{ record }">
					<!--正常情况下-->
					<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
					  {{ dict.video_type ? (dict.video_type.filter((di: any) => di.value === record.videoType || di.value === (record.videoType + '')))[0].label : ''}}
					</div>
					<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
					<div v-if="!record.editable && crud.options.tableInfo.isEdit">
					  <!--未修改的行-->
					  <div v-show="!crud.options.form[record.id]">
						{{ dict.video_type ? (dict.video_type.filter((di: any) => di.value === record.videoType || di.value === (record.videoType + '')))[0].label : ''}}
					  </div>
					  <!--修改完毕提交后-->
					  <div v-if="crud.options.form[record.id]">
						{{
						  crud.options.form[record.id].videoType
							? crud.options.form[record.id].videoType
							: record.videoType
						}}
					  </div>
					</div>

					<!--修改情况下-->
					<div v-if="record.editable">
					  <a-select
						v-model="crud.options.form[record.id].videoType"
						@change="loadKindData"
						allow-clear
						:default-value="dict.video_type[record.videoType].value"
					  >
						<a-option
						  v-for="s in dict.video_type"
						  :key="s.detailId"
						  :value="s.value"
						  >{{ s.label }}
						</a-option>
					  </a-select>
					</div>
				  </template>
				  <!--视频大分类-->
				  <template #videoKindId="{ record }">
					<!--正常情况下-->
					<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
					   {{allKindMap[record.videoKindId]?allKindMap[record.videoKindId].name:"" }}
					</div>

					<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
					<div v-if="!record.editable && crud.options.tableInfo.isEdit">
					  <!--未修改的行-->
					  <div v-show="!crud.options.form[record.id]">
						{{allKindMap[record.videoKindId]?allKindMap[record.videoKindId].name:"" }}
					  </div>
					  <!--修改完毕提交后-->
					  <div v-if="crud.options.form[record.id]">
						{{
						  crud.options.form[record.id].videoKindId
							? crud.options.form[record.id].videoKindId
							: record.videoKindId
						}}
					  </div>
					</div>

					<!--修改情况下-->
					<div v-if="record.editable">
					  <a-select
						v-model="crud.options.form[record.id].videoKindId"
						@change="loadCategoryData"
						allow-clear
						:default-value="record.videoKindId"
					  >
						<a-option
						  v-for="s in kindMap"
						  :key="s.id"
						  :value="s.id"
						  >{{ s.name }}
						</a-option>
					  </a-select>
					</div>
				  </template>

				  <!--视频小分类-->
				  <template #videoCategoryId="{ record }">
					<!--正常情况下-->
					<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
					   {{allCategoryMap[record.videoCategoryId]?allCategoryMap[record.videoCategoryId].name:"" }}
					</div>

					<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
					<div v-if="!record.editable && crud.options.tableInfo.isEdit">
					  <!--未修改的行-->
					  <div v-show="!crud.options.form[record.id]">
						 {{allCategoryMap[record.videoCategoryId]?allCategoryMap[record.videoCategoryId].name:"" }}
					  </div>
					  <!--修改完毕提交后-->
					  <div v-if="crud.options.form[record.id]">
						{{
						  crud.options.form[record.id].videoCategoryId
							? crud.options.form[record.id].videoCategoryId
							: record.videoCategoryId
						}}
					  </div>
					</div>

					<!--修改情况下-->
					<div v-if="record.editable">
					  <a-select
						v-model="crud.options.form[record.id].videoCategoryId"
						:default-value="record.videoCategoryId"
					  >
						<a-option
						  v-for="s in categoryMap"
						  :key="s.id"
						  :value="s.id"
						  >{{ s.name }}
						</a-option>
					  </a-select>
					</div>
				  </template>

				  <!--发贴用户ID-->
				  <template #postsUserId="{ record }">
					<!--正常情况下-->
					<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
					  {{ record.postsUserId }}
					</div>

					<!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
					<div v-if="!record.editable && crud.options.tableInfo.isEdit">
					  <!--未修改的行-->
					  <div v-show="!crud.options.form[record.id]">
						{{ record.postsUserId }}
					  </div>
					  <!--修改完毕提交后-->
					  <div v-if="crud.options.form[record.id]">
						{{
						  crud.options.form[record.id].postsUserId
							? crud.options.form[record.id].postsUserId
							: record.postsUserId
						}}
					  </div>
					</div>

					<!--修改情况下-->
					<div v-if="record.editable">
					  <a-input-number
						v-model="crud.options.form[record.id].postsUserId"
						:default-value="record.postsUserId"
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
	import { computed, ref, inject, onMounted, provide, reactive } from 'vue';
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';


    import { CircleVideo } from '@/api/bobosns/circleVideo';

	import { Kind, KindList,KindListAll } from '@/api/video/kind';
    import { Category, CategoryList ,CategoryListAll} from '@/api/video/category';
    import { useDict } from '@/components/dict';
	import Pagination from '@/components/crud/Pagination.vue';
	import RROperation from '@/components/crud/RROperation.vue';
	import CrudOperation from '@/components/crud/CrudOperation.vue';

	import { useI18n } from 'vue-i18n';

	const visible = inject<boolean>('digitalVisible');
	const circleName = inject<String>('circleName');
	const circleId = inject<String>('circleId');
	

	  const { t } = useI18n();
	  const crud = useCrud<CircleVideo>({
		tag: '关联视频设置',
		url: '/bobosns/circleVideo',
		title: '',
		tableInfo: {
		  componentConfig: {
			stripe: false,
		  },
		},
	  });
	  provide('crud', crud);
	  
	
	crud.options.query.circleId=circleId;
	crud.options.form.circleId=circleId;
	
	// 字典
	const dict = useDict('yes_no_status', 'video_type');
	
	provide('crud', crud);

  // 设置关联视频设置 columns信息
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
      title: '圈子',
      dataIndex: 'circleId',
      width: 100,
      display: false,
      slotName: 'circleId',
      tooltip: true,
      ellipsis: true,
    },
	{
	  title: '视频类型',
	  dataIndex: 'videoType',
	  width: 150,
	  display: true,
	  slotName: 'videoType',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '视频大分类',
      dataIndex: 'videoKindId',
      width: 100,
      display: true,
      slotName: 'videoKindId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '视频小分类',
      dataIndex: 'videoCategoryId',
      width: 100,
      display: true,
      slotName: 'videoCategoryId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '发贴用户ID',
      dataIndex: 'postsUserId',
      width: 100,
      display: true,
      slotName: 'postsUserId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户Id',
      dataIndex: 'userId',
      width: 150,
      display: false,
      slotName: 'userId',
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
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      display: false,
      slotName: 'updateTime',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });


    const allKindMap = ref<{ [key : number] : Kind }>({});
	const allCategoryMap = ref<{ [key : number] : Category }>({});
	
	const loadAllData = async () => {
		const kindList = await KindListAll();
		allKindMap.value = {};
		kindList.data.list.forEach((val) => {
			allKindMap.value[val.id] = val;
		});
		
		const categoryList = await CategoryListAll();
		allCategoryMap.value = {};
		categoryList.data.list.forEach((val) => {
			allCategoryMap.value[val.id] = val;
		});
		
	};

   
   const categoryMap = ref<{ [key : number] : Category }>({});
   const loadCategoryData = async (e) => {
   
   	crud.options.form.videoCategoryId="";
   	const categoryList = await CategoryList(e);
   	categoryMap.value = {};
   	categoryList.data.list.forEach((val) => {
   		categoryMap.value[val.id] = val;
   	});
   };
   
   
	const kindMap = ref<{ [key : number] : Kind }>({});
	const loadKindData = async (e:any) => {		
		
		crud.options.form.videoKindId="";
		crud.options.query.videoKindId="";
		crud.options.query.videoCategoryId="";
		
	
		const kindList = await KindList(e);
		kindMap.value = {};
		kindList.data.list.forEach((val) => {
			kindMap.value[val.id] = val;
		});
		
		//  加载小分类
		loadCategoryData(e);
		
	};

	const refreshData = async (id:number) => {
		crud.options.query.circleId=id;
		crud.options.form.circleId=id;
		crud.method.refresh();
	}
	// 暴露方法
	defineExpose({
		refreshData
	});
	
	
	onMounted(() => {
		loadAllData();
		crud.method.refresh();
	});
	
	/* crud.hook.beforeOpenAdd = () => {
		crud.options.query.circleId=circleId;
		crud.options.form.circleId=circleId;
		
		return true;
	};
	crud.hook.afterResetParams = () => {
		crud.options.query.circleId=circleId;
		crud.options.form.circleId=circleId;
		return true;
	}; */
	
	
</script>

<style scoped></style>