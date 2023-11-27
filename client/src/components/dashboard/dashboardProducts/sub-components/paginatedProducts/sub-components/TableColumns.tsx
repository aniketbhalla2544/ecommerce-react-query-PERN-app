const TableColumns = () => {
  return (
    <thead>
      <tr className='border-0 border-b-[1px] border-gray-200'>
        <th scope='col' className='text-sm text-gray-600 px-4 py-3 text-left'></th>
        <th scope='col' className='text-sm text-gray-600 px-4 py-3 text-left'>
          Id
        </th>
        <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
          Image
        </th>
        <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
          Name
        </th>
        <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
          Description
        </th>
        <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
          Price
        </th>
        <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
          Delete
        </th>
        <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
          Edit
        </th>
      </tr>
    </thead>
  );
};

export default TableColumns;
