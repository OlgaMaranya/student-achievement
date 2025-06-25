
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Страница не найдена</p>
      <a 
        href="/dashboard" 
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Вернуться на главную
      </a>
    </div>
  );
};

export default NotFound;
