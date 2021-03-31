import {
  React,
  Popover,
  PopoverPlacement,
  styles,
  IPopoverProps,
} from './imports';

const AlertPopover = React.forwardRef(
  ({children, isVisible, setIsPopoverVisible}: IPopoverProps, ref) => (
    <Popover
      isVisible={isVisible}
      onRequestClose={() => setIsPopoverVisible(false)}
      from={ref}
      placement={PopoverPlacement.TOP}
      arrowStyle={styles.arrow}
      arrowShift={-0.85}
      verticalOffset={-10}
      backgroundStyle={styles.overlay}>
      {children}
    </Popover>
  ),
);

export default AlertPopover;
