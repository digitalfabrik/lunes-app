import {ReactNode} from 'react';

export interface IListViewProps {
  title: ReactNode;
  listData: any;
  navigation: any;
  nextScreen?: string;
  extraParams?: any;
  isLoading: boolean;
  fromExercises?: boolean;
}

export interface IListItemProps {
  id: number;
  title: string;
  description: string;
  icon?: any;
  navigation: any;
  nextScreen?: string;
  extraParams?: any;
  Level?: any;
}

export interface IProfessionsProps {
  id: number;
  title: string;
  description: string;
  icon?: string;
}
