import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> {new Date().getFullYear()} ArtoriasChan
  </Fragment>
);

class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.lang} />
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Blogger Admin</span>
              </Link>
            </div>
            <div className={styles.desc}>伤情最是晚凉天, 憔悴私人不堪怜</div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
