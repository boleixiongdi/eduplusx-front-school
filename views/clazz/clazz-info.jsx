import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import ReactQuill from 'react-quill';
import RaisedButton from 'material-ui/lib/raised-button';
let _ClazzForm = require('./clazz-form.jsx');
let ClazzForm = createForm()(_ClazzForm);
let _ClazzTeacher = require('./clazz-teacher.jsx');
let ClazzTeacher = createForm()(_ClazzTeacher);

const ClazzInfo = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          addTeacherVisible:false,
          data : [],
          pagination: {},
          loading: false,
          gradeData : [],
          teacherListData : [],
          editGrade:"请选择",
          grade:"请选择",
          addGrade:"请选择",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        this._getData();

        let _data = {};
        let type = "get";
        let url_grade ="grade/queryBySchoolId";
        this.grade_ajax(url_grade,type,_data);
        let url_teacher= "teacher/list";
        this.teacher_ajax(url_teacher,type,_data);
    },
    _getData(){
        console.log("获取数据");
        let url= "clazz/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },
    _getDataTeacher(){
        let url= "clazz/listClazzTeacher/"+$("#clazzId_hid").val();
        let _data = {};
        let type = "get";
        this._ajaxTeacher(url,type,_data,$("#clazzId_hid").val());
    },
    grade_ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.length);
              console.log(data);
              this.setState({
                gradeData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    teacher_ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              this.setState({
                teacherListData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    showAddClazzModal() {
        this.setState({
          visible: true,
          addGrade:"请选择"
        });
    },

    addClazzHandleOk() {
        console.log('保存班级信息');
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
        let url= "clazz/save";
        let _data = {class_no:$("#clazzNo").val(), class_name:$("#clazzName").val(), grade_id:this.state.addGrade
                    ,student_sum:$("#studentSum").val(), teacherId:$("#teacherId").val(),introduction:$("#introduction").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addClazzHandleCancel() {
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
    _ajaxTeacher(url,type,_data,id){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              const pagination = this.state.pagination;
              pagination.total = data.totalCount;
              console.log(data);
              $("#clazzId_hid").val(id);
              this.setState({
                loading: false,
                teacherData: data,
                pagination,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    searchClazz(){
        console.log('点击了查询按钮');
        let url= "clazz/list";
        let _data = {class_no:$("#search_class_no").val(), class_name:$("#search_clazzName").val(),grade_id:this.state.grade};
        let type = "get";
        this._ajax(url,type,_data);
    },

    handleEditClazzChange(value){
        this.setState({
          editGrade: value,
        });
    },

    handleAddClazzChange(value){
        this.setState({
          addGrade: value,
        });
    },

    handleSearchClazzChange(value){
        this.setState({
          grade: value,
        });
    },
    handleTeacherIdChange(value){
        this.setState({
          editTeacherId: value,
        });
    },
    handlePositionChange(value){
        this.setState({
          editPosition: value,
        });
    },
    render() {
        self = this;
        function deleteConfirm(id,object) {
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              console.log('点击了确定删除按钮');
              $.ajax({
                  url: "clazz/delete/"+id,
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
        function deleteTeacherConfirm(id,object) {
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              console.log('点击了确定删除按钮');
              $.ajax({
                  url: "clazz/deleteClazzTeacher/"+id,
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
                      teacherData: data,
                      pagination,
                    });

                  }.bind(this),
                  error: function(xhr, status, err) {
                    console.error("/deleteClazzTeacher/"+id, status, err.toString());
                  }.bind(this)
              });
            },
            onCancel() {}
          });
        }
        function showEditModal(id,object) {
          console.log(id);
          console.log('点击了编辑按钮');
          self.setState({editVisible: true});
          $.ajax({
              url: "clazz/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                console.log(data.length);
                console.log(data);
                $("#edit_clazzNo").val(data.class_no);
                $("#edit_clazzName").val(data.class_name);
                $("#edit_studentSum").val(data.student_sum);
                $("#edit_id").val(data.pkid);
                self.setState({
                  editGrade: data.grade_id,
                });
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function showEditTeacherModal(id,object) {
          self.setState({editTeacherVisible: true});
          $.ajax({
              url: "clazz/editClazzTeacher/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_clazzTeacherId").val(data.id);
                $("#edit_clazzTeacherClazzId").val(data.clazzId);
                $("#edit_clazzTeacherTeacherId").val(data.teacherId);
                $("#edit_clazzTeacherContent").val(data.content);
                self.setState({
                  editPosition: data.position,
                  editTeacherId: data.teacherId,
                });
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };

        function editSubmit() {
          console.log('点击了提交按钮');
          console.log(self);
          let url= "clazz/edit";
          let _data = {pkid:$("#edit_id").val(),class_no:$("#edit_clazzNo").val(), class_name:$("#edit_clazzName").val()
                        , grade_id:self.state.editGrade, student_sum:$("#edit_studentSum").val()};
          let type = "get";
          self._ajax(url,type,_data);

          self.setState({editVisible: false});
        };

        function editCancel(e) {
          console.log(e);
          self.setState({editVisible: false});
        };
        function editTeacherSubmit() {
          let url= "clazz/editClazzTeacher";
          let _data = {id:$("#edit_clazzTeacherId").val(),clazzId:$("#edit_clazzTeacherClazzId").val(), teacherId:self.state.editTeacherId
                        , position:self.state.editPosition, content:$("#edit_clazzTeacherContent").val()};
          let type = "get";
          self._ajaxTeacher(url,type,_data,$("#clazzId_hid").val());

          self.setState({editTeacherVisible: false});
        };

        function editTeacherCancel(e) {
          console.log(e);
          self.setState({editTeacherVisible: false});
        };
        function teacherCancel(e) {
          console.log(e);
          self.setState({addTeacherVisible: false});
        };
        function showAddTeacherModal(id,object) {
            self.setState({addTeacherVisible: true});
            let url= "clazz/listClazzTeacher/"+id;
            let _data = {};
            let type = "get";
            self._ajaxTeacher(url,type,_data,id);
        };
        const columns = [{
            title: 'ID',
            dataIndex: 'pkid',
        }, {
            title: '班级编号',
            dataIndex: 'class_no'
        }, {
            title: '班级名称',
                dataIndex: 'class_name'
        }, {
            title: '所属年级',
                dataIndex: 'grade_id'
        }, {
            title: '学生总数',
                dataIndex: 'student_sum'
        },  {
            title: '操作',
            key: 'operation',
            render(text, record) {
              return (
                <span className="operation-cl">
                  <i className="fa fa-pencil fa-fw"></i><a onClick={showEditModal.bind(this,record.pkid)} value={record.pkid} >编辑</a>
                  <span className="ant-divider"></span>
                  <i className="fa fa-trash-o fa-fw"></i><a onClick={deleteConfirm.bind(this,record.pkid)} value={record.pkid}>删除</a>
                  <span className="ant-divider"></span>
                  <i className="fa fa-pencil fa-fw"></i><a onClick={showAddTeacherModal.bind(this,record.pkid)} value={record.pkid} >添加教师</a>
                </span>
              );
            }
        }];
        const columns2 = [{
            title: 'ID',
            dataIndex: 'id'
        }, {
            title: '班级名称',
                dataIndex: 'clazzName'
        }, {
            title: '内容',
                dataIndex: 'content'
        }, {
            title: '职位名称',
                dataIndex: 'positionName'
        }, {
            title: '教师名称',
                dataIndex: 'teacherName'
        },  {
            title: '操作',
            key: 'operation',
            render(text, record) {
              return (
                <span className="operation-cl">
                <i className="fa fa-pencil fa-fw"></i><a onClick={showEditTeacherModal.bind(this,record.id)} value={record.id} >编辑</a>
                <span className="ant-divider"></span>
                <i className="fa fa-trash-o fa-fw"></i><a onClick={deleteTeacherConfirm.bind(this,record.id)} value={record.id}>删除</a>
                </span>
              );
            }
        }];

        let grades = self.state.gradeData;
        let gradeList = grades.map(grade => <Option key={grade.pkid} value= {grade.pkid} >{grade.grade_name}</Option>);
        let teachers = this.state.teacherListData;
        let teacherList = teachers.map(teacher => <Option key={teacher.id} value= {teacher.id} >{teacher.teacherName}</Option>);


        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>班级管理</h5>
                    <div className="console-add">
                        <ClazzForm callbackParent={this._getData} />
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>班级编号：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="班级编号" id="search_clazzNo" />
                    </Col>
                    <div className="search-lb">
                        <label>班级名称：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="班级名称" id="search_clazzName" />
                    </Col>
                    <div className="search-lb">
                        <label>所属年级：</label>
                    </div>
                    <Col span="4">
                        <Select id="search_gradeId" style={{ width: 120 }} defaultValue="-1" value={this.state.grade} onChange={this.handleSearchClazzChange}>
                            <Option value="-1">请选择</Option>
                            {gradeList}
                        </Select>
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchClazz} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑用户信息" visible={this.state.editVisible}
                   onOk={editSubmit} onCancel={editCancel}>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>班级编号：</label>
                      </div>
                      <Col span="6">
                      <Input id="edit_id" type="hidden" />
                      <Input id="edit_clazzNo" placeholder="班级编号" />
                      </Col>
                      <div className="search-lb">
                          <label>班级名称：</label>
                      </div>
                      <Col span="6">
                      <Input id="edit_clazzName" placeholder="班级名称" />
                      </Col>
                  </div>
                  <div className="cl"></div>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>班级人数：</label>
                      </div>
                      <Col span="6">
                      <Input id="edit_studentSum" placeholder="班级总数" />
                      </Col>
                      <div className="search-lb">
                          <label>所属年级：</label>
                      </div>
                      <Col span="6">
                      <Select id="edit_grade" style={{ width: '100%' }} defaultValue="-1" value={this.state.editGrade} onChange={this.handleEditClazzChange}>
                          <Option value="-1">请选择</Option>
                          {gradeList}
                      </Select>
                      </Col>
                  </div>
                </Modal>
                <Modal title="教师信息" visible={this.state.addTeacherVisible}
                  onOk={teacherCancel} onCancel={teacherCancel}>
                  <div className="console-add">
                      <ClazzTeacher callbackParent={this._getDataTeacher} />
                  </div>
                  <div className="cl"></div>
                  <div className="">
                  <input type="hidden" id="clazzId_hid"/>
                      <Table columns={columns2} dataSource={this.state.teacherData}
                                               pagination={this.state.pagination}
                                               loading={this.state.loading}/>
                  </div>
                </Modal>
                <Modal title="编辑教师" visible={this.state.editTeacherVisible}
                onOk={editTeacherSubmit} onCancel={editTeacherCancel}>
                    <div className="e-row">
                        <Input type="hidden" id="edit_clazzTeacherId"/>
                        <Input type="hidden" id="edit_clazzTeacherClazzId"/>
                        <div className="search-lb">
                            <label>职位：</label>
                        </div>
                        <Col span="6">
                            <Select id="edit_clazzTeacherPosition" style={{ width: 150 }} defaultValue="-1" value={this.state.editPosition} onChange={this.handlePositionChange}>
                                <Option value="-1">请选择</Option>
                                <Option value="1">班主任</Option>
                                <Option value="2">配班老师</Option>
                                <Option value="3">保育老师</Option>
                            </Select>
                        </Col>
                        <div className="search-lb">
                            <label>教师：</label>
                        </div>
                        <Col span="6">
                            <Select id="edit_clazzTeacherTeacherId" style={{ width: 150 }} defaultValue="-1" value={this.state.editTeacherId} onChange={this.handleTeacherIdChange}>
                                <Option value="-1">请选择</Option>
                                {teacherList}
                            </Select>
                        </Col>
                    </div>
                    <div className="cl"></div>
                    <div className="e-row">
                    <div className="search-lb">
                        <label>职责描述：</label>
                    </div>
                    <Col span="14">
                        <Input id="edit_clazzTeacherContent" placeholder="职责描述" />
                    </Col>
                    </div>
                </Modal>

        </div>
        );
    },
});

module.exports = ClazzInfo;
