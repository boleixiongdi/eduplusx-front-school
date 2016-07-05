import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const ClazzForm = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          gradeData : [],
          teacherData:[],
          grade:"请选择",
          addGrade:"请选择",
          teacherId:"请选择"
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "clazz/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);

        let url_teacher= "teacher/list";
        this.teacher_ajax(url_teacher,type,_data);
        let url_grade ="grade/queryBySchoolId";
        this.grade_ajax(url_grade,type,_data);
    },

    showModal() {
        this.setState({
          visible: true,
          addGrade:"请选择"
        });
    },

    handleSubmit() {
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
                    ,student_sum:$("#studentSum").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    hideModal() {
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
              this.props.callbackParent();
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
    teacher_ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              this.setState({
                teacherData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    handleAddGradeChange(value){
        this.setState({
          addGrade: value,
        });
    },
    handleTeacherIdChange(value){
        this.setState({
          teacherId: value,
        });
    },
    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        };
        const clazzNoProps = getFieldProps('clazzNo', {
          rules: [
            { required: true, message: '班级编号为空' }
          ],
        });
        const clazzNameProps = getFieldProps('clazzName', {
          rules: [
            { required: true, message: '班级名称为空' }
          ],
        });
        const studentSumProps = getFieldProps('studentSum', {
          rules: [
            { required: true, message: '班级总人数为空' }
          ],
        });
        const introductionProps = getFieldProps('introduction', {
          rules: [
            { required: true, message: '班级介绍为空' }
          ],
        });

        let grades = this.state.gradeData;
        let gradeList = grades.map(grade => <Option key={grade.pkid} value= {grade.pkid} >{grade.grade_name}</Option>);

        let teachers = this.state.teacherData;
        let teacherList = teachers.map(teacher => <Option key={teacher.id} value= {teacher.id} >{teacher.teacherName}</Option>);

        return (
            <div>
              <Button type="primary" onClick={this.showModal} className="add-btn">新增班级</Button>
              <Modal title="新增班级" visible={this.state.visible}
              onOk={this.handleSubmit} onCancel={this.hideModal}>
                <Form horizontal form={this.props.form}>
                  <Row>
                      <FormItem className="formitem"
                        {...formItemLayout}
                        label="班级编号：">
                        <Input id="clazzNo" {...clazzNoProps} type="text" placeholder="班级编号" />
                      </FormItem>
                      <FormItem className="formitem"
                        {...formItemLayout}
                        label="班级名称：">
                        <Input id="clazzName" {...clazzNameProps} type="text" placeholder="班级名称" />
                      </FormItem>
                  </Row>
                  <Row>
                      <FormItem className="formitem"
                        {...formItemLayout}
                        label="班级人数：">
                        <Input id="studentSum" {...studentSumProps} type="text" placeholder="班级总人数" />
                      </FormItem>
                      <div className="search-lb">
                          <label>所属年级：</label>
                      </div>
                      <Col span="6">
                          <Select id="add_gradeId" style={{ width: 150 }} defaultValue="-1" value={this.state.addGrade} onChange={this.handleAddGradeChange}>
                              <Option value="-1">请选择</Option>
                              {gradeList}
                          </Select>
                      </Col>
                  </Row>
                  <div className="cl"></div>
                  <Row>
                      <FormItem className="formitem"
                        {...formItemLayout}
                        label="班级介绍：">
                        <Input id="introduction" {...introductionProps} type="text" placeholder="班级介绍" />
                      </FormItem>
                  </Row>
                  <FormItem className="formitem"
                    wrapperCol={{ span: 12, offset: 7 }} >
                    <Button type="ghost" onClick={this.handleReset}>重置</Button>
                  </FormItem>
                  <div className="cl"></div>
                </Form>
              </Modal>
            </div>
        );
    },
});

module.exports = ClazzForm;
