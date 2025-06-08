import React from "react";
import { Plus, Eye } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Conta<span className="text-blue-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600">
            Sistema Inteligente de Contabilidade
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            onClick={() => onNavigate("create")}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
              <Plus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Cadastrar Lançamento
            </h2>
            <p className="text-gray-600 text-center">
              Registre novos lançamentos contábeis de forma rápida e intuitiva
            </p>
          </div>

          <div
            onClick={() => onNavigate("view")}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Visualizar Lançamentos
            </h2>
            <p className="text-gray-600 text-center">
              Consulte e gerencie todos os seus lançamentos contábeis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
