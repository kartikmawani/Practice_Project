import dns from "node:dns/promises";

export interface MxVerificationResult {
  isValid: boolean;
  domain: string;
  exchange?: string;
  error?: string;
}

/**
 * Pre-flight DNS MX record verifier to prevent hard email bounces.
 */
export async function verifyDomainMx(email: string): Promise<MxVerificationResult> {
  // 1. Basic sanitization and domain extraction
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { isValid: false, domain: "", error: "Malformed email address" };
  }

  const parts = email.trim().toLowerCase().split("@");
  const domain = parts[parts.length - 1]; // Handles multiple '@' edge cases

  // 2. Validate domain format (must have at least one dot and valid chars)
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return { isValid: false, domain, error: "Invalid domain syntax" };
  }

  // 3. DNS MX Record Resolution
  try {
    const records = await dns.resolveMx(domain);

    // Domain is deliverable only if at least one active mail exchange server exists
    if (!records || records.length === 0) {
      return { isValid: false, domain, error: "No MX records found (Parked domain)" };
    }

    // Sort by priority (lowest number = highest priority server)
    records.sort((a, b) => a.priority - b.priority);

    return {
      isValid: true,
      domain,
      exchange: records[0].exchange,
    };

  } catch (err: any) {
    // Gracefully catch specific DNS resolver error codes
    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      return { isValid: false, domain, error: `Domain has no active mail infrastructure (${err.code})` };
    }
    
    if (err.code === "ETIMEOUT") {
      return { isValid: false, domain, error: "DNS lookup timed out" };
    }

    return { isValid: false, domain, error: err.message || "DNS resolution failed" };
  }
}