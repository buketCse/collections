import React from 'react'
import cx from 'classnames'

import TableBody from '../TableBody'
import TableData from '../TableData'
import TableFoot from '../TableFoot'
import TableHead from '../TableHead'
import TableHeader from '../TableHeader'
import TableRow from '../TableRow'

import { bs5ThemeOpts, rtV6ThemeOpts } from '../../utils/constants'
import ThemeContext from '../../contexts/themeContext'

import bs5Styles from './bs5.module.scss'
import rtV6Styles from './rt-v6.module.scss'

function getClassNames(className, theme) {
  const separator = ' '

  return className
    .split(separator)
    .map((currClassName) => {
      const themeStyles = theme === 'bs5' ? bs5Styles : rtV6Styles
      const themeOpts = theme === 'bs5' ? bs5ThemeOpts : rtV6ThemeOpts
      const isOptAvailable = themeOpts[currClassName]

      if (isOptAvailable) {
        return themeStyles[currClassName]
      }

      return currClassName
    })
    .join(separator)
}

function Table({ children, className, theme = 'bs5', ...props }) {
  return (
    <div className={getClassNames(className, theme)} {...props}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </div>
  )
}

Table.Body = TableBody
Table.Data = TableData
Table.Foot = TableFoot
Table.Head = TableHead
Table.Header = TableHeader
Table.Row = TableRow

export default Table
