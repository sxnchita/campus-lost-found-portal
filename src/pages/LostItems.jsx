import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

function LostItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lost-items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load lost items.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.itemName
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = category === "" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <p className="uppercase text-blue-500 text-sm font-semibold tracking-wide">
            Browse Reports
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
            🔍 Lost Items
          </h1>

          <p className="text-slate-600 mt-2">
            Search through items reported lost by students.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <input
              type="text"
              placeholder="Search by item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Wallet">Wallet</option>
              <option value="ID Card">ID Card</option>
              <option value="Keys">Keys</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </section>

        {loading ? (
          <Loader />
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-10 text-center text-slate-500">
            😔 No matching lost items found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-5"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-blue-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                    📷 No Image
                  </div>
                )}

                <h2 className="text-xl font-bold text-blue-700">
                  {item.itemName}
                </h2>

                <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {item.category}
                </span>

                <p className="mt-3 text-slate-700">{item.description}</p>

                <div className="mt-4 text-sm text-slate-600 space-y-1">
                  <p>📍 {item.lostLocation}</p>
                  <p>📅 {item.lostDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LostItems;