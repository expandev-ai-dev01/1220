import { getLoadingSpinnerClassName } from './variants';
import type { LoadingSpinnerProps } from './types';

export const LoadingSpinner = ({ size = 'medium', className }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className={getLoadingSpinnerClassName({ size, className })} />
    </div>
  );
};
