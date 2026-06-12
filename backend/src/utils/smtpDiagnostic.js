import "../config/loadEnv.js";
import dns from "dns";
import net from "net";
import { Resend } from "resend";

// Helper to sanitize env variables
const sanitizeEnv = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^['"]|['"]$/g, "").trim();
};

export async function runSmtpDiagnostics() {
  const host = "api.resend.com";
  const port = 443;
  const apiKey = sanitizeEnv(process.env.RESEND_API_KEY);

  const results = {
    envLoad: { status: "UNKNOWN", message: "" },
    dnsLookup: { status: "UNKNOWN", ips: [], message: "" },
    tcpConnect: { status: "UNKNOWN", message: "", details: null },
    nodemailerVerify: { status: "UNKNOWN", message: "", consoleLogs: [] }
  };

  console.log("\n======================================================================");
  console.log("🔍 [RESEND REST API DIAGNOSTICS SUITE] STARTING FULL CHANNEL AUDIT");
  console.log("======================================================================");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Host Configured: "${host}"`);
  console.log(`Port Configured: ${port}`);
  console.log(`API Key: "${apiKey ? apiKey.substring(0, 10) + "..." : "MISSING"}"`);
  console.log("======================================================================\n");

  // --- STEP 1: ENV CHECK ---
  console.log("👉 STEP 1: Verifying Environment Variable Injection...");
  if (!apiKey) {
    results.envLoad = {
      status: "WARNING",
      message: "Resend API Key (RESEND_API_KEY) is not defined. Email dispatch is running in Simulation Mode."
    };
    console.log("⚠️  Environment load warning: RESEND_API_KEY is missing.");
  } else {
    results.envLoad = {
      status: "SUCCESS",
      message: "RESEND_API_KEY environment variable loaded successfully."
    };
    console.log("✅ Credentials loaded safely.");
  }

  // --- STEP 2: DNS CHECK ---
  console.log("\n👉 STEP 2: Resolving Resend API Host via DNS...");
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
    console.log(`✅ DNS Lookup passed. Resend API Host resolved successfully: ${addresses.join(", ")}`);
  } catch (dnsErr) {
    results.dnsLookup = {
      status: "FAILED",
      ips: [],
      message: `DNS resolution failed for ${host}. Error: ${dnsErr.message || dnsErr}`
    };
    console.log(`❌ DNS Lookup failed! Details: ${dnsErr.message}`);
  }

  // --- STEP 3: TCP HANDSHAKE SOCKET CHECK ---
  console.log("\n👉 STEP 3: Attempting Direct TCP HTTPS Handshake Socket Connection...");
  if (results.dnsLookup.status === "SUCCESS" && results.dnsLookup.ips.length > 0) {
    const targetIp = results.dnsLookup.ips[0];
    const timeoutMs = 8000;

    await new Promise((resolve) => {
      console.log(`Connecting directly to target socket ${targetIp}:${port} (Timeout: ${timeoutMs}ms)...`);
      const socket = new net.Socket();
      
      const timer = setTimeout(() => {
        results.tcpConnect = {
          status: "FAILED",
          message: `TCP Connection to ${host}:${port} timed out after ${timeoutMs}ms. This strongly indicates severe outbound network rules blocking standard traffic.`,
          details: { code: "ETIMEDOUT" }
        };
        console.log(`❌ TCP Handshake timed out!`);
        socket.destroy();
        resolve();
      }, timeoutMs);

      socket.connect(port, targetIp, () => {
        clearTimeout(timer);
        results.tcpConnect = {
          status: "SUCCESS",
          message: `TCP socket successfully established with ${targetIp}:${port}. HTTPS traffic to Resend API is reachable.`
        };
        console.log(`✅ TCP Handshake success! Target socket ${targetIp}:${port} is reachable.`);
        socket.end();
        resolve();
      });

      socket.on("error", (err) => {
        clearTimeout(timer);
        results.tcpConnect = {
          status: "FAILED",
          message: `TCP Socket connection failed. Error: ${err.message}`,
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
    console.log("⏭️  TCP Handshake step skipped.");
  }

  // --- STEP 4: RESEND REST API KEY AUTH VALIDITY CHECK ---
  console.log("\n👉 STEP 4: Authenticating REST API Session Handshake...");
  if (apiKey && results.dnsLookup.status === "SUCCESS") {
    const debugLogs = [];
    try {
      debugLogs.push(`[INFO] Initializing Resend API client with provided key...`);
      const resend = new Resend(apiKey);
      
      debugLogs.push(`[INFO] Dispatching domains.list() fetch validation to Resend endpoint...`);
      const response = await resend.domains.list();
      
      if (response.error) {
        throw new Error(response.error.message || JSON.stringify(response.error));
      }

      debugLogs.push(`[INFO] Domains lists retrieved successfully.`);
      const domainsCount = response.data?.data?.length || 0;
      debugLogs.push(`[INFO] Verified domains counts under account: ${domainsCount}`);

      results.nodemailerVerify = {
        status: "SUCCESS",
        message: `Resend REST API handshake succeeded! Validated API key and retrieved ${domainsCount} domain(s).`,
        consoleLogs: debugLogs
      };
      console.log("✅ Resend REST API authenticated successfully!");
    } catch (verifyErr) {
      debugLogs.push(`[ERROR] Verification threw: ${verifyErr.message}`);
      results.nodemailerVerify = {
        status: "FAILED",
        message: `Resend REST API key check failed: ${verifyErr.message}`,
        details: { code: verifyErr.code },
        consoleLogs: debugLogs
      };
      console.log(`❌ Resend REST API verification failed! Error: ${verifyErr.message}`);
    }
  } else {
    results.nodemailerVerify = {
      status: "SKIPPED",
      message: "Skipped due to lack of RESEND_API_KEY or upstream DNS failure."
    };
    console.log("⏭️  Resend REST API diagnostic skipped.");
  }

  // --- PRETTIFY TRANSCRIPTS REPORT ---
  console.log("\n======================================================================");
  console.log("📊 [RESEND REST API DIAGNOSTIC TRANSCRIPT AUDIT MATRIX]");
  console.log("======================================================================");
  console.log(`1. Environment Variable Inject:    [ ${results.envLoad.status} ] - ${results.envLoad.message}`);
  console.log(`2. DNS Hostname Resolution:        [ ${results.dnsLookup.status} ] - ${results.dnsLookup.message}`);
  console.log(`3. Direct TCP Socket Handshake:    [ ${results.tcpConnect.status} ] - ${results.tcpConnect.message}`);
  console.log(`4. REST API Handshake:             [ ${results.nodemailerVerify.status} ] - ${results.nodemailerVerify.message}`);
  console.log("======================================================================\n");

  return results;
}
