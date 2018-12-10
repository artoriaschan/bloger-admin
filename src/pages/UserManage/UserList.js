import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Icon,
  Button,
  Dropdown,
  Menu,
  Divider,
  Avatar,
  Modal,
  message
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../styles/TableList.less';

const { confirm } = Modal;

// 用户权限
const userTypes = [{type: 1, name: "普通用户"}, {type: 2, name: "管理员"}]

function getTextByObjectList (list, sourceField, value, targetField){
  for(let i = 0; i < list.length; i += 1) {
    if(list[i][sourceField] === value) {
      return list[i][targetField]
    }
  }
  return null
}
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ userlist, loading }) => ({
  userlist,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {

  columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '权限',
      dataIndex: 'type',
      filterMultiple: false,
      filters: userTypes.map((elem) => ({
          text: elem.name,
          value: elem.type
      })),
      render(val, /* col 行数据 */) {
        return getTextByObjectList(userTypes, "type", val, "name") || "未知用户"
      }
    },
    {
      title: '状态',
      dataIndex: 'freezen',
      filterMultiple: false,
      filters: [{
          text: "冻结",
          value: true,
        },{
          text: "正常",
          value: false,
        }
      ],
      render(val){
        return val ? "冻结" : "正常"
      }
    },
    {
      title: '注册时间',
      dataIndex: 'registertime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: val => val ? <Avatar src={val} size={32} /> : <Avatar icon="user" size={32} />
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <a onClick={() => {this.handleDeleteUser(record)}}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => {this.handleFreezeUser(record)}}>{record.freezen ? "解冻" : "冻结"}</a>
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props)
    this.state = {
      expandForm: false,
      selectedRows: [],
      formValues: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'userlist/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userlist/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'userlist/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'userlist/fetch',
        payload: values,
      });
    });
  };

  showConfirm = (title, ok) => {
    confirm({
      title,
      content: '删除后无法恢复,确认删除请点击确认',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        return ok ? ok() : null
      },
      onCancel() {},
    });
  }

  handleDeleteUser = (record) => {
    const { dispatch } = this.props;
    this.showConfirm(`确认删除"${record.email}"这个用户吗?`,
      () =>
        new Promise((resolve) => {
          dispatch({
            type: 'userlist/remove',
            payload :{
              id: record.id,
            },
            callback: (res) => {
              resolve(res)
            },
          });
        })
        .then(() => {
          message.success('删除用户成功');
        })
        .catch(() => {
          message.error('删除用户失败')
        })
    )
  }

  handleFreezeUser = (record) => {
    const { dispatch } = this.props;
    if (!record.freezen) {
      this.showConfirm(`确认冻结"${record.email}"这个用户吗?`,
        () =>
          new Promise((resolve) => {
            dispatch({
              type: 'userlist/freeze',
              payload :{
                id: record.id,
              },
              callback: (res) => {
                resolve(res)
              },
            });
          })
          .then(() => {
            message.success('冻结用户成功');
          })
          .catch(() => {
            message.error('冻结用户失败')
          })
      )
    }else{
      console.log("解冻")
    }
  }

  render() {
    const {
      userlist: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderWrapper title="用户查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
