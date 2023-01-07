import React, { useContext } from 'react'
import cx from 'classnames'

import ThemeContext from '../../contexts/themeContext'

import bs5Styles from '../Table/bs5.module.scss'
import rtV6Styles from '../Table/rt-v6.module.scss'

export default function TableBody({ children, className, ...props }) {
  const theme = useContext(ThemeContext)
  const themeStyles = theme === 'bs5' ? bs5Styles : rtV6Styles

  return (
    <div className={cx(themeStyles.tbody, className)} {...props}>
      {children}
    </div>
  )
}
