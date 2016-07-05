import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const TeacherForm = React.createClass({
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
        let url= "teacher/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!');
          return;
        }
        this.setState({ visible: false });
        let url= "teacher/save";
        let _data = {teacherName:values.teacherName, phone:values.phone, teacherNo:values.teacherNo,
        email:values.email};
        let type = "post";
        this._ajax(url,type,_data);

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
    showModal() {
      this.setState({ visible: true });
    },

    hideModal() {
      this.setState({ visible: false });
    },

    render() {

        const { getFieldProps } = this.props.form;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        };
        const teacherNameProps = getFieldProps('teacherName', {
          rules: [
            { required: true, message: '教师姓名不能为空' }
          ],
        });
        const phoneProps = getFieldProps('phone', {
          rules: [
            { required: true, message: '手机号不能为空' }
          ],
        });
        const teacherNoProps = getFieldProps('teacherNo', {
          rules: [
            { required: true, message: '教师编号不能为空' }
          ],
        });
        const emailProps = getFieldProps('email', {
          rules: [
            { required: true, message: '邮箱不能为空' }
          ],
        });

        return (
            <div>
                <Button type="primary" onClick={this.showModal} className="add-btn">新增教师</Button>
                <Modal title="新增教师"
                  visible={this.state.visible}
                  onOk={this.handleSubmit}
                  onCancel={this.hideModal}>
                  <Form horizontal form={this.props.form}>
                    <FormItem className="formitem"
                      {...formItemLayout}
                      label="教师编号：">
                      <Input id="teacherNo" {...teacherNoProps} type="text" placeholder="教师编号" />
                    </FormItem>
                    <FormItem className="formitem"
                      {...formItemLayout}
                      label="教师姓名：">
                      <Input id="teacherName" {...teacherNameProps} type="text" placeholder="教师姓名" />
                    </FormItem>
                    <FormItem className="formitem"
                      {...formItemLayout}
                      label="手机号：">
                      <Input id="phone" {...phoneProps} type="text" placeholder="手机号" />
                    </FormItem>
                    <FormItem className="formitem"
                      {...formItemLayout}
                      label="邮箱：">
                      <Input id="email" {...emailProps} type="text" placeholder="邮箱" />
                    </FormItem>
                    <div className="cl"></div>
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

module.exports = TeacherForm;
