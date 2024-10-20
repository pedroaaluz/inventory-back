export const normalizeName = (name: string) => {
  const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const normalized = withoutAccents.replace(/[^a-zA-Z\s]/g, '');

  return normalized.trim().toUpperCase();
};

export const normalizeCNPJ = (cnpj: string) => {
  return cnpj.replace(/[^\d]/g, '');
};
