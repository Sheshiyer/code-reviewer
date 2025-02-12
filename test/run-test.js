import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Start the MCP server
const server = spawn('node', [join(__dirname, '../dist/index.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Handle server output
// Buffer for incomplete JSON messages
let buffer = '';

server.stdout.on('data', (data) => {
  console.log('Raw output:', data.toString());
  buffer += data.toString();
  
  // Try to parse complete JSON messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    try {
      if (!line.trim()) continue;
      
      const response = JSON.parse(line);
      console.log('Parsed response:', response);
      
      if (response.result) {
        const analysis = JSON.parse(response.result.content[0].text);
        console.log('Code Analysis Results:');
        console.log(JSON.stringify(analysis, null, 2));
        server.kill();
        process.exit(0);
      } else if (response.error) {
        console.error('Error:', response.error);
        server.kill();
        process.exit(1);
      }
    } catch (error) {
      console.log('Parse error for line:', line);
      console.error('Parse error:', error);
    }
  }
});

server.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString());
});

// Handle server exit
server.on('exit', (code) => {
  console.log('Server exited with code:', code);
  process.exit(code || 1);
});

// Send requests after a short delay to ensure server is ready
setTimeout(() => {
  // First list available tools
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'list_tools',
    params: {}
  };

  console.log('Sending list_tools request...');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  // Then send the analysis request after another delay
  setTimeout(() => {
    const analyzeRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'call_tool',
      params: {
        name: 'analyze_code',
        arguments: {
          code: testCode,
          language: 'javascript'
        }
      }
    };

    console.log('Sending analyze_code request...');
    server.stdin.write(JSON.stringify(analyzeRequest) + '\n');
  }, 500);
}, 1000);
