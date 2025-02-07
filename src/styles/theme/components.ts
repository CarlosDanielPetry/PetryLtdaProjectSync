export const components = {
  // Estilos de cartão de produto
  card: {
    base: 'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1',
    image: 'w-full h-48 object-cover',
    content: 'p-4',
    title: 'text-lg font-semibold text-gray-800',
    price: 'text-xl font-bold text-primary-600',
    badge: {
      hot: 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded',
      new: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded',
      sale: 'bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded'
    }
  },

  // Estilos de botão
  button: {
    base: 'font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none',
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
  },

  // Estilos de navegação
  nav: {
    base: 'bg-white shadow-md',
    container: 'max-w-7xl mx-auto px-4',
    link: 'text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium',
    activeLink: 'text-primary-600 font-semibold'
  },

  // Estilos de formulário
  form: {
    input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    label: 'block text-sm font-medium text-gray-700 mb-1',
    error: 'text-red-600 text-sm mt-1'
  }
}
