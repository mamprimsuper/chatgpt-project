// Sistema de sessão do usuário
export const getUserSession = (): string => {
  if (typeof window === 'undefined') return '';
  
  let session = localStorage.getItem('user_session');
  if (!session) {
    session = crypto.randomUUID();
    localStorage.setItem('user_session', session);
  }
  return session;
};

export const clearUserSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_session');
  }
};