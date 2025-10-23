import { useNavigate } from 'react-router-dom';
import type { NotFoundPageProps } from './types';

export const NotFoundPage = (props: NotFoundPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default NotFoundPage;
