import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

import RaisedButton from 'material-ui/lib/raised-button';

const GradeForm = React.createClass({
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
        let url= "grade/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
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
        if (!!errors) {
          console.log('Errors in form!!!');
          return;
        }
        this.setState({ visible: false });
        let url= "grade/save";
        let _data = {grade_name:values.grade_name};
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

    render() {

      const { getFieldProps } = this.props.form;

      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };

      const grade_nameProps = getFieldProps('grade_name', {
        rules: [
          { required: true, message: '年级名称' }
        ],
      });

      return (
          <div>
              <Button type="primary" onClick={this.showModal} className="add-btn">新增年级</Button>
              <Modal title="新增年级" visible={this.state.visible}
              onOk={this.handleSubmit} onCancel={this.hideModal}>
                <Form horizontal form={this.props.form}>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="年级名称：">
                    <Input id="grade_name" {...grade_nameProps} type="text" placeholder="年级名称" />
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
    },
});

module.exports = GradeForm;
