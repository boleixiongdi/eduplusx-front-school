import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';
let _StudentForm = require('./student-form.jsx');
let StudentForm = createForm()(_StudentForm);

const StudentInfo = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          gradeData: [],
          clazzData: [],
          searchGrade:"请选择",
          searchClazz:"请选择",
          editGrade:"0",
          editClazz:"0",
          clazz:"请选择",
          birthday:"",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        this._getData();
        let _data = {};
        let type = "get";
        let gradeUrl= "grade/queryBySchoolId";
        this.grade_ajax(gradeUrl,type,_data);

    },

    _getData(){
        console.log("获取数据");
        let url= "student/list";
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
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
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

    searchStudent(){
        console.log('点击了查询按钮');
        var clazzId = '请选择' == this.state.searchClazz ? 0 : this.state.searchClazz ;
        var gradeId = '请选择' == this.state.searchGrade ? 0 : this.state.searchGrade ;
        let url= "student/list";
        let _data = {studentNo:$("#search_studentNo").val(), stu_name:$("#search_studentName").val(), grade_id:gradeId
        , class_id:clazzId, card_no:$("#search_cardNo").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },

    handleSearchGradeChange(value){
        this.setState({
          searchGrade: value,
        });
        let _data = {grade_id:value};
        let type = "get";
        let clazzUrl= "clazz/queryByGradeId";
        this.clazz_ajax(clazzUrl,type,_data);
    },

    handleSearchClazzChange(value){
        this.setState({
          searchClazz: value,
        });
    },

    handleEditGradeChange(value){
        this.setState({
          editGrade: value,
        });
        let _data = {grade_id:value};
        let type = "get";
        let clazzUrl= "clazz/queryByGradeId";
        this.clazz_ajax(clazzUrl,type,_data);
    },

    handleEditClazzChange(value){
        this.setState({
          editClazz: value,
        });
    },
    changeSex(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            editSex: e.target.value,
        });
    },
    onChangeBirthday(field, value) {
        console.log(field, 'change', value);
        Date.prototype.Format = function(fmt)
        { //author: meizz
          var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
          };
          if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
          for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          return fmt;
        }

        this.setState({ visible: false });
        let birthday = value.Format("yyyy-MM-dd");
        console.log(birthday);
        this.setState({
            [field]: birthday,
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
                  url: "student/delete/"+id,
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
              url: "student/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                $("#edit_studentName").val(data.stu_name);
                $("#edit_gradeName").val(data.grade_name);
                $("#edit_clazzName").val(data.class_name);
                $("#edit_cardNo").val(data.card_no);
                $("#edit_mumPhone").val(data.mum_phone);
                $("#edit_dadPhone").val(data.dad_phone);
                $("#edit_id").val(data.pkid);
                if(data.grade_id!=0){
                    let _data = {grade_id:data.grade_id};
                    let type = "get";
                    let clazzUrl= "clazz/queryByGradeId";
                    self.clazz_ajax(clazzUrl,type,_data);
                }
                if(data.grade_id==0){
                    self.setState({
                        editGrade:"0",
                        editClazz:"0"
                    });
                }else{
                    if(data.clazz_id==0){
                        self.setState({
                            editGrade:data.grade_id,
                            editClazz:"0"
                        });
                    }else{
                        self.setState({
                            editGrade:data.grade_id,
                            editClazz:data.clazz_id
                        });
                    }
                }
                self.setState({
                    editSex:data.stu_sex,
                    editBirthday:data.birthday
                });

              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {


            let url= "student/edit";
            let _data = {pkid:$("#edit_id").val(),stu_name:$("#edit_studentName").val(),
            grade_id:self.state.editGrade,class_id:self.state.editClazz,
            card_no:$("#edit_cardNo").val(),mum_phone:$("#edit_mumPhone").val(),
            dad_phone:$("#edit_dadPhone").val(),birthday:self.state.editBirthday,
            stu_sex:self.state.editSex};
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
            title: '学生姓名',
                dataIndex: 'stu_name'
        }, {
            title: '一卡通号',
                dataIndex: 'card_no'
        },{
            title: '所属年级',
                dataIndex: 'grade_name'
        }, {
            title: '所属班级',
                dataIndex: 'class_name'
        }, {
            title: '父亲电话',
                dataIndex: 'dad_phone'
        },{
            title: '母亲电话',
                dataIndex: 'mum_phone'
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

        let grades = self.state.gradeData;
        let gradeList = grades.map(grade => <Option key={grade.pkid} value= {grade.pkid} >{grade.grade_name}</Option>);
        let clazzs = self.state.clazzData;
        let clazzList = clazzs.map(clazz => <Option key={clazz.pkid} value= {clazz.pkid} >{clazz.class_name}</Option>);

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>学生管理</h5>
                    <div className="console-add">
                        <StudentForm callbackParent={this._getData}/>
                    </div>
                </div>

                <div className="search-wrap">
                <div className="e-row">
                    <div className="search-lb">
                        <label>学号：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="学号" id="search_studentNo" />
                    </Col>
                    <div className="search-lb">
                        <label>学生姓名：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="学生姓名" id="search_studentName" />
                    </Col>
                    <div className="search-lb">
                        <label>年级：</label>
                    </div>
                    <Col span="4">
                      <Select id="search_gradeId" style={{ width: '100%' }} defaultValue="0" value={this.state.searchGrade} onChange={this.handleSearchGradeChange}>
                          <Option value="0">请选择</Option>
                          {gradeList}
                      </Select>
                    </Col>
                </div>
                <div className="e-row">
                    <div className="search-lb">
                        <label>班级：</label>
                    </div>
                    <Col span="4">
                      <Select id="search_clazzId" style={{ width: '100%' }} defaultValue="0" value={this.state.searchClazz} onChange={this.handleSearchClazzChange}>
                          <Option value="0">请选择</Option>
                          {clazzList}
                      </Select>
                    </Col>
                    <div className="search-lb">
                        <label>一卡通号：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="一卡通号" id="search_cardNo" />
                    </Col>
                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchStudent} >查询</Button>
                    </div>
                </div>
                <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑学生信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>学生姓名：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_studentName" placeholder="学生姓名" />
                      </Col>
                      <div className="search-lb">
                          <label>一卡通号：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_cardNo" placeholder="一卡通号" />
                      </Col>
                  </div>
                  <div className="cl"></div>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>学生性别：</label>
                      </div>
                      <Col span="8">
                          <RadioGroup id="sex" value={this.state.editSex} onChange={this.changeSex}>
                            <Radio value="male">男</Radio>
                            <Radio value="female">女</Radio>
                          </RadioGroup>
                      </Col>
                      <div className="search-lb">
                          <label>学生生日：</label>
                      </div>
                      <Col span="8">
                          <DatePicker id="birthday" value={this.state.editBirthday} onChange={this.onChangeBirthday.bind(this, 'editBirthday')} format="yyyy-MM-dd"/>
                      </Col>
                  </div>
                  <div className="cl"></div>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>所属年级：</label>
                      </div>
                      <Col span="8">
                        <Select id="edit_gradeId" style={{ width: '100%' }} defaultValue="0" value={this.state.editGrade} onChange={this.handleEditGradeChange}>
                            <Option value="0">请选择</Option>
                            {gradeList}
                        </Select>
                      </Col>
                      <div className="search-lb">
                          <label>所属班级：</label>
                      </div>
                      <Col span="8">
                        <Select id="edit_clazzId" style={{ width: '100%' }} defaultValue="0" value={this.state.editClazz} onChange={this.handleEditClazzChange}>
                            <Option value="0">请选择</Option>
                            {clazzList}
                        </Select>
                      </Col>
                  </div>
                  <div className="cl"></div>
                  <div className="s-row">
                      <div className="search-lb">
                          <label>父亲电话：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_dadPhone" placeholder="父亲电话" />
                      </Col>
                      <div className="search-lb">
                          <label>母亲电话：</label>
                      </div>
                      <Col span="8">
                          <Input id="edit_mumPhone" placeholder="母亲电话" />
                      </Col>
                  </div>
                  <div className="cl"></div>
                </Modal>
        </div>
        );
    },
});

module.exports = StudentInfo;
