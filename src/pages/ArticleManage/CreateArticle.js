import React, { PureComponent } from 'react'
import { connect } from 'dva';
import styles from './CreateArticle.less';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class CreateArticle extends PureComponent {
  render() {
    return (
      <div className={styles["create-article"]}>
        文章创作
      </div>
    )
  }
}

export default CreateArticle;
