import React from 'react'

export default function DefaultColumnFilter({
  cell: { column: { preFilteredRows, setFilter } = {} }
}) {
  const [filterValue, setFilterValue] = React.useState('')

  const count = preFilteredRows.length

  return (
    <>
      <input
        className="w-100"
        placeholder={`${count} records...`}
        value={filterValue}
        onChange={({ target: { value = '' } }) => {
          setFilterValue(value)
          setFilter(value)
        }}
      />
    </>
  )
}
