import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

import RaisedButton from 'material-ui/lib/raised-button';

const HonorForm = React.createClass({
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
        let url= "honor/list";
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
        let url= "honor/save";
        let _data = {honorName:values.honorName,honorType:values.honorType,honorDesc:values.honorDesc};
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

      const honorNameProps = getFieldProps('honorName', {
        rules: [
          { required: true, message: '荣誉名称为空' }
        ],
      });

      const honorTypeProps = getFieldProps('honorType', {
        rules: [
          { required: true, message: '荣誉类型为空' }
        ],
      });

      const honorDescProps = getFieldProps('honorDesc', {
        rules: [
          { required: true, message: '荣誉描述为空' }
        ],
      });


      return (
          <div>
              <Button type="primary" onClick={this.showModal} className="add-btn">新增荣誉</Button>
              <Modal title="新增荣誉" visible={this.state.visible}
              onOk={this.handleSubmit} onCancel={this.hideModal}>
                <Form horizontal form={this.props.form}>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="荣誉名称：">
                    <Input id="honorName" {...honorNameProps} type="text" placeholder="荣誉名称" />
                  </FormItem>

                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="荣誉名称：">
                    <Input id="honorDesc" {...honorDescProps} type="text" placeholder="荣誉描述" />
                  </FormItem>


                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="荣誉类型：">
                    <Select id="honorType" {...honorTypeProps} placeholder="荣誉类型" style={{ width: '100%' }}>
                      <Option value="1">校级</Option>
                      <Option value="2">年级</Option>
                      <Option value="3">班级</Option>
                    </Select>
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

module.exports = HonorForm;
