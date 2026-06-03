import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { default as axios } from "axios";

export default async function (
  uri: string,
  options: AxiosRequestConfig = {}
): Promise<any> {
  const {
    public: { apiBaseUrl: BASE_URL, backendUrl: BACKEND_URL },
  } = useRuntimeConfig();

  // Construct the request config
  const config: AxiosRequestConfig = {
    url:
      uri.startsWith("https://") || uri.startsWith("http://")
        ? `${uri}`
        : `${BASE_URL}${uri}`,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    withCredentials: true, // Ensure credentials are sent with each request
    withXSRFToken: true,
    ...options,
  };

  const method = (options.method || "GET").toUpperCase();
  const isStateChanging =
    ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  console.log(method, isStateChanging);

  // Get token from localStorage only on client side
  let token = null;
  if (import.meta.client && typeof localStorage !== "undefined") {
    token = localStorage.getItem("token");
  }

  // Set Authorization header if token exists
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }

  // Create Axios instance with the initial config
  const apiInstance: AxiosInstance = axios.create(config);

  // Retrieve CSRF token from cookie
  const csrfTokenCache = useCookie("XSRF-TOKEN").value;

  const applyCsrfHeader = (csrfToken: unknown) => {
    const value = typeof csrfToken === "string" ? csrfToken : String(csrfToken);
    if (!value) return;
    // Laravel Sanctum expects the XSRF token in this header name.
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)["X-XSRF-TOKEN"] = value;
  };

  // If CSRF token is not available, fetch it from the backend
  if (isStateChanging && !csrfTokenCache) {
    try {
      // Fetch CSRF token from the Laravel backend
      await apiInstance.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // Wait a moment for the cookie to be persisted in the browser.
      await new Promise((resolve) => setTimeout(resolve, 200));

      const csrfCookie = useCookie("XSRF-TOKEN");
      const newCsrfToken = csrfCookie.value;

      if (newCsrfToken) {
        applyCsrfHeader(newCsrfToken);
      } else {
        console.error("CSRF token is not available after fetching.");
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw new Error("Unable to fetch CSRF token");
    }
  } else {
    // If CSRF token is already available, ensure it is applied to the outgoing request.
    if (isStateChanging && csrfTokenCache) {
      applyCsrfHeader(csrfTokenCache);
    }
  }

  // Create a response interceptor to handle the 401 error (unauthorized)
  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: any) => {
      if (error.response && error.response.status === 401) {
        // Only handle localStorage on client side
        if (import.meta.client && typeof localStorage !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }

        // Redirect to login page if authentication fails (only on client)
        if (import.meta.client) {
          const route = useRoute();
          const currentRoute = route.fullPath;

          const isAlreadyRedirecting =
            currentRoute.includes("/401") && currentRoute.includes("redirect=");

          if (!isAlreadyRedirecting) {
            // Redirect to login with a proper redirect parameter
            navigateTo(`/401?redirect=${encodeURIComponent(currentRoute)}`);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  // Make the request using the configured axios instance
  try {
    return await apiInstance.request<any>(config);
  } catch (error) {
    // Laravel returns 419 on CSRF mismatch (e.g. token rotated / cookie not present).
    // Retry once after forcing a fresh CSRF cookie.
    if (
      isStateChanging &&
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as any).response?.status === 419 &&
      !(config as any).__csrfRetried
    ) {
      (config as any).__csrfRetried = true;
      try {
        await apiInstance.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
        const csrfCookie = useCookie("XSRF-TOKEN");
        if (csrfCookie.value) applyCsrfHeader(csrfCookie.value);
        return await apiInstance.request<any>(config);
      } catch (retryError) {
        console.error("CSRF retry failed:", retryError);
      }
    }

    console.error("Error in Axios request:", error);
    throw error;
  }
}
