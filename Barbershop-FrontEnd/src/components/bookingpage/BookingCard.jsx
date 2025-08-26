import React, { useState, useEffect, useMemo } from "react";
import { IoMdCut } from "react-icons/io";
import { BsFillLightningChargeFill } from "react-icons/bs";

/**
 * Props (backward compatible):
 * - text, price, text2, price2, setService
 * - OR provide `options`:
 *   options = [
 *     { key: "booking-card-1", title: "Low Taper", price: "$25", icon: IoMdCut, service: "Low Taper", hint: "Click to select" },
 *     { key: "booking-card-2", title: "Emergency Cut", price: "$40", icon: BsFillLightningChargeFill, service: "Emergency Cut", hint: "Priority scheduling" },
 *   ]
 */
function BookingCard({ text, price, text2, price2, setService, options }) {
  const [bookingOptions, setBookingOptions] = useState(null);

  useEffect(() => {
    // console.log("bookingOptions changed:", bookingOptions);
  }, [bookingOptions]);

  // build options if not provided (backward compat)
  const cards = useMemo(() => {
    if (Array.isArray(options) && options.length) return options;
    return [
      {
        key: "booking-card-1",
        title: text || "Low Taper",
        price: price || "$—",
        icon: IoMdCut,
        service: "Low Taper",
        hint: "Click to select",
      },
      {
        key: "booking-card-2",
        title: text2 || "Emergency Cut",
        price: price2 || "$—",
        icon: BsFillLightningChargeFill,
        service: "Emergency Cut",
        hint: "Priority scheduling",
      },
    ];
  }, [options, text, price, text2, price2]);

  const isSelected = (key) => bookingOptions === key;

  const baseCard =
    "relative rounded-2xl border bg-white/5 backdrop-blur-md " +
    "border-white/15 hover:border-[#DDCA7D]/40 transition-all duration-300 " +
    "shadow-sm hover:shadow-lg overflow-hidden focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-[#DDCA7D]/50 focus-visible:ring-offset-0";

  const selectedRing =
    "ring-2 ring-[#DDCA7D]/40 shadow-[0_0_40px_-10px_rgba(221,202,125,0.55)]";

  const pillIcon =
    "mx-auto mb-4 p-4 w-20 h-20 rounded-full bg-[#DDCA7D]/15 flex items-center justify-center";

  const titleClass =
    "text-2xl sm:text-3xl font-semibold leading-none tracking-tight text-[#DDCA7D]";
  const priceClass = "text-xl sm:text-2xl font-bold text-[#DDCA7D]";
  const container =
    "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl mx-auto mt-8 px-4";

  const handleSelect = (optKey, service) => {
    setBookingOptions(optKey);
    if (typeof setService === "function") setService(service);
  };

  const handleKeyDown = (e, optKey, service) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(optKey, service);
    }
  };

  return (
    <div className={container}>
      {cards.map(({ key, title, price, icon: Icon, service, hint }) => (
        <div
          key={key}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected(key)}
          aria-label={`${title} ${isSelected(key) ? "selected" : "not selected"}`}
          onClick={() => handleSelect(key, service)}
          onKeyDown={(e) => handleKeyDown(e, key, service)}
          className={`${baseCard} ${isSelected(key) ? selectedRing : ""}`}
        >
          {/* subtle gradient sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#DDCA7D]/8 via-transparent to-transparent" />

          {/* check badge when selected */}
          {isSelected(key) && (
            <div className="absolute top-3 right-3 w-7 h-7 bg-[#DDCA7D] text-black rounded-full grid place-items-center">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 
                     011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          <div className="h-full min-h-[14rem] sm:min-h-[16rem] flex flex-col items-center justify-center gap-3 px-6 py-8 text-center">
            <div className={pillIcon}>
              <Icon
                className={`w-full h-full ${
                  isSelected(key) ? "text-[#DDCA7D]" : "text-white/80"
                }`}
              />
            </div>
            <h3 className={titleClass}>{title}</h3>
            <div className={priceClass}>{price}</div>

            {/* footer hint */}
            {hint && <div className="mt-2 text-white/60 text-xs">{hint}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookingCard;
