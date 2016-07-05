import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

import RaisedButton from 'material-ui/lib/raised-button';

const StudentForm = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          loading: false,
          gradeData: [],
          clazzData: [],
          addGrade:"0",
          addClazz:"0",
        };
    },

    componentDidMount: function() {
      let _data = {};
      let type = "get";
      let gradeUrl= "grade/queryBySchoolId";
      this.grade_ajax(gradeUrl,type,_data);
    },

    showModal() {
      this.setState({ visible: true });
    },

    hideModal() {
      this.setState({ visible: false });
    },

    handleReset(e) {
      e.preventDefault();
      this.props.form.resetFields();
    },

    handleSubmit() {
      this.props.form.validateFields((errors, values) => {
        console.log(values);
        if (!!errors) {
          console.log('Errors in form!!!');
          return;
        }
        this.setState({ visible: false });

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
        let birthday = values.birthday.Format("yyyy-MM-dd");
        console.log(birthday);

        let url= "student/save";
        let _data = {stu_name:values.student_name,stu_sex:values.stu_sex,birthday:birthday,grade_id:this.state.addGrade,
        class_id:this.state.addClazz,card_no:values.cardNo,mum_phone:values.mumPhone,dad_phone:values.dadPhone,studentNo:values.studentNo};
        let type = "post";
        this._ajax(url,type,_data);
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
              console.log("--班级数据--"+data);
              this.setState({
                clazzData: data,
              });
              console.log("--班级数据--"+this.state.clazzData);

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(url, status, err.toString());
            }.bind(this)
        });
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
              this.props.callbackParent();
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
    handleAddGradeChange(value){
        this.setState({
          addGrade: value,
        });
        let _data = {grade_id:value};
        let type = "get";
        let clazzUrl= "clazz/queryByGradeId";
        this.clazz_ajax(clazzUrl,type,_data);
    },

    handleAddClazzChange(value){
        this.setState({
          addClazz: value,
        });
    },

    checkBirthday(rule, value, callback) {
        if (value && value.getTime() >= Date.now()) {
          callback(new Error('你不可能在未来出生吧!'));
        } else {
          callback();
        }
      },

    render() {
      function onChange(value) {
        console.log('选择了时间：', value);
      };
      const { getFieldProps } = this.props.form;

      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };

      const studentNoProps = getFieldProps('studentNo', {
        rules: [
          { required: true, message: '学号不能为空' }
        ],
      });
      const student_nameProps = getFieldProps('student_name', {
        rules: [
          { required: true, message: '学生姓名不能为空'},
        ]
      });
      const stu_sexProps = getFieldProps('stu_sex', {
        rules: [
          { required: true, message: '请选择您的性别' }
        ]
      });

      const birthdayProps = getFieldProps('birthday', {
        rules: [
          {
            required: true,
            type: 'date',
            message: '学生生日不能为空',
          }, {
            validator: this.checkBirthday,
          }
        ]
      });

      const cardNoProps = getFieldProps('cardNo', {
        rules: [
          { required: true, message: '一卡通号不能为空' }
        ],
      });

      const mumPhoneProps = getFieldProps('mumPhone', {
        rules: [
          { required: true, message: '母亲电话为空' }
        ],
      });

      const dadPhoneProps = getFieldProps('dadPhone', {
        rules: [
          { required: true, message: '父亲电话为空' }
        ],
      });


      let grades = this.state.gradeData;
      let gradeList = grades.map(grade => <Option key={grade.pkid} value= {grade.pkid} >{grade.grade_name}</Option>);

      let clazzs = this.state.clazzData;
      let clazzList = clazzs.map(clazz => <Option key={clazz.pkid} value= {clazz.pkid} >{clazz.class_name}</Option>);

      return (
          <div>
              <Button type="primary" onClick={this.showModal} className="add-btn">新增学生</Button>
              <Modal title="新增学生" visible={this.state.visible}
              onOk={this.handleSubmit} onCancel={this.hideModal}>
              <Form horizontal form={this.props.form}>
              <Row>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="学生姓名：">
                    <Input id="student_name" {...student_nameProps} type="text" placeholder="学生姓名" />
                  </FormItem>

                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="学号：">
                    <Input id="studentNo" {...studentNoProps} type="text" placeholder="学号" />
                  </FormItem>
              </Row>
              <Row>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="学生性别：">
                    <RadioGroup id="stu_sex" {...stu_sexProps}>
                      <Radio value="1">男</Radio>
                      <Radio value="0">女</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="学生生日：">
                    <DatePicker {...birthdayProps} />
                  </FormItem>
              </Row>
              <Row>
                    <div className="s-row">
                    <div className="search-lb">
                        <label>所属年级：</label>
                    </div>
                    <Col span="8">
                      <Select id="grade_id" style={{ width: '100%' }} defaultValue="0" value={this.state.addGrade} onChange={this.handleAddGradeChange}>
                          <Option value="0">请选择年级</Option>
                          {gradeList}
                      </Select>
                    </Col>
                    <div className="search-lb">
                        <label>所属班级：</label>
                    </div>
                    <Col span="8">
                      <Select id="class_id" style={{ width: '100%' }} defaultValue="0" value={this.state.addClazz} onChange={this.handleAddClazzChange}>
                          <Option value="0">请选择班级</Option>
                          {clazzList}
                      </Select>
                    </Col>
                    <div className="cl"></div>
                  </div>

              </Row>
              <Row>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="一卡通号：">
                    <Input id="cardNo" {...cardNoProps} type="text" placeholder="一卡通号" />
                  </FormItem>

                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="母亲电话：">
                    <Input id="mumPhone" {...mumPhoneProps} type="text" placeholder="母亲电话" />
                  </FormItem>
             </Row>
             <Row>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="父亲电话：">
                    <Input id="dadPhone" {...dadPhoneProps} type="text" placeholder="父亲电话" />
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

module.exports = StudentForm;
