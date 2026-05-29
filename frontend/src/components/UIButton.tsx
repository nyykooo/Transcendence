import React from 'react';
import { ButtonBase, useTheme } from '@mui/material';

type UIButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  children?: React.ReactNode;
};


const UIButton = React.forwardRef<HTMLButtonElement, UIButtonProps>(
  function UIButton(props, ref) {
    const { children, style, disabled, ...rest } = props;
    const theme = useTheme();

    return (
      <ButtonBase
        ref={ref}
        disabled={disabled}
        style={{
          color: theme.palette.primary.main,
          fontSize: '1.5rem',
          ...style,
        }}
        {...rest}
      >
        {children}
      </ButtonBase>
    );
  }
);

export default UIButton;
