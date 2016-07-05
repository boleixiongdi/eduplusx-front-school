import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

let StudentForm = React.createClass({
  getInitialState() {
    return {
      visible: false,
      gradeData: [],
      clazzData: [],
      addGrade:"请选择",
      addClazz:"请选择",
    };
  },

  componentDidMount: function() {
      let _data = {};
      let type = "get";
      let gradeUrl= "grade/queryBySchoolId";
      this.grade_ajax(gradeUrl,type,_data);

  },

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

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
      let _data = {studentNo:values.studentNo, studentName:values.studentName, gradeId:this.state.addGrade
      , clazzId:this.state.addClazz, cardNo:values.cardNo, mumPhone:values.mumPhone, dadPhone:values.dadPhone
      ,birthday:birthday};
      let type = "post";
      this._ajax(url,type,_data);
    });
  },

  handleAddGradeChange(value){
      this.setState({
        addGrade: value,
      });
      let _data = {gradeId:value};
      let type = "get";
      let clazzUrl= "clazz/queryByGradeId";
      this.clazz_ajax(clazzUrl,type,_data);
  },

  handleAddClazzChange(value){
      this.setState({
        addClazz: value,
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

  showModal() {
    this.setState({ visible: true });
  },

  hideModal() {
    this.setState({ visible: false });
  },

  checkBirthday(rule, value, callback) {
      if (value && value.getTime() >= Date.now()) {
        callback(new Error('你不可能在未来出生吧!'));
      } else {
        callback();
      }
    },

  render() {
    const { getFieldProps } = this.props.form;

    // 如果觉得在 JSX 中写 `getFieldProps` 会影响阅读，可以先用变量保存 `getFieldProps` 的返回值。
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const studentNoProps = getFieldProps('studentNo', {
      rules: [
        { required: true, message: '学号不能为空' }
      ],
    });
    const studentNameProps = getFieldProps('studentName', {
      rules: [
        { required: true, message: '学生姓名不能为空'},
      ]
    });
    const radioProps = getFieldProps('sex', {
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
    let gradeList = grades.map(grade => <Option key={grade.id} value= {grade.id} >{grade.gradeName}</Option>);

    let clazzs = this.state.clazzData;
    let clazzList = clazzs.map(clazz => <Option key={clazz.id} value= {clazz.id} >{clazz.clazzName}</Option>);

    return (
      <div>
        <Button type="primary" onClick={this.showModal} className="add-btn">新增学生</Button>
        <Modal title="新增学生" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
          <Form horizontal form={this.props.form}>
          <FormItem className="formitem"
            {...formItemLayout}
            label="学号：">
            <Input id="studentNo" {...studentNoProps} type="text" placeholder="学号" />
          </FormItem>

          <FormItem className="formitem"
            {...formItemLayout}
            label="学生姓名：">
            <Input id="studentName" {...studentNameProps} type="text" placeholder="学生姓名" />
          </FormItem>

          <FormItem className="formitem"
            {...formItemLayout}
            label="性别：">
            <RadioGroup id="sex" {...radioProps}>
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem className="formitem"
            {...formItemLayout}
            label="生日：">
            <DatePicker {...birthdayProps} />
          </FormItem>

          <FormItem className="formitem"
            {...formItemLayout}
            label="所属年级：">
            <Select id="gradeId" style={{ width: 120 }} defaultValue="-1" value={this.state.addGrade} onChange={this.handleAddGradeChange}>
                <Option value="-1">请选择</Option>
                {gradeList}
            </Select>
          </FormItem>

          <FormItem className="formitem"
            {...formItemLayout}
            label="所属班级：">
            <Select id="clazzId" style={{ width: 120 }} defaultValue="-1" value={this.state.addClazz} onChange={this.handleAddClazzChange}>
                <Option value="-1">请选择</Option>
                {clazzList}
            </Select>
          </FormItem>

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

          <FormItem className="formitem"
            {...formItemLayout}
            label="父亲电话：">
            <Input id="dadPhone" {...dadPhoneProps} type="text" placeholder="父亲电话" />
          </FormItem>

          <FormItem className="formitem"
            wrapperCol={{ span: 12, offset: 7 }} >
            <Button type="ghost" onClick={this.handleReset}>重置</Button>
          </FormItem>
          <div className="cl"></div>
        </Form>
        </Modal>
      </div>
    );
  }
});

module.exports = StudentForm;
