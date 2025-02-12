// Test script for Code Review MCP
const testCode = `
function processData(data) {
  var results = [];
  
  data.forEach(function(item) {
    if (item.value == null) return;
    
    try {
      var processed = eval(item.value);
      results.push(processed);
    } catch(e) {
      console.log('Error processing item:', e);
    }
  });
  
  return results;
}

// Add event listener without cleanup
document.addEventListener('click', function() {
  processData([
    { value: '1 + 2' },
    { value: 'invalid code' },
    { value: null }
  ]);
});
`;

// Send test code to MCP server
process.stdin.write(JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'call_tool',
  params: {
    name: 'analyze_code',
    arguments: {
      code: testCode,
      language: 'javascript'
    }
  }
}) + '\n');

// Handle response
let buffer = '';
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  
  // Try to parse complete JSON messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    try {
      const response = JSON.parse(line);
      if (response.result) {
        const analysis = JSON.parse(response.result.content[0].text);
        console.log('Code Analysis Results:');
        console.log(JSON.stringify(analysis, null, 2));
        process.exit(0);
      } else if (response.error) {
        console.error('Error:', response.error);
        process.exit(1);
      }
    } catch (error) {
      console.error('Failed to parse response:', error);
    }
  }
});
