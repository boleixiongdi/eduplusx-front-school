import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';
let Tree = require('../../components/tree/Tree');


const Role = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,

          readOnly: false,
          selectAble: true,
          greedy: false,
          sep: ',',
          value: 'role_delete',
          showValue: 'role_delete',
          editValue: '',
          editShowValue: '',
          treeData: null,
          permission_Data:[],

        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "role/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);

        $.ajax({
            url: "menu/list/permission",
            dataType: 'json',
            type: type,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.length);
              console.log(data);
              const pagination = this.state.pagination;
              pagination.total = data.totalCount;
              this.setState({
                permission_Data: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(menu/list/permission, status, err.toString());
            }.bind(this)
        });
    },

    showAddRoleModal() {
        this.setState({
          visible: true
        });
    },

    addRoleHandleOk() {
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
        let url= "role/save";
        let _data = {name:$("#name").val(), description:$("#description").val(),permissions:this.state.showValue.replace(/"/g, "")};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addRoleHandleCancel() {
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

    searchRole(){
        let url= "role/list";
        let _data = {name:$("#search_name").val(), description:$("#search_description").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },

    handleChange () {
      let value = JSON.stringify(this.refs.tree.getValue());
      this.setState({ showValue: value });
    },

    sepChange (sep) {
      this.setState({ sep });
      setTimeout(()=>this.handleChange(), 0);
    },

    handleEditChange () {
      let value = JSON.stringify(this.refs.editTree.getValue());
      self.setState({ editShowValue: value });
    },

    sepEditChange (sep) {
      this.setState({ sep });
      setTimeout(()=>this.handleEditChange(), 0);
    },
    render() {

        const Rcui_data = [
          {
            "id": "account",
            "text": "账户管理",
            "icon": "user",
            "children": [
              {
                "id": "user_list",
                "text": "用户管理",
                "children": [
                  {
                    "id": "user_edit",
                    "text": "编辑"
                  }
                ]
              },
              {
                "id": "role_list",
                "text": "角色管理",
                "children": [
                  {
                    "id": "role_edit",
                    "text": "编辑"
                  },
                  {
                    "id": "role_delete",
                    "text": "删除"
                  }
                ]
              }
            ]
          }
        ];

        self = this;
        function deleteConfirm(id,object) {
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              $.ajax({
                  url: "role/delete/"+id,
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
          self.setState({editVisible: true});
          $.ajax({
              url: "role/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_name").val(data.name);
                $("#edit_description").val(data.description);
                $("#edit_id").val(data.id);
                console.log(data.permissions);
                self.setState({
                  editValue: data.permissions,
                  editShowValue: data.permissions,
                });
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          let url= "role/edit";
          let _data = {id:$("#edit_id").val(),name:$("#edit_name").val(), description:$("#edit_description").val(),permissions:self.state.editShowValue.replace(/"/g, "")};
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
            title: '角色名称',
            dataIndex: 'name',
        }, {
            title: '角色描述',
                dataIndex: 'description'
        }, {
            title: '角色权限',
                dataIndex: 'permissions'
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
                    <h5>角色管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddRoleModal} className="add-btn">新增角色</Button>
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>角色名称：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="角色名称" id="search_name" />
                    </Col>

                    <div className="search-lb">
                        <label>角色描述：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="角色描述" id="search_description" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchRole} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="新增角色"
                  visible={this.state.visible}
                  onOk={this.addRoleHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addRoleHandleCancel}>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>角色名称：</label>
                    </div>
                    <Col span="4">
                    <Input id="name" placeholder="角色名称" />
                    </Col>
                    <div className="search-lb">
                        <label>角色描述：</label>
                    </div>
                    <Col span="4">
                    <Input id="description" placeholder="角色描述" />
                    </Col>
                  </div>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>角色权限：</label>
                    </div>
                    <Col span="12">
                      <Tree ref="tree" data={this.state.permission_Data}
                        readOnly={this.state.readOnly}
                        selectAble={this.state.selectAble}
                        greedy={this.state.greedy}
                        textTpl="{text}({id})"
                        valueTpl="{id}"
                        value={this.state.value}
                        open={true}
                        onClick={item => this.refs.textClick.getDOMNode().innerText = `clicked ${item.text}`}
                        onChange={this.handleChange.bind(this)}
                        sep={this.state.sep}
                      />
                      <div>value: {this.state.showValue}</div>
                      <div ref="textClick"></div>
                    </Col>
                  </div>
                  <div className="cl"></div>
                </Modal>

                <Modal title="编辑角色信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>角色名称：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_id" type="hidden" />
                    <Input id="edit_name" placeholder="角色名称" />
                    </Col>
                    <div className="search-lb">
                        <label>角色描述：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_description" placeholder="角色描述" />
                    </Col>
                  </div>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>角色权限：</label>
                    </div>
                    <Col span="12">
                      <Tree ref="editTree" data={this.state.permission_Data}
                        readOnly={this.state.readOnly}
                        selectAble={this.state.selectAble}
                        greedy={this.state.greedy}
                        textTpl="{text}({id})"
                        valueTpl="{id}"
                        value={this.state.editValue}
                        onClick={item => this.refs.editTextClick.getDOMNode().innerText = `clicked ${item.text}`}
                        onChange={this.handleEditChange.bind(this)}
                        open={true}
                        sep={this.state.sep}
                      />
                      <div>value: {this.state.editShowValue}</div>
                      <div ref="editTextClick"></div>
                    </Col>
                  </div>
                  <div className="cl"></div>
                </Modal>
        </div>
        );
    },
});

module.exports = Role;
