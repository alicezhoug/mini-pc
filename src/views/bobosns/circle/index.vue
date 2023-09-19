<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="crud.options.query"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-scrollbar style="height: 104px; overflow: auto">
                <a-row :gutter="16" style="width: 100%">
                  <!--圈子名称搜索框-->
                  <a-col :span="8">
                    <a-form-item field="circleName" label="圈子名称">
                      <a-input
                        v-model="crud.options.query.circleName"
                        placeholder="输入圈子名称搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--板块ID搜索框-->
                  <a-col :span="8">
                    <a-form-item field="plateId" label="板块">
                      <a-select
                        v-model="crud.options.query.plateId"
                        placeholder="输入板块搜索"
                        allow-search
						allow-clear

                      >
                        <a-option
                          v-for="s in plateMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.plateName }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
				 <!--状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="circleState" label="状态">
                      <a-select
                        v-model="crud.options.query.circleState"
                        placeholder="输入状态搜索"
                        allow-search
						allow-clear
                      >
                        <a-option
                          v-for="s in dict.circle_state"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>		
				<!--热门圈子搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isHot" label="热门圈子">
                      <a-select
                        v-model="crud.options.query.isHot"
                        placeholder="输入热门圈子搜索"
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
                  <!--圈子页顶部推荐搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isTopRecommend" label="顶部推荐">
                      <a-select
                        v-model="crud.options.query.isTopRecommend"
                        placeholder="输入圈子页顶部推荐搜索"
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
                 
                  
                </a-row>
              </a-scrollbar>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <RROperation direction="vertical"/>
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <CrudOperation
          :add-permission="['bobosns:circle:add']"
          :edit-permission="['bobosns:circle:edit']"
          :del-permission="['bobosns:circle:del']"
          :download-permission="['bobosns:circle:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--圈子名称-->
              <a-col :span="12">
                <a-form-item
                  field="circleName"
                  label="圈子名称"
                  :rules="[{ required: true, message: '圈子名称不能为空' }]">
                  <a-input v-model="crud.options.form.circleName" />
                </a-form-item>
              </a-col>
			  <!--板块ID-->
			  <a-col :span="12">
			    <a-form-item
			      field="plateId"
			      label="板块"
			  	  :rules="[{ required: true, message: '板块不能为空' }]"
			    >
			      <a-select
			        v-model="crud.options.form.plateId"
			        placeholder="请选择"
			        allow-search
			      >
			        <a-option
			          v-for="s in plateMap"
			          :key="s.id"
			          :value="s.id"
			          >{{ s.plateName }}</a-option
			        >
			      </a-select>
			    </a-form-item>
			  </a-col>
			<!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="circleState"
                  label="状态"
				  :rules="[{ required: true, message: '状态不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.circleState"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.circle_state"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>			  
              <!--排序-->
              <a-col :span="12">
                <a-form-item
                  field="sort"
                  label="排序"
                >
                  <a-input-number v-model="crud.options.form.sort" />
                </a-form-item>
              </a-col>
              
              <!--热门圈子-->
              <a-col :span="12">
                <a-form-item
                  field="isHot"
                  label="热门圈子"
				 :rules="[
				 { required: true, message: '是否热门不能为空' }
				 ]"
                >
                  <a-select
                    v-model="crud.options.form.isHot"
                    placeholder="请选择"
                    allow-search
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
             
              <!--圈子介绍-->
              <a-col :span="24">
                <a-form-item
                  field="circleIntroduce"
                  label="圈子介绍"
                    :rules="[
                    { required: true, message: '圈子介绍不能为空' }
                    ]"
                >
                  <a-textarea v-model="crud.options.form.circleIntroduce"/>
                </a-form-item>
              </a-col>
              <!--驳回原因-->
              <a-col :span="24">
                <a-form-item
                  field="reject"
                  label="驳回原因"
                >
                  <a-textarea v-model="crud.options.form.reject"/>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
		  <template #right>
		    <a-button
		      v-if="!crud.options.tableInfo.isEdit"
		      v-permission="['pay:modeDigital:list']"
		      type="outline"
		      size="small"
		  	  :disabled="!clickIconsId"
		      class="button"
		      @click="digitalVisible = true ">
		      视频关联设置
		    </a-button>
		  </template>	
        </CrudOperation>
		<Digital />
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
		    @row-click="tableColClick"
          style="height: calc(100% - 209px); margin-bottom: 12px"
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

          <!--圈子名称-->
          <template #circleName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.circleName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.circleName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].circleName
                    ? crud.options.form[record.id].circleName
                    : record.circleName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].circleName"
                :default-value="record.circleName"
              />
            </div>
          </template>

          <!--排序-->
          <template #sort="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.sort }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.sort }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].sort
                    ? crud.options.form[record.id].sort
                    : record.sort
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].sort"
                :default-value="record.sort"
              />
            </div>
          </template>

          <!--圈子介绍-->
          <template #circleIntroduce="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.circleIntroduce }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.circleIntroduce }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].circleIntroduce
                    ? crud.options.form[record.id].circleIntroduce
                    : record.circleIntroduce
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].circleIntroduce"
                :default-value="record.circleIntroduce"
              />
            </div>
          </template>
          <!--图片-->
          <template #headPortrait="{ record }">
				<a-upload
				  :custom-request="customHeadPortraitRequest"
				  list-type="picture-card"
				  :show-upload-button="true"
				  :show-file-list="false"
				>
				  <template #upload-button>
					<a-avatar :size="50" class="info-avatar">
					  <template #trigger-icon>
						<icon-camera />
					  </template>
					  <img v-if="record.headPortrait" :src="record.headPortrait" />
					</a-avatar>
				  </template>
				</a-upload>            
          </template>
		  
         <!--图片-->
          <template #backgroundMaps="{ record }">
				<a-upload
				  :custom-request="customBackgroundMapsRequest"
				  list-type="picture-card"
				  :show-upload-button="true"
				  :show-file-list="false"
				>
				  <template #upload-button>
					<a-avatar :size="50" class="info-avatar">
					  <template #trigger-icon>
						<icon-camera />
					  </template>
					  <img v-if="record.backgroundMaps" :src="record.backgroundMaps" />
					</a-avatar>
				  </template>
				</a-upload>            
          </template>		  
          <!--板块ID-->
          <template #plateId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
			   {{plateMap[record.plateId]?plateMap[record.plateId].plateName:"" }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{plateMap[record.plateId]?plateMap[record.plateId].plateName:"" }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].plateId
                    ? crud.options.form[record.id].plateId
                    : record.plateId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].plateId"
                :default-value="record.plateId"
				allow-clear
              >
                <a-option
                  v-for="s in plateMap"
                  :key="s.id"
                  :value="s.id"
                  >{{ s.plateName }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--热门圈子-->
          <template #isHot="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.isHot ? '1' : '0') || di.value === (record.isHot + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.isHot ? '1' : '0') || di.value === (record.isHot + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].isHot
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].isHot ? '1' : '0') || di.value === (record.isHot + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.isHot ? '1' : '0') || di.value === (record.isHot + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].isHot"
                :default-value="record.isHot ? '1' : '0'"
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


          <!--热门圈子-->
          <template #isTopRecommend="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.isTopRecommend ? '1' : '0') || di.value === (record.isTopRecommend + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.isTopRecommend ? '1' : '0') || di.value === (record.isTopRecommend + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].isTopRecommend
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].isTopRecommend ? '1' : '0') || di.value === (record.isTopRecommend + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.isTopRecommend ? '1' : '0') || di.value === (record.isTopRecommend + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].isTopRecommend"
                :default-value="record.isTopRecommend ? '1' : '0'"
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
		  
          <!--状态-->
          <template #circleState="{ record }">
				{{ dict.circle_state ? (dict.circle_state.filter((di: any) => di.value === record.circleState || di.value === (record.circleState + '')))[0].label : ''}}
          </template>

          <!--驳回原因-->
          <template #reject="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.reject }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.reject }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].reject
                    ? crud.options.form[record.id].reject
                    : record.reject
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].reject"
                :default-value="record.reject"
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
 
  import { computed, getCurrentInstance, CSSProperties,onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  
  import { Plate,PlateList} from '@/api/bobosns/plate';
  import { Circle,iconUpload } from '@/api/bobosns/circle';
  import { useI18n } from 'vue-i18n';
  import Digital from '@/views/bobosns/circle/digital.vue';
  import {TableData} from '@arco-design/web-vue/es/table/interface';

  import {
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  
  const { t } = useI18n();
  const crud = useCrud<Circle>({
    tag: '圈子设置',
    url: '/bobosns/circle',
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
  



	const plateMap = ref<{ [key : number] : Plate }>({});
	const loadData = async () => {

		const plateList = await PlateList();
		plateMap.value = {};
		plateList.data.list.forEach((val) => {
			plateMap.value[val.id] = val;
		});
	};
	
	

  // 字典
  const dict = useDict('yes_no_status', 'circle_state');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置圈子设置 columns信息
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
      width: 100,
      display: false,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '圈子名称',
      dataIndex: 'circleName',
      width: 150,
      display: true,
      slotName: 'circleName',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    
    {
      title: '圈子介绍',
      dataIndex: 'circleIntroduce',
      width: 150,
      display: true,
      slotName: 'circleIntroduce',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '圈子头像',
      dataIndex: 'headPortrait',
      width: 150,
      display: true,
      slotName: 'headPortrait',
      tooltip: true,
      ellipsis: true,
	  
    },
    {
      title: '圈子背景',
      dataIndex: 'backgroundMaps',
      width: 150,
      display: true,
      slotName: 'backgroundMaps',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '板块ID',
      dataIndex: 'plateId',
      width: 150,
      display: true,
      slotName: 'plateId',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
   
    {
      title: '圈子页顶部推荐',
      dataIndex: 'isTopRecommend',
      width: 150,
      display: true,
      slotName: 'isTopRecommend',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '热门圈子',
      dataIndex: 'isHot',
      width: 150,
      display: true,
      slotName: 'isHot',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
	{
	  title: '排序',
	  dataIndex: 'sort',
	  width: 150,
	  display: true,
	  slotName: 'sort',
	  tooltip: true,
	  ellipsis: true,
	  bodyCellStyle
	},
    {
      title: '状态',
      dataIndex: 'circleState',
      width: 150,
      display: true,
      slotName: 'circleState',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '驳回原因',
      dataIndex: 'reject',
      width: 150,
      display: true,
      slotName: 'reject',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
	{
	  title: '圈主ID',
	  dataIndex: 'userId',
	  width: 150,
	  display: true,
	  slotName: 'userId',
	  tooltip: true,
	  ellipsis: true,
	  bodyCellStyle
	},
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: false,
      slotName: 'createBy',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
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

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  
  
   let lastClickRecord: TableData = {};

   const clickCircleName = ref('');
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
	
	clickCircleName.value = record.circleName;
	
  	lastClickRecord = record;
     record.click = true;
   };
   
   // quartzLog
     const digitalVisible = ref(false);
     
     provide('digitalVisible', digitalVisible);
	 provide('circleName', clickCircleName);
	 provide('circleId', clickIconsId);
   
  onMounted(() => {
	loadData();
    crud.method.refresh();
  });



  
  
  
  const customBackgroundMapsRequest = (options: RequestOption) => {
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
  
         const res = await iconUpload(formData,clickIconsId.value as string,1, {
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
   
   
 const customHeadPortraitRequest = (options: RequestOption) => {
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
        const res = await iconUpload(formData,clickIconsId.value as string,0, {
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
    name: 'Circle',
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