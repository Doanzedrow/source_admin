import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { TableSkeleton } from './TableSkeleton';
import './AppTable.less';

export interface AppTableProps<RecordType> extends TableProps<RecordType> {
  hidePagination?: boolean;
  showSkeleton?: boolean;
  skeletonRows?: number;
}

interface AppTableComponent {
  <RecordType extends object>(props: AppTableProps<RecordType>): React.ReactElement;
  Summary: typeof Table.Summary;
  Column: typeof Table.Column;
  ColumnGroup: typeof Table.ColumnGroup;
}

export const AppTable: AppTableComponent = Object.assign(
  <RecordType extends object>({
    className,
    hidePagination,
    pagination,
    rowClassName,
    showSkeleton,
    skeletonRows = 10,
    ...props
  }: AppTableProps<RecordType>) => {
    if (showSkeleton) {
      return (
        <div className={`app-table-wrapper ${className || ''}`}>
          <TableSkeleton 
            rows={skeletonRows} 
            columns={props.columns?.length || 5} 
            compact={props.size === 'small' || props.size === 'middle'}
          />
        </div>
      );
    }

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
      <div className={`app-table-wrapper ${className || ''} ${props.loading ? 'loading-active' : ''}`}>
        <Table<RecordType>
          size="middle"
          scroll={{ x: 'max-content' }}
          sticky={{ offsetHeader: 0 }}
          pagination={
            hidePagination
              ? false
              : {
                  ...pagination,
                  showSizeChanger: false,
                }
          }
          rowClassName={getRowClassName}
          {...props}
        />
      </div>
    );
  },
  {
    Summary: Table.Summary,
    Column: Table.Column,
    ColumnGroup: Table.ColumnGroup,
  }
);
