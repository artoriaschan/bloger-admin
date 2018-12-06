import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Button,
  Divider,
  Tag,
  Modal,
  message
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ArticleList.less';

const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ article, loading }) => ({
  article,
  loading: loading.models.rule,
}))
@Form.create()
class ArticleList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      width: 300
    },
    {
      title: '文章描述',
      dataIndex: 'desc',
      width: 400
    },
    {
      title: '文章类型',
      dataIndex: 'cates',
      filters: [
        {
          text: "前端",
          value: 0,
        }
      ],
      render(val){
        if(val) {
          return val.map((elem) => <Tag key={elem.id}>{elem.catename}</Tag>)
        }
        return ""
      },
      width: 100
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      filters: [
        {
          text: "前端",
          value: 0,
        }
      ],
      render(val){
        if(val) {
          return val.map((elem) => <Tag key={elem.id} color={elem.color}>{elem.tagname}</Tag>)
        }
        return ""
      },
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      width: 150
    },
    {
      title: '修改时间',
      dataIndex: 'updatetime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      width: 150
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => (this.handleRouteToEditor("1daw54dd645w68d4a65d14a5wd"))}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => {this.handleDeleteArticle(record)}}>删除</a>
        </Fragment>
      ),
      width: 120
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetch',
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
      type: 'article/fetch',
      payload: params,
    });
  };

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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleRouteToEditor = (articleId) => {
    const { history } = this.props;
    if(articleId) {
      history.push(`/articlemanage/createarticle?articleId=${articleId}`)
    }else{
      history.push("/articlemanage/createarticle")
    }
  }

  handleDeleteArticle = (record) => {
    const { dispatch } = this.props;
    this.showConfirm(`确认删除"${record.title}"这篇文章?`,
      () =>
        new Promise((resolve) => {
          dispatch({
            type: 'article/remove',
            payload: {
              key: record.key,
            },
            callback: (res) => {
              resolve(res)
            },
          });
        })
        .then(() => {
          message.success('删除文章成功');
        })
        .catch(() => {
          message.error('Oops errors!')
        })
    )
  }

  handleBatchDeleteArticles = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    this.showConfirm("确认删除所选的文章?", () => new Promise((resolve) => {
        dispatch({
          type: 'article/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: (res) => {
            this.setState({
              selectedRows: [],
            });
            resolve(res)
          },
        });
      }).then(() => {
        message.success('删除文章成功');
      }).catch(() => {
        message.error('Oops errors!')
      })
    )
  };

  render() {
    const {
      article: { data },
      loading,
    } = this.props;
    const { selectedRows, } = this.state;
    return (
      <PageHeaderWrapper title="文章列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => (this.handleRouteToEditor())}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleBatchDeleteArticles}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
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

export default ArticleList;
