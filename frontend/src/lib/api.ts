const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function fetchRegistrations() {
  const res = await fetch(`${API_URL}/registrations/`);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function createRegistration(data: any) {
  const res = await fetch(`${API_URL}/registrations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create record");
  }

  return res.json();
}

export async function updateRegistration(id: number, data: any) {
  const res = await fetch(`${API_URL}/registrations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update record");
  }

  return res.json();
}
