import React from 'react';
import type { CSSProperties } from 'react';

type UIButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  children?: React.ReactNode;
};

const UIButton = React.forwardRef<HTMLButtonElement, UIButtonProps>(function UIButton(props, ref) {
  const { children, className, type = 'button', disabled, onClick, style, ...rest } = props;
  const baseStyle: CSSProperties = {
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    padding: 0,
    margin: 0,
    font: 'inherit',
    color: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
  };

  return (
    <button
      type={type}
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
});

export default UIButton;
