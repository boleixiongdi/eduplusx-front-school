import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const StudentAttendance = React.createClass({
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
        let url= "student/attendance/list";
        let _data = {};
        let type = "get";
        this._ajax(url,type,_data);
    },

    showAddUserModal() {
        this.setState({
          visible: true
        });
    },

    addUserHandleOk() {
        console.log('保存用户信息');
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
        }, 1000);

        console.log('点击了查询按钮');
        let url= "user/save";
        let _data = {name:$("#name").val(), mobile:$("#mobile").val()};
        let type = "get";
        this._ajax(url,type,_data);
    },
    addUserHandleCancel() {
        console.log('点击了取消');
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

    searchUsers(){
        console.log('点击了查询按钮');
        let url= "student/attendance/list";
        let _data = {studentNo:$("#search_studentNo").val(), studentName:$("#search_studentName").val(), clazzName:$("#search_clazzName").val()};
        let type = "get";
        this._ajax(url,type,_data);
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
                  url: "user/delete/"+id,
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

        function edit(){
          alert("ok");
        }

        function showEditModal(id,object) {
          console.log(id);
          self.setState({editVisible: true});
          $.ajax({
              url: "student/attendance/edit/"+id,
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                console.log(data.length);
                console.log(data);
                var img=data.arrivedPic;
                if(null == img){
                  $('.attImg img').attr("src","http://songhao888.cn/noimg.jpg");
                }else{
                  $('.attImg img').attr("src",img);
                }
              }.bind(this),
              error: function(xhr, status, err) {
                console.error("/delete/"+id, status, err.toString());
              }.bind(this)
          });

        };
        function editSubmit() {
          console.log('点击了提交按钮');
          console.log(self);
          let url= "user/edit";
          let _data = {id:$("#edit_id").val(),name:$("#edit_name").val(), mobile:$("#edit_mobile").val()};
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
            title: '学号',
            dataIndex: 'studentNo',
        }, {
            title: '姓名',
                dataIndex: 'studentName'
        }, {
            title: '班级',
                dataIndex: 'clazzName'
        }, {
            title: '到校时间',
                dataIndex: 'arrivedTime'
        },{
            title: '操作',
            key: 'operation',
            render(text, record) {
              return (
                <span className="operation-cl">
                  <i className="fa fa-pencil fa-fw"></i><a onClick={showEditModal.bind(this,record.id)} value={record.id} >考勤照片</a>
                </span>
              );
            }
        }];

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>学生考勤管理</h5>
                </div>

                <div className="search-wrap">
                    <div className="search-lb">
                        <label>学号：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="学号" id="search_studentNo" />
                    </Col>
                    <div className="search-lb">
                        <label>姓名：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="姓名" id="search_studentName" />
                    </Col>
                    <div className="search-lb">
                        <label>班级名称：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="班级名称" id="search_clazzName" />
                    </Col>

                    <div className="search-qr">
                        <Button type="primary" onClick={this.searchUsers} >查询</Button>
                    </div>
                    <div className="cl"></div>
                </div>

                <div className="">
                    <Table columns={columns} dataSource={this.state.data}
                                             pagination={this.state.pagination}
                                             loading={this.state.loading}/>
                </div>
                <Modal title="查看图片" visible={this.state.editVisible}
                  onOk={editSubmit} onCancel={editCancel}>
                  <div className="attImg">
                      <img src=""/>
                  </div>

                </Modal>
        </div>
        );
    },
});

module.exports = StudentAttendance;
