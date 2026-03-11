import { Table } from 'antd';
import type { TableProps } from 'antd';
import './AppTable.less';

export interface AppTableProps<RecordType> extends TableProps<RecordType> {
  hidePagination?: boolean;
}

export const AppTable = <RecordType extends object>({ 
  className, 
  hidePagination,
  pagination,
  rowClassName,
  ...props 
}: AppTableProps<RecordType>) => {

  const getRowClassName = (record: RecordType, index: number, indent: number) => {
    const zebraClass = index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
    let customClass = '';
    
    if (typeof rowClassName === 'function') {
      customClass = (rowClassName as any)(record, index, indent);
    } else if (typeof rowClassName === 'string') {
      customClass = rowClassName;
    }
    
    return `${zebraClass} ${customClass}`.trim();
  };

  return (
    <div className={`app-table-wrapper ${className || ''}`}>
      <Table<RecordType>
        size="middle"
        scroll={{ x: 'max-content' }} 
        pagination={hidePagination ? false : {
          ...pagination,
          showSizeChanger: false
        }}
        rowClassName={getRowClassName}
        {...props}
      />
    </div>
  );
};
