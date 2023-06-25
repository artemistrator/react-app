const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 rounded-lg bg-red-500 text-white flex"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
