import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface IInputComponent {
  (props: TextFieldProps): React.JSX.Element;
}

export const Input: IInputComponent = (props) => {
  const theme = useTheme();
  const { sx, ...restProps } = props;

  const modeStyles =
    theme.palette.mode === 'dark'
      ? {
          '& .MuiInputBase-input': {
            color: theme.palette.grey[100],
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.grey[400],
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.primary.light,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[600],
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
        }
      : {
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.primary.main,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[400],
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        };

  return <TextField {...restProps} variant="outlined" sx={[modeStyles, ...(Array.isArray(sx) ? sx : [sx])]} />;
};
