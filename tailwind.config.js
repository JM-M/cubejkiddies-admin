/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-gray-500',
    'bg-red-500',
    'text-blue-500',
    'text-green-500',
    'text-orange-500',
    'text-gray-500',
    'text-red-500',
    'text-blue-700',
    'text-green-700',
    'text-orange-700',
    'text-gray-700',
    'text-red-700',
    'bg-opacity-10',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
};
