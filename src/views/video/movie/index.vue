<template>
	<div class="container">
		<div class="panel">
			<div style="position: relative; height: 100%">
				<!--查询表单-->
				<a-row :gutter="24" style="margin-bottom: 12px">
					<!--标题搜索框-->
					<a-col :span="6">
						<a-input v-model="crud.options.query.title" placeholder="输入标题搜索">
							<template #prefix> 模糊 </template>
						</a-input>
					</a-col>

					<!--标题搜索框-->
					<a-col :span="12">
						<a-input v-model="crud.options.query.tags" placeholder="输入标签搜索">
							<template #prefix> 模糊 </template>
						</a-input>
					</a-col>


				</a-row>
				<!--查询表单-->
				<a-row :gutter="24" style="margin-bottom: 12px">

					<!--大分类搜索框-->
					<a-col :span="6">
						<a-select v-model="crud.options.query.channelId" placeholder="选择视频源搜索">
							<a-option v-for="channel in channelMap" :key="channel.id" :value="channel.id">
								{{ channel.name }}
							</a-option>
						</a-select>
					</a-col>

					<!--大分类搜索框-->
					<a-col :span="6">
						<a-select v-model="crud.options.query.kindId" placeholder="选择大分类搜索">
							<a-option v-for="kind in kindMap" :key="kind.id" :value="kind.id">
								{{ kind.name }}
							</a-option>
						</a-select>
					</a-col>
					<!--大分类搜索框-->
					<a-col :span="6">
						<a-select v-model="crud.options.query.categoryId" placeholder="选择小分类搜索">
							<a-option v-for="category in categoryMap" :key="category.id" :value="category.id">
								{{ category.name }}
							</a-option>
						</a-select>
					</a-col>
					<a-col :span="6">
						<RROperation />
					</a-col>
				</a-row>
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
          " style="height: calc(100% - 128px); margin-bottom: 12px">


					<!--频道ID-->
					<template #channelId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ channelMap[record.channelId]?channelMap[record.channelId].name:''}}
						</div>

					</template>

					<!--大分类-->
					<template #kindId="{ record }">
						
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ kindMap[record.kindId]?kindMap[record.kindId].name:'' }}
						</div>
					</template>
			  <!--头像-->
					  <template #thumb="{ record }">
							<a-avatar :size="50" class="info-avatar">
							  <img v-if="record.thumb" :src="record.thumb" />
							</a-avatar>          
					  </template>	
		  
		  
					<!--细分类-->
					<template #categoryId="{ record }">
						<!--正常情况下-->
						<div v-show="!record.editable && !crud.options.tableInfo.isEdit">
							{{ categoryMap[record.categoryId]?categoryMap[record.categoryId].name:''}}
						</div>
					</template>
					<template #operate="{ record }">
						<a-button v-permission="['video:movie:pull']" :loading="pullLoading[record.id]" type="outline" size="mini"
							status="danger" @click="rePull(record.id)">
							<template #icon>
								<icon-forward />
							</template>
							Pull
						</a-button>
					</template>
				</a-table>
				<Pagination style="position: absolute; right: 0; bottom: 0; padding-right: 7px" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useCrud, CrudStatus } from '@/components/crud/CRUD';
	import { Movie } from '@/api/video/movie';
	import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
	import RROperation from '@/components/crud/RROperation.vue'
	import Pagination from '@/components/crud/Pagination.vue';

	import axios from 'axios';


	import { useI18n } from 'vue-i18n';
	import { Kind, KindList } from '@/api/video/kind';
	import { Category, CategoryList } from '@/api/video/category';
	import { Channel, ChannelList } from '@/api/video/channel';
	// import useLoading from '@/hooks/loading';

	const { t } = useI18n();
	const crud = useCrud<Movie>({
		tag: '电影源',
		url: '/video/movie',
		title: 'video.movie',
		tableInfo: {
			componentConfig: {
				stripe: false,
				colResizable: true
			},
		},
	});
	provide('crud', crud);



	const instance = getCurrentInstance();
	const global = (instance as any).appContext.config.globalProperties;


	const pullLoading = ref<{ [key : number] : boolean }>({});

	// const { loading, toggle } = useLoading(false);
	const rePull = async (movieId : number) => {
		// toggle();
		pullLoading.value[movieId]=true;
		const res = await axios.post('/video/movie/pull', { id: movieId });
		try {
			if ((res as any).code === 20000) {
				global.$message.success('操作成功！');
				crud.method.refresh();
			} else {
				global.$message.error(`操作失败！${(res as any).msg}`);
			}
		} finally {
			pullLoading.value[movieId]=false;
			// toggle();
		}
	};



	// 设置电影源 columns信息
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
			width: 50,
			display: false,
			slotName: 'id',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '频道源',
			dataIndex: 'channelId',
			width: 120,
			display: true,
			slotName: 'channelId',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '影视ID',
			dataIndex: 'filmId',
			width: 150,
			display: false,
			slotName: 'filmId',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '大分类',
			dataIndex: 'kindId',
			width: 100,
			display: true,
			slotName: 'kindId',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '小分类',
			dataIndex: 'categoryId',
			width: 100,
			display: true,
			slotName: 'categoryId',
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
			title: '播放地址',
			dataIndex: 'address',
			width: 350,
			display: true,
			slotName: 'address',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '头像',
			dataIndex: 'thumb',
			width: 150,
			display: true,
			slotName: 'thumb',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '观看人数',
			dataIndex: 'views',
			width: 150,
			display: false,
			slotName: 'views',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '标签',
			dataIndex: 'tags',
			width: 250,
			display: true,
			slotName: 'tags',
			tooltip: true,
			ellipsis: true,
		},
		{
			title: '操作',
			width: 100,
			display: true,
			slotName: 'operate',
		},
	]);
	const tableColumns = computed(() => {
		return crud.options.tableInfo.columns?.filter((val) => val.display);
	});





	const channelMap = ref<{ [key : number] : Channel }>({});
	const kindMap = ref<{ [key : number] : Kind }>({});
	const categoryMap = ref<{ [key : number] : Category }>({});
	// 获取服务器和应用信息
	const getKind = async () => {
		
		const kindList = await KindList("2");
		kindMap.value = {};
		kindList.data.list.forEach((val) => {
		  kindMap.value[val.id] = val;
		});
		
	


		CategoryList("2").then((categoryList) => {
			categoryMap.value = {};
			categoryList.data.list.forEach((val) => {
				categoryMap.value[val.id] = val;
			});
		}, (error) => {
			console.log((error))
		})


		ChannelList().then((channelList) => {
			channelMap.value = {};
			channelList.data.list.forEach((val) => {
				channelMap.value[val.id] = val;
			});
		}, (error) => {
			console.log(error)
		})


	};



	// region    ↓-------------------------------- switch --------------------------------↓
	// endregion ↑-------------------------------- switch --------------------------------↑

	// region    ↓-------------------------------- rangePicker --------------------------------↓
	// endregion ↑-------------------------------- rangePicker --------------------------------↑

	// region    ↓-------------------------------- 钩子 --------------------------------↓

	onMounted(() => {
		crud.method.refresh();
		getKind();
	});
	crud.hook.beforeOpenAdd = () => {
		getKind();
		return true;
	};



  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
	export default {
		name: 'Movie',
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