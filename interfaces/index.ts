import {ReactElement} from 'react';

export interface ILoadingProps {
  children: ReactElement;
  isLoading: boolean;
}

export interface IButtonProps {
  onPress: () => void;
  disabled?: boolean;
  children: ReactElement;
  theme?: string;
  style?: any;
  testID?: string;
}
export interface IPopoverProps {
  setIsPopoverVisible: (param: boolean) => void;
  isVisible: boolean;
  children: ReactElement;
}
