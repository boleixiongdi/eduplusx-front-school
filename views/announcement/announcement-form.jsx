import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,textarea } from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;
import ReactQuill from 'react-quill';
import RaisedButton from 'material-ui/lib/raised-button';

const AnnouncementForm = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          gradeData: [],
          clazzData: [],
          addGrade:"0",
          addClazz:"0",
          pagination: {},
          loading: false,
          text:"",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "announcement/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
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
      this.setState({
          addGrade:"0",
          addClazz:"0"
      });
    },

    handleSubmit() {
      this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!');
          return;
        }
        this.setState({ visible: false });
        console.log('点击了保存按钮');
        let url= "announcement/save";
        let _data = {title:values.title, content:values.content
                    ,annRange:values.annRange,gradeId:this.state.addGrade, clazzId:this.state.addClazz};
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
        console.log("根据年级显示班级"+_data);
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
    handleAddGradeChange(value){
        this.setState({
          addGrade: value,
        });
        this.setState({
          addClazz: "0",
        });
        let _data = {grade_id:value};
        let type = "get";
        let clazzUrl= "clazz/queryByGradeId";
        console.log("根据年级显示班级"+_data);
        this.clazz_ajax(clazzUrl,type,_data);
    },

    handleAddClazzChange(value){
        this.setState({
          addClazz: value,
        });
    },
    onTextChange: function(value) {
      this.setState({ text:value });
      console.log(this.state.text);
    },

    render() {
        const { getFieldProps } = this.props.form;

        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        };

        const titleProps = getFieldProps('title', {
          rules: [
            { required: true, message: '标题为空' }
          ],
        });

        const annRangeProps = getFieldProps('annRange', {
          rules: [
            { required: true, message: '范围为空' }
          ],
        });
        const contentProps = getFieldProps('content', {
          rules: [
            { required: true, message: '内容为空' }
          ],
        });
        let grades = this.state.gradeData;
        let gradeList = grades.map(grade => <Option key={grade.pkid} value= {grade.pkid} >{grade.grade_name}</Option>);

        let clazzs = this.state.clazzData;
        let clazzList = clazzs.map(clazz => <Option key={clazz.pkid} value= {clazz.pkid} >{clazz.class_name}</Option>);
        return (
            <div>
                <Button type="primary" onClick={this.showModal} className="add-btn">新增公告</Button>
                <Modal title="新增公告" visible={this.state.visible}
                onOk={this.handleSubmit} onCancel={this.hideModal}>
                  <Form horizontal form={this.props.form}>
                  <div className="e-row-no">
                    <FormItem className="formitem"
                      {...formItemLayout}
                      label="标题：">
                      <Input id="add_title" {...titleProps} type="text" placeholder="标题" />
                    </FormItem>
                    <FormItem className="formitem"
                      {...formItemLayout}
                      label="范围：">
                      <Select id="add_annRange" {...annRangeProps} placeholder="请选择范围" style={{ width: '100%' }}>
                        <Option value="1">校级</Option>
                        <Option value="2">年级</Option>
                        <Option value="3">班级</Option>
                      </Select>
                    </FormItem>
                    <div className="cl"></div>
                  </div>
                  <div className="e-row-no">
                    <div className="s-row">
                      <div className="search-lb">
                          <label>所带班级：</label>
                      </div>
                      <Col span="4">
                        <Select id="gradeId" style={{ width: 95 }} defaultValue="0" value={this.state.addGrade} onChange={this.handleAddGradeChange}>
                            <Option value="0">请选择年级</Option>
                            {gradeList}
                        </Select>
                      </Col>
                      <Col span="4">
                        <Select id="clazzId" style={{ width: 120 }} defaultValue="0" value={this.state.addClazz} onChange={this.handleAddClazzChange}>
                            <Option value="0">请选择班级</Option>
                            {clazzList}
                        </Select>
                      </Col>
                      <div className="cl"></div>
                    </div>
                  </div>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="内容：">
                    <textarea style={{ width: 450 }} id="add_content" {...contentProps} type="text" placeholder="内容" />
                  </FormItem>
                  <div className="cl"/>
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

module.exports = AnnouncementForm;
