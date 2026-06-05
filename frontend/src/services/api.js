// Base URL pointing to the backend (empty string or VITE_API_URL)
const BASE_URL = import.meta.env.VITE_API_URL || '';

// Global cache for CSRF Token
let csrfTokenCache = null;

/**
 * Fetch and seed a secure double-submit CSRF token.
 */
export async function fetchCSRFToken() {
  try {
    const res = await fetch(`${BASE_URL}/api/csrf-token`);
    if (!res.ok) throw new Error('Failed to retrieve security context CSRF key.');
    const data = await res.json();
    csrfTokenCache = data.csrfToken;
    return csrfTokenCache;
  } catch (err) {
    console.error('CSRF initial seed issue:', err);
    return null;
  }
}

/**
 * Perform a secure, CSRF-aware HTTP request.
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}/api${endpoint}`;
  
  // Set headers
  const headers = {
    ...options.headers,
  };

  // Auto-detect JSON payload content-type
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Ensure CSRF token is present for unsafe actions
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    if (!csrfTokenCache) {
      await fetchCSRFToken();
    }
    if (csrfTokenCache) {
      headers['x-csrf-token'] = csrfTokenCache;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = `Request failed with code ${response.status}`;
    try {
      const errJSON = JSON.parse(errText);
      errMsg = errJSON.error || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
}

export const api = {
  // Auth methods
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    signup: (user) => apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
    sendSignupOTP: (user) => apiRequest('/auth/signup-send-otp', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
    verifySignupOTP: (payload) => apiRequest('/auth/signup-verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    googleLogin: (token) => apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential: token }),
    }),
    logout: () => apiRequest('/auth/logout', {
      method: 'POST',
    }),
    updateProfile: (profile) => apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
    getDriverData: (email) => apiRequest(`/user/data?email=${encodeURIComponent(email)}`),
    getGoogleClientId: () => apiRequest('/config/google-client-id'),
  },

  // Cars Inventory
  cars: {
    list: () => apiRequest('/cars'),
    create: (car) => apiRequest('/cars', {
      method: 'POST',
      body: JSON.stringify(car),
    }),
    update: (id, car) => apiRequest(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
    }),
    delete: (id) => apiRequest(`/cars/${id}`, {
      method: 'DELETE',
    }),
  },

  // Lease / Underwriting Applications
  applications: {
    create: (payload) => apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    updateStep: (id, step) => apiRequest(`/applications/${id}/step`, {
      method: 'PUT',
      body: JSON.stringify({ step }),
    }),
    updateDocuments: (id, docs) => apiRequest(`/applications/${id}/documents`, {
      method: 'PUT',
      body: JSON.stringify(docs),
    }),
  },

  // Payments / Transactions
  payments: {
    create: (payload) => apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },

  // Admin dedicated utilities
  admin: {
    getAllRecords: () => apiRequest('/admin/all-records'),
    addCar: (payload) => apiRequest('/admin/add-car', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    editCar: (id, payload) => apiRequest(`/admin/edit-car/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    deleteCar: (id) => apiRequest(`/admin/delete-car/${id}`, {
      method: 'DELETE',
    }),
    getApplications: () => apiRequest('/admin/applications'),
    updateApplicationStatus: (id, payload) => apiRequest(`/admin/application-status/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    getUsers: () => apiRequest('/admin/users'),
    deleteUser: (email) => apiRequest(`/admin/user/${email}`, {
      method: 'DELETE',
    }),
    blockUser: (email, blocked) => apiRequest(`/admin/user/block/${email}`, {
      method: 'PUT',
      body: JSON.stringify({ blocked }),
    }),
    getPayments: () => apiRequest('/admin/payments'),
    verifyPayment: (id) => apiRequest(`/admin/payments/verify/${id}`, {
      method: 'POST',
    }),
    getEmails: () => apiRequest('/admin/emails'),
    sendEmail: (payload) => apiRequest('/admin/emails/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    uploadInsurance: (payload) => apiRequest('/admin/emails/upload-insurance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    getInquiries: () => apiRequest('/admin/inquiries'),
    submitInquiry: (payload) => apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    createAgreement: (payload) => apiRequest('/agreements', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    deleteApplication: (id) => apiRequest(`/applications/${id}`, {
      method: 'DELETE',
    }),
    deleteAgreement: (id) => apiRequest(`/agreements/${id}`, {
      method: 'DELETE',
    }),
    deletePayment: (id) => apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    }),
    updateUserRole: (email, role) => apiRequest('/admin/users/role', {
      method: 'PUT',
      body: JSON.stringify({ email, role }),
    }),
  },

  // Upload helpers
  upload: {
    avatar: async (file) => {
      const fd = new FormData();
      fd.append('avatar', file);
      
      const headers = {};
      if (csrfTokenCache) headers['x-csrf-token'] = csrfTokenCache;

      const res = await fetch(`${BASE_URL}/api/upload/avatar`, {
        method: 'POST',
        body: fd,
        headers,
      });
      if (!res.ok) throw new Error('Avatar image upload fail.');
      return res.json();
    },
    carImage: async (file) => {
      const fd = new FormData();
      fd.append('carImage', file);

      const headers = {};
      if (csrfTokenCache) headers['x-csrf-token'] = csrfTokenCache;

      const res = await fetch(`${BASE_URL}/api/upload/car-image`, {
        method: 'POST',
        body: fd,
        headers,
      });
      if (!res.ok) throw new Error('Car image upload fail.');
      return res.json();
    },
    documents: async (licenseFrontFile, licenseBackFile, addressProofFile) => {
      console.log("[CLIENT-API-DEBUG] Uploading documents...", {
        licenseFrontFile: licenseFrontFile ? licenseFrontFile.name : null,
        licenseBackFile: licenseBackFile ? licenseBackFile.name : null,
        addressProofFile: addressProofFile ? addressProofFile.name : null
      });

      const fd = new FormData();
      if (licenseFrontFile) fd.append('licenseFront', licenseFrontFile);
      if (licenseBackFile) fd.append('licenseBack', licenseBackFile);
      if (addressProofFile) fd.append('proofOfAddress', addressProofFile);

      if (!csrfTokenCache) {
        console.log("[CLIENT-API-DEBUG] CSRF token cache is empty, fetching new one first...");
        await fetchCSRFToken();
      }

      const headers = {};
      if (csrfTokenCache) {
        headers['x-csrf-token'] = csrfTokenCache;
      }

      console.log("[CLIENT-API-DEBUG] Dispatching fetch for upload/documents with headers:", headers);

      const res = await fetch(`${BASE_URL}/api/upload/documents`, {
        method: 'POST',
        body: fd,
        headers,
      });

      console.log("[CLIENT-API-DEBUG] Received upload response. Status:", res.status, "Ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[CLIENT-API-DEBUG] Upload failed with text:", errorText);
        throw new Error(`Underwriting lease document uploads fail: ${errorText || res.statusText}`);
      }

      const data = await res.json();
      console.log("[CLIENT-API-DEBUG] Upload succeeded. Response data:", data);
      return data;
    },
  },
};
