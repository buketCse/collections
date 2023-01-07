import React, { useRef } from 'react'
import cx from 'classnames'

// import { useOnClickOutside } from '../../../../../hooks'

import styles from './index.module.scss'

export default function EditableCell({ cell, className, onEditCell }) {
  const [value, setValue] = React.useState(cell.value)
  const [isEditable, setIsEditable] = React.useState(false)
  const inputRef = useRef(null)

  React.useEffect(() => {
    setValue(cell.value)
  }, [cell.value])

  // useOnClickOutside(inputRef, () => {
  //   setIsEditable(false)
  //   onEditCell(cell, value)
  // })

  function handleChange({ target: { value } }) {
    setValue(value)
  }

  function handleKeyDown({ key }) {
    if (key !== 'Enter') return

    setIsEditable(false)
    onEditCell(cell, value)
  }

  function handleDoubleClick(isEditable) {
    setIsEditable(true)
  }

  return isEditable ? (
    <input
      ref={inputRef}
      className={cx(className, styles.input)}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  ) : (
    <div
      className={styles.editableCell}
      onDoubleClick={(isEditable) => handleDoubleClick(isEditable)}
    >
      <i
        className={cx(
          [styles.icon],
          { [styles.catalogIcon]: cell.row.depth === 0 },
          { 'fa-fw fa fa-cubes': cell.row.depth === 0 },
          { 'fa-fw fa fa-list-ul': cell.row.depth === 1 },
          { 'fa-fw fa fa-file-o': cell.row.depth === 2 }
        )}
      />
      <span>{value}</span>
    </div>
  )
}
