import {ReactNode} from 'react';

export interface IListViewProps {
  title: ReactNode;
  listData: any;
}

export interface IListItemProps {
  title: string;
  description: string;
  Icon: any;
}
