import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme, type PaletteMode } from '@mui/material/styles';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

interface IRenderWithThemeOptions {
  mode: PaletteMode;
}

const renderWithTheme = (ui: React.ReactElement, options: IRenderWithThemeOptions) => {
  const theme = createTheme({
    palette: {
      mode: options.mode,
    },
  });

  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('UI wrappers', () => {
  it('renders button and handles click', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Create</Button>, { mode: 'light' });

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders input and handles change', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input label="Title" value="" onChange={handleChange} />, { mode: 'light' });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Task' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders button variants in dark mode', () => {
    renderWithTheme(
      <>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </>,
      { mode: 'dark' },
    );

    expect(screen.getByRole('button', { name: 'Contained' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outlined' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Text' })).toBeInTheDocument();
  });

  it('renders input in dark mode', () => {
    renderWithTheme(<Input label="Dark title" value="" onChange={() => {}} />, { mode: 'dark' });

    expect(screen.getByLabelText('Dark title')).toBeInTheDocument();
  });
});
