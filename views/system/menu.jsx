import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon ,Select} from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const Menu = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          dictData : [],
          parentMenus: [],
          pagination: {},
          loading: false,
          menuLevel:"请选择",
          addMenuLevel:"请选择",
          addParentMenu:"请选择",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "menu/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);

        $.ajax({
            url: "dict/list",
            dataType: 'json',
            type: "get",
            data: {menuType:"menu"},
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.length);
              console.log(data);
              this.setState({
                dictData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error("/dict/list", status, err.toString());
            }.bind(this)
        });

        this.getParentMenu();

    },

    getParentMenu(){
      $.ajax({
          url: "menu/list",
          dataType: 'json',
          type: "get",
          data: {parentMenu:"true"},
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            console.log(data.length);
            console.log(data);
            this.setState({
              parentMenus: data,
            });

          }.bind(this),
          error: function(xhr, status, err) {
            console.error("/menu/list", status, err.toString());
          }.bind(this)
      });
    },

    showAddMenuModal() {
        this.getParentMenu();
        this.setState({
          visible: true
        });
    },

    addMenuHandleOk() {
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
        }, 1000);

        let url= "menu/save";
        let _data = {'parentId':this.state.addParentMenu, 'menuName':$("#menuName").val(), 'menuIcon':$("#menuIcon").val()
                    , 'menuPath':$("#menuPath").val(), 'menuLevel':this.state.addMenuLevel};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addMenuHandleCancel() {
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

    searchMenu(){
        console.log("点击了查询按钮");
        console.log(this.state.menuLevel);
        let url= "menu/list";
        let _data = {menuName:$("#search_menuName").val(),menuPath:$("#search_menuPath").val(), menuLevel:this.state.menuLevel};
        let type = "get";
        this._ajax(url,type,_data);
    },

    handleMenuLevelChange(value){
        this.setState({
          menuLevel: value,
        });
    },

    handleAddMenuLevelChange(value){
        this.setState({
          addMenuLevel: value,
        });
    },

    handleEditMenuLevelChange(value){
        this.setState({
          editMenuLevel: value,
        });
    },

    handleAddParentMenuChange(value){
        this.setState({
          addParentMenu: value,
        });
    },

    handleEditParentMenuChange(value){
        this.setState({
          editParentMenu: value,
        });
    },

    render() {
        self = this;
        function deleteConfirm(id,object) {
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              $.ajax({
                  url: "menu/delete/"+id,
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
              url: "menu/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_parentId").val(data.parentId);
                $("#edit_menuName").val(data.menuName);
                $("#edit_menuIcon").val(data.menuIcon);
                $("#edit_menuPath").val(data.menuPath);

                self.setState({
                  editParentMenu:data.parentId,
                  editMenuLevel:data.menuLevel,
                });

                $("#edit_id").val(data.id);
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          let url= "menu/edit";
          let _data = {id:$("#edit_id").val(),parentId:self.state.editParentMenu, menuName:$("#edit_menuName").val()
                      ,menuIcon:$("#edit_menuIcon").val(),menuPath:$("#edit_menuPath").val(),menuLevel:self.state.editMenuLevel};
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
            title: '父级菜单',
            dataIndex: 'parentId',
        },{
            title: '菜单名称',
                dataIndex: 'menuName'
        },{
            title: '菜单图标',
                dataIndex: 'menuIcon'
        },{
            title: '菜单路径',
                dataIndex: 'menuPath'
        },{
            title: '菜单等级',
                dataIndex: 'menuLevel'
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

        let dicts = self.state.dictData;
        let dictList = dicts.map(dict => <Option key={dict.id} value= {dict.id} >{dict.dictName}</Option>);

        let _parentMenus = self.state.parentMenus;
        let parentList = _parentMenus.map(menu => <Option key={menu.id} value= {menu.id} >{menu.menuName}</Option>);

        return (

            <div>
                <div className="console-title console-title-border">
                    <h5>菜单管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddMenuModal} className="add-btn">新增菜单</Button>
                    </div>
                </div>

                <div className="search-wrap">
                    <div className="search-lb">
                        <label>菜单名称：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="菜单名称" id="search_menuName" />
                    </Col>
                    <div className="search-lb">
                        <label>菜单路径：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="菜单路径" id="search_menuPath" />
                    </Col>
                    <div className="search-lb">
                        <label>菜单等级：</label>
                    </div>
                    <Col span="4">
                      <Select id="search_menuLevel" style={{ width: 120 }} defaultValue="-1" value={this.state.menuLevel} onChange={this.handleMenuLevelChange}>
                          <Option value="-1">请选择</Option>
                          {dictList}
                      </Select>
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchMenu} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>
                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="新增菜单"
                  visible={this.state.visible}
                  onOk={this.addMenuHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addMenuHandleCancel}>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>父级菜单：</label>
                    </div>

                    <Col span="4">
                      <Select id="add_menuLevel" style={{ width: 80 }} defaultValue="-1" value={this.state.addParentMenu} onChange={this.handleAddParentMenuChange}>
                          <Option value="-1">请选择</Option>
                          <Option value="0">顶级菜单</Option>
                          {parentList}
                      </Select>
                    </Col>
                    <div className="search-lb">
                        <label>菜单名称：</label>
                    </div>
                    <Col span="4">
                    <Input id="menuName" placeholder="菜单名称" />
                    </Col>
                    <div className="search-lb">
                        <label>菜单图标：</label>
                    </div>
                    <Col span="4">
                    <Input id="menuIcon" placeholder="菜单图标" />
                    </Col>
                  </div>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>菜单路径：</label>
                    </div>
                    <Col span="4">
                    <Input id="menuPath" placeholder="菜单路径" />
                    </Col>
                    <div className="search-lb">
                        <label>菜单等级：</label>
                    </div>
                    <Col span="4">
                      <Select id="search_menuLevel" style={{ width: 120 }} defaultValue="-1" value={this.state.addMenuLevel} onChange={this.handleAddMenuLevelChange}>
                          <Option value="-1">请选择</Option>
                          {dictList}
                      </Select>
                    </Col>
                  </div>
                  <div className="cl"></div>
                </Modal>
                <Modal title="编辑菜单信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>父级菜单：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_id" type="hidden" />
                    <Select style={{ width: 80 }} defaultValue={this.state.editParentMenu} value={this.state.editParentMenu} onChange={this.handleEditParentMenuChange}>
                        {parentList}
                    </Select>
                    </Col>
                    <div className="search-lb">
                        <label>菜单名称：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_menuName" placeholder="菜单名称" />
                    </Col>
                    <div className="search-lb">
                        <label>菜单图标：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_menuIcon" placeholder="菜单图标" />
                    </Col>
                  </div>
                  <div className="e-row">
                    <div className="search-lb">
                        <label>菜单路径：</label>
                    </div>
                    <Col span="4">
                    <Input id="edit_menuPath" placeholder="菜单路径" />
                    </Col>
                    <div className="search-lb">
                        <label>菜单等级：</label>
                    </div>
                    <Col span="4">
                      <Select style={{ width: 120 }} defaultValue={this.state.editMenuLevel} value={this.state.editMenuLevel} onChange={this.handleEditMenuLevelChange}>
                          {dictList}
                      </Select>
                    </Col>
                  </div>
                </Modal>
        </div>
        );
    },
});

module.exports = Menu;
