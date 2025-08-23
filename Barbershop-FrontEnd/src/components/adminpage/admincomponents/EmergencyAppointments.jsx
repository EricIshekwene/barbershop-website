import React, { useMemo, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaInstagram, FaPhone } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { ApproveEmergencyModal, CancelEmergencyModal, DeleteEmergencyModal } from "./AdminSubcomponents/EmergencyModals";
/** ======================= Shared styles ======================= */
const Pill =
  "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn border transition-all duration-300 focus:outline-none";
const CountBadge = `${Pill} bg-white/10 backdrop-blur-sm border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md`;
const ApproveBtn = `${Pill} bg-green-500/20 backdrop-blur-sm border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md`;
const ApproveBtnDisabled = `${Pill} bg-white/5 border-white/10 text-white/50 cursor-not-allowed`;
const CancelBtn = `${Pill} bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/30`;
const CardEmergency =
  "flex flex-col sm:flex-row justify-start items-start gap-4 w-full bg-red-500/10 border border-red-400/20 rounded-lg p-4";
const DeleteBtn = `${Pill} bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/30`;

/** ======================= Helpers ======================= */
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};
const fmtTime = (hhmm) => (hhmm?.length >= 5 ? hhmm.slice(0, 5) : hhmm || "");

/** ======================= Card ======================= */
function EmergencyRequestCard({ req }) {
  // Expecting: { name, email, instagram, phone, reason, proposals, status, verified? }
  const {
    name,
    email,
    instagram,
    phone,
    reason,
    proposals = [],
    status,
    verified,
    email_verified,
    account_verified,
  } = req;

  // tolerate different backend field names for “verified”
  const isVerified = Boolean(verified ?? email_verified ?? account_verified);

  const [selectedIdx, setSelectedIdx] = useState(null);
  const selected = selectedIdx !== null ? proposals[selectedIdx] : null;
  const [approveOpen, setApproveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
    <div className={CardEmergency}>
      {/* Left */}
      <div className="flex flex-col gap-2 min-w-[240px]">
        <div className="flex items-center gap-2">
          <p className="text-white raleway-bold text-2xl">{name}</p>

          {/* verified tick next to name */}
          {isVerified && <TiTick className="text-[#DDCA7D] text-xl" title="Verified client" />}

          {/* keep your old approved badge behavior */}
          {status === "approved" && (
            <span className={`${ApproveBtn} !px-2 !py-1`} title="Approved">
              ✓
            </span>
          )}
        </div>

        <div className="text-white text-sm space-y-1">
          <p className="opacity-90">
            Service: <span className="text-[#DDCA7D] font-semibold">Emergency Cut</span>
          </p>
          {reason && (
            <p className="opacity-90">
              Reason: <span className="text-white/90">{reason}</span>
            </p>
          )}
        </div>

        {/* Instagram + Phone in one row */}
        <div className="flex items-center gap-4 mt-1">
          {instagram && (
            <button
              type="button"
              onClick={() =>
                window.open(`https://www.instagram.com/${instagram.replace(/^@/, "")}`, "_blank")
              }
              className="flex items-center gap-2 text-[#DDCA7D] hover:text-[#f1e6a8] transition"
              title="Open Instagram"
            >
              <FaInstagram className="text-base" />
              <span className="text-base raleway-regular">{instagram}</span>
            </button>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-[#DDCA7D] hover:text-[#f1e6a8] transition"
              title="Call"
            >
              <FaPhone className="text-base" />
              <span className="text-base raleway-regular">{phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Middle: proposals */}
      <div className="flex-1 w-full">
        <p className="text-white/90 text-sm mb-2">Proposed times (select one):</p>
        {proposals.length ? (
          <div className="flex flex-wrap gap-2">
            {proposals.map((p, i) => {
              // backend returns { slot_date, slot_time }
              const active = i === selectedIdx;
              return (
                <button
                  key={`${p.slot_date}-${p.slot_time}-${i}`}
                  type="button"
                  onClick={() => setSelectedIdx(active ? null : i)} // toggle select/deselect
                  className={`${active ? ApproveBtn : CountBadge} !px-3 !py-1.5`}
                  title={`${fmtDate(p.slot_date)} @ ${fmtTime(p.slot_time)}`}
                >
                  {fmtDate(p.slot_date)} • {fmtTime(p.slot_time)}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-white/60 text-sm italic">No proposals provided</p>
        )}

        {selected && (
          <p className="mt-2 text-xs text-white/70">
            Selected to approve:{" "}
            <span className="text-[#DDCA7D] font-semibold">
              {fmtDate(selected.slot_date)} @ {fmtTime(selected.slot_time)}
            </span>
          </p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          className={selected ? ApproveBtn : ApproveBtnDisabled}
          disabled={!selected}
          onClick={() => setApproveOpen(true)}
        >
          Approve
        </button>

        <button
          type="button"
          className={CancelBtn}
          onClick={() => setCancelOpen(true)}
        >
          Cancel
        </button>
        <button
          type="button"
          className={DeleteBtn}
          onClick={() => setDeleteOpen(true)}
        >
          Delete
        </button>
      </div>
    </div>
    {/* --- Modals (scoped to this card) --- */}
<ApproveEmergencyModal
  isOpen={approveOpen}
  onClose={() => setApproveOpen(false)}
  request={req}
  selectedProposal={selected}
  onApprove={(slot) => {
    console.log("Approve & Notify", { email: req.email, slot });
    setApproveOpen(false);
  }}
/>

<CancelEmergencyModal
  isOpen={cancelOpen}
  onClose={() => setCancelOpen(false)}
  request={req}
  onCancel={() => {
    console.log("Cancel request", { email: req.email });
    setCancelOpen(false);
  }}
/>

<DeleteEmergencyModal
  isOpen={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  request={req}
  onDelete={() => {
    console.log("Delete request", { email: req.email });
    setDeleteOpen(false);
  }}
/>

    </>
  );
}

/** ======================= Collapsible List ======================= */
export default function AdminEmergencyRequests() {
  const [showEmergency, setShowEmergency] = useState(true);
  const [query, setQuery] = useState("");
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [error, setError] = useState(null);

  /** ======================= API Call ======================= */
  const getEmergencyRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/emergency/get-requests", {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setEmergencyRequests(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching emergency requests:", err);
      setError(err.message || "Failed to load emergency requests");
    }
  };

  useEffect(() => {
    getEmergencyRequests();
  }, []);

  const matches = (r, q) => {
    const s = (q || "").toLowerCase();
    return (
      r.name?.toLowerCase().includes(s) ||
      r.email?.toLowerCase().includes(s) ||
      r.instagram?.toLowerCase().includes(s) ||
      r.phone?.toLowerCase?.().includes(s) ||
      r.reason?.toLowerCase().includes(s)
    );
  };

  const total = emergencyRequests.length;
  const filtered = useMemo(
    () => emergencyRequests.filter((r) => matches(r, query)),
    [emergencyRequests, query]
  );

  return (
    <div className="flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border border-white/20">
      {/* Header row */}
      <div className="flex flex-row items-center gap-2 cursor-pointer">
        <p className="text-2xl raleway-bold text-white">Emergency Requests</p>

        <div className={CountBadge}>
          <p>
            {filtered.length}
            {query ? ` / ${total}` : ""}
          </p>
        </div>

        <FaChevronDown
          className={`text-white text-2xl transition-transform duration-200 ${
            showEmergency ? "rotate-90" : ""
          }`}
          onClick={() => setShowEmergency((v) => !v)}
        />

        {showEmergency && (
          <div className="relative w-1/3 min-w-[220px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, @, phone, reason…"
              className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
            />
            {!!query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {/* Collapsible list */}
      {showEmergency && (
        <div className="max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {filtered.length ? (
            filtered.map((req) => <EmergencyRequestCard key={req.request_id} req={req} />)
          ) : (
            <p className="text-white/60 italic px-1">
              {query ? "No matches." : "No emergency requests."}
            </p>
          )}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      
</div>
  );
}
