import axios from "axios";

// 1. Immutable Blacklist Sets
const BLACKLISTED_DIRECTORIES = [
  "node_modules",
  "test",
  "tests",
  "dist",
  "build",
  ".git",
  ".next",
  "coverage"
] as const;

const BLACKLISTED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".exe",
  ".svg",
  ".ico",
  ".lock",
  ".gitignore",
  ".min.js",
  ".map"
] as const;

// 2. GitHub API Type Contracts
interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

/**
 * Fetches and filters a repository file tree in a single in-memory pass.
 */
export async function filterRepositoryTree(
  owner: string,
  repo: string,
  branch: string = "main",
  token?: string
): Promise<GitHubTreeItem[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    const response = await axios.get<GitHubTreeResponse>(url, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      timeout: 8000, // 8-second circuit breaker
    });

    if (!response.data?.tree || !Array.isArray(response.data.tree)) {
      throw new Error("Invalid response format: 'tree' array not found.");
    }
    // you can use filter with && to remove intermediate array to prevent heap memory overload
    // Single-pass O(N * K) filter combining all gates
    // const prunedTree = response.data.tree.filter((item) => {
    //   // Gate 1: Exclude folder nodes directly (keep only file blobs)
    //   if (item.type !== "blob") return false;

    //   const pathLower = item.path.toLowerCase();
    //   const pathSegments = pathLower.split("/");

    //   // Gate 2: Exclude blacklisted directories
    //   const isInBlacklistedDir = BLACKLISTED_DIRECTORIES.some((dir) =>
    //     pathSegments.includes(dir)
    //   );
    //   if (isInBlacklistedDir) return false;

    //   // Gate 3: Exclude non-code or static asset extensions
    //   const hasBlacklistedExtension = BLACKLISTED_EXTENSIONS.some((ext) =>
    //     pathLower.endsWith(ext)
    //   );
    //   if (hasBlacklistedExtension) return false;

    //   return true;
    // });

    return prunedTree;

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      throw new Error(`GitHub API Error [${status}]: ${message}`);
    }
    
    throw new Error(`Tree filtration failed: ${err.message}`);
  }
}