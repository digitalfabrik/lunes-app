import {ReactNode} from 'react';

export interface IListViewProps {
  title: ReactNode;
  listData: any;
  navigation: any;
}

export interface IListItemProps {
  id: string;
  title: string;
  description: string;
  Icon?: any;
  navigation: any;
}
