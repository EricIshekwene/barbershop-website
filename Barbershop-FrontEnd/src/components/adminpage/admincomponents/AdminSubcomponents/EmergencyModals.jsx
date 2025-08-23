import React, { useMemo, useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import { FaTrashAlt, FaInstagram, FaPhone } from "react-icons/fa";

/* ============= Shared styles ============= */
const Pill =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn border transition-all duration-300 focus:outline-none";
const GoldBtn =
    `${Pill} bg-[#DDCA7D] text-[#1c1808] border-[#DDCA7D] hover:brightness-110`;
const GhostBtn =
    `${Pill} bg-white/10 backdrop-blur-sm border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md`;
const DangerBtn =
    `${Pill} bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/30`;
const DisabledBtn =
    `${Pill} bg-white/5 border-white/10 text-white/50 cursor-not-allowed`;
const Chip =
    "px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-[#DDCA7D] text-sm";
const ChipSelected =
    "px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-400 text-green-300";

const Divider = () => <div className="h-px w-full bg-white/10 my-4" />;

/* ============= Utility ============= */
const fmtDate = (iso) => {
    try {
        if (!iso) return "";
        const [y, m, d] = iso.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return iso || "";
    }
};
const fmtTime = (t) => (t?.length >= 5 ? t.slice(0, 5) : t || "");

/* ============= Base Modal ============= */
function BaseModal({ isOpen, title, onClose, children, footer }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-xl">
                {/* header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl raleway-bold text-[#DDCA7D]">{title}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <RxCross1 className="text-xl" />
                    </button>
                </div>

                <Divider />
                <div>{children}</div>
                {footer && (
                    <>
                        <Divider />
                        <div className="flex items-center justify-end gap-3">{footer}</div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ============================================================
   Approve Emergency Modal
   ============================================================ */
   export function ApproveEmergencyModal({
    isOpen,
    onClose,
    request,
    onApprove,
    selectedProposal,
  }) {
    const requestId = request?.request_id;
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Approve Emergency Request"
        footer={
          <>
            <button className={GhostBtn} onClick={onClose}>
              Close
            </button>
            <button
              className={selectedProposal ? GoldBtn : DisabledBtn}
              disabled={!selectedProposal}
              onClick={() => selectedProposal && onApprove?.(selectedProposal)}
            >
              <TiTick className="inline-block mr-2 text-lg" />
              Approve & Notify
            </button>
          </>
        }
      >
        {/* Client info */}
        <div className="flex flex-col gap-2 text-white">
          <div className="flex items-center gap-2">
            <p className="text-base sm:text-lg raleway-bold">{request?.name}</p>
            {request?.verified && (
              <span className="px-2 py-0.5 rounded-lg bg-green-500/20 border border-green-400 text-green-300 text-xs">
                ✓ Verified
              </span>
            )}
          </div>
  
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {request?.instagram && (
              <button
                type="button"
                className="flex items-center gap-2 text-[#DDCA7D] hover:text-[#f1e6a8]"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/${request.instagram.replace(/^@/, "")}`,
                    "_blank"
                  )
                }
              >
                <FaInstagram />
                <span>{request.instagram}</span>
              </button>
            )}
            {request?.phone && (
              <a
                href={`tel:${request.phone}`}
                className="flex items-center gap-2 text-[#DDCA7D] hover:text-[#f1e6a8]"
              >
                <FaPhone />
                <span>{request.phone}</span>
              </a>
            )}
          </div>
  
          {request?.reason && (
            <p className="text-white/80 text-sm">
              <span className="text-white/60">Reason: </span>
              {request.reason}
            </p>
          )}
        </div>
  
        {/* Show the already chosen slot */}
        {selectedProposal ? (
          <div className="mt-4 text-sm text-white/80">
            Approving:{" "}
            <span className="text-[#DDCA7D] font-semibold">
              {fmtDate(selectedProposal.slot_date)} @ {fmtTime(selectedProposal.slot_time)}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/60 italic">
            No time selected. Please select one from the card before approving.
          </p>
        )}
      </BaseModal>
    );
  }

/* ============================================================
   Cancel Emergency Modal
   ============================================================ */
export function CancelEmergencyModal({ isOpen, onClose, request, onCancel }) {
    const requestId = request?.request_id;
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Cancel Emergency Request"
            footer={
                <>
                    <button className={GhostBtn} onClick={onClose}>Keep</button>
                    <button className={DangerBtn} onClick={onCancel}>
                        <RxCross1 className="inline-block mr-2 text-lg" />
                        Cancel Request
                    </button>
                </>
            }
        >
            <p className="text-white/80 text-sm">
                Cancel emergency request for{" "}
                <span className="text-[#DDCA7D]">{request?.name}</span>?
                They’ll be notified it was not approved.
            </p>
        </BaseModal>
    );
}

/* ============================================================
   Delete Emergency Modal
   ============================================================ */
export function DeleteEmergencyModal({ isOpen, onClose, request, onDelete }) {
    const requestId = request?.request_id;
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Emergency Request"
            footer={
                <>
                    <button className={GhostBtn} onClick={onClose}>Keep</button>
                    <button className={DangerBtn} onClick={onDelete}>
                        <FaTrashAlt className="inline-block mr-2" />
                        Delete
                    </button>
                </>
            }
        >
            <p className="text-white/80 text-sm">
                Permanently delete emergency request for{" "}
                <span className="text-[#DDCA7D]">{request?.name}</span>?
                <br />
                <span className="text-white/60">
                    Tip: Use <span className="text-white/80">Cancel</span> instead if you want to keep a record but mark as declined.
                </span>
            </p>
        </BaseModal>
    );
}
