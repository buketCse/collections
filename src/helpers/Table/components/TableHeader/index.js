import React, { useContext } from 'react'
import cx from 'classnames'

import ThemeContext from '../../contexts/themeContext'

import bs5Styles from '../Table/bs5.module.scss'
import rtV6Styles from '../Table/rt-v6.module.scss'

export default function TableHeader({ children, className, isSorted, isSortedDesc, ...props }) {
  const theme = useContext(ThemeContext)
  const themeStyles = theme === 'bs5' ? bs5Styles : rtV6Styles

  return (
    <div
      className={cx(
        themeStyles.th,
        { [themeStyles.sortDesc]: isSorted && isSortedDesc },
        { [themeStyles.sortAsc]: isSorted && !isSortedDesc },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
