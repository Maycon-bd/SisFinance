export default function Settings() {
  function logout() {
    localStorage.removeItem('token')
    location.href = '/login'
  }
  return (
    <div style={{padding:20}}>
      <h2>Configurações</h2>
      <button onClick={logout}>Sair</button>
      <p>Em breve: notificações e alertas personalizados.</p>
    </div>
  )
}