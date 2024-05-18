/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';
import Icon from 'components/ui/Icon/Icon';
import { Link, useParams } from 'react-router-dom';
import { Checkbox } from 'components/ui/Checkbox';

export type AccountColumns = {
  id: string;
  accountName: string;
  phone: string;
  accountOwnerAlias: string;
};

export const createTableLayout = (companyName: string): ColumnDef<AccountColumns>[] => {
  const { domainName } = useParams();
  const accountColumns: ColumnDef<AccountColumns>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: () => <span></span>
    },
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className='grid place-content-center rounded-[2px]'
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className='grid place-content-center rounded-[2px]'
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'accountName',
      header: ({ column }) => (
        <div
          className='flex items-center justify-between'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className=''>Account Name</span>
          <Icon name='expand_more' />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <Link
            to={`/${companyName}/section/${domainName}/record/${row.getValue('id')}`}
            className='block w-full items-center align-middle text-blue-500 hover:underline'
          >
            {row.getValue('accountName')}
          </Link>
        );
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <div
          className='flex items-center justify-between'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className=''>Phone</span>
          <Icon name='expand_more' />
        </div>
      )
    },
    {
      accessorKey: 'accountOwnerAlias',
      header: ({ column }) => (
        <div
          className='flex items-center justify-between'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className=''>Account Owner Alias</span>
          <Icon name='expand_more' />
        </div>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <div className='flex aspect-square w-8 cursor-pointer items-center justify-center rounded-[4px] border'>
          <Icon name='arrow_drop_down' size='32px' />
        </div>
      )
    }
  ];
  return accountColumns;
};
