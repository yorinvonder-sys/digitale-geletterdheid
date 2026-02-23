
const responseText = `Wat een leuk idee! Laten we beginnen.

[TITLE]De Avonturen van de Verloren Vlieger[/TITLE]

[PAGE] Er was eens een kleine jongen die dol
was op vliegeren. Op een dag woei de wind zo
hard, dat zijn vlieger ontsnapte! [/PAGE]

[IMG target="cover"]illustration of a lost kite
in the sky, children book style, no text[/IMG]
[IMG target="1"]boy looking at sky where kite
is flying away, children book style, no
text[/IMG]`;

console.log("Original:", responseText);

// Test TITLE Regex
let processed = responseText;
const titleRegex = /\[TITLE\]([\s\S]*?)\[\/TITLE\]/gi;
processed = processed.replace(titleRegex, '(TITLE REMOVED)');

// Test PAGE Regex
const pageRegex = /\[PAGE(?:\s+target=["']?(\d+)["']?)?\]([\s\S]*?)\[\/PAGE\]/gi;
processed = processed.replace(pageRegex, '(PAGE REMOVED)');

// Test IMG Regex (from code line 352)
// const imgRegex = /\[IMG\s+target=["']?\s*([^"'>\]]+)\s*["']?\]([\s\S]*?)\[\/IMG\]/gi;
// The one used for cleanup at line 468 is different:
const cleanupImgRegex = /\[IMG\s+[^\]]*\][\s\S]*?\[\/IMG\]/gi;

processed = processed.replace(cleanupImgRegex, '(IMG REMOVED)');

console.log("---------------------------------------------------");
console.log("Processed:", processed);

// Test the specific IMG regex used for extraction
const extractImgRegex = /\[IMG\s+target=["']?\s*([^"'>\]]+)\s*["']?\]([\s\S]*?)\[\/IMG\]/gi;
let match;
while ((match = extractImgRegex.exec(responseText)) !== null) {
    console.log("Found Image:", match[1], match[2].substring(0, 20));
}
