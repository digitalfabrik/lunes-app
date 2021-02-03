import {ReactNode} from 'react';

export interface ILoadingProps {
  children: ReactNode;
  isLoading: boolean;
}

export interface IButtonProps {
  onPress: () => void;
  disabled?: boolean;
  children: ReactNode;
  theme?: string;
}
export interface IPopoverProps {
  setIsPopoverVisible: (param: boolean) => void;
  isVisible: boolean;
  children: ReactNode;
}
