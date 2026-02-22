export interface MemberData {
  name: string;
  gender: string;
  institution: string;
  semester: string;
  division: string;
  department: string;
  email: string;
  contact: string;
  foodPreference: string;
  residentialStatus: string;
  teamName?: string;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
};

const cleanString = (str: string) => {
  if (!str) return "";
  return str.trim().replace(/[<>"/\\;]/g, "");
};

const sanitizeMember = (member: MemberData): MemberData => ({
  name: cleanString(member.name),
  gender: member.gender,
  institution: cleanString(member.institution),
  semester: member.semester,
  division: member.division,
  department: cleanString(member.department),
  email: member.email.trim().toLowerCase(),
  contact: member.contact.trim(),
  foodPreference: member.foodPreference,
  residentialStatus: member.residentialStatus,
  teamName: member.teamName ? cleanString(member.teamName) : undefined,
});

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Please upload JPG, PNG, or WEBP.`,
    };
  }

  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Invalid file extension: .${extension}`,
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      isValid: false,
      error: "File size too large. Maximum allowed is 5MB.",
    };
  }

  return { isValid: true };
};

export const processRegistrationSubmission = async (
  teamSize: number,
  lead: MemberData,
  members: MemberData[],
  paymentContact: string,
  paymentFile: File,
  amount: number
) => {
  const fileCheck = validateImageFile(paymentFile);
  if (!fileCheck.isValid) {
    throw new Error(fileCheck.error);
  }

  const sanitizedLead = sanitizeMember(lead);
  const sanitizedMembers = members.map(sanitizeMember);

  const screenshotUrl = await uploadImageToCloudinary(paymentFile);

  const response = await fetch(`${API_BASE_URL}/api/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      teamSize,
      lead: sanitizedLead,
      members: sanitizedMembers,
      payment: {
        contact: paymentContact.trim(),
        screenshotUrl: screenshotUrl,
      },
      totalAmount: amount,
      submittedAt: new Date().toISOString(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};