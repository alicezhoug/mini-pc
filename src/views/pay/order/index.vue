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
                  <!--平台搜索框-->
                  <a-col :span="8">
                    <a-form-item field="platformId" label="平台">
                      <a-select
                        v-model="crud.options.query.platformId"
                        placeholder="输入平台搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in platformMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--商户搜索框-->
                  <a-col :span="8">
                    <a-form-item field="merchantId" label="商户">
                      <a-select
                        v-model="crud.options.query.merchantId"
                        placeholder="输入商户搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in merchantMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--支付模式搜索框-->
                  <a-col :span="8">
                    <a-form-item field="modeId" label="支付模式">
                      <a-select
                        v-model="crud.options.query.modeId"
                        placeholder="输入支付模式搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in modeMap"
                          :key="s.id"
                          :value="s.id"
                        >
                          {{ s.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--订单号码搜索框-->
                  <a-col :span="8">
                    <a-form-item field="orderNo" label="订单号码">
                      <a-input
                        v-model="crud.options.query.orderNo"
                        placeholder="输入订单号码搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--支付状态(0:支付中、1：支付失败、2:支付成功）搜索框-->
                  <a-col :span="8">
                    <a-form-item field="status" label="支付状态">
                      <a-select
                        v-model="crud.options.query.status"
                        placeholder="选择支付状态搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.pay_status"
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
          :add-permission="['pay:order:add']"
          :edit-permission="['pay:order:edit']"
          :del-permission="['pay:order:del']"
          :download-permission="['pay:order:list']"
		  
		  :show-edit="false"
	
          style="margin-bottom: 12px"
        >
		<template #right>
		  <a-button
		    v-permission="['pay:order:status']"
		    :loading="loading"
		    type="outline"
		    size="small"
		    status="danger"
			:disabled="crud.options.tableInfo.selectKeys.length==0"
		    @click="pullPayStatus(crud.options.tableInfo.selectKeys)"
		  >
		    拉取支付状态
		  </a-button>
		</template>
          <template #addForm>
            <a-row :gutter="12">
              <!--平台-->
              <a-col :span="12">
                <a-form-item
                  field="platformId"
                  label="平台"
                >
                  <a-select
                    v-model="crud.options.form.platformId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in platformMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--商户-->
              <a-col :span="12">
                <a-form-item
                  field="merchantId"
                  label="商户"
                >
                  <a-select
                    v-model="crud.options.form.merchantId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in merchantMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--支付模式-->
              <a-col :span="12">
                <a-form-item
                  field="modeId"
                  label="支付模式"
                >
                  <a-select
                    v-model="crud.options.form.modeId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in modeMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.name }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--金币-->
              <a-col :span="12">
                <a-form-item
                  field="coinId"
                  label="金币"
                >
                  <a-select
                    v-model="crud.options.form.coinId"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in coinMap"
                      :key="s.id"
                      :value="s.id"
                      >{{ s.quantity }}</a-option
                    >
                  </a-select>
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

          <!--平台-->
          <template #platformId="{ record }">
             {{ platformMap[record.platformId]?platformMap[record.platformId].name:"" }}
          </template>

          <!--商户-->
          <template #merchantId="{ record }">
             {{ merchantMap[record.merchantId]?merchantMap[record.merchantId].name:"" }}
          </template>

          <!--支付模式-->
          <template #modeId="{ record }">   
            {{ modeMap[record.modeId]?modeMap[record.modeId].name:"" }}
          </template>
		  <!--支付模式-->
		  <template #status="{ record }">
		    {{ dict.pay_status ? (dict.pay_status.filter((di: any) => di.value === record.status || di.value === (record.status + '')))[0].label : ''}}
		  
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
  import { Order } from '@/api/pay/order';
  import { computed,getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import { Platform, PlatformList } from '@/api/pay/platform';
  import { Merchant, MerchantList } from '@/api/pay/merchant';
  import { Mode, ModeList } from '@/api/pay/mode';
  import { Coin, CoinList } from '@/api/pay/coin';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();
  const crud = useCrud<Order>({
    tag: '支付订单',
    url: '/pay/order',
    title: 'menu.pay.order',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);


 const instance = getCurrentInstance();
 const global = (instance as any).appContext.config.globalProperties;


 const { loading, toggle } = useLoading(false);
  const pullPayStatus = async (ids: string[]) => {
    toggle();
    const res = await axios.post('/pay/order/pullStatus',ids);
    try {
      if ((res as any).code === 20000) {
        global.$message.success('操作成功！');
        crud.method.refresh();
      } else {
        global.$message.error(`操作失败！${(res as any).msg}`);
      }
    } finally {
      toggle();
    }
  };
  

  // 字典
  const dict = useDict('yes_no_status', 'pay_status');
  
  // 设置支付订单 columns信息
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
      title: '平台',
      dataIndex: 'platformId',
      width: 150,
      display: true,
      slotName: 'platformId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '商户',
      dataIndex: 'merchantId',
      width: 150,
      display: true,
      slotName: 'merchantId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '支付模式',
      dataIndex: 'modeId',
      width: 150,
      display: true,
      slotName: 'modeId',
      tooltip: true,
      ellipsis: true,
    },
    
    {
      title: '订单号码',
      dataIndex: 'orderNo',
      width: 150,
      display: true,
      slotName: 'orderNo',
      tooltip: true,
      ellipsis: true,
    },
	{
	  title: '支付状态',
	  dataIndex: 'status',
	  width: 150,
	  display: true,
	  slotName: 'status',
	  tooltip: true,
	  ellipsis: true,
	},
	{
	  title: '支付地址',
	  dataIndex: 'payUrl',
	  width: 350,
	  display: true,
	  slotName: 'payUrl',
	  tooltip: true,
	  ellipsis: true,
	},
    {
      title: '订单金额',
      dataIndex: 'orderFee',
      width: 150,
      display: true,
      slotName: 'orderFee',
      tooltip: true,
      ellipsis: true,
    },
    
    {
      title: '兑换金币数',
      dataIndex: 'coin',
      width: 150,
      display: true,
      slotName: 'coin',
      tooltip: true,
      ellipsis: true,
    },
    
	{
	  title: '实际金额',
	  dataIndex: 'fee',
	  width: 150,
	  display: true,
	  slotName: 'fee',
	  tooltip: true,
	  ellipsis: true,
	},
	{
	  title: '第三方交易订单号',
	  dataIndex: 'tradeOrderNo',
	  width: 150,
	  display: true,
	  slotName: 'tradeOrderNo',
	  tooltip: true,
	  ellipsis: true,
	},
	{
	  title: '有效开始时间',
	  dataIndex: 'validStartTime',
	  width: 180,
	  display: true,
	  slotName: 'validStartTime',
	  tooltip: true,
	  ellipsis: true,
	},
	{
	  title: '有效结束时间',
	  dataIndex: 'validEndTime',
	  width: 180,
	  display: true,
	  slotName: 'validEndTime',
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
      title: '创建日期',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
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

	const platformMap = ref<{ [key : number] : Platform }>({});
	const merchantMap = ref<{ [key : number] : Merchant }>({});
	const modeMap = ref<{ [key : number] : Mode }>({});
	const coinMap = ref<{ [key : number] : Coin }>({});
	const loadData = async () => {

		const platformList = await PlatformList();
		platformMap.value = {};
		platformList.data.list.forEach((val) => {
			platformMap.value[val.id] = val;
		});
		
		
		const merchantList = await MerchantList();
		merchantMap.value = {};
		merchantList.data.list.forEach((val) => {
			merchantMap.value[val.id] = val;
		});

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
		

	};
	
	
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
    name: 'Order',
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