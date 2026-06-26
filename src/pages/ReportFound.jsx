import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function ReportFound() {
  const today = new Date().toISOString().split("T")[0];

  const initialForm = {
    itemName: "",
    category: "",
    color: "",
    model: "",
    description: "",
    foundLocation: "",
    foundDate: "",
    imageUrl: "",
    specialFeatures: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const getLoggedInUserId = () => {
    return Number(localStorage.getItem("userId"));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const payload = {
      ...formData,
      reportedById: getLoggedInUserId(),
    };

    setLoading(true);

    try {
      await API.post("/found-items", payload);
      toast.success("Found item reported successfully!");
      setFormData(initialForm);
      setPreview("");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to report found item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="uppercase text-blue-500 text-sm font-semibold tracking-wide">
            Found Report
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-2">
            Report Found Item
          </h1>

          <p className="text-slate-600 mb-8">
            Found something on campus? Add the details so the owner can claim it.
          </p>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <input name="itemName" value={formData.itemName} onChange={handleChange} placeholder="Item Name *" required className="input" />

            <select name="category" value={formData.category} onChange={handleChange} required className="input">
              <option value="">Select Category *</option>
              <option value="Electronics">Electronics</option>
              <option value="Wallet">Wallet</option>
              <option value="ID Card">ID Card</option>
              <option value="Keys">Keys</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>

            <input name="color" value={formData.color} onChange={handleChange} placeholder="Color" className="input" />
            <input name="model" value={formData.model} onChange={handleChange} placeholder="Brand / Model" className="input" />
            <input name="foundLocation" value={formData.foundLocation} onChange={handleChange} placeholder="Found Location *" required className="input" />
            <input type="date" name="foundDate" value={formData.foundDate} onChange={handleChange} required max={today} className="input" />

            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description *" required rows="4" className="input md:col-span-2" />

            <textarea name="specialFeatures" value={formData.specialFeatures} onChange={handleChange} placeholder="Special Features / Identifying Marks" rows="3" className="input md:col-span-2" />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Upload Item Image
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="input" disabled={loading} />
            </div>

            {preview && (
              <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-2xl border shadow md:col-span-2" />
            )}

            <button
              type="submit"
              disabled={loading}
              className={`md:col-span-2 text-white py-3 rounded-2xl font-semibold transition ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Found Report"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ReportFound;