
export default function generateDataTableColumns() {
  const columns = [
    {
      name: 'Store',
      selector: 'store',
      sortable: true,
      maxWidth: '25px',
      style: {
        color: 'red',
        fontWeight: 600
      }
    },
    {
      name: 'Price',
      selector: 'price',
      sortable: true,
      maxWidth: '25px',
      style: {
        color: '#4a148c',
        fontWeight: 600
      }
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: false,
      style: {
        fontWeight: 600
      }
    },
  ]
  return columns
}