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
                  <!--所属圈子搜索框-->
                  <a-col :span="8">
                    <a-form-item field="circleId" label="所属圈子">
                      <a-select
                        v-model="crud.options.query.circleId"
                        placeholder="输入所属圈子搜索"
                        allow-search
						allow-clear

                      >
                        <a-option
                          v-for="s in circleMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.circleName }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--是否热榜搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isInformation" label="是否热榜">
                      <a-select
                        v-model="crud.options.query.isInformation"
                        placeholder="输入是否热榜搜索"
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
                  <!--审核状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isExamine" label="审核状态">
                      <a-select
                        v-model="crud.options.query.isExamine"
                        placeholder="输入审核状态搜索"
                        allow-search
						allow-clear

                      >
                        <a-option
                          v-for="s in dict.posts_examine_state"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--是否已读搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isFee" label="是否收费">
                      <a-select
                        v-model="crud.options.query.isFee"
                        placeholder="输入是否收费搜索"
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
                  <!--帖子状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="postsState" label="帖子状态">
                      <a-select
                        v-model="crud.options.query.postsState"
                        placeholder="输入帖子状态搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.posts_state"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--是否置顶搜索框-->
                  <a-col :span="8">
                    <a-form-item field="isSticky" label="是否置顶">
                      <a-select
                        v-model="crud.options.query.isSticky"
                        placeholder="输入是否置顶搜索"
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
          :add-permission="['bobosns:posts:add']"
          :edit-permission="['bobosns:posts:edit']"
          :del-permission="['bobosns:posts:del']"
          :download-permission="['bobosns:posts:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--所属圈子-->
              <a-col :span="12">
                <a-form-item
                  field="circleId"
                  label="所属圈子"
                >
                  <a-select
                    v-model="crud.options.form.circleId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in circleMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.circleName }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--标签-->
              <a-col :span="12">
                <a-form-item
                  field="tagsId"
                  label="标签"
                >
                  <a-input v-model="crud.options.form.tagsId" />
                </a-form-item>
              </a-col>
              <!--金币数量-->
              <a-col :span="12">
                <a-form-item
                  field="feeCoin"
                  label="金币数量"
                >
                  <a-input-number v-model="crud.options.form.feeCoin" />
                </a-form-item>
              </a-col>
              <!--是否热榜-->
              <a-col :span="12">
                <a-form-item
                  field="isInformation"
                  label="是否热榜"
                >
                  <a-select
                    v-model="crud.options.form.isInformation"
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
              <!--审核状态-->
              <a-col :span="12">
                <a-form-item
                  field="isExamine"
                  label="审核状态"
                >
                  <a-select
                    v-model="crud.options.form.isExamine"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.posts_examine_state"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
             
              <!--帖子状态-->
              <a-col :span="12">
                <a-form-item
                  field="postsState"
                  label="帖子状态"
                >
                  <a-select
                    v-model="crud.options.form.postsState"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.posts_state"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--是否置顶-->
              <a-col :span="12">
                <a-form-item
                  field="isSticky"
                  label="是否置顶"
                >
                  <a-select
                    v-model="crud.options.form.isSticky"
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
              
            
              <!--实时热度-->
              <a-col :span="12">
                <a-form-item
                  field="degree"
                  label="实时热度"
                >
                  <a-date-picker
                    v-model="crud.options.form.degree"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--帖子内容-->
              <a-col :span="24">
                <a-form-item
                  field="postsContent"
                  label="帖子内容"
                >
                  <a-textarea v-model="crud.options.form.postsContent"/>
                </a-form-item>
              </a-col>
              <!--驳回原因-->
              <a-col :span="24">
                <a-form-item
                  field="overruleContent"
                  label="驳回原因"
                >
                  <a-textarea v-model="crud.options.form.overruleContent"/>
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

          <!--帖子内容-->
          <template #postsContent="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.postsContent }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.postsContent }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].postsContent
                    ? crud.options.form[record.id].postsContent
                    : record.postsContent
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].postsContent"
                :default-value="record.postsContent"
              />
            </div>
          </template>

          <!--所属圈子-->
          <template #circleId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">           
			   {{circleMap[record.circleId]?circleMap[record.circleId].circleName:"" }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                  {{circleMap[record.circleId]?circleMap[record.circleId].circleName:"" }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].circleId
                    ? crud.options.form[record.id].circleId
                    : record.circleId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].circleId"
                :default-value="record.circleId"
              >
                <a-option
                  v-for="s in circleMap"
                  :key="s.id"
                  :value="s.id"
                  >{{ s.circleName }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--标签-->
          <template #tagsId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.tagsId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.tagsId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].tagsId
                    ? crud.options.form[record.id].tagsId
                    : record.tagsId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].tagsId"
                :default-value="record.tagsId"
              />
            </div>
          </template>

          <!--金币数量-->
          <template #feeCoin="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.feeCoin }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.feeCoin }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].feeCoin
                    ? crud.options.form[record.id].feeCoin
                    : record.feeCoin
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].feeCoin"
                :default-value="record.feeCoin"
              />
            </div>
          </template>

          <!--是否热榜-->
          <template #isInformation="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.isInformation }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.isInformation }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].isInformation
                    ? crud.options.form[record.id].isInformation
                    : record.isInformation
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].isInformation"
                :default-value="record.isInformation"
              >
                <a-option
                  v-for="s in dict.yes_no_status"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--审核状态-->
          <template #isExamine="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.isExamine }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.isExamine }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].isExamine
                    ? crud.options.form[record.id].isExamine
                    : record.isExamine
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].isExamine"
                :default-value="record.isExamine"
              >
                <a-option
                  v-for="s in dict.posts_examine_state"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--驳回原因-->
          <template #overruleContent="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.overruleContent }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.overruleContent }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].overruleContent
                    ? crud.options.form[record.id].overruleContent
                    : record.overruleContent
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].overruleContent"
                :default-value="record.overruleContent"
              />
            </div>
          </template>

          <!--是否已读-->
          <template #overruleIsRead="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.overruleIsRead }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.overruleIsRead }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].overruleIsRead
                    ? crud.options.form[record.id].overruleIsRead
                    : record.overruleIsRead
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].overruleIsRead"
                :default-value="record.overruleIsRead"
              >
                <a-option
                  v-for="s in dict.yes_no_status"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--帖子状态-->
          <template #postsState="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.postsState }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.postsState }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].postsState
                    ? crud.options.form[record.id].postsState
                    : record.postsState
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].postsState"
                :default-value="record.postsState"
              >
                <a-option
                  v-for="s in dict.posts_state"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--是否置顶-->
          <template #isSticky="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.isSticky }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.isSticky }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].isSticky
                    ? crud.options.form[record.id].isSticky
                    : record.isSticky
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].isSticky"
                :default-value="record.isSticky"
              >
                <a-option
                  v-for="s in dict.yes_no_status"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--实时热度-->

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
  import { Posts } from '@/api/bobosns/posts';
  
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import { Circle, CircleList } from '@/api/bobosns/circle';

  const { t } = useI18n();
  const crud = useCrud<Posts>({
    tag: '帖子列表',
    url: '/bobosns/posts',
    title: '',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



	const circleMap = ref<{ [key : number] : Circle }>({});
	const loadData = async () => {

		const circleList = await CircleList();
		circleMap.value = {};
		circleList.data.list.forEach((val) => {
			circleMap.value[val.id] = val;
		});
		

	};
	
	

  // 字典
  const dict = useDict('yes_no_status', 'posts_examine_state', 'posts_state');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置帖子列表 columns信息
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
	  title: '发贴用户',
	  dataIndex: 'userId',
	  width: 150,
	  display: true,
	  slotName: 'userId',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '帖子内容',
      dataIndex: 'postsContent',
      width: 150,
      display: true,
      slotName: 'postsContent',
      tooltip: true,
      ellipsis: true,
    },
    
    {
      title: '所属圈子',
      dataIndex: 'circleId',
      width: 150,
      display: true,
      slotName: 'circleId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tagsId',
      width: 150,
      display: true,
      slotName: 'tagsId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '金币数量',
      dataIndex: 'feeCoin',
      width: 150,
      display: true,
      slotName: 'feeCoin',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '图片数量',
      dataIndex: 'imgCount',
      width: 150,
      display: true,
      slotName: 'imgCount',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '是否热榜',
      dataIndex: 'isInformation',
      width: 150,
      display: true,
      slotName: 'isInformation',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '审核状态',
      dataIndex: 'isExamine',
      width: 150,
      display: true,
      slotName: 'isExamine',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '驳回原因',
      dataIndex: 'overruleContent',
      width: 150,
      display: true,
      slotName: 'overruleContent',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '是否已读',
      dataIndex: 'overruleIsRead',
      width: 150,
      display: true,
      slotName: 'overruleIsRead',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '帖子状态',
      dataIndex: 'postsState',
      width: 150,
      display: true,
      slotName: 'postsState',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '客户端',
      dataIndex: 'device',
      width: 150,
      display: true,
      slotName: 'device',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'ip地址',
      dataIndex: 'ip',
      width: 150,
      display: true,
      slotName: 'ip',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      width: 150,
      display: true,
      slotName: 'latitude',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      width: 150,
      display: true,
      slotName: 'longitude',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '国家',
      dataIndex: 'country',
      width: 150,
      display: true,
      slotName: 'country',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '省份',
      dataIndex: 'province',
      width: 150,
      display: true,
      slotName: 'province',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '城市',
      dataIndex: 'city',
      width: 150,
      display: true,
      slotName: 'city',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '县城',
      dataIndex: 'district',
      width: 150,
      display: true,
      slotName: 'district',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '是否置顶',
      dataIndex: 'isSticky',
      width: 150,
      display: true,
      slotName: 'isSticky',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '计算热度',
      dataIndex: 'weight',
      width: 180,
      display: true,
      slotName: 'weight',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '实时热度',
      dataIndex: 'degree',
      width: 150,
      display: true,
      slotName: 'degree',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '最后回复时间',
      dataIndex: 'lastReplyAt',
      width: 180,
      display: true,
      slotName: 'lastReplyAt',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
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
  onMounted(() => {
	loadData();
    crud.method.refresh();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Posts',
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