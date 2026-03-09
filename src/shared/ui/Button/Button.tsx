import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface IButtonComponent {
  (props: ButtonProps): React.JSX.Element;
}

export const Button: IButtonComponent = (props) => {
  const theme = useTheme();
  const { sx, variant = 'contained', ...restProps } = props;

  const modeStyles =
    theme.palette.mode === 'dark'
      ? {
          ...(variant === 'contained' && {
            '&:hover': { backgroundColor: theme.palette.primary.main },
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.grey[900],
          }),
          ...(variant === 'outlined' && {
            '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.12)', borderColor: theme.palette.primary.light },
            borderColor: theme.palette.primary.light,
            color: theme.palette.primary.light,
          }),
          ...(variant === 'text' && {
            '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.12)' },
            color: theme.palette.primary.light,
          }),
        }
      : {
          ...(variant === 'contained' && {
            '&:hover': { backgroundColor: theme.palette.primary.dark },
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
          }),
          ...(variant === 'outlined' && {
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)', borderColor: theme.palette.primary.main },
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          }),
          ...(variant === 'text' && {
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
            color: theme.palette.primary.main,
          }),
        };

  return <MuiButton {...restProps} variant={variant} sx={[modeStyles, ...(Array.isArray(sx) ? sx : [sx])]} />;
};
