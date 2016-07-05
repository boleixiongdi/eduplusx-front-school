import 'antd/lib/index.css';
let React = require('react');
let ReactDOM = require('react-dom');
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
let Router = require('react-router');
let { Route, Redirect, RouteHandler, Link ,DefaultRoute} = Router;
let LeftNav = require('./views/common/left-nav.jsx');
let TopNav = require('./views/common/top-nav.jsx');
/* 系统管理 */
let Permission = require('./views/system/permission.jsx');
let Authorization = require('./views/system/authorization.jsx');
let Role = require('./views/system/role.jsx');
let User = require('./views/system/user.jsx');
let Source = require('./views/system/source.jsx');
let Dict = require('./views/system/dict.jsx');
let E_Menu = require('./views/system/menu.jsx');
let UserCenter = require('./views/system/user-center.jsx');

let Message = require('./views/message.jsx');
/* 公告管理 */
let Announcement = require('./views/announcement/announcement.jsx');
/* 考勤管理 */
let StudentAttendance = require('./views/attendance/student-attendance.jsx');
let TeacherAttendance = require('./views/attendance/teacher-attendance.jsx');
/* 班级管理 */
let ClazzInfo = require('./views/clazz/clazz-info.jsx');
/* 教师管理 */
let TeacherInfo = require('./views/teacher/teacher-info.jsx');
/* 学生管理 */
let StudentInfo = require('./views/student/student-info.jsx');
let PatriarchInfo = require('./views/student/patriarch-info.jsx');

/* 课程管理 */
let CourseInfo = require('./views/course/course-info.jsx');
/* 年级管理 */
let GradeInfo = require('./views/grade/grade-info.jsx');
/* 食谱管理 */
let RecipeInfo = require('./views/recipe/recipe-info.jsx');
/* 荣誉字典 */
let HonorInfo = require('./views/honor/honor-info.jsx');

const App = React.createClass({
  getInitialState() {
    return {
      current: 'mail'
    };
  },
  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key
    });
  },
  render() {
    return (
        <div>
          <TopNav></TopNav>
          <LeftNav></LeftNav>
          <section className="content">
            <RouteHandler />
          </section>
        </div>
    );
  }
});

var routes = (
    <Route path="/" handler={App}>
      <Route name="authorization" path="/sys/authorization" handler={Authorization}></Route>
      <Route name="role" path="/sys/role" handler={Role}></Route>
      <Route name="user" path="/sys/user" handler={User}></Route>
      <Route name="source" path="/sys/source" handler={Source}></Route>
      <Route name="dict" path="/sys/dict" handler={Dict}></Route>
      <Route name="menu" path="/sys/menu" handler={E_Menu}></Route>
      <Route name="userCenter" path="/sys/user/center" handler={UserCenter}></Route>

      <Route name="announcement" path="/announcement/" handler={Announcement}></Route>
      <Route name="studentAttendance" path="/attendance/student" handler={StudentAttendance}></Route>
      <Route name="teacherAttendance" path="/attendance/teacher" handler={TeacherAttendance}></Route>
      <Route name="teacherInfo" path="/teacher" handler={TeacherInfo}></Route>
      <Route name="studentInfo" path="/student" handler={StudentInfo}></Route>
      <Route name="patriarchInfo" path="/patriarch" handler={PatriarchInfo}></Route>
      <Route name="clazzInfo" path="/clazz" handler={ClazzInfo}></Route>
      <Route name="courseInfo" path="/course" handler={CourseInfo}></Route>
      <Route name="gradeInfo" path="/grade" handler={GradeInfo}></Route>
      <Route name="recipeInfo" path="/recipe" handler={RecipeInfo}></Route>
      <Route name="honorInfo" path="/honor" handler={HonorInfo}></Route>

      <DefaultRoute handler={Message}/>
    </Route>
);

Router.run(routes, function (Handler) {
  ReactDOM.render(<Handler/>, document.getElementById('app'));
});
