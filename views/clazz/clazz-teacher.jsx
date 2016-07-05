import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const ClazzTeacher = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          teacherListData:[],
          teacherId:"请选择",
          position:"请选择",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let _data = {};
        let type = "get";
        let url_teacher= "teacher/list";
        this.teacher_ajax(url_teacher,type,_data);
    },

    showModal() {
        this.setState({
          visible: true,
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
    handleTeacherIdChange(value){
        this.setState({
          teacherId: value,
        });
    },
    handlePositionChange(value){
        this.setState({
          position: value,
        });
    },
    handleSubmit() {
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
        }, 1000);

        let url= "clazz/saveClazzTeacher";
        let _data = {clazzId:$("#clazzId_hid").val(),teacherId:this.state.teacherId,position:this.state.position,content:$("#content").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    hideModal() {
        console.log('点击了取消');
        this.setState({
          visible: false
        });
    },
    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        };

        let teachers = this.state.teacherListData;
        let teacherList = teachers.map(teacher => <Option key={teacher.id} value= {teacher.id} >{teacher.teacherName}</Option>);

        return (
            <div>
              <Button type="primary" onClick={this.showModal} className="add-btn">新增教师</Button>
              <div className="cl"></div>
              <Modal title="新增教师" visible={this.state.visible}
              onOk={this.handleSubmit} onCancel={this.hideModal}>
                <Form horizontal form={this.props.form}>
                  <div className="e-row">
                      <div className="search-lb">
                          <label>职位：</label>
                      </div>
                      <Col span="6">
                          <Select id="position" style={{ width: 150 }} defaultValue="-1" value={this.state.position} onChange={this.handlePositionChange}>
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
                          <Select id="teacherId" style={{ width: 150 }} defaultValue="-1" value={this.state.teacherId} onChange={this.handleTeacherIdChange}>
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
                  <Col span="13">
                      <Input id="content" placeholder="职责描述" />
                  </Col>
                  </div>
                </Form>
              </Modal>
            </div>
        );
    },
});

module.exports = ClazzTeacher;
