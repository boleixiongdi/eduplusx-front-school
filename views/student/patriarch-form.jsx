import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon } from 'antd';
const confirm = Modal.confirm;
const createForm = Form.create;
const FormItem = Form.Item;
import RaisedButton from 'material-ui/lib/raised-button';

const PatriarchForm = React.createClass({
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
        let url= "parent/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    showModal() {
        this.setState({
          visible: true
        });
    },

    handleSubmit() {
      this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!');
          return;
        }
        this.setState({ visible: false });
        let url= "parent/save";
        let _data = {name:values.name, phone:values.phone,childNos:values.childNos,studentNames:values.studentNames};
        let type = "get";
        this._ajax(url,type,_data);
      });
    },
    hideModal() {
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

        const nameProps = getFieldProps('name', {
          rules: [
            { required: true, message: '姓名不能为空' }
          ],
        });
        const phoneProps = getFieldProps('phone', {
          rules: [
            { required: true, message: '电话不能为空'},
          ]
        });
        const childNosProps = getFieldProps('childNos', {
          rules: [
            { required: true, message: '子女学号不能为空' }
          ],
        });
        const studentNamesProps = getFieldProps('studentNames', {
          rules: [
            { required: true, message: '子女姓名不能为空' }
          ],
        });
        return (
            <div>
                <Button type="primary" onClick={this.showModal} className="add-btn">新增家长</Button>
                <Modal title="新增家长"
                  visible={this.state.visible}
                  onOk={this.handleSubmit}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.hideModal}>
                    <Form horizontal form={this.props.form}>
                        <Row>
                            <FormItem className="formitem"
                              {...formItemLayout}
                              label="姓名：">
                              <Input id="name" {...nameProps} type="text" placeholder="姓名" />
                            </FormItem>

                            <FormItem className="formitem"
                              {...formItemLayout}
                              label="电话：">
                              <Input id="phone" {...phoneProps} type="text" placeholder="电话" />
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem className="formitem"
                              {...formItemLayout}
                              label="子女学号：">
                              <Input id="childNos" {...childNosProps} type="text" placeholder="子女学号" />
                            </FormItem>

                            <FormItem className="formitem"
                              {...formItemLayout}
                              label="子女姓名：">
                              <Input id="studentNames" {...studentNamesProps} type="text" placeholder="子女姓名" />
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

module.exports = PatriarchForm;
