<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--名字搜索框-->
          <a-col :span="6">
            <a-input
                    v-model="crud.options.query.name"
                    placeholder="输入名字搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <!--类型搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.type"
              placeholder="输入类型搜索"
              allow-search

            >
              <a-option
                v-for="s in dict.icon_type"
                :key="s.detailId"
                :value="s.value"
              >
                {{ s.label }}
              </a-option>
            </a-select>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['bobosns:icons:add']"
          :edit-permission="['bobosns:icons:edit']"
          :del-permission="['bobosns:icons:del']"
          :download-permission="['bobosns:icons:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--名字-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="名字"
                  :rules="[{ required: true, message: '名字不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
             <!--类型-->
              <a-col :span="12">
                <a-form-item
                  field="type"
                  label="类型"
                  :rules="[{ required: true, message: '类型不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.type"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.icon_type"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>			  
              <!--icon-->
              <a-col :span="12">
                <a-form-item
                  field="icon"
                  label="icon"
                >
                  <a-input v-model="crud.options.form.icon" />
                </a-form-item>
              </a-col>
              <!--unicode16-->
              <a-col :span="12">
                <a-form-item
                  field="unicode16"
                  label="unicode16"
                >
                  <a-input v-model="crud.options.form.unicode16" />
                </a-form-item>
              </a-col>

			 <!--跳转id-->
			 <a-col :span="12">
			   <a-form-item
				 field="targetId"
				 label="跳转id"
			   >
				 <a-input v-model="crud.options.form.targetId"/>
			   </a-form-item>
			 </a-col>
              <!--描述-->
              <a-col :span="24">
                <a-form-item
                  field="desc"
                  label="描述"
                >
                  <a-textarea v-model="crud.options.form.desc"/>
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
          style="height: calc(100% - 128px); margin-bottom: 12px"
		   @row-click="tableColClick"
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

          <!--名字-->
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
              <a-input
                v-model="crud.options.form[record.id].name"
                :default-value="record.name"
              />
            </div>
          </template>

          <!--icon-->
          <template #icon="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.icon }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.icon }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].icon
                    ? crud.options.form[record.id].icon
                    : record.icon
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].icon"
                :default-value="record.icon"
              />
            </div>
          </template>

          <!--unicode16-->
          <template #unicode16="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.unicode16 }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.unicode16 }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].unicode16
                    ? crud.options.form[record.id].unicode16
                    : record.unicode16
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].unicode16"
                :default-value="record.unicode16"
              />
            </div>
          </template>
    
          <!--图片-->
          <template #img="{ record }">
				<a-upload
				  :custom-request="customRequest"
				  list-type="picture-card"
				  :show-upload-button="true"
				  :show-file-list="false"
				>
				  <template #upload-button>
					<a-avatar :size="50" class="info-avatar">
					  <template #trigger-icon>
						<icon-camera />
					  </template>
					  <img v-if="record.img" :src="record.img" />
					</a-avatar>
				  </template>
				</a-upload>            
          </template>

          <!--描述-->
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

          <!--类型-->
          <template #type="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
             
			  {{ dict.icon_type ? (dict.icon_type.filter((di: any) => di.value === record.type || di.value === (record.type + '')))[0].label : ''}}
			 			
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
        
				{{ dict.icon_type ? (dict.icon_type.filter((di: any) => di.value === record.type || di.value === (record.type + '')))[0].label : ''}}
							 	
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].type
                    ? crud.options.form[record.id].type
                    : record.type
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].type"
                :default-value="record.type"
              >
                <a-option
                  v-for="s in dict.icon_type"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--跳转id-->
          <template #targetId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.targetId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.targetId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].targetId
                    ? crud.options.form[record.id].targetId
                    : record.targetId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].targetId"
                :default-value="record.targetId"
              />
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
  import { Icons,iconUpload } from '@/api/bobosns/icons';
  import { computed, getCurrentInstance, onMounted,CSSProperties, provide, ref } from 'vue';
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
  const crud = useCrud<Icons>({
    tag: '图标设置',
    url: '/bobosns/icons',
    title: '',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



// 点击行的样式
  const bodyCellStyle = (record: TableData) => {
    const style: CSSProperties = {
      color: 'rgb(var(--arcoblue-5))',
    };
    if (record.click) {
      return style;
    }
    return {};
  };
  

  // 字典
  const dict = useDict('icon_type');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置图标设置 columns信息
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
	   bodyCellStyle,
    },
    {
      title: '名字',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
	{
	  title: '类型',
	  dataIndex: 'type',
	  width: 150,
	  display: true,
	  slotName: 'type',
	  tooltip: true,
	  ellipsis: true,
	   bodyCellStyle,
	},
	{
	  title: '图片',
	  dataIndex: 'img',
	  width: 250,
	  display: true,
	  slotName: 'img',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: 'icon',
      dataIndex: 'icon',
      width: 150,
      display: true,
      slotName: 'icon',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
	{
	  title: '跳转id',
	  dataIndex: 'targetId',
	  width: 150,
	  display: true,
	  slotName: 'targetId',
	  tooltip: true,
	  ellipsis: true,
	   bodyCellStyle,
	},
    {
      title: 'unicode16',
      dataIndex: 'unicode16',
      width: 150,
      display: true,
      slotName: 'unicode16',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    
    {
      title: '描述',
      dataIndex: 'desc',
      width: 150,
      display: true,
      slotName: 'desc',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '创建者',
      dataIndex: 'userId',
      width: 150,
      display: false,
      slotName: 'userId',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      display: false,
      slotName: 'updateTime',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      display: false,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
	   bodyCellStyle,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑



 let lastClickRecord: TableData = {};
 
  // 点击表格行，记录支付方式名称
  const clickIconsId = ref('');
 
  
  const tableColClick = async (record: TableData) => {
    // 编辑状态下不可选择
    if (crud.options.tableInfo.isEdit) return;
	
	if (lastClickRecord !== {}) {
	  // 清除上一次点击的对象属性
	  delete lastClickRecord.click;
	}
	

	clickIconsId.value=record.id;

	lastClickRecord = record;
    record.click = true;
  };
  
  
  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });


  
  
 const customRequest = (options: RequestOption) => {
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
      const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };
      try {
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127

        const res = await iconUpload(formData,clickIconsId.value as string, {
          controller,
          onUploadProgress,
        });
        crud.method.refresh();
        global.$message.success('修改成功！');
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
    name: 'Icons',
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