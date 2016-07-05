import '../../node_modules/antd/lib/index.css';
import '../../public/css/common.css';
let React = require('react');
let ReactDOM = require('react-dom');
import { Menu, Icon, Dropdown } from 'antd';
const SubMenu = Menu.SubMenu;
let Router = require('react-router');
let { Route, Redirect, RouteHandler, Link ,DefaultRoute} = Router;

const TopNav = React.createClass({

    render() {

        const menu = (
            <Menu>
                <Menu.Item key="0">
                <Link className="control-item" to="userCenter">个人中心</Link>
                </Menu.Item>
                <Menu.Item key="1">
                <a target="_blank" href="logout">退出</a>
                </Menu.Item>
                <Menu.Divider/>
            </Menu>
        );

        return (
            <div className="header">
                <a className="logo">
                    <img src="https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg" />
                    潍坊城市云幼儿园管理平台
                </a>
                <div className="top-nav">
                    <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#">
                        <i className="fa fa-user fa-lg"></i>个人设置
                    </a>
                    </Dropdown>
                </div>

            </div>
        );
    }
});

module.exports = TopNav;
