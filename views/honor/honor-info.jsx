import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';
let _HonorForm = require('./honor-form.jsx');
let HonorForm = createForm()(_HonorForm);

const HonorInfo = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        this._getData();
    },

    _getData(){
        console.log("获取数据");
        let url= "honor/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    _ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.length);
              console.log(data);
              const pagination = this.state.pagination;
              pagination.total = data.totalCount;
              this.setState({
                loading: false,
                data: data,
                pagination,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    searchHonor(){
        let url= "honor/list";
        let _data = {honorName:$("#search_honorName").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    handleEditHonorTypeChange(value){
        this.setState({
          editHonorType: value,
        });
    },

    render() {
        self = this;
        function deleteConfirm(id,object) {
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              $.ajax({
                  url: "honor/delete/"+id,
                  dataType: 'json',
                  type: "get",
                  contentType: "application/json; charset=utf-8",
                  success: function(data) {
                    console.log(data.length);
                    console.log(data);
                    const pagination = self.state.pagination;
                    pagination.total = data.totalCount;
                    self.setState({
                      loading: false,
                      data: data,
                      pagination,
                    });

                  }.bind(this),
                  error: function(xhr, status, err) {
                    console.error("/delete/"+id, status, err.toString());
                  }.bind(this)
              });
            },
            onCancel() {}
          });
        }

        function showEditModal(id,object) {
          self.setState({editVisible: true});
          $.ajax({
              url: "honor/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_honorName").val(data.honorName);
                $("#edit_honorDesc").val(data.honorDesc);
                $("#edit_honorType").val(data.honorType);
                $("#edit_id").val(data.id);
                self.setState({
                  editHonorType: data.honorType,
                });
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };

        function editSubmit() {
          console.log(self);
          let url= "honor/edit";
          let _data = {id:$("#edit_id").val(),honorName:$("#edit_honorName").val(),honorDesc:$("#edit_honorDesc").val(),honorType:self.state.editHonorType};
          let type = "get";
          self._ajax(url,type,_data);

          self.setState({editVisible: false});
        };

        function editCancel(e) {
          console.log(e);
          self.setState({editVisible: false});
        };
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
        },{
            title: '荣誉名称',
            dataIndex: 'honorName',
        },{
            title: '荣誉类型',
            dataIndex: 'honorTypeName',
        },{
            title: '荣誉描述',
            dataIndex: 'honorDesc',
        },{
            title: '操作',
            key: 'operation',
            render(text, record) {
              return (
                <span className="operation-cl">
                  <i className="fa fa-pencil fa-fw"></i><a onClick={showEditModal.bind(this,record.id)} value={record.id} >编辑</a>
                  <span className="ant-divider"></span>
                  <i className="fa fa-trash-o fa-fw"></i><a onClick={deleteConfirm.bind(this,record.id)} value={record.id}>删除</a>
                </span>
              );
            }
        }];

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>荣誉字典管理</h5>
                    <div className="console-add">
                        <HonorForm callbackParent={this._getData} />
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>荣誉名称：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="荣誉名称" id="search_honorName" />
                    </Col>
                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchHonor} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑荣誉字典信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="search-lb">
                      <label>荣誉名称：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_id" type="hidden" />
                  <Input id="edit_honorName" placeholder="荣誉名称" />
                  </Col>
                  <div className="search-lb">
                      <label>荣誉描述：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_honorDesc" placeholder="荣誉描述" />
                  </Col>
                  <div className="search-lb">
                      <label>荣誉类型：</label>
                  </div>
                  <Col span="4">
                  <Select id="edit_honorType" placeholder="荣誉类型" value={this.state.editHonorType}  style={{ width: '100%' }} onChange={this.handleEditHonorTypeChange}>
                    <Option value="1">校级</Option>
                    <Option value="2">年级</Option>
                    <Option value="3">班级</Option>
                  </Select>
                  </Col>
                  <div className="cl"></div>
                </Modal>
        </div>
        );
    },
});

module.exports = HonorInfo;
