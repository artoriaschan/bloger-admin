import React, { PureComponent } from 'react'
import styles from './Welcome.less'

import welcome from '../../assets/welcome.jpg';

class Welcome extends PureComponent {
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={styles.welcome}>
        <img src={welcome} style={{width: "100%"}} alt="欢迎" />
      </div>
    )
  }
}

export default Welcome
