import React from 'react';
import { Modal, Form, Input, Button, Checkbox,Row, Col, Table, Icon } from 'antd';
const confirm = Modal.confirm;
import RaisedButton from 'material-ui/lib/raised-button';

const UserCenter = React.createClass({
    getInitialState() {
        return {
          visible: false,
        };
    },

    componentDidMount: function() {

    },

    render() {

        return (
            <div>
                <div className="console-title console-title-border">
                    <h5>个人中心</h5>
                </div>
                <div className="search-wrap">
                    <div className="search-lb">
                        <label>姓名：</label>
                    </div>
                    <Col span="4">
                    <Input placeholder="姓名" id="search_name" />
                    </Col>

                    <div className="search-lb">
                        <label>手机号：</label>
                    </div>
                    <Col span="4">
                        <Input placeholder="手机号" id="search_mobile" />
                    </Col>
                    <div className="cl"></div>
                </div>

        </div>
        );
    },
});

module.exports = UserCenter;
