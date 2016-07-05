import 'antd/lib/index.css';
let React = require('react');
let ReactDOM = require('react-dom');
let Tree = require('./tree/Tree');
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon,TreeSelect } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';


const _data = [
    {
        "id": "account",
        "text": "账户管理",
        "icon": "user",
        "children": [
            {
                "id": "user_list",
                "text": "用户管理",
                "children": [
                    {
                        "id": "user_edit",
                        "text": "编辑"
                    }
                ]
            },
            {
                "id": "role_list",
                "text": "角色管理",
                "children": [
                    {
                        "id": "role_edit",
                        "text": "编辑"
                    },
                    {
                        "id": "role_delete",
                        "text": "删除"
                    }
                ]
            }
        ]
    },

    {
        "id": "sys",
        "text": "系统设置",
        "icon": "cogs",
        "children": [
            {
                "id": "system_log",
                "text": "系统日志"
            },
            {
                "id": "config_list",
                "text": "参数设置",
                "children": [
                    {
                        "id": "config_edit",
                        "text": "编辑"
                    },
                    {
                        "id": "config_delete",
                        "text": "删除"
                    }
                ]
            }
        ]
    }
];

const App = React.createClass({
  getInitialState() {
    return {
      readOnly: false,
      selectAble: true,
      greedy: false,
      sep: ',',
      value: 'role_delete',
      showValue: 'role_delete',
      treeData: null,
      visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false,
    };
  },

  showAddAuthorizationModal() {
        this.setState({
          visible: true
        });
    },

    addAuthorizationHandleOk() {
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
        }, 1000);
    },
    addAuthorizationHandleCancel() {
        console.log('点击了取消');
        this.setState({
          visible: false
        });
    },

    handleChange () {
    let value = JSON.stringify(this.refs.tree.getValue());
      this.setState({ showValue: value });
    },

    sepChange (sep) {
      this.setState({ sep });
      setTimeout(()=>this.handleChange(), 0);
    },
  
  render() {
    return (
        <div>
          <Tree ref="tree" data={_data}
            readOnly={this.state.readOnly}
            selectAble={this.state.selectAble}
            greedy={this.state.greedy}
            textTpl="{text}({id})"
            valueTpl="{id}"
            onClick={item => this.refs.textClick.getDOMNode().innerText = `clicked ${item.text}`}
            onChange={this.handleChange.bind(this)}
            value={this.state.value}
            open={true}
            sep={this.state.sep}
          />

          <div>value: {this.state.showValue}</div>
          <div ref="textClick"></div>

            <div className="console-title console-title-border">
                    <h5>权限管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddAuthorizationModal} className="add-btn">赋权限</Button>
                    </div>
                </div>

                <Modal title="新增用户"
                  visible={this.state.visible}
                  onOk={this.addAuthorizationHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addAuthorizationHandleCancel}>
                  <div className="search-lb">
                      <label>姓名：</label>
                  </div>
                  <Col span="4">
                  <Input id="name" placeholder="姓名" />
                  </Col>
                  <div className="search-lb">
                      <label>手机号：</label>
                  </div>
                  <Col span="4">
              
                  </Col>
                  <div className="cl"></div>
                </Modal>

        </div>
    );
  }
});

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          readOnly: false,
          selectAble: true,
          greedy: false,
          sep: ',',
          value: 'role_delete',
          showValue: 'role_delete',
          treeData: null,
          visible: false,
          editVisible: false,
          data : [],
          pagination: {},
          loading: false
        };
        this.showAddAuthorizationModal = this.showAddAuthorizationModal.bind(this);
        this.addAuthorizationHandleOk = this.addAuthorizationHandleOk.bind(this);
        this.addAuthorizationHandleCancel =this.addAuthorizationHandleCancel.bind(this);
    }

    showAddAuthorizationModal() {
      this.setState({ visible: true });
      
        
    }

    addAuthorizationHandleOk() {
        this.setState({
          confirmLoading: true
        });
        setTimeout(() => {
          this.setState({
           visible: false,
            confirmLoading: false
        })
          
        }, 1000);
    }
    addAuthorizationHandleCancel() {
        console.log('点击了取消');
        this.setState({
          visible: false
        });
    }

    render() {
        return (
            <div>
                <Tree ref="tree" data={_data}
                readOnly={this.state.readOnly}
                selectAble={this.state.selectAble}
                greedy={this.state.greedy}
                textTpl="{text}({id})"
                valueTpl="{id}"
                value={this.state.value}
                open={true}
                sep={this.state.sep}
              />

            <div className="console-title console-title-border">
                    <h5>权限管理</h5>
                    <div className="console-add">
                        <Button type="primary" onClick={this.showAddAuthorizationModal} className="add-btn">赋权限</Button>
                    </div>
                </div>

                <Modal title="新增用户"
                  visible={this.state.visible}
                  onOk={this.addAuthorizationHandleOk}
                  confirmLoading={this.state.confirmLoading}
                  onCancel={this.addAuthorizationHandleCancel}>
                  <div className="search-lb">
                      <label>姓名：</label>
                  </div>
                  <Col span="4">
                  <Input id="name" placeholder="姓名" />
                  </Col>
                  <div className="search-lb">
                      <label>手机号：</label>
                  </div>
                  <Col span="4">
              
                  </Col>
                  <div className="cl"></div>
                </Modal>

          </div>
    );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));

