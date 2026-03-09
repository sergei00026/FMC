import { Container, type ContainerProps } from '@mui/material';

interface IPageContainerComponent {
  (props: ContainerProps): React.JSX.Element;
}

export const PageContainer: IPageContainerComponent = (props) => {
  return <Container maxWidth="lg" {...props} />;
};
