import {ReactNode} from 'react';

export interface IListViewProps {
  title: ReactNode;
  listData: any;
  navigation: any;
  nextScreen: string;
  extraParams?: any;
  isLoading: boolean;
}

export interface IListItemProps {
  id: number;
  title: string;
  description: string;
  Icon?: any;
  navigation: any;
  nextScreen: string;
  extraParams?: any;
}

export interface IProfessionsProps {
  id: number;
  title: string;
  description: string;
  Icon?: string;
}

//This will be removed when icons are ready in the API
export interface IIconsProps {
  id: number;
  Icon: string;
}
