import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';
let _GradeForm = require('./grade-form.jsx');
let GradeForm = createForm()(_GradeForm);

const GradeInfo = React.createClass({
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

    showAddGradeModal() {
        this.setState({
          visible: true
        });
    },

    _getData(){
        console.log("获取数据");
        let url= "grade/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    addGradeHandleOk() {
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
        }, 1000);

        let url= "grade/save";
        let _data = {grade_name:$("#gradeName").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addGradeHandleCancel() {
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

    searchGrade(){
        let url= "grade/list";
        let _data = {grade_name:$("#search_gradeName").val()};
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
                  url: "grade/delete/"+id,
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
              url: "grade/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_gradeName").val(data.grade_name);
                $("#edit_id").val(data.pkid);
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };

        function editSubmit() {
          console.log(self);
          let url= "grade/edit";
          let _data = {pkid:$("#edit_id").val(),grade_name:$("#edit_gradeName").val()};
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
            dataIndex: 'pkid'
        }, {
            title: '年级名称',
            dataIndex: 'grade_name'
        },{
            title: '操作',
            key: 'operation',
            render(text, record) {
              return (
                <span className="operation-cl">
                  <i className="fa fa-pencil fa-fw"></i><a onClick={showEditModal.bind(this,record.pkid)} value={record.pkid} >编辑</a>
                  <span className="ant-divider"></span>
                  <i className="fa fa-trash-o fa-fw"></i><a onClick={deleteConfirm.bind(this,record.pkid)} value={record.pkid}>删除</a>
                </span>
              );
            }
        }];

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>年级管理</h5>
                    <div className="console-add">
                        <GradeForm callbackParent={this._getData} />
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>年级名称：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="年级名称" id="search_gradeName" />
                    </Col>
                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchGrade} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑年级信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="search-lb">
                      <label>年级名称：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_id" type="hidden" />
                  <Input id="edit_gradeName" placeholder="年级名称" />
                  </Col>
                </Modal>
        </div>
        );
    },
});

module.exports = GradeInfo;
