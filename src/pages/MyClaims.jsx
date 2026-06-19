import Navbar from "../components/Navbar";

function MyClaims() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const claims = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="uppercase text-blue-500 text-sm font-semibold tracking-wide">
            Claim Center
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
            📝 My Claims
          </h1>

          <p className="text-slate-600 mt-2 mb-8">
            Track all your submitted item claims here.
          </p>

          {claims.length === 0 ? (
            <div className="bg-blue-50 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-blue-700">
                No Claims Yet
              </h2>
              <p className="text-slate-600 mt-2">
                Once you claim an item, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {claims.map((claim) => (
                <div key={claim.id} className="bg-blue-50 rounded-2xl p-6">
                  <h2 className="font-bold text-xl text-blue-700">
                    {claim.itemName}
                  </h2>
                  <p className="text-slate-600 mt-2">{claim.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyClaims;