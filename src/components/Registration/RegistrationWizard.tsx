import { useState, useEffect } from "react";
import TeamSizeSelector from "./TeamSizeSelector";
import "./Registration.css";
import { processRegistrationSubmission } from "../../form_handler/registrationHandler";
import type { MemberData } from "../../form_handler/registrationHandler";

const PRICES: Record<number, number> = { 3: 999, 4: 1299, 5: 1599 };
const STORAGE_KEY = "hackfit_registration_draft";

const INITIAL_MEMBER_DATA: MemberData = {
  name: "",
  gender: "",
  institution: "",
  semester: "",
  division: "",
  department: "",
  email: "",
  contact: "",
  foodPreference: "",
  residentialStatus: "",
  teamName: "",
};

export default function RegistrationWizard() {
  const [step, setStep] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).step ?? 1) : 1;
  });

  const [teamSize, setTeamSize] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).teamSize ?? 3) : 3;
  });

  const [formData, setFormData] = useState<MemberData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).formData ?? INITIAL_MEMBER_DATA) : INITIAL_MEMBER_DATA;
  });

  const [members, setMembers] = useState<MemberData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).members ?? []) : [];
  });

  const [leadData, setLeadData] = useState<MemberData | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).leadData ?? null) : null;
  });

  const [memberEntryIndex, setMemberEntryIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).memberEntryIndex ?? 0) : 0;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MemberData, string>>>({});

  const [teamContact, setTeamContact] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).teamContact ?? "") : "";
  });

  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const draft = {
      step,
      teamSize,
      formData,
      members,
      leadData,
      memberEntryIndex,
      teamContact,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [step, teamSize, formData, members, leadData, memberEntryIndex, teamContact]);

  const steps = [
    { number: 1, label: "TEAM SIZE" },
    { number: 2, label: "MEMBER DETAILS" },
    { number: 3, label: "PAYMENT & QR" },
  ];

  const resetFullForm = () => {
    setStep(1);
    setTeamSize(3);
    setMembers([]);
    setLeadData(null);
    setMemberEntryIndex(0);
    setFormData(INITIAL_MEMBER_DATA);
    setTeamContact("");
    setPaymentFile(null);
    setErrors({});
    setIsSuccess(false);
    setIsSubmitting(false);
    setSubmitError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const prevStep = () => {
    if (step === 2) {
      if (memberEntryIndex > 0) {
        const newIndex = memberEntryIndex - 1;
        setMemberEntryIndex(newIndex);

        if (newIndex === 0) {
          if (leadData) setFormData(leadData);
        } else {
          const prevMember = members[newIndex - 1];
          if (prevMember) setFormData(prevMember);
        }
        setErrors({});
      } else {
        setStep(1);
        setMembers([]);
        setLeadData(null);
        setMemberEntryIndex(0);
        setFormData(INITIAL_MEMBER_DATA);
      }
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone.replace(/\s/g, ""));

  const validateForm = () => {
    const newErrors: Partial<Record<keyof MemberData, string>> = {};
    let isValid = true;

    if (!formData.name.trim()) { newErrors.name = "Full name is required"; isValid = false; }
    else if (formData.name.trim().length < 2) { newErrors.name = "Name must be at least 2 characters"; isValid = false; }

    if (!formData.gender) { newErrors.gender = "Gender is required"; isValid = false; }
    if (!formData.institution.trim()) { newErrors.institution = "Institution is required"; isValid = false; }
    if (!formData.semester) { newErrors.semester = "Semester is required"; isValid = false; }
    if (!formData.division) { newErrors.division = "Division is required"; isValid = false; }
    if (!formData.department.trim()) { newErrors.department = "Branch/Department is required"; isValid = false; }

    if (!formData.email.trim()) { newErrors.email = "Email address is required"; isValid = false; }
    else if (!validateEmail(formData.email)) { newErrors.email = "Please enter a valid email address"; isValid = false; }

    if (!formData.contact.trim()) { newErrors.contact = "Phone number is required"; isValid = false; }
    else if (!validatePhone(formData.contact)) { newErrors.contact = "Please enter a valid 10-digit phone number"; isValid = false; }

    if (!formData.foodPreference) { newErrors.foodPreference = "Food preference is required"; isValid = false; }
    if (!formData.residentialStatus) { newErrors.residentialStatus = "Residential status is required"; isValid = false; }

    if (memberEntryIndex === 0 && !formData.teamName?.trim()) {
      newErrors.teamName = "Team name is required"; isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextMember = () => {
    if (!validateForm()) return;

    if (memberEntryIndex === 0) {
      setLeadData(formData);
    } else {
      setMembers((prev) => {
        const idx = memberEntryIndex - 1;
        const updated = [...prev];
        if (updated[idx]) {
          updated[idx] = formData;
        } else {
          updated.push(formData);
        }
        return updated;
      });
    }

    if (memberEntryIndex < teamSize - 1) {
      setMemberEntryIndex((prev) => prev + 1);
      setFormData(INITIAL_MEMBER_DATA);
      setErrors({});
    } else {
      setStep(3);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!teamContact.trim()) {
      setSubmitError("Please enter team contact number");
      return;
    }
    if (!paymentFile) {
      setSubmitError("Please upload payment screenshot");
      return;
    }
    if (!leadData) {
      setSubmitError("Lead data is missing. Please go back and fill member details.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await processRegistrationSubmission(
        teamSize,
        leadData,
        members,
        teamContact,
        paymentFile,
        PRICES[teamSize]
      );

      setIsSuccess(true);
      localStorage.removeItem(STORAGE_KEY); // clear draft on success

    } catch (err: any) {
      setSubmitError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep1Next = () => {
    setStep(2);
    setMemberEntryIndex(0);
    setFormData(INITIAL_MEMBER_DATA);
  };

  const isStep2Filled = (data: MemberData, index: number): boolean => {
    if (!data.name.trim()) return false;
    if (!data.gender) return false;
    if (!data.institution.trim()) return false;
    if (!data.semester) return false;
    if (!data.division) return false;
    if (!data.department.trim()) return false;
    if (!data.email.trim() || !validateEmail(data.email)) return false;
    if (!data.contact.trim() || !validatePhone(data.contact)) return false;
    if (!data.foodPreference) return false;
    if (!data.residentialStatus) return false;
    if (index === 0 && !data.teamName?.trim()) return false;
    return true;
  };

  return (
    <div className="wizard-container">
      <div className="wizard-navbar">
        {steps.map((s, i) => (
          <div key={s.number}>
            <div className={`wizard-step ${step === s.number ? "wizard-step-active" : ""}`}>
              <span className="step-number">{s.number}</span>
              <span className="step-label">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="wizard-arrow" />}
          </div>
        ))}
      </div>

      <div className="registration-content">
        <div className="registration-content-box">
          {step === 1 && (
            <>
              <TeamSizeSelector teamSize={teamSize} setTeamSize={setTeamSize} />
              <button className="wizard-next-btn" onClick={handleStep1Next}>
                NEXT →
              </button>
            </>
          )}

          {step === 2 && (
            <div className="wizard-step-content">
              <button className="wizard-prev-btn" onClick={prevStep}>
                ← PREVIOUS
              </button>

              <h2 className="wizard-section-title">TEAM & MEMBER DETAILS</h2>

              <div className="wizard-form-card">
                <h3 className="wizard-form-title">
                  {memberEntryIndex === 0 ? "TEAM LEAD" : `MEMBER ${memberEntryIndex + 1}`}
                </h3>

                {memberEntryIndex === 0 && (
                  <>
                    <label className="wizard-label">Team Name *</label>
                    <input
                      className="wizard-input"
                      name="teamName"
                      value={formData.teamName ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter your team name"
                    />
                    {errors.teamName && <div className="wizard-error">{errors.teamName}</div>}
                  </>
                )}

                <label className="wizard-label">Full Name *</label>
                <input
                  className="wizard-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
                {errors.name && <div className="wizard-error">{errors.name}</div>}

                <label className="wizard-label">Gender *</label>
                <select className="wizard-select" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <div className="wizard-error">{errors.gender}</div>}

                <label className="wizard-label">Phone Number *</label>
                <input
                  className="wizard-input"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {errors.contact && <div className="wizard-error">{errors.contact}</div>}

                <label className="wizard-label">Email Address *</label>
                <input
                  className="wizard-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
                {errors.email && <div className="wizard-error">{errors.email}</div>}

                <label className="wizard-label">Semester *</label>
                <select className="wizard-select" name="semester" value={formData.semester} onChange={handleInputChange}>
                  <option value="">Select Semester</option>
                  <option>S2</option>
                  <option>S4</option>
                  <option>S6</option>
                  <option>S8</option>
                </select>
                {errors.semester && <div className="wizard-error">{errors.semester}</div>}

                <label className="wizard-label">Branch *</label>
                <select className="wizard-select" name="department" value={formData.department} onChange={handleInputChange}>
                  <option value="">Select Branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Other">Other</option>
                </select>
                {errors.department && <div className="wizard-error">{errors.department}</div>}

                <label className="wizard-label">Institution *</label>
                <input
                  className="wizard-input"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Enter institution name"
                />
                {errors.institution && <div className="wizard-error">{errors.institution}</div>}

                <label className="wizard-label">Division *</label>
                <select className="wizard-select" name="division" value={formData.division} onChange={handleInputChange}>
                  <option value="">Select Division</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
                {errors.division && <div className="wizard-error">{errors.division}</div>}

                <label className="wizard-label">Food Preferences *</label>
                <select className="wizard-select" name="foodPreference" value={formData.foodPreference} onChange={handleInputChange}>
                  <option value="">Select Food Preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
                {errors.foodPreference && <div className="wizard-error">{errors.foodPreference}</div>}

                <label className="wizard-label">Are you a Dayscholar or Hosteler? *</label>
                <select className="wizard-select" name="residentialStatus" value={formData.residentialStatus} onChange={handleInputChange}>
                  <option value="">Select Residential Status</option>
                  <option value="Dayscholar">Dayscholar</option>
                  <option value="Hosteler">Hosteler</option>
                </select>
                {errors.residentialStatus && <div className="wizard-error">{errors.residentialStatus}</div>}
              </div>

              <div style={{ position: "relative", display: "inline-block", textAlign: "center" }}>
                {!isStep2Filled(formData, memberEntryIndex) && (
                  <div className="required-text">Please fill all required fields above</div>
                )}

                <button className="wizard-next-btn" onClick={handleNextMember}>
                  {memberEntryIndex === 0
                    ? "+ MEMBER 2 DETAILS"
                    : memberEntryIndex === teamSize - 1
                    ? "FINISH → PAYMENT"
                    : `+ MEMBER ${memberEntryIndex + 2} DETAILS`}
                </button>

                {!isStep2Filled(formData, memberEntryIndex) && (
                  <span className="red-indicator" title="Required fields missing"></span>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step-content">
              <button
                className="wizard-prev-btn"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                ← PREVIOUS
              </button>

              <h2 className="wizard-section-title">PAYMENT & QR</h2>

              {isSuccess ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <h2 style={{ color: "#4caf50", marginBottom: "1.5rem" }}>
                    🎉 Registration Successful!
                  </h2>
                  <p>Thank you for registering your team.</p>
                  <p>You should receive confirmation shortly.</p>
                  <button
                    className="wizard-next-btn"
                    style={{ marginTop: "2rem" }}
                    onClick={resetFullForm}
                  >
                    Register Another Team
                  </button>
                </div>
              ) : (
                <div className="wizard-payment-card">
                  <h3 className="wizard-payment-title">REGISTRATION FEE</h3>
                  <p className="wizard-payment-amount">₹ {PRICES[teamSize]}</p>
                  <p className="wizard-payment-instruction">Scan QR code and complete payment</p>

                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=HackFitPayment"
                    className="wizard-qr"
                    alt="Payment QR Code"
                  />

                  <label className="wizard-label">Team Contact Number *</label>
                  <input
                    className="wizard-input"
                    placeholder="Enter contact number"
                    value={teamContact}
                    onChange={(e) => setTeamContact(e.target.value)}
                    disabled={isSubmitting}
                  />

                  <label className="wizard-label">Upload Payment Screenshot *</label>
                  <input
                    className="wizard-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.length) setPaymentFile(e.target.files[0]);
                    }}
                    disabled={isSubmitting}
                  />

                  {submitError && (
                    <div style={{
                      color: "#d32f2f",
                      margin: "1.2rem 0",
                      fontWeight: 500,
                      background: "#ffebee",
                      padding: "12px",
                      borderRadius: "6px",
                    }}>
                      {submitError}
                    </div>
                  )}

                  <button
                    className="wizard-next-btn"
                    onClick={handlePaymentSubmit}
                    disabled={isSubmitting || !teamContact.trim() || !paymentFile}
                    style={{
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      minHeight: "52px",
                    }}
                  >
                    {isSubmitting ? (
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                      }}>
                        <span className="spinner"></span>
                        Submitting...
                      </span>
                    ) : (
                      "SUBMIT REGISTRATION"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}