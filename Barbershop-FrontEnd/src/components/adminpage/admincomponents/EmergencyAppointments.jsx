import React, { useMemo, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaInstagram, FaPhone } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import {
  ApproveEmergencyModal,
  CancelEmergencyModal,
  DeleteEmergencyModal,
} from "./AdminSubcomponents/EmergencyModals";
import toast from "react-hot-toast";

/** ======================= Shared styles ======================= */
const Pill =
  "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn border transition-all duration-300 focus:outline-none";
const CountBadge = `${Pill} bg-white/10 backdrop-blur-sm border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md`;
const ApproveBtn = `${Pill} bg-green-500/20 backdrop-blur-sm border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md`;
const ApproveBtnDisabled = `${Pill} bg-white/5 border-white/10 text-white/50 cursor-not-allowed`;
const CancelBtn = `${Pill} bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/30`;
const DeleteBtn = `${Pill} bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/30`;

const CardBase =
  "flex flex-col sm:flex-row justify-start items-start gap-4 w-full rounded-lg p-4 border";
const CardPending = `${CardBase} bg-red-500/10 border-red-400/20`;
const CardApproved = `${CardBase} bg-green-500/10 border-green-400/20`;
const CardCancelled = `${CardBase} bg-white/5 border-white/10`;

const ReadonlyChip =
  "px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-[#DDCA7D] text-sm";

/** ======================= Helpers ======================= */
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const fmtTime = (hhmm) => (hhmm?.length >= 5 ? hhmm.slice(0, 5) : hhmm || "");

