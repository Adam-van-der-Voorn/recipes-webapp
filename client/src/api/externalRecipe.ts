import { User } from "firebase/auth";

export async function addFromUrl(fbUser: User, url: string) {
  const token = await fbUser.getIdToken(/* forceRefresh */ true);
  const body = JSON.stringify({ url });
  const res = await fetch("/api/external-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `JWT ${token}`,
    },
    body,
  });
  if (!res.ok) {
    const j = await res.json();
    throw new Error(j);
  }
}

export async function getFromUrl(url: string) {
  const qp = `url=${encodeURIComponent(url)}`;
  const res = await fetch("/api/external-recipe?" + qp, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw json;
  }

  // quick validation, we at LEAST need a name
  const name = json?.recipe?.name;
  if (name === undefined || name === "" || name === null) {
    console.error("bad api response? OK status but no recipe");
    throw { error: "Unkown client error" };
  }

  return json.recipe;
}
