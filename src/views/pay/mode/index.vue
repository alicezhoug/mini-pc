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
                  <!--数字货币搜索框-->
                  <a-col :span="8">
                    <a-form-item field="digital" label="数字货币">
                      <a-select
                        v-model="crud.options.query.digital"
                        placeholder="输入数字货币搜索"
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
                  <!--启用搜索框-->
                  <a-col :span="8">
                    <a-form-item field="enabled" label="启用">
                      <a-select
                        v-model="crud.options.query.enabled"
                        placeholder="输入启用搜索"
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
                  <!--支持提现搜索框-->
                  <a-col :span="8">
                    <a-form-item field="withdrawal" label="支持提现">
                      <a-select
                        v-model="crud.options.query.withdrawal"
                        placeholder="输入支持提现搜索"
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
                  <!--支持国家搜索框-->
                  <a-col :span="8">
                    <a-form-item field="country" label="支持国家">
                      <a-select
                        v-model="crud.options.query.country"
                        placeholder="输入支持国家搜索"
                        allow-search
                      >
                        <a-option
                          v-for="s in countryMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.enName }}
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
          :add-permission="['pay:mode:add']"
          :edit-permission="['pay:mode:edit']"
          :del-permission="['pay:mode:del']"
          :download-permission="['pay:mode:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="名称"
                  :rules="[{ required: true, message: '名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--数字货币-->
              <a-col :span="12">
                <a-form-item
                  field="digital"
                  label="数字货币"
                  :rules="[{ required: true, message: '数字货币不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.digital"
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
              <!--启用-->
              <a-col :span="12">
                <a-form-item
                  field="enabled"
                  label="启用"
                  :rules="[{ required: true, message: '启用不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.enabled"
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
              <!--支持提现-->
              <a-col :span="12">
                <a-form-item
                  field="withdrawal"
                  label="支持提现"
                  :rules="[{ required: true, message: '支持提现不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.withdrawal"
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
              <!--提现手续费-->
              <a-col :span="12">
                <a-form-item
                  field="withdrawalComm"
                  label="提现手续费"
                  :rules="[{ required: false, message: '提现手续费不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.withdrawalComm" />
                </a-form-item>
              </a-col>
              <!--支持国家-->
              <a-col :span="12">
                <a-form-item
                  field="country"
                  label="支持国家"
                >
                  <a-select v-model="crud.options.form.country" placeholder="请选择" allow-search multiple>
                    <a-option
                      v-for="s in countryMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.enName }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--图标样式-->
              <a-col :span="24">
                <a-form-item
                  field="iconClass"
                  label="图标样式"
                >
                  <a-input v-model="crud.options.form.iconClass" />
                </a-form-item>
              </a-col>
              <!--图标样式-->
              <a-col :span="24">
                <a-form-item
                  field="iconStyle"
                  label="图标样式"
                >
                  <a-input v-model="crud.options.form.iconStyle" />
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
			  :disabled="!digitalTag"
              class="button"
              @click="digitalVisible = true "
            >
              数字货币设置
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
          style="height: calc(100% - 209px); margin-bottom: 12px"
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

          <!--名称-->
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

          <!--数字货币-->
          <template #digital="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.digital ? '1' : '0') || di.value === (record.digital + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.digital ? '1' : '0') || di.value === (record.digital + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].digital
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].digital ? '1' : '0') || di.value === (record.digital + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.digital ? '1' : '0') || di.value === (record.digital + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].digital"
                :default-value="record.digital ? '1' : '0'"
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

          <!--启用-->
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
              <a-select
                v-model="crud.options.form[record.id].enabled"
                :default-value="record.enabled ? '1' : '0'"
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

          <!--支持提现-->
          <template #withdrawal="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.withdrawal ? '1' : '0') || di.value === (record.withdrawal + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.withdrawal ? '1' : '0') || di.value === (record.withdrawal + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].withdrawal
                   ? dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (crud.options.form[record.id].withdrawal ? '1' : '0') || di.value === (record.withdrawal + '')))[0].label : ''
                   : dict.yes_no_status ? (dict.yes_no_status.filter((di: any) => di.value === (record.withdrawal ? '1' : '0') || di.value === (record.withdrawal + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].withdrawal"
                :default-value="record.withdrawal ? '1' : '0'"
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

          <!--提现手续费-->
          <template #withdrawalComm="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.withdrawalComm }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.withdrawalComm }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].withdrawalComm
                    ? crud.options.form[record.id].withdrawalComm
                    : record.withdrawalComm
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].withdrawalComm"
                :default-value="record.withdrawalComm"
              />
            </div>
          </template>

          <!--支持国家-->
          <template #country="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              <a-space v-show="!crud.options.form[record.id]">
                <a-tag
                    v-for="(d,index) in record.country"
                        :key="index"
                        bordered
                >
              
				   {{ countryMap[d] ? countryMap[d].enName : '' }}
                </a-tag>
              </a-space>
			
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <a-space v-show="!crud.options.form[record.id]">
                <a-tag
                  v-for="(d,index) in record.country"
                  :key="index"
                  bordered
                >
                   {{ countryMap[d] ? countryMap[d].enName : '' }}
                </a-tag>
              </a-space>
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
              <a-select
                v-model="crud.options.form[record.id].country"
                :default-value="record.country"
                allow-search
                multiple
              >
               <a-option
                 v-for="(d,index) in countryMap"
                 :key="index"
                 :value="d.id.toString()"
                 >
				 {{ d.enName }}
				 </a-option>
              </a-select>
            </div>
      </template>
       <!--支付方式图标-->
          <template #icon="{ record }">
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
					  <img v-if="record.icon" :src="record.icon" />
					</a-avatar>
				  </template>
				</a-upload>
            
          </template>
		  
          <!--图标样式-->
          <template #iconClass="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.iconClass }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.iconClass }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].iconClass
                    ? crud.options.form[record.id].iconClass
                    : record.iconClass
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].iconClass"
                :default-value="record.iconClass"
              />
            </div>
          </template>

          <!--图标样式-->
          <template #iconStyle="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.iconStyle }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.iconStyle }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].iconStyle
                    ? crud.options.form[record.id].iconStyle
                    : record.iconStyle
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].iconStyle"
                :default-value="record.iconStyle"
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
  import { Mode,iconUpload} from '@/api/pay/mode';
  import { computed, onMounted, provide, ref,CSSProperties ,getCurrentInstance} from 'vue';
  import { useDict } from '@/components/dict';
  import { Country ,CountryList} from '@/api/pay/country';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import Digital from '@/views/pay/mode/digital.vue';
  import {TableData} from '@arco-design/web-vue/es/table/interface';
  
  
  import {
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';

  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<Mode>({
    tag: '支付方式设置',
    url: '/pay/mode',
    title: '支付方式',
    tableInfo: {
      componentConfig: {
        stripe: false,
		colResizable:true
      },
    },
  });
  provide('crud', crud);

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

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
  
  
  
  const parseToArray = (str: string): string[] => {
    const s = str.replace('[', '').replace(']', '').split(/,/);
    const res: string[] = [];
    for (let i = 0; i < s.length; i += 1) {
      res.push(s[i]);
    }
	
    return res;
  };

 
  
  

  // 字典
  const dict = useDict('yes_no_status');
 
  // 设置支付方式设置 columns信息
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
      title: 'id',
      dataIndex: 'id',
      width: 100,
      display: false,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
	
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
	
    },
	{
	  title: '支持国家',
	  dataIndex: 'country',
	  width: 250,
	  display: true,
	  slotName: 'country',
	  tooltip: true,
	  ellipsis: true,
	  bodyCellStyle,
	
	},
    {
      title: '数字货币',
      dataIndex: 'digital',
      width: 100,
      display: true,
      slotName: 'digital',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
	  
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 100,
      display: true,
      slotName: 'enabled',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
	  
	  
    },
    {
      title: '支持提现',
      dataIndex: 'withdrawal',
      width: 150,
      display: true,
      slotName: 'withdrawal',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
	  
    },
    {
      title: '提现手续费',
      dataIndex: 'withdrawalComm',
      width: 150,
      display: true,
      slotName: 'withdrawalComm',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle,
	  
    },
	{
	  title: '图标',
	  dataIndex: 'icon',
	  width: 150,
	  display: true,
	  slotName: 'icon',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '图标样式Class',
      dataIndex: 'iconClass',
      width: 150,
      display: true,
      slotName: 'iconClass',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '图标样式Style',
      dataIndex: 'iconStyle',
      width: 150,
      display: true,
      slotName: 'iconStyle',
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
      title: '创建日期',
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
  
  const countryMap = ref<{ [key: number]: Country }>({});
  // 获取国家信息列表
  const loadCountry = async () => {
    const countryList = await CountryList();
    countryMap.value = {};
    countryList.data.list.forEach((val) => {
      countryMap.value[val.id] = val;
    });
  };
  
  
  
  
  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑


 // region    ↓-------------------------------- crud --------------------------------↓
 
 let lastClickRecord: TableData = {};
 
 // 点击表格行，记录支付方式名称
  const clickModeName = ref('');
  const clickModeId = ref('');
  const digitalTag=ref(0);
  
  const tableColClick = async (record: TableData) => {
    // 编辑状态下不可选择
    if (crud.options.tableInfo.isEdit) return;
	
	if (lastClickRecord !== {}) {
	  // 清除上一次点击的对象属性
	  delete lastClickRecord.click;
	}
	
	
    clickModeName.value = record.name;
	clickModeId.value=record.id;
	digitalTag.value=record.digital;
	
	lastClickRecord = record;
    record.click = true;
  };
  
// quartzLog
  const digitalVisible = ref(false);
  
  provide('digitalVisible', digitalVisible);
  provide('modeName', clickModeName);
  provide('modeId', clickModeId);
  
  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
	loadCountry();
  });

  crud.hook.afterRefresh = () => {
    for (let i = 0; i < (crud.options.tableInfo as any).data.length; i += 1) {
      (crud.options.tableInfo as any).data[i].country = parseToArray((crud.options.tableInfo as any).data[i].country);
    }
    if (crud.options.query.country) {
      crud.options.query.country = parseToArray(crud.options.query.country);
    }

  };

  crud.hook.beforeRefresh = () => {
    if (crud.options.query.country){
      let newStr = '';
      for (let i = 0; i < crud.options.query.country.length; i += 1) {
        newStr += crud.options.query.country[i];
        if (i !== crud.options.query.country.length - 1) newStr += ', ';
      }
      crud.options.query.country = newStr;
    }
    return true;
  };
  // endregion ↑-------------------------------- 钩子 --------------------------------↑
  
  
 
  
  
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

        const res = await iconUpload(formData,clickModeId.value as string, {
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
  
  
</script>

<script lang="ts">
  export default {
    name: 'Mode',
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