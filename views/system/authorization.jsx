import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon,TreeSelect } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';
let Tree = require('../../components/tree/Tree');

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
  },
  {
    "id": "sys",
    "text": "系统设置",
    "icon": "cogs",
    "children": [
      {
        "id": "system_log",
        "text": "系统日志"
      },
      {
        "id": "config_list",
        "text": "参数设置",
        "children": [
          {
            "id": "config_edit",
            "text": "编辑"
          },
          {
            "id": "config_delete",
            "text": "删除"
          }
        ]
      }
    ]
  }
];

const treeData = [{
  label: '节点一',
  value: '0-0',
  key: '0-0',
  children: [{
    label: '子节点一',
    value: '0-0-0',
    key: '0-0-0',
  }, {
    label: '子节点二',
    value: '0-0-1',
    key: '0-0-1',
  }],
}, {
  label: '节点二',
  value: '0-1',
  key: '0-1',
  children: [{
    label: '子节点三',
    value: '0-1-0',
    key: '0-1-0',
  }, {
    label: '子节点四',
    value: '0-1-1',
    key: '0-1-1',
  }],
}];

const Demo = React.createClass({
  getInitialState() {
    return {
      value: ['0-0-0'],
    };
  },
  onChange(value) {
    console.log('onChange ', value, arguments);
    this.setState({ value });
  },
  render() {
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      multiple: true,
      treeCheckable: true,
      searchPlaceholder: '请选择',
      treeDefaultExpandAll: true,
      style: {
        width: 300,
      },
    };
    return <TreeSelect {...tProps} />;
  },
});

const Authorization = React.createClass({
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
          treeData: null,
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "authorization/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    showAddAuthorizationModal() {
        this.setState({
          visible: true
        });
    },

    addAuthorizationHandleOk() {
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
        let url= "authorization/save";
        let _data = {name:$("#name").val(), mobile:$("#mobile").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addAuthorizationHandleCancel() {
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

    searchAuthorization(){
        console.log('点击了查询按钮');
        let url= "authorization/list";
        let _data = {name:$("#search_name").val(), mobile:$("#search_mobile").val()};
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
                  url: "authorization/delete/"+id,
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
              url: "authorization/edit/"+id,
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
          let url= "authorization/edit";
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
            title: '角色ID',
            dataIndex: 'name',
            /*render(text) {
            return <a href="#">{text}</a>;
            }*/
        }, {
            title: '菜单ID',
                dataIndex: 'mobile'
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
                    <h5>权限管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddAuthorizationModal} className="add-btn">赋权限</Button>
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>姓名：</label>
                    </div>
                    <Col span="4">
                    <Demo />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchAuthorization} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="赋权限"
                  visible={this.state.visible}
                  onOk={this.addAuthorizationHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addAuthorizationHandleCancel}>
                  <div className="search-lb">
                      <label>角色名称：</label>
                  </div>
                  <Col span="4">
                  <Input id="name" placeholder="角色名称" />
                  </Col>
                  <div className="search-lb">
                      <label>权限：</label>
                  </div>
                  <Col span="12">
                    <Tree ref="tree" data={Rcui_data}
                      readOnly={this.state.readOnly}
                      selectAble={this.state.selectAble}
                      greedy={this.state.greedy}
                      textTpl="{text}({id})"
                      valueTpl="{id}"
                      value={this.state.value}
                      open={true}
                      sep={this.state.sep}
                    />
                  </Col>
                  <div className="cl"></div>
                </Modal>

                <Modal title="编辑权限信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="search-lb">
                      <label>角色名称：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_id" type="hidden" />
                  <Input id="edit_name" placeholder="角色名称" />
                  </Col>
                  <div className="search-lb">
                      <label>权限：</label>
                  </div>
                  <Col span="12">
                  <Input id="edit_mobile" placeholder="权限" />
                  </Col>
                </Modal>
        </div>
        );
    },
});

module.exports = Authorization;
