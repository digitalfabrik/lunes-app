import {ReactNode} from 'react';

export interface IMenuItemProps {
  selected: boolean;
  onPress: () => void;
  icon: string;
  title: string;
  children: ReactNode;
}
