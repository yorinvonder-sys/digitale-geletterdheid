const fs = require('fs');
const content = fs.readFileSync(process.argv[2], 'utf8');

function checkBalance(text) {
    const stack = [];
    const lines = text.split('\n');
    let inString = false;
    let stringChar = '';
    let inComment = false; // Block comment

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Handle comments and strings roughly
        if (inComment) {
            if (char === '*' && text[i + 1] === '/') {
                inComment = false;
                i++;
            }
            continue;
        }
        if (inString) {
            if (char === '\\') { i++; continue; }
            if (char === stringChar) { inString = false; }
            continue;
        }

        if (char === '/' && text[i + 1] === '*') {
            inComment = true;
            i++;
            continue;
        }
        if (char === '/' && text[i + 1] === '/') {
            // Line comment, skip to newline
            while (i < text.length && text[i] !== '\n') i++;
            continue;
        }
        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
            continue;
        }

        if (['{', '(', '['].includes(char)) {
            stack.push({ char, index: i });
        } else if (['}', ')', ']'].includes(char)) {
            if (stack.length === 0) {
                console.log(`Error: Unexpected '${char}' at index ${i}`);
                printContext(text, i);
                return;
            }
            const last = stack.pop();
            const expected = last.char === '{' ? '}' : last.char === '(' ? ')' : ']';
            if (char !== expected) {
                console.log(`Error: Mismatched '${char}' at index ${i}. Expected '${expected}' closing '${last.char}' from index ${last.index}`);
                printContext(text, i);
                printContext(text, last.index, "Start:");
                return;
            }
        }
    }

    if (stack.length > 0) {
        const last = stack[stack.length - 1];
        console.log(`Error: Unclosed '${last.char}' at index ${last.index}`);
        printContext(text, last.index);
    } else {
        console.log("All braces balanced.");
    }
}

function printContext(text, index, label = "Context:") {
    const lines = text.substring(0, index).split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    console.log(`${label} Line ${lineNum}, Col ${colNum}`);

    // Show line content
    const allLines = text.split('\n');
    console.log(`${lineNum}: ${allLines[lineNum - 1]}`);
}

checkBalance(content);
