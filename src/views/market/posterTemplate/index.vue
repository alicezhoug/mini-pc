<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--二维码标题搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.text1"
                    placeholder="输入二维码标题搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <!--是否启用搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.status"
              placeholder="输入是否启用搜索"
              allow-search
              allow-clear

            >
                    <a-option
                      v-for="s in dict.yes_no_status"
                      :key="s.detailId"
                      :value="s.value">
                        {{ s.label }}
                      </a-option>
              
            </a-select>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['market:posterTemplate:add']"
          :edit-permission="['market:posterTemplate:edit']"
          :del-permission="['market:posterTemplate:del']"
          :download-permission="['market:posterTemplate:list']"
          :show-edit="false"
		  :show-save="true"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--二维码标题-->
              <a-col :span="12">
                <a-form-item
                  field="text1"
                  label="二维码标题"
                  :rules="[{ required: true, message: '二维码标题不能为空' }]"
                >
                  <a-input v-model="crud.options.form.text1" />
                </a-form-item>
              </a-col>
			  <!--是否启用-->
			  <a-col :span="12">
			    <a-form-item
			      field="status"
			      label="是否启用"
			      :rules="[{ required: true, message: '是否启用不能为空' }]"
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
			          :value="s.value">
			            {{ s.label }}
			          </a-option
			        >
			      </a-select>
			    </a-form-item>
			  </a-col>
              <!--描述2-->
              <a-col :span="12">
                <a-form-item
                  field="text2"
                  label="描述2"
                >
                  <a-input v-model="crud.options.form.text2" />
                </a-form-item>
              </a-col>
              <!--描述3-->
              <a-col :span="12">
                <a-form-item
                  field="text3"
                  label="描述3"
                >
                  <a-input v-model="crud.options.form.text3" />
                </a-form-item>
              </a-col>
              
              
            </a-row>
          </template>
        </CrudOperation>

        <!--表格-->
        <a-table
          ref="table"
          v-model:selectedKeys="crud.options.tableInfo.selectKeys"
          row-key="id"
          :columns="tableColumns"
          :data="crud.options.tableInfo.data"
          :pagination="false"
          :scroll="{ y: '100%' }"
          :loading="crud.status.value === CrudStatus.REFRESHING"
          :column-resizable="crud.options.tableInfo.componentConfig.colResizable"
          :bordered="{cell: crud.options.tableInfo.componentConfig.border}"
          :stripe="crud.options.tableInfo.componentConfig.stripe"
          :show-header="crud.options.tableInfo.componentConfig.tableHeader"
		  @row-click="tableColClick"
          :row-selection="
            crud.options.tableInfo.componentConfig.checkbox
              ? {
                  type: 'checkbox',
                  showCheckedAll: true,
                }
              : undefined
          "
          style="height: calc(100% - 128px); margin-bottom: 12px"
        >
 

          <!--二维码标题-->
          <template #text1="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.text1 }}
            </div>
          </template>

          <!--描述2-->
          <template #text2="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.text2 }}
            </div>
          </template>

          <!--描述3-->
          <template #text3="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.text3 }}
            </div>
          </template>

          <!--图片-->
          <template #domainUrl="{ record }">
          	<a-upload :custom-request="customRequest" list-type="picture-card" :show-upload-button="true"
          		:show-file-list="false">
          		<template #upload-button>
          			<a-avatar :size="50" class="info-avatar">
          				<template #trigger-icon>
          					<icon-camera />
          				</template>
          				<img v-if="record.domainUrl" :src="record.domainUrl" />
          			</a-avatar>
          		</template>
          	</a-upload>
          </template>

          <!--是否启用-->
          <template #status="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === record.status))[0].label : ''}}
             
            </div>
            
          </template>

        </a-table>
        <Pagination
          style="position: absolute; right: 0; bottom: 0; padding-right: 7px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { PosterTemplate ,iconUpload} from '@/api/market/posterTemplate';
  
  import { computed, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import {TableData} from '@arco-design/web-vue/es/table/interface';
  import { useI18n } from 'vue-i18n';
  import {
  	RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';

  const { t } = useI18n();
  const crud = useCrud<PosterTemplate>({
    tag: '分享海报模板',
    url: '/market/posterTemplate',
    title: 'menu.market.posterTemplate',
    tableInfo: {
      componentConfig: {
        stripe: false,
        colResizable:true
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('yes_no_status');
  
  
  // 设置分享海报模板 columns信息
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
      title: '二维码标题',
      dataIndex: 'text1',
      width: 150,
      display: true,
      slotName: 'text1',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '描述2',
      dataIndex: 'text2',
      width: 150,
      display: true,
      slotName: 'text2',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '描述3',
      dataIndex: 'text3',
      width: 150,
      display: true,
      slotName: 'text3',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '背景',
      dataIndex: 'domainUrl',
      width: 150,
      display: true,
      slotName: 'domainUrl',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      width: 150,
      display: true,
      slotName: 'status',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'userId',
      width: 150,
      display: true,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: true,
      slotName: 'createBy',
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
    {
      title: '更新者',
      dataIndex: 'updateBy',
      width: 150,
      display: true,
      slotName: 'updateBy',
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
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  
  // 点击表格行，记录Id
  const clickDataId = ref('');
  const tableColClick = async (record : TableData) => {
  	// 编辑状态下不可选择
  	if (crud.options.tableInfo.isEdit) return;
  	clickDataId.value = record.id;
  };
  
  onMounted(() => {
    crud.method.refresh();
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


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'PosterTemplate',
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