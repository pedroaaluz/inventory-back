export const normalizeName = (name: string) => {
  // 1. Remove acentos
  const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 2. Remove caracteres especiais, números, letras estranhas e caracteres Unicode fora do alfabeto padrão
  const normalized = withoutAccents.replace(/[^a-zA-Z\s]/g, '');

  return normalized.trim().toUpperCase();
};