/** ======================= Read-only info card (Approved/Cancelled) ======================= */
function EmergencyInfoCard({ req, status }) {
  const {
    name,
    instagram,
    phone,
    reason,
    proposals = [],
    verified,
    email_verified,
    account_verified,
  } = req;
  const isVerified = Boolean(verified ?? email_verified ?? account_verified);

  const cardClass =
    status === "approved"
      ? CardApproved
      : status === "cancelled"
      ? CardCancelled
      : CardBase;

  return (
    <div className={cardClass}>
      {/* Left */}
      <div className="flex flex-col gap-2 min-w-[240px]">
        <div className="flex items-center gap-2">
          <p className="text-white raleway-bold text-2xl">{name}</p>
          {isVerified && (
            <TiTick className="text-[#DDCA7D] text-xl" title="Verified client" />
          )}
          {status === "approved" && (
            <span className="px-2 py-1 rounded-md border border-green-400 text-green-300 text-xs">
              Approved
            </span>
          )}
          {status === "cancelled" && (
            <span className="px-2 py-1 rounded-md border border-white/30 text-white/80 text-xs">
              Cancelled
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

        {/* Instagram + Phone */}
        <div className="flex items-center gap-4 mt-1">
          {instagram && (
            <button
              type="button"
              onClick={() =>
                window.open(
                  `https://www.instagram.com/${instagram.replace(/^@/, "")}`,
                  "_blank"
                )
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

      {/* Right (read-only proposals if any) */}
      <div className="flex-1 w-full">
        {proposals?.length ? (
          <>
            <p className="text-white/90 text-sm mb-2">Proposed times:</p>
            <div className="flex flex-wrap gap-2">
              {proposals.map((p, i) => (
                <span
                  key={`${p.slot_date}-${p.slot_time}-${i}`}
                  className={ReadonlyChip}
                  title={`${fmtDate(p.slot_date)} @ ${fmtTime(p.slot_time)}`}
                >
                  {fmtDate(p.slot_date)} • {fmtTime(p.slot_time)}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-white/60 text-sm italic">No proposals provided</p>
        )}
      </div>
    </div>
  );
}

/** ======================= Action card (Pending) ======================= */
function EmergencyRequestCard({ req, onChanged }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const {
    name,
    instagram,
    phone,
    reason,
    proposals = [],
    status,
    verified,
    email_verified,
    account_verified,
  } = req;

  const isVerified = Boolean(verified ?? email_verified ?? account_verified);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const selected = selectedIdx !== null ? proposals[selectedIdx] : null;
  const [approveOpen, setApproveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  return (
    <>
      <div className={CardPending}>
        {/* Left */}
        <div className="flex flex-col gap-2 min-w-[240px]">
          <div className="flex items-center gap-2">
            <p className="text-white raleway-bold text-2xl">{name}</p>
            {isVerified && (
              <TiTick className="text-[#DDCA7D] text-xl" title="Verified client" />
            )}
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

          {/* Instagram + Phone */}
          <div className="flex items-center gap-4 mt-1">
            {instagram && (
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/${instagram.replace(/^@/, "")}`,
                    "_blank"
                  )
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
                const active = i === selectedIdx;
                return (
                  <button
                    key={`${p.slot_date}-${p.slot_time}-${i}`}
                    type="button"
                    onClick={() => setSelectedIdx(active ? null : i)}
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

      {/* --- Modals --- */}
      <ApproveEmergencyModal
        isOpen={approveOpen}
        onClose={() => setApproveOpen(false)}
        request={req}
        selectedProposal={selected}
        onApprove={async (slot) => {
          try {
            if (isApproving) return;
            setIsApproving(true);
            const res = await fetch("http://localhost:3000/api/emergency/approve-request", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                requestId: req.request_id,
                slot_date: slot.slot_date,
                slot_time: slot.slot_time,
              }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
            toast.success("Request approved successfully");
            await onChanged?.();
            setApproveOpen(false);
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to approve");
          } finally {
            setIsApproving(false);
          }
        }}
      />

      <CancelEmergencyModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        request={req}
        onCancel={async () => {
          try {
            if (isCancelling) return;
            setIsCancelling(true);
            const res = await fetch(
              "http://localhost:3000/api/emergency/cancel-emergency",
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  requestId: req.request_id,   // OR send { email, date, time } if you prefer
                  email: req.email,
                  name: req.name,
                }),
              }
            );

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

            toast.success("Request cancelled successfully");
            await onChanged?.();
            setCancelOpen(false);
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to cancel");
          } finally {
            setIsCancelling(false);
          }
        }}
      />

      <DeleteEmergencyModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        request={req}
        onDelete={async () => {
          try {
            if (isDeleting) return;
            setIsDeleting(true);
            const res = await fetch("http://localhost:3000/api/emergency/delete-request", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requestId: req.request_id }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
            toast.success("Request deleted successfully");
            await onChanged?.();
            setDeleteOpen(false);
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to delete");
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </>
  );
}

/** ======================= Collapsible Lists ======================= */
export default function AdminEmergencyRequests() {
  // Collapsible toggles
  const [showPending, setShowPending] = useState(true);
  const [showApproved, setShowApproved] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  // Queries per section (so you can search inside each block independently)
  const [qPending, setQPending] = useState("");
  const [qApproved, setQApproved] = useState("");
  const [qCancelled, setQCancelled] = useState("");

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

  // match helper
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

  // Buckets
  const pending = useMemo(
    () => emergencyRequests.filter((r) => (r.status || "").toLowerCase() === "pending"),
    [emergencyRequests]
  );
  const approved = useMemo(
    () => emergencyRequests.filter((r) => (r.status || "").toLowerCase() === "approved"),
    [emergencyRequests]
  );
  const cancelled = useMemo(
    () => emergencyRequests.filter((r) => (r.status || "").toLowerCase() === "cancelled"),
    [emergencyRequests]
  );

  // Filters per bucket
  const filteredPending = useMemo(
    () => pending.filter((r) => matches(r, qPending)),
    [pending, qPending]
  );
  const filteredApproved = useMemo(
    () => approved.filter((r) => matches(r, qApproved)),
    [approved, qApproved]
  );
  const filteredCancelled = useMemo(
    () => cancelled.filter((r) => matches(r, qCancelled)),
    [cancelled, qCancelled]
  );

  return (
    <div className="flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-6 border border-white/20">
      {/* ===== PENDING ===== */}
      <div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-2xl raleway-bold text-white">Emergency – Pending</p>

          <div className={CountBadge}>
            <p>{filteredPending.length}{qPending ? ` / ${pending.length}` : ""}</p>
          </div>

          <FaChevronDown
            className={`text-white text-2xl cursor-pointer transition-transform duration-200 ${
              showPending ? "rotate-90" : ""
            }`}
            onClick={() => setShowPending((v) => !v)}
          />

          {showPending && (
            <div className="relative w-1/3 min-w-[220px]">
              <input
                type="text"
                value={qPending}
                onChange={(e) => setQPending(e.target.value)}
                placeholder="Search name, email, @, phone, reason…"
                className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
              />
              {!!qPending && (
                <button
                  type="button"
                  onClick={() => setQPending("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {showPending && (
          <div className="mt-3 max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {filteredPending.length ? (
              filteredPending.map((req) => (
                <EmergencyRequestCard
                  key={req.request_id}
                  req={req}
                  onChanged={getEmergencyRequests}
                />
              ))
            ) : (
              <p className="text-white/60 italic px-1">
                {qPending ? "No matches." : "No pending emergency requests."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ===== APPROVED ===== */}
      <div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-2xl raleway-bold text-white">Emergency – Approved</p>

          <div className={CountBadge}>
            <p>{filteredApproved.length}{qApproved ? ` / ${approved.length}` : ""}</p>
          </div>

          <FaChevronDown
            className={`text-white text-2xl cursor-pointer transition-transform duration-200 ${
              showApproved ? "rotate-90" : ""
            }`}
            onClick={() => setShowApproved((v) => !v)}
          />

          {showApproved && (
            <div className="relative w-1/3 min-w-[220px]">
              <input
                type="text"
                value={qApproved}
                onChange={(e) => setQApproved(e.target.value)}
                placeholder="Search name, email, @, phone, reason…"
                className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
              />
              {!!qApproved && (
                <button
                  type="button"
                  onClick={() => setQApproved("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {showApproved && (
          <div className="mt-3 max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {filteredApproved.length ? (
              filteredApproved.map((req) => (
                <EmergencyInfoCard key={req.request_id} req={req} status="approved" />
              ))
            ) : (
              <p className="text-white/60 italic px-1">
                {qApproved ? "No matches." : "No approved emergency requests."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ===== CANCELLED ===== */}
      <div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-2xl raleway-bold text-white">Emergency – Cancelled</p>

          <div className={CountBadge}>
            <p>{filteredCancelled.length}{qCancelled ? ` / ${cancelled.length}` : ""}</p>
          </div>

          <FaChevronDown
            className={`text-white text-2xl cursor-pointer transition-transform duration-200 ${
              showCancelled ? "rotate-90" : ""
            }`}
            onClick={() => setShowCancelled((v) => !v)}
          />

          {showCancelled && (
            <div className="relative w-1/3 min-w-[220px]">
              <input
                type="text"
                value={qCancelled}
                onChange={(e) => setQCancelled(e.target.value)}
                placeholder="Search name, email, @, phone, reason…"
                className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
              />
              {!!qCancelled && (
                <button
                  type="button"
                  onClick={() => setQCancelled("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {showCancelled && (
          <div className="mt-3 max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {filteredCancelled.length ? (
              filteredCancelled.map((req) => (
                <EmergencyInfoCard key={req.request_id} req={req} status="cancelled" />
              ))
            ) : (
              <p className="text-white/60 italic px-1">
                {qCancelled ? "No matches." : "No cancelled emergency requests."}
              </p>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
