import { useMemo } from 'react'
import GridView from '../../helpers/GridView'
import moment from 'moment'

function CollectionView(props){

    const getCell = (cell) => {
        const {
          row: {
            depth,
            original = {},
            original: { IsLeaf = false }
          },
          column: { id: columnId}
        } = cell
        if (columnId === 'Name') {
          return (
            <div className="d-flex align-items-center" style={{ marginLeft: 15 * depth }}>
              {/* {!IsLeaf && <span>{getExpanderCell(cell)}</span>} */}
              <span style={{ marginLeft: '2px' }}> {cell.value}</span>
            </div>
          )
        } else if (columnId === 'CreateTime') {
          return (
            <div className="d-flex align-items-center">
              <span style={{ marginLeft: '2px' }}>
                {' '}
                {cell.value ? moment(cell.value).format('DD.MM.YYYY') : ''}
              </span>
            </div>
          )
        } else {
          return (
            <div className="d-flex align-items-center">
              <span style={{ marginLeft: '2px' }}> {cell.value}</span>
            </div>
          )
        }
      }

    const columns = useMemo(
        () => [
          {
            accessor: 'Name',
            Header: 'Name',
            sortable: true,
            width: 280,
            Cell: getCell
          },
          {
            // AvailableStatus,
            accessor: 'Status',
            Header: 'Status',
            sortable: true,
            width: 100,
            Cell: getCell
          },
          {
            accessor: 'Description',
            Header: 'Description',
            sortable: true,
            width: 100,
            Cell: getCell
          },
          {
            accessor: 'UserName',
            Header: 'User Name',
            sortable: true,
            width: 150,
            Cell: getCell
          },
          {
            accessor: 'CreateTime',
            Header: 'Create Time',
            sortable: true,
            width: 100,
            Cell: getCell
          }
        ],
        []
      )

      const MainNode = useMemo(
        () => [
          {
            Name: 'All Assortments',
            Description: '',
            UserName: '',
            Status: 'FOLDER',
            Id: 0,
            CreateTime: null,
            Children:[],
            // Children: _.isNil(recentAssortments) ? [Root] : _.concat(recentAssortments, Root),
            MainNode: true,
            nodeType: 0
          }
        ],
        []
        // [Root]
      )

    const gridView= <GridView
    rowSelection
    className="Table tableHover"
    enableGlobalFilter
    columns={columns}
    data={MainNode}
    // getRowStyle={(row) => getRowStyle(row, selectedCurrentScenario)}
    // getCellClass={getCellClass}
    globalFilterStyle={{
      borderWidth: '0px',
      fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
      fontSize: '12px',
      padding: '3px 7px',
      width: '100%'
    }}
    getSubRows={(row) => row.Children}
    // initialState={{
    //   expanded: expandedRows
    // }}
    // rowClicked={handleRowClicked}
    theme="bs5"
  />

    return gridView
}

export default CollectionView