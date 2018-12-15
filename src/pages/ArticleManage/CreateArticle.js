import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
} from 'antd';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { queryArticle } from '@/services/api';
import 'simplemde/dist/simplemde.min.css';
import styles from './CreateArticle.less';

const FormItem = Form.Item;
const { Option } = Select;
// 参数配置
const articleTypes = ["私密文章", "公开文章", "简历", "管理员介绍"]
const articleOperators = ["草稿", "发布"]

@connect(({ article, tags, category, loading }) => ({
  article,
  tags,
  category,
  loading: loading.models.rule,
}))
@Form.create()
class CreateArticle extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      articleId: null,
      allCategory:[],  // 该用户创建的所有的分类
      allTags:[]  // 该用户创建的所有标签
    }
  }

	componentDidMount() {
    // 判断是否是含有articleId的路由
    const articleId = this.isEditArticle()
    this.setState({
      articleId
    })
    this.handleSearchTag()
    this.handleSearchCategory()
		this.state.smde = new SimpleMDE({
			element: document.getElementById('editor').childElementCount,
			autofocus: true,
			autosave: true,
			previewRender(plainText) {
				return marked(plainText, {
					renderer: new marked.Renderer(),
					gfm: true,
					pedantic: false,
					sanitize: false,
					tables: true,
					breaks: true,
					smartLists: true,
					smartypants: true,
					highlight(code) {
						return highlight.highlightAuto(code).value;
					},
				});
			},
		});
    if(articleId){
      this.handleQueryArticle(articleId)
    }
  }

  setSmdeValue(value) {
    const { smde } = this.state;
		smde.value(value);
	}

	getSmdeValue() {
    const { smde } = this.state;
		return smde.value();
	}

  isEditArticle = () => {
    const {location} = this.props
    return location.query.articleId
  }

  handleSearchTag = () => {
    const { dispatch, tags } = this.props
    const tagsList = tags.data.list
    if(tagsList.length === 0) {
      dispatch({
        type: 'tags/fetch',
        payload: {},
        callback: (res) => {
          const { data } = res
          this.setState({
            allTags: data.list
          })
        }
      });
    }else{
      this.setState({
        allTags: tagsList
      })
    }
  }

  handleSearchCategory = () => {
    const { dispatch, category } = this.props
    const categoryList = category.data.list
    if(categoryList.length === 0) {
      dispatch({
        type: 'category/fetch',
        payload: {},
        callback: (res) => {
          const { data } = res
          this.setState({
            allCategory: data.list
          })
        }
      });
    }else{
      this.setState({
        allCategory: categoryList
      })
    }
  }

  handleQueryArticle = (articleId) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    queryArticle({articleId}).then((response) => {
      console.log(response)
      const res = response.data
      // 恢复表单数据
      setFieldsValue({
        title: res.title,
        author: res.author.username,
        keywords: res.keywords,
        desc: res.desc,
        imgSrc: res.imgSrc,
      })
      this.setSmdeValue(res.content)
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    let postType = "add"
    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err)
        return;
      }
      let values = {}
      const { articleId } = this.state
      if(articleId) {
        postType = "update"
        values = {
          articleId
        };
      }
      values = Object.assign({
        num: this.getSmdeValue().length,
        content: this.getSmdeValue()
      }, values, fieldsValue)
      console.info(values)
      new Promise(resolve => {
        dispatch({
          type: `article/${postType}`,
          payload: values,
          callback: (res) => {
            resolve(res)
          }
        })
      }).then((res) => {
        const { history } = this.props;
        if(res.code === 1) {
          // message.success('发布文章成功,即将跳转文章列表');
          // setTimeout(() => {
          //   history.push("/articlemanage/articlelist")
          // }, 2500)
        }
      })
    });
  }

  // 创做文章时的选择项
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { allCategory, allTags } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入文章标题', whitespace: true }],
              })(
                <Input placeholder="请输入文章标题" />
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keywords')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="描述">
              {getFieldDecorator('desc', {
                rules: [{ required: true, message: '请输入文章描述', whitespace: true }],
              })(
                <Input placeholder="请输入文章描述" />
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="封面地址">
              {getFieldDecorator('cover', {
                rules: [{ required: true, message: '请输入封面地址', whitespace: true }],
              })(
                <Input placeholder="请输入封面地址" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="文章分类">
              {getFieldDecorator('articleCates', {
                rules: [{ required: true, message: '请选择文章分类', whitespace: true, type: "array" }],
              })(
                <Select
                  placeholder="请选择文章分类"
                  style={{ width: '100%' }}
                  mode="multiple"
                >
                  {allCategory.map((elem) => <Option value={elem.id} key={elem.id}>{elem.catename}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="文章标签">
              {getFieldDecorator('articleTags', {
                rules: [{ required: true, message: '请选择文章标签', whitespace: true, type: "array" }],
              })(
                <Select
                  placeholder="请选择文章标签"
                  style={{ width: '100%' }}
                  mode="multiple"
                >
                  {allTags.map((elem) => <Option value={elem.id} key={elem.id}>{elem.tagname}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="操作">
              {getFieldDecorator('articleOperator', {
                rules: [{ required: true, message: '请选择文章操作', whitespace: true, type: "number" }],
              })(
                <Select placeholder="请选择文章操作" style={{ width: '100%' }}>
                  {articleOperators.map((elem, index) => <Option value={index} key={elem}>{elem}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="文章类型">
              {getFieldDecorator('articleType', {
                rules: [{ required: true, message: '请选择文章类型', whitespace: true, type: "number" }],
              })(
                <Select placeholder="请选择文章类型" style={{ width: '100%' }}>
                  {articleTypes.map((elem, index) => <Option value={index} key={elem}>{elem}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <Button type="primary" htmlType="submit" style={{width: "100px", height: "40px"}}>提 交</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <PageHeaderWrapper title="文章创作">
        <Card bordered={false}>
          <div className={styles.createArticleForm}>{this.renderAdvancedForm()}</div>
          <div title="添加与修改文章" style={{paddingTop: "20px"}} className={styles.simpleMDE}>
            <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateArticle;
