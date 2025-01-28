import { OpacityBox } from 'src/components/UI/OpacityBox';

export const NotFound = () => {
  return (
    <OpacityBox className="flex flex-col flex-1 h-full items-center justify-center space-y-4">
      <h1 className="text-6xl">404</h1>
      <p className="text-2xl">Page not found.</p>
    </OpacityBox>
  );
};
