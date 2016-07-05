import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon, Select,
DatePicker, message, InputNumber, Radio, Cascader } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';
let _RecipeForm = require('./recipe-form.jsx');
let RecipeForm = createForm()(_RecipeForm);

const RecipeInfo = React.createClass({
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
        this._getData();
    },

    _getData(){
        console.log("获取数据");
        let url= "recipe/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    _ajax(url,type,_data){
        $.ajax({
            url: url,
            dataType: 'json',
            type: type,
            data: _data,
            contentType: "application/json; charset=utf-8",
            success: function(data) {
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

    searchRecipe(){
        console.log('点击了查询按钮');
        let url= "recipe/list";
        let _data = {recipe:$("#search_recipe").val(), time:$("#search_date").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },

        handleEditTimeChange(value){
            this.setState({
              edit_time: value,
            });
        },
    render() {
        self = this;
        function deleteConfirm(id,object) {
        let ss = id;
        console.log(ss);
          confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
              console.log('点击了确定删除按钮');
              $.ajax({
                  url: "recipe/delete/"+id,
                  dataType: 'json',
                  type: "get",
                  contentType: "application/json; charset=utf-8",
                  success: function(data) {
                    console.log(data.length);
                    console.log(data);
                    const pagination = self.state.pagination;
                    pagination.total = data.totalCount;
                    self.setState({
                      loading: false,
                      data: data,
                      pagination,
                    });

                  }.bind(this),
                  error: function(xhr, status, err) {
                    console.error("/delete/"+id, status, err.toString());
                  }.bind(this)
              });
            },
            onCancel() {}
          });
        }

        function showEditModal(id,object) {
          console.log(id);
          console.log('点击了编辑按钮');
          self.setState({editVisible: true});
          $.ajax({
              url: "recipe/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                console.log(data.length);
                console.log(data);
                $("#edit_recipe").val(data.recipe);
                self.setState({
                  edit_time: data.time,
                });
                $("#edit_id").val(data.id);
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          console.log('点击了提交按钮');
          console.log(self);
          let url= "recipe/edit";
          let _data = {id:$("#edit_id").val(),recipe:$("#edit_recipe").val(), time:self.state.edit_time};
          let type = "get";
          self._ajax(url,type,_data);

          self.setState({editVisible: false});
        };

        function editCancel(e) {
          console.log(e);
          self.setState({editVisible: false});
        };

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
        }, {
            title: '食谱',
            dataIndex: 'recipe',
            /*render(text) {
            return <a href="#">{text}</a>;
            }*/
        },{
            title: '日期',
                dataIndex: 'date'
        },{
            title: '时间',
                dataIndex: 'time'
        },{
            title: '图片',
                dataIndex: 'images'
        },{
            title: '操作',
            key: 'operation',
            render(text, record) {
              return (
                <span className="operation-cl">
                  <i className="fa fa-pencil fa-fw"></i><a onClick={showEditModal.bind(this,record.id)} value={record.id} >编辑</a>
                  <span className="ant-divider"></span>
                  <i className="fa fa-trash-o fa-fw"></i><a onClick={deleteConfirm.bind(this,record.id)} value={record.id}>删除</a>
                </span>
              );
            }
        }];

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>食谱管理</h5>
                    <div className="console-add">
                        <RecipeForm callbackParent={this._getData} />
                    </div>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>食谱：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="食谱" id="search_recipe" />
                    </Col>

                    <div className="search-lb">
                        <label>日期：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="日期" id="search_date" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchRecipe} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>

                <Modal title="编辑食谱信息" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="search-lb">
                      <label>食谱：</label>
                  </div>
                  <Col span="4">
                  <Input id="edit_id" type="hidden" />
                  <Input id="edit_recipe" placeholder="食谱" />
                  </Col>
                  <div className="search-lb">
                      <label>用餐时间：</label>
                  </div>
                  <Col span="4">
                  <Select id="edit_time" placeholder="请选择" value={this.state.edit_time} style={{ width: '100%' }} onChange={this.handleEditTimeChange}>
                    <Option value="早餐">早餐</Option>
                    <Option value="午餐">午餐</Option>
                    <Option value="晚餐">晚餐</Option>
                  </Select>
                  </Col>
                </Modal>
        </div>
        );
    },
});

module.exports = RecipeInfo;
