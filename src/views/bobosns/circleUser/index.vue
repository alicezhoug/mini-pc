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
              :wrapper-col-props="{ span: 24 }"
              label-align="left"
            >
              <a-scrollbar style="height: 160px; overflow: auto">
                <a-row :gutter="24" style="width: 100%">
                  <!--部门名称搜索框-->
                  <a-col :span="6">
					<a-form-item
						field="deptId">
						<a-tree-select
						  v-model="crud.options.form.deptId"
						  :data="crud.options.props.deptTreeData"
						  placeholder="按区域查询"/>
					</a-form-item>
                  </a-col>
                  <!--用户名搜索框-->
                  <a-col :span="6">
                    <a-form-item field="username">
                      <a-input
                        v-model="crud.options.query.username"
                        placeholder="用户名搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
				  <!--昵称搜索框-->
				  <a-col :span="6">
				    <a-form-item field="nickName" >
				      <a-input
				        v-model="crud.options.query.nickName"
				        placeholder="用户昵称搜索"
				      >
				        <template #prefix> Like </template>
				      </a-input>
				    </a-form-item>
				  </a-col>
				<!--性别搜索框-->
                 <a-col :span="6">
                   <a-form-item field="gender">
                     <a-select
                       v-model="crud.options.query.gender"
                       placeholder="性别搜索"
                       allow-search
                 
                     >
                       <a-option
                         v-for="s in dict.gender"
                         :key="s.detailId"
                         :value="s.label"
                       >
                         {{ s.label }}
                       </a-option>
                     </a-select>
                   </a-form-item>
                 </a-col>				  
                
                  <!--设备UUID搜索框-->
                  <a-col :span="6">
                    <a-form-item field="deviceUuid">
                      <a-input
                        v-model="crud.options.query.deviceUuid"
                        placeholder="设备UUID搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--邮箱搜索框-->
                  <a-col :span="6">
                    <a-form-item field="email">
                      <a-input
                        v-model="crud.options.query.email"
                        placeholder="邮箱搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  
                  <!--手机号码搜索框-->
                  <a-col :span="6">
                    <a-form-item field="phone">
                      <a-input
                        v-model="crud.options.query.phone"
                        placeholder="手机号码搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
				 <!--设备ID搜索框-->
                  <a-col :span="6">
                    <a-form-item field="deviceId" >
                      <a-input
                        v-model="crud.options.query.deviceId"
                        placeholder="设备ID搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>                 
                  <!--用户类型搜索框-->
                  <a-col :span="6">
                    <a-form-item field="userType" >
                      <a-select
                        v-model="crud.options.query.userType"
                        placeholder="用户类型搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.user_type"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--状态：1启用、0禁用搜索框-->
                  <a-col :span="6">
                    <a-form-item field="enabled" >
                      <a-select
                        v-model="crud.options.query.enabled"
                        placeholder="帐号状态搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.user_status"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--状态（0:正常,1:用户注销，2:封号)搜索框-->
                  <a-col :span="6">
                    <a-form-item field="state" >
                      <a-select
                        v-model="crud.options.query.state"
                        placeholder="用户状态搜索"
                        allow-search

                      >
                        <a-option
                          v-for="s in dict.user_state"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--创建日期搜索框-->
                  <a-col :span="6">
                    <a-form-item field="createTime">
                      <a-range-picker
                        v-model="pickerValueCreateTime"
                        :placeholder="['[注册日期', '注册日期]']"
                        @change="rangePickerCreateTimeChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-scrollbar>
            </a-form>
          </a-col>
          <a-divider style="height: 160px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <RROperation direction="vertical"/>
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <CrudOperation
          :add-permission="['user:add']"
          :edit-permission="['user:edit']"
          :del-permission="['user:del']"
          :download-permission="['user:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--用户名-->
              <a-col :span="12">
                <a-form-item
                  field="username"
                  label="登录帐号"
                  :rules="[{ required: true, message: '登录帐号不能为空' }]"
                >
                  <a-input v-model="crud.options.form.username" />
                </a-form-item>
              </a-col>	

			  <!--密码-->
              <a-col :span="12">
                <a-form-item
                  field="password"
                  label="密码"
				  :rules="[{ required: true, message: '登录密码不能为空' }]"
				>

                  <a-input-password v-model="crud.options.form.password" />
                </a-form-item>
              </a-col>
										
			  <!--用户类型-->
              <a-col :span="12">
                <a-form-item
                  field="userType"
                  label="用户类型"
				  :rules="[{ required: true, message: '用户类型不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.userType"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.user_type"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
													  
              <!--部门名称-->
              <a-col :span="12">
                <a-form-item
                  field="deptId"
                  label="所属部门"
				  :rules="[{ required: true, message: '所属部门不能为空' }]"
                >
                <a-tree-select
                  v-model="crud.options.form.deptId"
				 
                  :data="crud.options.props.deptTreeData"
                  placeholder="请选择"/>
                </a-form-item>
			
              </a-col>
              <!--设备ID-->
              <a-col :span="12">
                <a-form-item
                  field="deviceId"
                  label="设备ID"
                >
                  <a-input v-model="crud.options.form.deviceId" />
                </a-form-item>
              </a-col>
              <!--设备UUID-->
              <a-col :span="12">
                <a-form-item
                  field="deviceUuid"
                  label="设备UUID"
                >
                  <a-input v-model="crud.options.form.deviceUuid" />
                </a-form-item>
              </a-col>
			<!--手机号码-->
              <a-col :span="12">
                <a-form-item
                  field="phone"
                  label="手机号码"
                >
                  <a-input v-model="crud.options.form.phone" />
                </a-form-item>
              </a-col>
              <!--邮箱-->
              <a-col :span="12">
                <a-form-item
                  field="email"
                  label="邮箱"
                >
                  <a-input v-model="crud.options.form.email" />
                </a-form-item>
              </a-col>			  
              <!--昵称-->
              <a-col :span="12">
                <a-form-item
                  field="nickName"
                  label="昵称"
                >
                  <a-input v-model="crud.options.form.nickName" />
                </a-form-item>
              </a-col>
              <!--全称-->
              <a-col :span="12">
                <a-form-item
                  field="fullName"
                  label="全称"
                >
				 <a-input v-model="crud.options.form.fullName" />
                </a-form-item>
              </a-col>
              <!--性别-->
              <a-col :span="12">
                <a-form-item
                  field="gender"
                  label="性别"
                >
                  <a-select
                    v-model="crud.options.form.gender"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.gender"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
             
              <!--出生日期-->
              <a-col :span="12">
                <a-form-item
                  field="birthday"
                  label="出生日期"
                >
                  <a-date-picker
                    v-model="crud.options.form.birthday"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
             
             
              <!--状态：1启用、0禁用-->
              <a-col :span="12">
                <a-form-item
                  field="enabled"
                  label="帐号状态"
                >
                  <a-select
                    v-model="crud.options.form.enabled"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.user_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--状态（0:正常,1:用户注销，2:封号)-->
              <a-col :span="12">
                <a-form-item
                  field="state"
                  label="用户状态"
                >
                  <a-select
                    v-model="crud.options.form.state"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="s in dict.user_state"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
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
		    @row-click="tableColClick"
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
          style="height: calc(100% - 255px); margin-bottom: 12px"
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

          <!--部门名称-->
          <template #deptName="{ record }">
            <!--正常情况下-->
            <div v-if="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deptName }}
            </div>
          
            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deptName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                <a-tree-select
                  v-model="crud.options.form[record.id].deptId"
                  :data="crud.options.props.deptTreeData"
                  :default-value="record.deptName"
                  :disabled="true"
                />
              </div>
            </div>
          
            <!--修改情况下-->
            <div v-if="record.editable">
              <a-tree-select
                v-model="crud.options.form[record.id].deptId"
                :data="crud.options.props.deptTreeData"
                :default-value="record.deptName"
              />
            </div>
          </template>

          <!--图片-->
          <template #avatarPath="{ record }">
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
					  <img v-if="record.avatarPath" :src="record.avatarPath" />
					</a-avatar>
				  </template>
				</a-upload>            
          </template>
		  
          <!--用户名-->
          <template #username="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.username }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.username }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].username
                    ? crud.options.form[record.id].username
                    : record.username
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].username"
                :default-value="record.username"
              />
            </div>
          </template>

          <!--设备ID-->
          <template #deviceId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deviceId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deviceId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deviceId
                    ? crud.options.form[record.id].deviceId
                    : record.deviceId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].deviceId"
                :default-value="record.deviceId"
              />
            </div>
          </template>

          <!--设备UUID-->
          <template #deviceUuid="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deviceUuid }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deviceUuid }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deviceUuid
                    ? crud.options.form[record.id].deviceUuid
                    : record.deviceUuid
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].deviceUuid"
                :default-value="record.deviceUuid"
              />
            </div>
          </template>

          <!--昵称-->
          <template #nickName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.nickName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.nickName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].nickName
                    ? crud.options.form[record.id].nickName
                    : record.nickName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].nickName"
                :default-value="record.nickName"
              />
            </div>
          </template>

          <!--全称-->
          <template #fullName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.fullName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.fullName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].fullName
                    ? crud.options.form[record.id].fullName
                    : record.fullName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].fullName"
                :default-value="record.fullName"
              />
            </div>
          </template>

          <!--性别-->
          <template #gender="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">           
			  {{ (dict.gender && record.gender) ? (dict.gender.filter((di: any) => di.value === record.gender || di.value === (record.gender + '')))[0].label : ''}}
			  		  
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
               {{ (dict.gender && record.gender) ? (dict.gender.filter((di: any) => di.value === record.gender || di.value === (record.gender + '')))[0].label : ''}}
               	
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].gender
                    ? crud.options.form[record.id].gender
                    : record.gender
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].gender"
                :default-value="record.gender"
              >
                <a-option
                  v-for="s in dict.gender"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--手机号码-->
          <template #phone="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.phone }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.phone }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].phone
                    ? crud.options.form[record.id].phone
                    : record.phone
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].phone"
                :default-value="record.phone"
              />
            </div>
          </template>

          <!--邮箱-->
          <template #email="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.email }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.email }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].email
                    ? crud.options.form[record.id].email
                    : record.email
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].email"
                :default-value="record.email"
              />
            </div>
          </template>

          <!--出生日期-->
          <template #birthday="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.birthday }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.birthday }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].birthday
                    ? crud.options.form[record.id].birthday
                    : record.birthday
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].birthday"
                show-time
                :default-value="record.birthday"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </div>
          </template>

          <!--密码-->
          <template #password="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.password }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.password }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].password
                    ? crud.options.form[record.id].password
                    : record.password
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].password"
                :default-value="record.password"
              />
            </div>
          </template>

          <!--用户类型-->
          <template #userType="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.userType }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.userType }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].userType
                    ? crud.options.form[record.id].userType
                    : record.userType
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].userType"
                :default-value="record.userType"
              >
                <a-option
                  v-for="s in dict.user_type"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--状态（0:正常,1:用户注销，2:封号)-->
          <template #state="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.state }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.state }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].state
                    ? crud.options.form[record.id].state
                    : record.state
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].state"
                :default-value="record.state"
              >
                <a-option
                  v-for="s in dict.user_state"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
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
  import { User,iconUpload } from '@/api/bobosns/circleUser';
  import { computed, onMounted, provide,CSSProperties, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import { getDeptListTree } from '@/api/system/department';
  import { useI18n } from 'vue-i18n';
  
  import {TableData} from '@arco-design/web-vue/es/table/interface';
  import {
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  
  
  const { t } = useI18n();
  const crud = useCrud<User>({
    tag: '平台用户',
    url: '/system/user',
    title: '',
    tableInfo: {
      componentConfig: {
        stripe: false,
		colResizable:true
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
  const dict = useDict('yes_no_status', 'gender', 'user_type', 'user_status', 'user_state');

  // 设置平台用户 columns信息
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
      title: '用户ID',
      dataIndex: 'id',
      width: 150,
      display: true,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '所属区域',
      dataIndex: 'deptName',
      width: 150,
      display: true,
      slotName: 'deptName',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '登录帐号',
      dataIndex: 'username',
      width: 150,
      display: true,
      slotName: 'username',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      width: 180,
      display: true,
      slotName: 'deviceId',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '设备UUID',
      dataIndex: 'deviceUuid',
      width: 180,
      display: true,
      slotName: 'deviceUuid',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      width: 150,
      display: true,
      slotName: 'nickName',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
	{
	  title: '用户头像',
	  dataIndex: 'avatarPath',
	  width: 150,
	  display: true,
	  slotName: 'avatarPath',
	  tooltip: true,
	  ellipsis: true,
	  bodyCellStyle
	},
    {
      title: '全称',
      dataIndex: 'fullName',
      width: 150,
      display: true,
      slotName: 'fullName',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 150,
      display: true,
      slotName: 'gender',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      width: 150,
      display: true,
      slotName: 'phone',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
      display: true,
      slotName: 'email',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      width: 180,
      display: true,
      slotName: 'birthday',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
   
   
    {
      title: '用户类型',
      dataIndex: 'userType',
      width: 150,
      display: true,
      slotName: 'userType',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '帐号状态',
      dataIndex: 'enabled',
      width: 150,
      display: true,
      slotName: 'enabled',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      width: 150,
      display: true,
      slotName: 'state',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: true,
      slotName: 'createBy',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '更新者',
      dataIndex: 'updateBy',
      width: 150,
      display: true,
      slotName: 'updateBy',
      tooltip: true,
      ellipsis: true,
	  bodyCellStyle
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
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
	  bodyCellStyle
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // rangePickerCreateTime的值改变
  function rangePickerCreateTimeChange(data: any) {
      crud.update.appendQueryParams({
          startCreateTime: `${data[0]} 00:00:00`,
          endCreateTime: `${data[1]} 00:00:00`,
      });
  }
  // 解决重置params rangerPickerCreateTime不清除数据的问题
  const pickerValueCreateTime = ref([]);

  // endregion ↑-------------------------------- rangePicker --------------------------------↑



  function loadData(){
	  // 查部门列表树
	      getDeptListTree().then(({ data }) => {
	        crud.options.props.deptTreeData = data;
	      });
  }
  

 
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
	 
  
  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
	  loadData();
    crud.method.refresh();
  });
  crud.hook.afterResetParams = () => {
    pickerValueCreateTime.value = [];
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
    name: 'CircleUser',
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