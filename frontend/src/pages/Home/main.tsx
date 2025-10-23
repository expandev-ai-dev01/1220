import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Editor de Música Cifrada
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Organize, edite e compartilhe suas músicas cifradas de forma simples e eficiente.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cadastro de Músicas</h3>
          <p className="text-gray-600">
            Adicione novas músicas com letras e cifras, incluindo informações como título, artista e
            tom original.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Busca Avançada</h3>
          <p className="text-gray-600">
            Encontre rapidamente suas músicas por título, artista, categoria ou conteúdo da letra.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Transposição de Tom</h3>
          <p className="text-gray-600">
            Transponha automaticamente as cifras para diferentes tons, adaptando para sua voz ou
            instrumento.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 p-8 rounded-lg text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Pronto para começar?</h3>
        <p className="text-gray-600 mb-6">
          Crie sua conta e comece a organizar seu repertório musical hoje mesmo.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
          Criar Conta Gratuita
        </button>
      </section>
    </div>
  );
};

export default HomePage;
