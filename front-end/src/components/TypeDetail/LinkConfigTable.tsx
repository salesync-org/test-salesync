import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/Table/Table';
import Icon from '../ui/Icon/Icon';
import Button from '../ui/Button/Button';
import { memo } from 'react';
import Skeleton from '../ui/Skeleton/Skeleton';

interface ConfigTableProps {
  data: TypeRelation[] | undefined;
}

const LinkConfigTable = ({ data }: ConfigTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Link Type</TableHead>
          <TableHead>Label Name</TableHead>
          <TableHead>To Type</TableHead>
          <TableHead>Label Name</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className='font-medium'>{item.relationName}</TableCell>
              <TableCell>{item.type1Label}</TableCell>
              <TableCell>{item.type2Name}</TableCell>
              <TableCell>{item.type2Label}</TableCell>
              <TableCell className='w-4'>
                <Button
                  onClick={() => {}}
                  rounded
                  className='border-0 bg-transparent dark:border-0 dark:bg-transparent'
                >
                  <Icon name='chevron_right' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export const LinkConfigTableLoading = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Link Type</TableHead>
          <TableHead>To Type</TableHead>
          <TableHead>Label Name</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4].map((item) => (
          <TableRow key={item}>
            <TableCell colSpan={4} className='text-center'>
              <Skeleton width='100%' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const MemoizedLinkConfigTable = memo(LinkConfigTable);
export default MemoizedLinkConfigTable;