import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import ReactQuill from 'react-quill';
import RaisedButton from 'material-ui/lib/raised-button';
let _TeacherForm = require('./teacher-form.jsx');
let TeacherForm = createForm()(_TeacherForm);

const TeacherInfo = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          gradeData: [],
          clazzData: [],
          editGrade:"请选择",
          editClazz:"请选择",
        };
    },
    componentDidMount: function() {
        this.setState({ loading: true });
        this._getData();
    },
    _getData(){
        console.log("获取数据");
        let url= "teacher/list";
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

    searchTeacher(){
        console.log('点击了查询按钮');
        let url= "teacher/list";
        let _data = {teacherName:$("#search_teacherName").val(), phone:$("#search_phone").val(), teacherNo:$("#search_teacherNo").val()};
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
                  url: "teacher/delete/"+id,
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
              url: "teacher/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                console.log(data);
                $("#edit_teacherName").val(data.teacherName);
                $("#edit_phone").val(data.phone);
                $("#edit_teacherNo").val(data.teacherNo);
                $("#edit_id").val(data.id);
                $("#edit_email").val(data.email);
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          console.log('点击了提交按钮');
          console.log(self);
          let url= "teacher/edit";
          let _data = {id:$("#edit_id").val(),teacherName:$("#edit_teacherName").val(), phone:$("#edit_phone").val(), teacherNo:$("#edit_teacherNo").val(),
          email:$("#edit_email").val()};
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
            title: '教师编号',
                dataIndex: 'teacherNo'
        },{
            title: '教师姓名',
            dataIndex: 'teacherName',
            /*render(text) {
            return <a href="#">{text}</a>;
            }*/
        },{
            title: '电话',
                dataIndex: 'phone'
        },{
            title: '邮箱',
                dataIndex: 'email'
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
                    <h5>教师管理</h5>
                    <div className="console-add">
                        <TeacherForm callbackParent={this._getData} />
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>教师姓名：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="教师姓名" id="search_teacherName" />
                    </Col>

                    <div className="search-lb">
                        <label>手机号：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="手机号" id="search_phone" />
                    </Col>

                    <div className="search-lb">
                        <label>教师编号：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="教师编号" id="search_teacherNo" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchTeacher} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑教师信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>教师编号：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_id" type="hidden" />
                          <Input id="edit_teacherNo" placeholder="教师编号" />
                      </Col>
                      <div className="search-lb">
                          <label>教师姓名：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_teacherName" placeholder="姓名" />
                      </Col>
                  </div>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>手机号：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_phone" placeholder="手机号" />
                      </Col>
                      <div className="search-lb">
                          <label>邮箱：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_email" placeholder="邮箱" />
                      </Col>
                  </div>
                  <div className="cl"></div>
                </Modal>
        </div>
        );
    },
});

module.exports = TeacherInfo;
