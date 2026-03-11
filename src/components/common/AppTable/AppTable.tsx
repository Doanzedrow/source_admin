import { Table } from 'antd';
import type { TableProps } from 'antd';
import './AppTable.less';

export interface AppTableProps<RecordType> extends TableProps<RecordType> {
  // Bạn có thể mở rộng Props ở đây sau này nếu cần thiết
  hidePagination?: boolean;
}

export const AppTable = <RecordType extends object>({ 
  className, 
  hidePagination,
  pagination,
  ...props 
}: AppTableProps<RecordType>) => {

  return (
    <div className={`app-table-wrapper ${className || ''}`}>
      <Table<RecordType>
        size="middle"
        scroll={{ x: 'max-content' }} 
        pagination={hidePagination ? false : {
          ...pagination,
          showSizeChanger: false
        }}
        {...props}
      />
    </div>
  );
};
