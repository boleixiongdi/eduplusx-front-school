import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Upload, Icon, DatePicker,Select } from 'antd';
const confirm = Modal.confirm;
const createForm = Form.create;
const FormItem = Form.Item;
import RaisedButton from 'material-ui/lib/raised-button';

const RecipeForm = React.createClass({
    getInitialState() {
        return {
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
          imageUrl:"",
        };
    },

    componentDidMount: function() {
        this.setState({ loading: true });
        let url= "recipe/list";
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
        console.log('点击了查询按钮');
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
        let date = values.date.Format("yyyy-MM-dd");
        let url= "recipe/save";
        let _data = {recipe:values.recipe, date:date,time:values.time,images:$("#imgUrl").val()};
        let type = "get";
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

    render() {
        const props = {
          action: 'upload/qiupic',
          listType: 'picture',
          showUploadList:true,

          onChange(info) {
            info.fileList.push(info.file);
            if(info.file.response!=null){
              console.log($("#imgUrl").val());
              if($("#imgUrl").val()!=""){
                $("#imgUrl").val($("#imgUrl").val()+'*'+info.file.response);
              }else{
                $("#imgUrl").val(info.file.response);
              }
            }
            //self.setState({imageUrl: info.file.response});
            if (info.file.status !== 'uploading') {
              console.log(info.fileList);
            }
          },

        };

        function onChange(value) {
          console.log('选择了时间：', value);
        };

        const { getFieldProps } = this.props.form;

        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        };

        const recipeProps = getFieldProps('recipe', {
          rules: [
            { required: true, message: '食谱为空' }
          ],
        });
        const timeProps = getFieldProps('time', {
          rules: [
            { required: true, message: '用餐时间不能为空' }
          ],
        });
        const dateProps = getFieldProps('date', {
          rules: [
            {
              required: true,
              type: 'date',
              message: '日期不能为空',
            }
          ],
        });

        return (
            <div>
                <Button type="primary" onClick={this.showModal} className="add-btn">新增食谱</Button>
                <Modal title="新增食谱"
                  visible={this.state.visible}
                  onOk={this.handleSubmit} onCancel={this.hideModal}>
                  <Input id="imgUrl" type="hidden" />
                  <Form horizontal form={this.props.form}>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="食谱：">
                    <Input id="recipe" {...recipeProps} type="text" placeholder="食谱" />
                  </FormItem>

                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="用餐时间：">
                    <Select id="time" {...timeProps} placeholder="请选择用餐时间" style={{ width: '100%' }}>
                      <Option value="早餐">早餐</Option>
                      <Option value="午餐">午餐</Option>
                      <Option value="晚餐">晚餐</Option>
                    </Select>
                  </FormItem>
                  <FormItem className="formitem"
                    {...formItemLayout}
                    label="日期：">
                    <DatePicker {...dateProps} />
                  </FormItem>
                  <div className="search-lb">
                      <label>图片：</label>
                  </div>

                  <Upload {...props} id="imageUrl">
                    <Button type="ghost">
                      <Icon type="upload" /> 点击上传
                    </Button>
                  </Upload>
                  <div className="cl"></div>
                  </Form>
                </Modal>
            </div>
        );
    },
});

module.exports = RecipeForm;
