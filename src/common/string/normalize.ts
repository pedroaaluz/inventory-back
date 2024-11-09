export const normalizeName = (name: string) => {
  const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // 2. Remove caracteres especiais, letras estranhas e caracteres Unicode fora do alfabeto padrão
  const normalized = withoutAccents.replace(/[^a-zA-Z0-9\s]/g, '');

  return normalized.trim().toUpperCase();
};

export const normalizeCNPJ = (cnpj: string) => {
  return cnpj.replace(/[^\d]/g, '');
};
