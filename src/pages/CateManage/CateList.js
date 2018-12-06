import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Modal,
  message,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../styles/TableList.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 创建分类弹窗
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="创建分类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
        {form.getFieldDecorator('catename', {
          rules: [{ required: true, message: '请输入分类名称！'}],
        })(<Input placeholder="请输入分类名称" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ category , loading }) => ({
  category,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '分类名称',
      dataIndex: 'catename',
    },
    {
      title: '创建人',
      dataIndex: 'creater',
      render(val) {
        return <span>{val ? val.username : ""}</span>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '修改时间',
      dataIndex: 'updatetime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={this.handleModalVisible}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDeleteCate(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  }

  showConfirm = (title, ok) => {
    confirm({
      title,
      content: '删除后无法恢复,确认删除请点击确认',
      onOk() {
        return ok ? ok() : null
      },
      onCancel() {},
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
      type: 'category/fetch',
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
      type: 'category/fetch',
      payload: {},
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    this.showConfirm("确认批量删除所选的分类?",
      () =>
        new Promise((resolve) => {
          dispatch({
            type: 'category/remove',
            payload: {
              id: selectedRows.map(row => row.id),
            },
            callback: (res) => {
              this.setState({
                selectedRows: [],
              });
              resolve(res)
            },
          });
        })
        .then(() => {
          message.success('删除分类成功');
        })
        .catch(() => {
          message.error('Oops errors!')
        })
    )
  };

  handleDeleteCate = (record) => {
    const { dispatch } = this.props
    const { id, catename} = record
    console.log(record)
    this.showConfirm(`确认删除"${catename}"分类?`,
      () =>
        new Promise((resolve) => {
          dispatch({
            type: 'category/remove',
            payload: {
              id
            },
            callback: (res) => {
              resolve(res)
            },
          });
        })
        .then(() => {
          message.success('删除分类成功');
        })
        .catch(() => {
          message.error('Oops errors!')
        })
    )
  }

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
        catename: fieldsValue.catename ? fieldsValue.catename : "",
        createtimeRange: fieldsValue.createtimeRange ? fieldsValue.createtimeRange.map(elem => elem.valueOf()) : []
      };
      console.log(values)
      if(!values.createtimeRange && !values.catename) return
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'category/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/add',
      payload: {
        catename: fields.catename,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="分类名称">
              {getFieldDecorator('catename')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={11} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createtimeRange')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      category: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper title="分类列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleBatchDelete}>批量删除</Button>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
