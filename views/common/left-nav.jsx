import '../../node_modules/antd/lib/index.css';
let React = require('react');
let ReactDOM = require('react-dom');
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
let Router = require('react-router');
let { Route, Redirect, RouteHandler, Link ,DefaultRoute} = Router;

const LeftNav = React.createClass({
    getInitialState() {
        return {
            current: '1',
            openKeys: [],
            menuData:[]
        };
    },
    componentDidMount: function() {
    	$.ajax({
            url: "menu/list/leftmenu",
            dataType: 'json',
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
              console.log(data.length);
              console.log(data);
              this.setState({
                menuData: data,
              });

            }.bind(this),
            error: function(xhr, status, err) {
              console.error("menu/list/leftmenu", status, err.toString());
            }.bind(this)
        });
    },

    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key,
            openKeys: e.keyPath.slice(1)
        });
    },
    onToggle(info) {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
        });
    },
    sleepFunc: function (numberMillis) {
       var now = new Date();
       var exitTime = now.getTime() + numberMillis;
       while (true) {
           now = new Date();
           if (now.getTime() > exitTime)    return;
        }
    },

    vedioClick() {
        console.log("vedio");
        $.ajax({
              url: "vedio/vedioLogin",
              dataType: 'json',
              type: "get",
              contentType: "application/json; charset=utf-8",
              success: function(data) {
                var n = data.userName;
                var p = data.password;
                var s = data.schoolId;
                window.location = "http://121.42.138.60:8090/zzb/index.php?m=Admin&c=Public&a=LO&loginFlag=1&username="+ n +"&password="+ p +"&school_id="+s;
              }.bind(this),
              error: function(xhr, status, err) {
              return false;
                alert("解析失败")
              }.bind(this)
          });
    },






    render() {

    	let _menuData = this.state.menuData;
        let menuList = _menuData.map(menu => <SubMenu key={menu.id} title={<span><i className={menu.menuIcon}></i><span className="pl10">{menu.menuName}</span></span>}>
                    	 {menu.menus.map(subMenu =>
                    		<Menu.Item key={subMenu.id}><Link className="control-item" to={subMenu.menuPath}>{subMenu.menuName}</Link></Menu.Item>
                    	)}
                </SubMenu>);
                authority();
                function authority() {
                    $.ajax({
                        url: "user/authority",
                        dataType: 'json',
                        type: "get",
                        contentType: "application/json; charset=utf-8",
                        success: function(data) {
                          //console.log(data.flag);
                          if(data.flag==1){
                            $('.delete').parents(".ant-menu-submenu-inline").hide();
                            $('.delete2').parent().hide();
                          }

                        }.bind(this),
                        error: function(xhr, status, err) {
                          alert("解析失败");
                        }.bind(this)
                    });

                };

        return (
            <div className="ant-menu ant-menu-inline  ant-menu-light ant-menu-root left-nav-wrap">
            <Menu onClick={this.handleClick}
            style={{ width: 240 }}
            openKeys={this.state.openKeys}
            onOpen={this.onToggle}
            onClose={this.onToggle}
            selectedKeys={[this.state.current]}
            mode="inline">
            	  {menuList}

                <SubMenu key="sub2" title={<span><i className="fa fa-volume-up fa-lg"></i><span className="pl10">公告管理</span></span>}>
                    <Menu.Item key="5"><Link className="control-item" to="announcement">公告列表</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub10" title={<span><i className="fa fa-volume-up fa-lg"></i><span className="pl10">荣誉管理</span></span>}>
                    <Menu.Item key="18"><Link className="control-item" to="honorInfo">荣誉列表</Link></Menu.Item>
                </SubMenu>

                <SubMenu key="sub3" title={<span><i className="fa fa-street-view fa-lg"></i><span className="pl10">考勤管理</span></span>}>
                    <Menu.Item key="7"><Link className="control-item delete2" to="teacherAttendance">教师考勤</Link></Menu.Item>
                    <Menu.Item key="8"><Link className="control-item" to="studentAttendance">学生考勤</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" title={<span><i className="fa fa-cubes fa-lg"></i><span className="pl10">食谱管理</span></span>}>
                    <Menu.Item key="9"><Link className="control-item" to="recipeInfo">食谱管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub5" title={<span><i className="fa fa-book fa-lg"></i><span className="pl10 delete">课程管理</span></span>}>
                    <Menu.Item key="10"><Link className="control-item" to="courseInfo">课程管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub6" title={<span><i className="fa fa-users fa-lg"></i><span className="pl10 delete">教师管理</span></span>}>
                    <Menu.Item key="11"><Link className="control-item" to="teacherInfo">教师列表</Link></Menu.Item>
                    <Menu.Item key="12"><Link className="control-item" to="teacherAttendance">教师考勤</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub7" title={<span><i className="fa fa-object-ungroup fa-lg"></i><span className="pl10">班级管理</span></span>}>
                    <Menu.Item key="13"><Link className="control-item" to="clazzInfo">班级列表</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub8" title={<span><i className="fa fa-mortar-board fa-lg"></i><span className="pl10">学生管理</span></span>}>
                    <Menu.Item key="14"><Link className="control-item" to="studentInfo">学生管理</Link></Menu.Item>
                    <Menu.Item key="17"><Link className="control-item" to="patriarchInfo">家长管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub9" title={<span><i className="fa fa-cc fa-lg"></i><span className="pl10">年级管理</span></span>}>
                    <Menu.Item key="15"><Link className="control-item" to="gradeInfo">年级管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub9" title={<span><i className="fa fa-cc fa-lg"></i><span className="pl10">年级管理</span></span>}>
                    <Menu.Item key="15"><Link className="control-item" to="gradeInfo">年级管理</Link></Menu.Item>
                </SubMenu>
            </Menu>
             <a className="videoUrlStyle" target="_blank" onClick={this.vedioClick}>视频管理</a>
            </div>
        );
    }
});

module.exports = LeftNav;
