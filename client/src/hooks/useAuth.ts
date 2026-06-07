import useAuthStore from '../store/authStore'

export const useAuth = () => {
  const { token, user, isAuthenticated, setAuth, setUser, logout } = useAuthStore()

  return { token, user, isAuthenticated, setAuth, setUser, logout }
}

export default useAuth
