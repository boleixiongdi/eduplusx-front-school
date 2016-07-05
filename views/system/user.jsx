import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const User = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          roleData : [],
          addUser:"请选择",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "user/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);

    },

    showAddUserModal() {
        this.setState({
          visible: true
        });

        $.ajax({
            url: "role/list",
            dataType: 'json',
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.length);
              console.log(data);
              this.setState({
                roleData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error("/role/list", status, err.toString());
            }.bind(this)
        });
    },

    addUserHandleOk() {
        console.log('保存用户信息');
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
        }, 1000);

        console.log('点击了查询按钮');
        let url= "user/save";
        let _data = {name:$("#name").val(), mobile:$("#mobile").val(), roleId:this.state.addUser};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addUserHandleCancel() {
        console.log('点击了取消');
        this.setState({
          visible: false
        });
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

    searchUsers(){
        console.log('点击了查询按钮');
        let url= "user/list";
        let _data = {name:$("#search_name").val(), mobile:$("#search_mobile").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },

    handleAddUserChange(value){
        this.setState({
          addUser: value,
        });
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
                  url: "user/delete/"+id,
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

        function edit(){
          alert("ok");
        }

        function showEditModal(id,object) {
          console.log(id);
          console.log('点击了编辑按钮');
          self.setState({editVisible: true});
          $.ajax({
              url: "user/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                console.log(data.length);
                console.log(data);
                $("#edit_name").val(data.name);
                $("#edit_mobile").val(data.mobile);
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
          let url= "user/edit";
          let _data = {id:$("#edit_id").val(),name:$("#edit_name").val(), mobile:$("#edit_mobile").val()};
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
            /*render(text) {
            return <a href="#">{text}</a>;
            }*/
        }, {
            title: '电话',
                dataIndex: 'mobile'
        }, {
            title: '角色',
                dataIndex: 'roleName'
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

        let roles = self.state.roleData;
        let roleList = roles.map(role => <Option key={role.id} value= {role.id} >{role.name}</Option>);

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>用户管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddUserModal} className="add-btn">新增用户</Button>
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>姓名：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="姓名" id="search_name" />
                    </Col>

                    <div className="search-lb">
                        <label>手机号：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="手机号" id="search_mobile" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchUsers} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="新增用户"
                  visible={this.state.visible}
                  onOk={this.addUserHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addUserHandleCancel}>
                  <div className="search-lb">
                      <label>姓名：</label>
                  </div>
                  <Col span="4">
                  <Input id="name" placeholder="姓名" />
                  </Col>
                  <div className="search-lb">
                      <label>手机号：</label>
                  </div>
                  <Col span="4">
                  <Input id="mobile" placeholder="手机号" />
                  </Col>
                  <div className="search-lb">
                      <label>用户角色：</label>
                  </div>
                  <Col span="4">
                    <Select style={{ width: 120 }} defaultValue="-1" value={this.state.addUser} onChange={this.handleAddUserChange}>
                        <Option value="-1">请选择</Option>
                        {roleList}
                    </Select>
                  </Col>
                  <div className="cl"></div>
                </Modal>

                <Modal title="编辑用户信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="search-lb">
                      <label>姓名：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_id" type="hidden" />
                  <Input id="edit_name" placeholder="姓名" />
                  </Col>
                  <div className="search-lb">
                      <label>手机号：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_mobile" placeholder="手机号" />
                  </Col>
                  <div className="cl"></div>
                </Modal>
        </div>
        );
    },
});

module.exports = User;
