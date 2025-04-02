// This script will run after the page loads and standardize all code blocks
// It directly manipulates the DOM to ensure consistent structure and behavior
document.addEventListener('DOMContentLoaded', function() {
    console.log("Standardizing all code blocks...");
    
    // Wait for content to load
    setTimeout(function() {
        // Find all code blocks
        const codeBlocks = document.querySelectorAll('.code-block');
        console.log(`Found ${codeBlocks.length} code blocks to standardize`);
        
        codeBlocks.forEach(function(block, index) {
            try {
                // Check for required elements
                let header = block.querySelector('.code-header');
                let content = block.querySelector('.code-content');
                let toggle = header ? header.querySelector('.toggle-btn') : null;
                let codeElement = content ? content.querySelector('code') : null;
                
                // Fix missing header
                if (!header) {
                    console.log(`Block #${index} missing header, creating one`);
                    header = document.createElement('div');
                    header.className = 'code-header';
                    
                    // Create a title span
                    const span = document.createElement('span');
                    span.textContent = 'Code Block';
                    header.appendChild(span);
                    
                    // Insert at beginning of block
                    block.insertBefore(header, block.firstChild);
                }
                
                // Fix missing toggle button
                if (!toggle) {
                    console.log(`Block #${index} missing toggle button, creating one`);
                    toggle = document.createElement('div');
                    toggle.className = 'toggle-btn';
                    toggle.textContent = '−';
                    toggle.style.cursor = 'pointer';
                    
                    // Add event listener
                    toggle.addEventListener('click', function(e) {
                        if (window.toggleCodeBlock) {
                            window.toggleCodeBlock(this, e);
                        }
                    });
                    
                    // Add to header
                    header.appendChild(toggle);
                }
                
                // Fix missing content div
                if (!content) {
                    console.log(`Block #${index} missing content div, creating one`);
                    content = document.createElement('div');
                    content.className = 'code-content';
                    content.style.display = 'block';
                    
                    // Move all remaining content into this div
                    while (block.children.length > 1) {
                        content.appendChild(block.children[1]);
                    }
                    
                    // Add to block
                    block.appendChild(content);
                }
                
                // Ensure code has language class for Python
                if (codeElement && !codeElement.className.includes('language-')) {
                    // Check if it looks like Python code
                    const codeText = codeElement.textContent;
                    if (codeText.includes('def ') || codeText.includes('class ') || 
                        codeText.includes('import ') || codeText.includes('#') ||
                        codeText.includes('"""')) {
                        console.log(`Block #${index} looks like Python, adding language class`);
                        codeElement.className = 'language-python';
                    }
                }
                
                // Always make sure content is displayed
                content.style.display = 'block';
                
                // Ensure toggle button has correct text
                toggle.textContent = '−';
                
            } catch (e) {
                console.error(`Error standardizing block #${index}:`, e);
            }
        });
        
        // Force rehighlight all code
        if (window.Prism) {
            console.log("Re-running syntax highlighting");
            Prism.highlightAll();
        }
    }, 1000); // Wait a second for content to fully load
}); 