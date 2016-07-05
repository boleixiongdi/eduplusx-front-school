import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
let _PatriarchForm = require('./patriarch-form.jsx');
let PatriarchForm = createForm()(_PatriarchForm);
import RaisedButton from 'material-ui/lib/raised-button';

const PatriarchInfo = React.createClass({
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
        let url= "parent/list";
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

    search(){
        console.log('点击了查询按钮');
        let url= "parent/list";
        let _data = {name:$("#search_name").val(), phone:$("#search_phone").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },

    render() {
        self = this;
        function deleteConfirm(id,object) {
        let ss = id;
        console.log(ss);
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              console.log('点击了确定删除按钮');
              $.ajax({
                  url: "parent/delete/"+id,
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
              url: "parent/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                console.log(data.length);
                console.log(data);
                $("#edit_name").val(data.name);
                $("#edit_phone").val(data.phone);
                $("#edit_childNos").val(data.childNos);
                $("#edit_studentNames").val(data.studentNames);
                $("#edit_id").val(data.id);
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          console.log('点击了提交按钮');
          console.log(self);
          let url= "parent/edit";
          let _data = {id:$("#edit_id").val(),name:$("#edit_name").val(), phone:$("#edit_phone").val(), childNos:$("#edit_childNos").val()
          , studentNames:$("#edit_studentNames").val()};
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
        }, {
            title: '姓名',
            dataIndex: 'name',
        }, {
            title: '电话',
                dataIndex: 'phone'
        }, {
            title: '子女学号',
                dataIndex: 'childNos'
        }, {
            title: '子女姓名',
                dataIndex: 'studentNames'
        }, {
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
                    <h5>家长管理</h5>
                    <div className="console-add">
                          <PatriarchForm callbackParent={this._getData} />
                    </div>
                </div>

                <div className="search-wrap">
                <div className="e-row">
                    <div className="search-lb">
                        <label>姓名：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="姓名" id="search_name" />
                    </Col>
                    <div className="search-lb">
                        <label>电话：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="学生姓名" id="search_phone" />
                    </Col>
                    <div className="search-qr">
                        <Button type="primary" onClick={this.search} >查询</Button>
                    </div>
                </div>
                <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑家长信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>姓名：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_id" type="hidden" />
                    <Input id="edit_name" placeholder="姓名" />
                    </Col>
                    <div className="search-lb">
                        <label>电话：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_phone" placeholder="电话" />
                    </Col>
                    <div className="search-lb">
                        <label>子女学号：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_childNos" placeholder="子女学号" />
                    </Col>
                  </div>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>子女姓名：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_studentNames" placeholder="子女姓名" />
                    </Col>
                  </div>
                  <div className="cl"></div>
                </Modal>
        </div>
        );
    },
});

module.exports = PatriarchInfo;
