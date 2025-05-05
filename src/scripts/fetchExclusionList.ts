import axios from "axios";
import { Octokit } from "octokit";
import fs from "fs";
import path from "path";

// Initialize GitHub API client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
});

const REPO_OWNER = "DefiLlama";
const REPO_NAME = "yield-server";
const EXCLUDE_FILE = "src/utils/exclude.js";
const DATA_OUTPUT_DIR = path.join(__dirname, "../../data");

/**
 * Fetch exclusion list from DefiLlama yield-server repository
 */
async function fetchExclusionList(): Promise<string[]> {
  try {
    console.log("Fetching exclusion list from DefiLlama yield-server repo...");

    // Get the exclusion file
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: EXCLUDE_FILE,
    });

    if (Array.isArray(fileData) || !fileData.download_url) {
      throw new Error("Failed to get exclusion file content");
    }

    // Download the file content
    const content = await axios.get(fileData.download_url);
    const fileContent = content.data;

    // Extract the exclusion list
    const excludedProtocols = extractExcludedProtocols(fileContent);

    // Save the exclusion list
    saveExclusionList(excludedProtocols);

    console.log(
      `Successfully extracted ${excludedProtocols.length} excluded protocols`
    );
    return excludedProtocols;
  } catch (error) {
    console.error("Error fetching exclusion list:", error);
    return [];
  }
}

/**
 * Extract the list of excluded protocols from the file content
 */
function extractExcludedProtocols(fileContent: string): string[] {
  try {
    // Extract the exclusion array
    const excludeListMatch = fileContent.match(
      /const\s+excludeAdaptors\s*=\s*\[([\s\S]*?)\]/
    );

    if (!excludeListMatch || !excludeListMatch[1]) {
      console.warn("Could not find exclusion list in file content");
      return [];
    }

    const listContent = excludeListMatch[1].trim();

    // Match all strings in the array
    const protocolMatches = listContent.match(/['"]([^'"]+)['"]/g) || [];

    // Extract the protocol names and clean them
    const protocols = protocolMatches.map((match) =>
      match.replace(/['"]/g, "")
    );

    return protocols;
  } catch (error) {
    console.error("Error extracting excluded protocols:", error);
    return [];
  }
}

/**
 * Save the exclusion list to a JSON file
 */
function saveExclusionList(excludedProtocols: string[]) {
  // Create directory if it doesn't exist
  if (!fs.existsSync(DATA_OUTPUT_DIR)) {
    fs.mkdirSync(DATA_OUTPUT_DIR, { recursive: true });
  }

  // Save to file
  const outputPath = path.join(DATA_OUTPUT_DIR, "excluded-protocols.json");
  fs.writeFileSync(outputPath, JSON.stringify(excludedProtocols, null, 2));

  console.log(
    `Saved ${excludedProtocols.length} excluded protocols to ${outputPath}`
  );
}

// Execute if run directly
if (require.main === module) {
  fetchExclusionList().catch(console.error);
}

export { fetchExclusionList };
