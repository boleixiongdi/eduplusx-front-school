import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const Dict = React.createClass({
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
        let url= "dict/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    showAddDictModal() {
        this.setState({
          visible: true
        });
    },

    addDictHandleOk() {
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
        let url= "dict/save";
        let _data = {dictType:$("#dictType").val(), dictName:$("#dictName").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addDictHandleCancel() {
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

    searchDict(){
        let url= "dict/list";
        let _data = {dictType:$("#search_dictType").val(), dictName:$("#search_dictName").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },

    render() {
        self = this;
        function deleteConfirm(id,object) {
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              $.ajax({
                  url: "dict/delete/"+id,
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
              url: "dict/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_dictType").val(data.dictType);
                $("#edit_dictName").val(data.dictName);
                $("#edit_id").val(data.id);
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          let url= "dict/edit";
          let _data = {id:$("#edit_id").val(),dictType:$("#edit_dictType").val(), dictName:$("#edit_dictName").val()};
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
            title: '字典类型',
            dataIndex: 'dictType',
        }, {
            title: '字典名称',
                dataIndex: 'dictName'
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
                    <h5>字典管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddDictModal} className="add-btn">新增字典</Button>
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>字典类型：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="字典类型" id="search_dictType" />
                    </Col>

                    <div className="search-lb">
                        <label>字典名称：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="字典名称" id="search_dictName" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchDict} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="新增字典"
                  visible={this.state.visible}
                  onOk={this.addDictHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addDictHandleCancel}>
                  <div className="search-lb">
                      <label>字典类型：</label>
                  </div>
                  <Col span="4">
                  <Input id="dictType" placeholder="字典类型" />
                  </Col>
                  <div className="search-lb">
                      <label>字典名称：</label>
                  </div>
                  <Col span="4">
                  <Input id="dictName" placeholder="字典名称" />
                  </Col>
                  <div className="cl"></div>
                </Modal>

                <Modal title="编辑字典信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="search-lb">
                      <label>字典类型：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_id" type="hidden" />
                  <Input id="edit_dictType" placeholder="字典类型" />
                  </Col>
                  <div className="search-lb">
                      <label>字典名称：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_dictName" placeholder="字典名称" />
                  </Col>
                </Modal>
        </div>
        );
    },
});

module.exports = Dict;
