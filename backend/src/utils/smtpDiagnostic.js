import "../config/loadEnv.js";
import dns from "dns";
import net from "net";
import nodemailer from "nodemailer";

// Helper to sanitize env variables
const sanitizeEnv = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^['"]|['"]$/g, "").trim();
};

export async function runSmtpDiagnostics() {
  const host = sanitizeEnv(process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com");
  const port = Number(sanitizeEnv(process.env.BREVO_SMTP_PORT)) || 587;
  const user = sanitizeEnv(process.env.BREVO_SMTP_USER || process.env.EMAIL_USER);
  const pass = sanitizeEnv(process.env.BREVO_SMTP_PASSWORD || process.env.EMAIL_PASS);

  const results = {
    envLoad: { status: "UNKNOWN", message: "" },
    dnsLookup: { status: "UNKNOWN", ips: [], message: "" },
    tcpConnect: { status: "UNKNOWN", message: "", details: null },
    nodemailerVerify: { status: "UNKNOWN", message: "", consoleLogs: [] }
  };

  console.log("\n======================================================================");
  console.log("🔍 [BREVO SMTP DIAGNOSTICS SUITE] STARTING FULL CHANNEL AUDIT");
  console.log("======================================================================");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Host Configured: "${host}"`);
  console.log(`Port Configured: ${port}`);
  console.log(`User Credential: "${user ? user.substring(0, 6) + "..." : "MISSING"}"`);
  console.log(`Pass Credential: "${pass ? "configured" : "MISSING"}"`);
  console.log("======================================================================\n");

  // --- STEP 1: ENV CHECK ---
  console.log("👉 STEP 1: Verifying Environment Variable Injection...");
  if (!user || !pass) {
    results.envLoad = {
      status: "WARNING",
      message: "Brevo SMTP credentials are not fully defined. Falling back to simulation mode in logs."
    };
    console.log("⚠️  Environment load warning: SMTP credentials missing.");
  } else {
    results.envLoad = {
      status: "SUCCESS",
      message: "Environment variables loaded and sanitized successfully."
    };
    console.log("✅ Credentials loaded safely.");
  }

  // --- STEP 2: DNS CHECK ---
  console.log("\n👉 STEP 2: Resolving SMTP Host via DNS...");
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolve4(host, (err, addresses) => {
        if (err) {
          dns.lookup(host, (lookupErr, address) => {
            if (lookupErr) {
              reject(lookupErr);
            } else {
              resolve([address]);
            }
          });
        } else {
          resolve(addresses);
        }
      });
    });

    results.dnsLookup = {
      status: "SUCCESS",
      ips: addresses,
      message: `Resolved ${host} to IP(s): ${addresses.join(", ")}`
    };
    console.log(`✅ DNS Lookup passed. Host resolved successfully: ${addresses.join(", ")}`);
  } catch (dnsErr) {
    results.dnsLookup = {
      status: "FAILED",
      ips: [],
      message: `DNS resolution failed for ${host}. Error: ${dnsErr.message || dnsErr}`
    };
    console.log(`❌ DNS Lookup failed! Please ensure the host domain is correct and active. Details: ${dnsErr.message}`);
  }

  // --- STEP 3: TCP HANDSHAKE SOCKET CHECK ---
  console.log("\n👉 STEP 3: Attempting Raw TCP Handshake Socket Connection...");
  if (results.dnsLookup.status === "SUCCESS" && results.dnsLookup.ips.length > 0) {
    const targetIp = results.dnsLookup.ips[0];
    const timeoutMs = 8000; // 8 seconds timeout to intercept ETIMEDOUT nicely

    await new Promise((resolve) => {
      console.log(`Connecting directly to target socket ${targetIp}:${port} (Timeout: ${timeoutMs}ms)...`);
      const socket = new net.Socket();
      
      const timer = setTimeout(() => {
        results.tcpConnect = {
          status: "FAILED",
          message: `TCP Connection timed out after ${timeoutMs}ms. This strongly indicates outbound port blocking!`,
          details: { code: "ETIMEDOUT" }
        };
        console.log(`❌ TCP Handshake timed out! Private cloud environments or Railway may occasionally block outbound port ${port}.`);
        socket.destroy();
        resolve();
      }, timeoutMs);

      socket.connect(port, targetIp, () => {
        clearTimeout(timer);
        results.tcpConnect = {
          status: "SUCCESS",
          message: `TCP socket successfully established with ${targetIp}:${port}. No firewall blocks detected.`
        };
        console.log(`✅ TCP Handshake success! Target socket ${targetIp}:${port} is reachable.`);
        socket.end();
        resolve();
      });

      socket.on("error", (err) => {
        clearTimeout(timer);
        results.tcpConnect = {
          status: "FAILED",
          message: `TCP Socket connection failed during socket setup. Error: ${err.message}`,
          details: { code: err.code, message: err.message }
        };
        console.log(`❌ TCP Socket error intercepted: ${err.code} - ${err.message}`);
        resolve();
      });
    });
  } else {
    results.tcpConnect = {
      status: "SKIPPED",
      message: "Skipped due to upstream DNS resolution failure."
    };
    console.log("⏭️  TCP Handshake step skipped due to DNS resolution failure.");
  }

  // --- STEP 4: NODEMAILER STAGE & SMTP INTERFERING WITH AUTH ---
  console.log("\n👉 STEP 4: Initializing Nodemailer Protocol handshake with Authentication...");
  if (user && pass && results.dnsLookup.status === "SUCCESS") {
    // Collect protocol debug stream logs
    const debugLogs = [];
    const customLogger = {
      info: (info) => { debugLogs.push(`[INFO] ${info.message}`); },
      warn: (warn) => { debugLogs.push(`[WARN] ${warn.message}`); },
      error: (error) => { debugLogs.push(`[ERROR] ${error.message}`); }
    };

    try {
      const diagTransporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true,
        logger: customLogger
      });

      console.log("Triggering transporter.verify() control flight...");
      await diagTransporter.verify();
      
      results.nodemailerVerify = {
        status: "SUCCESS",
        message: "Nodemailer transport verification succeeded! Login details and TLS security layer confirmed.",
        consoleLogs: debugLogs
      };
      console.log("✅ Nodemailer verification checklist completed! Transporter channels are fully functional.");
    } catch (verifyErr) {
      results.nodemailerVerify = {
        status: "FAILED",
        message: `Nodemailer verify threw exception: ${verifyErr.message}`,
        details: { code: verifyErr.code, command: verifyErr.command },
        consoleLogs: debugLogs
      };
      console.log(`❌ Nodemailer verification failed! Error: ${verifyErr.message}`);
    }
  } else {
    results.nodemailerVerify = {
      status: "SKIPPED",
      message: "Skipped due to lack of SMTP credentials or upstream DNS failure."
    };
    console.log("⏭️  Nodemailer diagnostic skipped (No SMTP configurations found or DNS failure).");
  }

  // --- PRETTIFY TRANSCRIPTS DIAGNOSTIC REPORTS ---
  console.log("\n======================================================================");
  console.log("📊 [BREVO DIAGNOSTIC TRANSCRIPT AUDIT MATRIX]");
  console.log("======================================================================");
  console.log(`1. Environment Variable Inject:    [ ${results.envLoad.status} ] - ${results.envLoad.message}`);
  console.log(`2. DNS Hostname Resolution:        [ ${results.dnsLookup.status} ] - ${results.dnsLookup.message}`);
  console.log(`3. Direct TCP Socket Handshake:    [ ${results.tcpConnect.status} ] - ${results.tcpConnect.message}`);
  console.log(`4. Full Protocol Handshake Verification: [ ${results.nodemailerVerify.status} ] - ${results.nodemailerVerify.message}`);
  console.log("======================================================================\n");

  if (results.nodemailerVerify.consoleLogs && results.nodemailerVerify.consoleLogs.length > 0) {
    console.log("📝 [SMTP PROTOCOL LOGS STREAM] INTERACTION TRANSCRIPT:");
    console.log("----------------------------------------------------------------------");
    results.nodemailerVerify.consoleLogs.forEach((log) => console.log(`  ${log}`));
    console.log("----------------------------------------------------------------------\n");
  }

  // Actionable advisory logic based on failure profile
  console.log("💡 [ACTIONABLE ENGINEERING MITIGATIVE FEEDBACK] ADVISORY NOTES:");
  if (results.tcpConnect.status === "FAILED") {
    console.log("  ⚠️  NETWORK TIMEOUT INDICATOR (ETIMEDOUT / Outbound Block):");
    console.log("    - The SMTP host is perfectly live via DNS, but connection attempts were timed out or aborted.");
    console.log("    - Railway environment host egress controls might block standard plain text/StartTLS ports (e.g. 587, 25).");
    console.log("    - SOLUTIONS:");
    console.log("      1. Swap BREVO_SMTP_PORT from '587' to SMTPS secure port '465' (or vice versa).");
    console.log("      2. Double check if Brevo requires TLS handshake on port 465 explicitly.");
    console.log("      3. Verify your Brevo API SMTP key is fully active and not disabled/blocked inside brevo.com.");
  } else if (results.nodemailerVerify.status === "FAILED") {
    const isAuthErr = results.nodemailerVerify.message.toLowerCase().includes("auth") || 
                      results.nodemailerVerify.message.toLowerCase().includes("username") ||
                      results.nodemailerVerify.message.toLowerCase().includes("password");
    if (isAuthErr) {
      console.log("  ⚠️  SMTP AUTHENTICATION FAILURE (Invalid API Credentials):");
      console.log("    - Handshake completed, but Brevo server rejected SMTP authentication details.");
      console.log("    - SOLUTIONS:");
      console.log("      1. Verify BREVO_SMTP_USER email account string exactly matches Brevo master credentials.");
      console.log("      2. Ensure BREVO_SMTP_PASSWORD is a valid Brevo SMTP API Key (and not regular login password).");
      console.log("      3. Ensure no trailing space, backslash, or single-quote wrapper marks are stored in Railway Env settings.");
    } else {
      console.log("  ⚠️  HANDSHAKE PROTOCOL STALL:");
      console.log("    - SMTP target was reached but rejected/stalled protocol handshakes.");
      console.log("    - Check the protocol log transcript segment above for exact SMTP code replies.");
    }
  } else if (results.nodemailerVerify.status === "SUCCESS") {
    console.log("  🟢  CHANNEL STATUS ACTIVE:");
    console.log("    - Outgoing relay email transport verified clean and operational.");
    console.log("    - Standard user submissions or notification trigger files will transmit successfully.");
  } else {
    console.log("  🟡  SIMULATION MODE CONFIG:");
    console.log("    - Diagnostic skipped because SMTP coordinates aren't defined. The application runs local DB simulations.");
  }
  console.log("======================================================================\n");

  return results;
}

// Support executing directly if run from CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, "/"))) {
  runSmtpDiagnostics().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error("Diagnostic execution failed:", err);
    process.exit(1);
  });
}
