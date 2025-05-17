// src/Components/Header.jsx
function Header() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return null;

  return (
    <div className="w-full flex justify-end px-4 pt-3">
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm px-3 py-1.5 flex items-center gap-2 border border-gray-300">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.name)}&background=0D8ABC&color=fff`}
          alt="avatar"
          className="w-8 h-8 rounded-full border"
        />
        <span className="text-sm text-gray-700 font-medium leading-none">
          Bienvenido, {usuario.name}
        </span>
      </div>
    </div>
  );
}

export default Header;
