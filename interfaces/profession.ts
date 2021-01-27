import {ReactNode} from 'react';

export interface IListViewProps {
  title: ReactNode;
  listData: any;
  navigation: any;
  nextScreen?: string;
  extraParams?: any;
  isLoading: boolean;
  from?: string;
}

export interface IListItemProps {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  navigation: any;
  nextScreen?: string;
  extraParams?: any;
  Level?: any;
  numOfCategories?: number;
  numOfWords?: number;
  from?: string;
}

export interface IProfessionsProps {
  id: number;
  title: string;
  description: string;
  icon?: string;
  total_training_sets: number;
}
