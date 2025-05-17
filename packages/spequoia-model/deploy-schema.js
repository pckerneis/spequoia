/* Include schema/spequoia.json into the website */
const fs = require('fs');
const path = require('path');

const startMarker = '<!-- RAW_SCHEMA_START -->';
const endMarker = '<!-- RAW_SCHEMA_END -->';
const schemaPath = path.join(__dirname, 'schema', 'spequoia.json');
const outputPath = path.join(__dirname, '..', 'website', 'schema.md');

// Read the schema file
const schema = fs.readFileSync(schemaPath, 'utf8');

// Wrap the schema in a code block
const wrappedSchema = '\n```json\n' + schema + '\n```\n';

// Read the output file
let output = fs.readFileSync(outputPath, 'utf8');

// Find the start and end markers
const startPos = output.indexOf(startMarker) + startMarker.length;
const endPos = output.indexOf(endMarker);

// Check if the markers are found
if (startPos === -1 || endPos === -1) {
  console.error('Markers not found in the output file');
  process.exit(1);
}

// Replace the content between the markers
output = output.slice(0, startPos) + wrappedSchema + output.slice(endPos);

// Write the updated content back to the output file
fs.writeFileSync(outputPath, output, 'utf8');