import 'antd/lib/index.css';
let React = require('react');
let ReactDOM = require('react-dom');
let Tree = require('./Tree');


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
  
  render() {
    return (
        <div>

            wewe
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
    }
    handleChange () {
    let value = JSON.stringify(this.refs.tree.getValue());
      this.setState({ showValue: value });
    }

    sepChange (sep) {
      this.setState({ sep });
      setTimeout(()=>this.handleChange(), 0);
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
                onClick={item => this.refs.textClick.getDOMNode().innerText = `clicked ${item.text}`}
              onChange={this.handleChange.bind(this)}
              />
              <div>value: {this.state.showValue}</div>
          <div ref="textClick"></div>
          </div>
    );
    }
}

ReactDOM.render(<Message/>, document.getElementById('app'));

