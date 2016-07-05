import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import ReactQuill from 'react-quill';
import RaisedButton from 'material-ui/lib/raised-button';
let _AnnouncementForm = require('./announcement-form.jsx');
let AnnouncementForm = createForm()(_AnnouncementForm);

const Announcement = React.createClass({
    getInitialState() {
        return {
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          edit_content:"",
          editGrade:"0",
          editClazz:"0",
          gradeData : [],
          clazzData : [],
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        this._getData();
    },

    _getData(){
        console.log("获取数据");
        let url= "announcement/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
        let gradeUrl= "grade/queryBySchoolId";
        this.grade_ajax(gradeUrl,type,_data);
    },

    _ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            xhr:_data.err,
            status:_data.code,
            err:_data.err,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.success);
              console.log("22222--22");
              const pagination = this.state.pagination;
              pagination.total = data.totalCount;
              this.setState({
                loading: false,
                data: data,
                pagination,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.log("1111");
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    grade_ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              this.setState({
                gradeData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    clazz_ajax(url,type,_data){
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
                clazzData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    onTextChange: function(value) {
      this.setState({ edit_content:value });
      console.log(this.state.edit_content);
    },

    searchAnnouncement(){
        console.log('点击了查询按钮');
        let url= "announcement/list";
        let _data = {title:$("#search_title").val(), content:$("#search_content").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    handleEditGradeChange(value){
        this.setState({
          editGrade: value,
        });
        this.setState({
          editClazz: "请选择班级",
        });
        let _data = {grade_id:value};
        let type = "get";
        let clazzUrl= "clazz/queryByGradeId";
        this.clazz_ajax(clazzUrl,type,_data);
    },
    handleEditAnnRangeChange(value){
        this.setState({
          editAnnRange: value,
        });
    },
    handleEditClazzChange(value){
        this.setState({
          editClazz: value,
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
                  url: "announcement/delete/"+id,
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
              url: "announcement/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_title").val(data.title);
                $("#edit_id").val(data.id);
                $("#edit_content").val(data.content);
                if(data.gradeId!=0){
                    let _data = {grade_id:data.gradeId};
                    let type = "get";
                    let clazzUrl= "clazz/queryByGradeId";
                    self.clazz_ajax(clazzUrl,type,_data);
                }
                if(data.gradeId==0){
                    self.setState({
                        editGrade:"0",
                        editClazz:"0"
                    });
                }else{
                    if(data.clazzId==0){
                        self.setState({
                            editGrade:data.gradeId,
                            editClazz:"0"
                        });
                    }else{
                        self.setState({
                            editGrade:data.gradeId,
                            editClazz:data.clazzId
                        });
                    }
                }
                self.setState({
                    editAnnRange:data.annRange
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
          let url= "announcement/edit";
          let _data = {id:$("#edit_id").val(),title:$("#edit_title").val(), content:$("#edit_content").val()
                      ,annType:self.state.editAnnRange,annRange:self.state.editAnnRange,gradeId:self.state.editGrade, clazzId:self.state.editClazz};
          let type = "get";
          self._ajax(url,type,_data);

          self.setState({editVisible: false});
        };

        function editCancel(e) {
          console.log(e);
          self.setState({editVisible: false});
        };

        const columns = [{
            title: '标题',
            dataIndex: 'title',
            /*render(text) {
            return <a href="#">{text}</a>;
            }*/
        }, {
            title: '内容',
                dataIndex: 'content'
        },{
            title: '范围',
                dataIndex: 'annRangeName'
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


        let grades = this.state.gradeData;
        let gradeList = grades.map(grade => <Option key={grade.id} value= {grade.id} >{grade.gradeName}</Option>);

        let clazzs = this.state.clazzData;
        let clazzList = clazzs.map(clazz => <Option key={clazz.id} value= {clazz.id} >{clazz.clazzName}</Option>);

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>公告管理</h5>
                    <div className="console-add">
                        <AnnouncementForm callbackParent={this._getData} />
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>标题：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="标题" id="search_title" />
                    </Col>

                    <div className="search-lb">
                        <label>内容：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="内容" id="search_content" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchAnnouncement} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑公告信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <Row>
                  <div className="s-row">
                    <div className="search-lb">
                        <label>标题：</label>
                    </div>
                    <Col span="8">
                    <Input id="edit_id" type="hidden" />
                    <Input id="edit_title" placeholder="标题" />
                    </Col>
                    <div className="search-lb">
                        <label>范围：</label>
                    </div>
                    <Col span="8">
                    <Select id="edit_annRange"  placeholder="请选择范围" style={{ width: '100%' }} defaultValue="0" value={this.state.editAnnRange} onChange={this.handleEditAnnRangeChange}>
                      <Option value="1">校级</Option>
                      <Option value="2">年级</Option>
                      <Option value="3">班级</Option>
                    </Select>
                    </Col>
                  </div>
                  </Row>
                  <Row>
                  <div className="s-row">
                    <div className="search-lb">
                        <label>所带班级：</label>
                    </div>
                    <Col span="4">
                      <Select id="edit_grade" style={{ width: '100%' }} defaultValue="0" value={this.state.editGrade} onChange={this.handleEditGradeChange}>
                          <Option value="0">请选择年级</Option>
                          {gradeList}
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select id="edit_clazz" style={{ width: '100%' }} defaultValue="0" value={this.state.editClazz} onChange={this.handleEditClazzChange}>
                          <Option value="0">请选择班级</Option>
                          {clazzList}
                      </Select>
                    </Col>
                  </div>
                  </Row>
                  <Row>
                  <div className="s-row">
                    <div className="search-lb">
                        <label>内容：</label>
                    </div>
                    <Col span="18">
                    <textarea style={{ width: '100%' }} id="edit_content" placeholder="内容"/>
                    </Col>
                  </div>
                  <div className="cl"/>
                  </Row>
                </Modal>
        </div>
        );
    },
});

module.exports = Announcement;
