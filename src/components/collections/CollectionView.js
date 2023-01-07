import { useMemo } from 'react'
import GridView from '../../helpers/GridView'
import moment from 'moment'
import { faker } from '@faker-js/faker';

function CollectionView(props){

    const getCell = (cell) => {
        const {
          row: {
            depth,
            // original = {},
            // original: { IsLeaf = false }
          },
          column: { id: columnId}
        } = cell
        if (columnId === 'Product') {
          return (
            <div className="d-flex align-items-center" style={{ marginLeft: 15 * depth }}>
              <span><img style={{height:'60px'}} src={faker2.image.food()} alt={faker.commerce.productDescription()} /></span>
              <span style={{ marginLeft: '2px' }}> {cell.value}</span>
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
            accessor: 'Product',
            Header: 'Product',
            sortable: true,
            width: 280,
            height:60,
            Cell: getCell
          },
          {
            // AvailableStatus,
            accessor: 'Summary',
            Header: 'Summary',
            sortable: true,
            width: 100,
            height:60,
            Cell: getCell
          },
          {
            accessor: 'Term-1',
            Header: 'Term-1',
            sortable: true,
            width: 100,
            height:60,
            Cell: getCell
          },
          {
            accessor: 'Term-2',
            Header: 'Term-2',
            sortable: true,
            width: 150,
            Cell: getCell
          },
          {
            accessor: 'Term-3',
            Header: 'Term-3',
            sortable: true,
            width: 100,
            Cell: getCell
          }
        ],
        []
      )
    let products= []
    let i = 0
      for(i=0; i < 10; i++){
        let newObj={Product:faker.commerce.productName(),Summary:faker.commerce.price()}
        products.push(newObj)
      }
      console.log('products',products)
      const faker2=faker
debugger

    return (<GridView
    rowSelection
    className="Table tableHover"
    enableGlobalFilter
    columns={columns}
    data={products}
    globalFilterStyle={{
      borderWidth: '0px',
      fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
      fontSize: '12px',
      padding: '3px 7px',
      width: '100%'
    }}
    theme="bs5"
  />)
}

export default CollectionView