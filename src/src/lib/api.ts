export const login = async (username: string, password: string) => {
  console.log("Sending login request to:", "http://127.0.0.1:8000/api/token/", {
    username,
    password,
  });

  const response = await fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const raw = await response.text();
  console.log("Raw response:", raw);

  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("JSON parse error:", err);
  }

  if (!response.ok) {
    console.log("Login error response:", data);
    throw new Error(data.detail || "Login failed");
  }

  return data;
};
