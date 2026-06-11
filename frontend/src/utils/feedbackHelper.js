/**
 * feedbackHelper.js
 * Converts technical stack traces, status codes, and server responses
 * into clear, user-friendly feedback feedback messages.
 */

export function mapFriendlyFeedback(err) {
  if (!err) {
    return "Something went wrong on our side. Please try again later.";
  }

  // Extract raw error string
  let rawMsg = "";
  if (typeof err === 'string') {
    rawMsg = err;
  } else if (err instanceof Error) {
    rawMsg = err.message || "";
  } else if (typeof err === 'object') {
    // Handle API response objects
    rawMsg = err.error || err.message || JSON.stringify(err);
  }

  const lower = rawMsg.toLowerCase();

  // 1. APPLICATION FORM & UPLOAD ERRORS
  if (lower.includes('413') || lower.includes('too large') || lower.includes('payload too large') || lower.includes('entity too large')) {
    return "The uploaded image is too large. Please upload an image smaller than 10MB.";
  }
  
  if (lower.includes('upload') && (lower.includes('document') || lower.includes('file') || lower.includes('image') || lower.includes('fail') || lower.includes('storage'))) {
    return "Unable to upload your document. Please try again.";
  }

  if (lower.includes('missing document') || lower.includes('all required underwriting records') || lower.includes('please upload all required')) {
    return "Please upload all required documents before submitting.";
  }

  if (lower.includes('application') && (lower.includes('save') || lower.includes('create') || lower.includes('could not be submitted') || lower.includes('submit_error') || lower.includes('failed to save') || lower.includes('failed to create'))) {
    return "Your application could not be submitted at this time. Please try again.";
  }

  // 2. NETWORK & SERVER ERRORS
  if (
    lower.includes('network error') || 
    lower.includes('failed to fetch') || 
    lower.includes('connect to the server') || 
    lower.includes('internet connection') || 
    lower.includes('dns_probe') || 
    lower.includes('econndefused')
  ) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  if (
    lower.includes('500') || 
    lower.includes('internal server error') || 
    lower.includes('enoent') || 
    lower.includes('validationerror') || 
    lower.includes('mongoerror') || 
    lower.includes('stack trace') || 
    lower.includes('mongodb') ||
    lower.includes('database error')
  ) {
    return "Something went wrong on our side. Please try again later.";
  }

  // 3. AUTH / LOGIN ERRORS
  // Check specifically for email validity formats first
  if (lower.includes('invalid email address') || (lower.includes('email') && (lower.includes('valid') || lower.includes('format')))) {
    return "Please enter a valid email address.";
  }

  if (
    lower.includes('password') && (lower.includes('incorrect') || lower.includes('invalid') || lower.includes('wrong')) ||
    lower.includes('unauthorized') || 
    lower.includes('credentials')
  ) {
    return "Incorrect email or password.";
  }

  if (lower.includes('no account') || lower.includes('user not found') || lower.includes('account not found')) {
    return "No account found with this email address.";
  }

  if (lower.includes('disabled') || lower.includes('unavailable') || lower.includes('suspended') || lower.includes('banned')) {
    return "Your account is currently unavailable. Please contact support.";
  }

  // 4. SIGNUP ERRORS
  if (lower.includes('already exists') || lower.includes('duplicate key') || lower.includes('already registered') || lower.includes('email in use')) {
    return "An account with this email already exists.";
  }

  if (lower.includes('weak password') || (lower.includes('password') && (lower.includes('8 characters') || lower.includes('length') || lower.includes('too short') || lower.includes('contain')))) {
    return "Password must contain at least 8 characters.";
  }

  if (lower.includes('complete all') || lower.includes('required fields') || lower.includes('missing fields') || lower.includes('fields are required')) {
    return "Please complete all required fields.";
  }

  // 5. TRACK RIDE ERRORS
  if (lower.includes('no matching application') || lower.includes('application search') || lower.includes('not found') && (lower.includes('id') || lower.includes('track'))) {
    return "No application found with this Application ID.";
  }

  if (lower.includes('invalid application id') || lower.includes('please fill') && lower.includes('id')) {
    return "Please enter a valid Application ID.";
  }

  // 6. PAYMENT ERRORS
  if (lower.includes('payment') && (lower.includes('fail') || lower.includes('process') || lower.includes('decline') || lower.includes('error'))) {
    return "Payment could not be processed. Please try again.";
  }

  // 7. ADMIN PANEL ERRORS
  if (lower.includes('save vehicle') || lower.includes('vehicle save') || lower.includes('create car') || lower.includes('update car')) {
    return "Unable to save vehicle information.";
  }

  if (lower.includes('update application') || lower.includes('application update') || lower.includes('status progressed successfully') === false && lower.includes('underwriting status')) {
    return "Unable to update application status.";
  }

  if (lower.includes('notification') || lower.includes('email') && (lower.includes('send') || lower.includes('alert') || lower.includes('reminder') || lower.includes('failed to send'))) {
    return "Unable to send notification at this time.";
  }

  // Clean fallback (removes stack traces or raw details, returns clean generic message or sanitized msg)
  if (rawMsg.includes('Error:') || rawMsg.includes('Exception') || rawMsg.includes('/') || rawMsg.includes('\\') || rawMsg.includes('{')) {
    return "Something went wrong on our side. Please try again later.";
  }

  return rawMsg;
}

export default mapFriendlyFeedback;
