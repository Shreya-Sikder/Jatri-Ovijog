export function useNavigate() {
  return (path: string) => {
    window.location.href = path;
  };
}