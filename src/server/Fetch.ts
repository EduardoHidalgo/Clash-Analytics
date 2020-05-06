import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";

type Methods = "GET" | "POST" | "PUT" | "DELETE";

/** Método que realiza las peticiones síncronas.
 *
 * @param requestInfo URI de Riot API.
 * @param method Verbo REST.
 * @param apiKey Clave para hacer uso de la Riot API.
 */
export async function Fetch<T>(
  requestInfo: RequestInfo,
  method: Methods,
  apiKey?: string
): Promise<T> {
  const requestInit: RequestInit = {
    method: method,
    headers: {
      "X-Riot-Token": apiKey ? apiKey : "",
      Origin: "https://developer.riotgames.com",
    },
  };

  return (await fetch(requestInfo, requestInit)
    .then((res: Response) => res.json())
    .then((res) => res)
    .catch((error) => {
      console.log(error);
      return null;
    })) as T;
}
