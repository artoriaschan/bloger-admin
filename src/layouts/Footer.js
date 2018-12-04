import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'github',
          title: (<span><Icon type="github" style={{marginRight: "5px"}} />Github地址</span>),
          href: 'https://github.com/artoriaschan',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> {new Date().getFullYear()} ArtoriasChan
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
