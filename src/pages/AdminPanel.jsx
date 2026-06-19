import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import AdminNavbar from "../components/AdminNavbar";

function AdminPanel() {
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [matchesRes, claimsRes, lostRes, foundRes] = await Promise.all([
        API.get("/matches"),
        API.get("/claims"),
        API.get("/lost-items"),
        API.get("/found-items"),
      ]);

      setMatches(matchesRes.data);
      setClaims(claimsRes.data);
      setLostItems(lostRes.data);
      setFoundItems(foundRes.data);
    } catch {
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const updateMatch = async (matchId, action) => {
    try {
      await API.put(`/matches/${matchId}/${action}`);
      toast.success(`Match ${action}d`);
      fetchAdminData();
    } catch {
      toast.error("Failed to update match.");
    }
  };

  const updateClaim = async (claimId, action) => {
    try {
      await API.put(`/claims/${claimId}/${action}`);
      toast.success(`Claim ${action}d`);
      fetchAdminData();
    } catch {
      toast.error("Failed to update claim.");
    }
  };

  const approveLostItem = async (id) => {
    try {
      await API.put(`/lost-items/${id}/approve`);
      toast.success("Lost item approved");
      fetchAdminData();
    } catch {
      toast.error("Failed to approve lost item.");
    }
  };

  const rejectLostItem = async (id) => {
    try {
      await API.put(`/lost-items/${id}/reject`);
      toast.success("Lost item rejected");
      fetchAdminData();
    } catch {
      toast.error("Failed to reject lost item.");
    }
  };

  const approveFoundItem = async (id) => {
    try {
      await API.put(`/found-items/${id}/approve`);
      toast.success("Found item approved");
      fetchAdminData();
    } catch {
      toast.error("Failed to approve found item.");
    }
  };

  const rejectFoundItem = async (id) => {
    try {
      await API.put(`/found-items/${id}/reject`);
      toast.success("Found item rejected");
      fetchAdminData();
    } catch {
      toast.error("Failed to reject found item.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white border border-purple-100 rounded-3xl shadow-xl p-8 mb-10">
          <p className="uppercase text-purple-600 font-semibold tracking-widest text-sm">
            Admin Workspace
          </p>
          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            Management Panel
          </h1>
          <p className="text-slate-600 mt-3">
            Review lost items, found items, matches, and claims from one place.
          </p>
        </div>

        <Section title="📦 Lost Items" empty={lostItems.length === 0}>
          {lostItems.map((item) => (
            <Box key={item.lostItemId}>
              <Info label="Item" value={item.itemName} />
              <Info label="Category" value={item.category} />
              <Info label="Location" value={item.lostLocation} />
              <p>
                <b>Status:</b> <Badge status={item.status} />
              </p>

              {item.status === "PENDING_APPROVAL" && (
                <ButtonGroup>
                  <ApproveButton onClick={() => approveLostItem(item.lostItemId)} />
                  <RejectButton onClick={() => rejectLostItem(item.lostItemId)} />
                </ButtonGroup>
              )}
            </Box>
          ))}
        </Section>

        <Section title="📚 Found Items" empty={foundItems.length === 0}>
          {foundItems.map((item) => (
            <Box key={item.foundItemId}>
              <Info label="Item" value={item.itemName} />
              <Info label="Category" value={item.category} />
              <Info label="Location" value={item.foundLocation} />
              <p>
                <b>Status:</b> <Badge status={item.status} />
              </p>

              {item.status === "PENDING_APPROVAL" && (
                <ButtonGroup>
                  <ApproveButton onClick={() => approveFoundItem(item.foundItemId)} />
                  <RejectButton onClick={() => rejectFoundItem(item.foundItemId)} />
                </ButtonGroup>
              )}
            </Box>
          ))}
        </Section>

        <Section title="🔗 Matches" empty={matches.length === 0}>
          {matches.map((match) => (
            <Box key={match.matchId}>
              <Info label="Lost" value={match.lostItem?.itemName || "N/A"} />
              <Info label="Found" value={match.foundItem?.itemName || "N/A"} />
              <Info label="Score" value={match.matchScore} />
              <Info label="Level" value={match.matchLevel} />
              <p>
                <b>Status:</b> <Badge status={match.matchStatus} />
              </p>

              {match.matchStatus === "PENDING_ADMIN_REVIEW" && (
                <ButtonGroup>
                  <ApproveButton onClick={() => updateMatch(match.matchId, "approve")} />
                  <RejectButton onClick={() => updateMatch(match.matchId, "reject")} />
                </ButtonGroup>
              )}
            </Box>
          ))}
        </Section>

        <Section title="📝 Claims" empty={claims.length === 0}>
          {claims.map((claim) => (
            <Box key={claim.claimId}>
              <Info label="Claim ID" value={claim.claimId} />
              <Info label="Proof" value={claim.ownershipProof} />
              <p>
                <b>Status:</b> <Badge status={claim.claimStatus} />
              </p>

              {claim.claimStatus === "PENDING" && (
                <ButtonGroup>
                  <ApproveButton onClick={() => updateClaim(claim.claimId, "approve")} />
                  <RejectButton onClick={() => updateClaim(claim.claimId, "reject")} />
                </ButtonGroup>
              )}
            </Box>
          ))}
        </Section>
      </main>
    </div>
  );
}

function Section({ title, empty, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bold text-purple-700 mb-5">{title}</h2>
      {empty ? (
        <div className="bg-white border border-purple-100 p-6 rounded-2xl text-slate-500 shadow">
          No data found.
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function Box({ children }) {
  return (
    <div className="bg-white border border-purple-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:shadow-purple-100 transition mb-4">
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p className="text-slate-700 mb-1">
      <b className="text-slate-900">{label}:</b> {value}
    </p>
  );
}

function ButtonGroup({ children }) {
  return <div className="flex gap-3 mt-4">{children}</div>;
}

function ApproveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
    >
      Approve
    </button>
  );
}

function RejectButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
    >
      Reject
    </button>
  );
}

function Badge({ status }) {
  const color =
    status === "ACTIVE" || status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {status}
    </span>
  );
}

export default AdminPanel;