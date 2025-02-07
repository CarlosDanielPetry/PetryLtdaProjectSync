import React from 'react';
import { useAuthStore } from '../store/authStore';

export default function Inicio() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Bem-vindo ao Sistema
        </h1>
      </div>
    </div>
  );
}