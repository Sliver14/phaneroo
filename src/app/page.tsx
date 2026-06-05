"use client";

import { useState } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import {
  IconStarFilled,
  IconCalendarEvent,
  IconMapPin,
  IconClock,
  IconUser,
  IconMail,
  IconBrandWhatsapp,
  IconMapPinCheck,
  IconCheck,
  IconDeviceTv,
  IconBus,
  IconCar,
  IconCurrentLocation,
  IconArrowRightCircle,
  IconClipboardCheck,
  IconShare2,
  IconPray,
  IconCopy,
} from "@tabler/icons-react";

interface FormData {
  fullName: string;
  email: string;
  whatsapp: string;
  attendance: "yes" | "no" | "";
  bus: "yes" | "no" | "";
  busAddress: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    whatsapp: "",
    attendance: "",
    bus: "",
    busAddress: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wasAlreadyRegistered, setWasAlreadyRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, name, type } = e.target;
    if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    // Clear error for this field
    if (errors[id || name]) {
      setErrors((prev) => ({ ...prev, [id || name]: false }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = true;
    if (!formData.whatsapp.trim()) newErrors.whatsapp = true;
    if (!formData.attendance) newErrors.attendance = true;
    if (!formData.bus) newErrors.bus = true;
    if (formData.bus === "yes" && !formData.busAddress.trim()) newErrors.busAddress = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (result.alreadyRegistered) {
            setWasAlreadyRegistered(true);
          }
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          alert(result.error || "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to connect to the server.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Link copied!");
    });
  };

  const shareWA = () => {
    const msg = encodeURIComponent(
      `Join me at Phaneroo Port Harcourt — Manifestation & Glory! 🔥\n📅 Fri 26 & Sat 27 June 2026\n📍 Opal Place, NTA Road\n\nRegister here: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const registerNew = () => {
    setFormData({
      fullName: "",
      email: "",
      whatsapp: "",
      attendance: "",
      bus: "",
      busAddress: "",
    });
    setIsSubmitted(false);
    setWasAlreadyRegistered(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCalendar = () => {
    const event = {
      title: "Phaneroo Port Harcourt: Manifestation & Glory",
      description: "Prepare your heart for a manifestation of glory at Opal Place.",
      location: "Opal Place, NTA Road, Port Harcourt",
      startTime: "20260626T150000Z",
      endTime: "20260627T210000Z",
    };

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(
      event.location
    )}&dates=${event.startTime}/${event.endTime}`;
    
    window.open(url, "_blank");
  };

  if (isSubmitted) {
    return (
      <main>
        <div className="banner-wrap">
          <Image
            src="/phanero.png"
            alt="Phaneroo Port Harcourt Banner"
            width={1200}
            height={290}
            priority
          />
        </div>
        <div className="page">
          <div className="success-page" style={{ padding: 0, background: "transparent" }}>
            <div className="success-inner">
              <div className="check-ring">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="#1A1A1A" strokeWidth="4" />
                  <circle
                    className="ring-circle"
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#FFC630"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="check-icon">
                  <IconCheck size={42} />
                </div>
              </div>

              <h2>{wasAlreadyRegistered ? "ALREADY REGISTERED!" : "YOU'RE IN!"}</h2>
              <p className="sub-heading">
                {wasAlreadyRegistered 
                  ? "You have already signed up for this event." 
                  : "Registration Confirmed"}
              </p>

              <div className="detail-card">
                <p className="card-title">
                  <IconClipboardCheck
                    size={13}
                    style={{ verticalAlign: "-1px", marginRight: "5px" }}
                  />{" "}
                  Your Details
                </p>

                <div className="detail-row">
                  <IconUser size={19} />
                  <div>
                    <p className="label">Full Name</p>
                    <p className="value">{formData.fullName}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <IconMail size={19} />
                  <div>
                    <p className="label">Email Address</p>
                    <p className="value">{formData.email}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <IconBrandWhatsapp size={19} />
                  <div>
                    <p className="label">WhatsApp</p>
                    <p className="value">{formData.whatsapp}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <IconMapPinCheck size={19} />
                  <div>
                    <p className="label">Attendance</p>
                    <p className="value">
                      {formData.attendance === "yes" ? "In-person attendance" : "Online only"}
                    </p>
                  </div>
                </div>

                {formData.bus === "yes" && (
                  <div className="detail-row">
                    <IconBus size={19} />
                    <div>
                      <p className="label">Bus Pickup</p>
                      <p className="value">{formData.busAddress}</p>
                    </div>
                  </div>
                )}

                <div className="detail-row">
                  <IconCalendarEvent size={19} />
                  <div>
                    <p className="label">Event Dates</p>
                    <p className="value">Fri 26 & Sat 27 June 2026</p>
                  </div>
                </div>

                <div className="detail-row">
                  <IconMapPin size={19} />
                  <div>
                    <p className="label">Venue</p>
                    <p className="value">Opal Place, NTA Road, Opp. National Open University</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button 
                  className="submit-btn" 
                  onClick={addToCalendar}
                  style={{ backgroundColor: "transparent", border: "2px solid #FFC630", color: "#FFC630" }}
                >
                  <IconCalendarEvent size={20} /> Add to Google Calendar
                </button>
                <button 
                  className="submit-btn" 
                  onClick={registerNew}
                  style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF", border: "1px solid #333" }}
                >
                  <IconUser size={20} /> Register Another Person
                </button>
              </div>

              <div className="next-steps">
                <div className="step-box">
                  <IconBrandWhatsapp size={24} />
                  <p className="step-title">Watch WhatsApp</p>
                  <p>Updates & reminders will be sent to your number</p>
                </div>
                <div className="step-box">
                  <IconShare2 size={24} />
                  <p className="step-title">Tell a Friend</p>
                  <p>Invite others to join Manifestation & Glory</p>
                </div>
                <div className="step-box">
                  <IconClock size={24} />
                  <p className="step-title">Arrive Early</p>
                  <p>Friday 4pm · Saturday 10am</p>
                </div>
                <div className="step-box">
                  <IconPray size={24} />
                  <p className="step-title">Come Ready</p>
                  <p>Prepare your heart for glory</p>
                </div>
              </div>

              <div className="share-row">
                <button className="share-btn" onClick={copyLink}>
                  <IconCopy size={17} /> Copy Link
                </button>
                <button className="share-btn" onClick={shareWA}>
                  <IconBrandWhatsapp size={17} /> Share on WhatsApp
                </button>
              </div>
            </div>
          </div>
          <p className="footer">Ascend · Phaneroo Ministries</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="banner-wrap">
        <Image
          src="/phanero.png"
          alt="Phaneroo Port Harcourt Banner"
          width={1200}
          height={290}
          priority
        />
      </div>

      <div className="page">
        <div className="event-header">
          <div className="eyebrow">
            <IconStarFilled size={14} /> Event Registration <IconStarFilled size={14} />
          </div>
          <h1>
            PHANEROO
            <br />
            <span>PORT HARCOURT</span>
          </h1>
          <p className="theme-label">Manifestation & Glory</p>
          <div className="pills">
            <div className="pill">
              <IconCalendarEvent size={17} /> <strong>Fri 26</strong>&nbsp;&&nbsp;
              <strong>Sat 27</strong> June 2026
            </div>
            <div className="pill">
              <IconMapPin size={17} /> Opal Place, NTA Road
            </div>
            <div className="pill">
              <IconClock size={17} /> Fri 4pm · Sat 10am
            </div>
          </div>
        </div>

        <CountdownTimer targetDate="2026-06-26T16:00:00" />

        <div className="divider">
          <span>Secure Your Seat</span>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label>
                <IconUser size={16} /> Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? "shake" : ""}
                required
              />
            </div>

            <div className="field-group">
              <label>
                <IconMail size={16} /> Email Address <span className="req">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="yourname@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "shake" : ""}
                required
              />
            </div>

            <div className="field-group">
              <label>
                <IconBrandWhatsapp size={16} /> WhatsApp Number <span className="req">*</span>
              </label>
              <input
                type="tel"
                id="whatsapp"
                placeholder="+234 000 000 0000"
                autoComplete="tel"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className={errors.whatsapp ? "shake" : ""}
                required
              />
            </div>

            <hr className="sep" />

            <div className="field-group">
              <label>
                <IconMapPinCheck size={16} /> Physical Attendance <span className="req">*</span>
              </label>
              <div className="toggle-group">
                <label>
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === "yes"}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="toggle-btn">
                    <IconCheck size={17} /> Yes, I&apos;ll be there
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === "no"}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-btn">
                    <IconDeviceTv size={17} /> Online only
                  </span>
                </label>
              </div>
            </div>

            <hr className="sep" />

            <div className="field-group">
              <label>
                <IconBus size={16} /> Require a Bus? <span className="req">*</span>
              </label>
              <div className="toggle-group">
                <label>
                  <input
                    type="radio"
                    name="bus"
                    value="yes"
                    checked={formData.bus === "yes"}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="toggle-btn">
                    <IconBus size={17} /> Yes, I need a bus
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="bus"
                    value="no"
                    checked={formData.bus === "no"}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-btn">
                    <IconCar size={17} /> No, I&apos;m fine
                  </span>
                </label>
              </div>
              <div className={`bus-sub ${formData.bus === "yes" ? "visible" : ""}`}>
                <p className="bus-note">
                  <IconCurrentLocation size={15} /> Provide your pickup address below:
                </p>
                <input
                  type="text"
                  id="busAddress"
                  placeholder="e.g. 14 Rumuola Road, Port Harcourt"
                  value={formData.busAddress}
                  onChange={handleInputChange}
                  className={errors.busAddress ? "shake" : ""}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <IconArrowRightCircle size={20} />
              {isSubmitting ? "Registering..." : "Register Now"}
            </button>
          </form>
        </div>

        <p className="footer">Ascend · Phaneroo Ministries</p>
      </div>
    </main>
  );
}
