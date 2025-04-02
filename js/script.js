// Theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the theme toggle checkbox
    const toggleSwitch = document.getElementById('checkbox');
    const themeLabel = document.querySelector('.theme-label');
    
    // Function to set theme
    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeLabel.textContent = isDark ? 'Dark Mode' : 'Light Mode';
        
        // Enable/disable the appropriate Prism theme
        const darkTheme = document.getElementById('prism-theme-dark');
        const lightTheme = document.getElementById('prism-theme-light');
        
        if (darkTheme && lightTheme) {
            if (isDark) {
                darkTheme.disabled = false;
                lightTheme.disabled = true;
            } else {
                darkTheme.disabled = true;
                lightTheme.disabled = false;
            }
        }
        
        // Force rehighlight after a small delay to allow CSS to update
        if (window.Prism) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    }
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
        toggleSwitch.checked = savedTheme === 'dark';
    } else {
        setTheme(prefersDark);
        toggleSwitch.checked = prefersDark;
    }
    
    // Listen for theme switch changes
    toggleSwitch.addEventListener('change', function(e) {
        setTheme(e.target.checked);
    });
    
    // Also watch for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            // Only auto-switch if user hasn't set a preference
            setTheme(e.matches);
            toggleSwitch.checked = e.matches;
        }
    });
});

// Enhanced Code block toggle functionality
window.toggleCodeBlock = function(button, event) {
    try {
        // Make sure the event doesn't bubble up
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        console.log("Toggle button clicked:", button);
        
        // Find closest code block elements
        const header = button.closest('.code-header');
        const block = header?.closest('.code-block');
        
        if (!block) {
            console.error("Could not find parent code block!", button);
            return false;
        }
        
        const content = block.querySelector('.code-content');
        
        if (!content) {
            console.error("Could not find code content!", block);
            return false;
        }
        
        // Toggle visibility
        const isVisible = content.style.display !== 'none';
        
        console.log("Current visibility:", isVisible ? "visible" : "hidden");
        
        // Update content display
        content.style.display = isVisible ? 'none' : 'block';
        
        // Update button text
        button.textContent = isVisible ? '+' : '−';
        
        console.log("Code block toggled:", isVisible ? "hidden" : "visible");
        
        return false;
    } catch (err) {
        console.error("Error in toggleCodeBlock:", err);
        return false;
    }
};

// Initialize code blocks when content is loaded
document.addEventListener('content-loaded', function() {
    console.log("content-loaded event received, initializing code blocks");
    initializeCodeBlocks();
    
    // Re-run Prism.js highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
});

// Add a mutation observer to detect dynamically added code blocks
document.addEventListener('DOMContentLoaded', function() {
    // Create an observer instance
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain code blocks
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('code-block')) {
                            // Single code block added
                            initializeCodeBlock(node);
                        } else if (node.querySelectorAll) {
                            // Check for code blocks inside added node
                            const codeBlocks = node.querySelectorAll('.code-block');
                            if (codeBlocks.length > 0) {
                                codeBlocks.forEach(initializeCodeBlock);
                                
                                // Re-highlight with Prism.js
                                if (window.Prism) {
                                    Prism.highlightAll();
                                }
                            }
                        }
                    }
                });
            }
        });
    });
    
    // Start observing the document body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Force initialize code blocks when DOM is ready
    setTimeout(function() {
        initializeCodeBlocks();
        if (window.Prism) {
            Prism.highlightAll();
        }
    }, 100);
});

// Function to initialize a single code block
function initializeCodeBlock(block) {
    try {
        console.log("Initializing code block:", block);
        
        // Find all required elements
        const header = block.querySelector('.code-header');
        const content = block.querySelector('.code-content');
        let button = header ? header.querySelector('.toggle-btn') : null;
        
        if (!header || !content) {
            console.warn("Missing essential elements for code block", block);
            return;
        }
        
        // Create toggle button if missing
        if (!button) {
            console.log("Creating missing toggle button");
            button = document.createElement('div');
            button.className = 'toggle-btn';
            button.textContent = '−';
            button.style.cursor = 'pointer';
            header.appendChild(button);
        }
        
        // Ensure content is visible initially
        content.style.display = 'block';
        button.textContent = '−';
        
        // Remove any existing event listeners (to avoid duplicates)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        button = newButton;
        
        // Add a clean event listener for the toggle button
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleCodeBlock(this, e);
        });
        
        // Make header clickable too
        header.addEventListener('click', function(e) {
            // Only trigger if not clicking the button itself
            if (e.target !== button) {
                window.toggleCodeBlock(button, e);
            }
        });
        
        // Check if the code block's content has the language-python class
        const codeElement = content.querySelector('code');
        if (codeElement && !codeElement.className.includes('language-')) {
            // Detect if this might be Python code
            const text = codeElement.textContent || '';
            if (text.includes('def ') || text.includes('class ') || 
                text.includes('import ') || text.includes('#') || 
                text.includes('"""') || text.includes("'''")) {
                console.log("Adding Python language class to code element");
                codeElement.className = 'language-python';
                // Re-highlight this code block
                if (window.Prism) {
                    Prism.highlightElement(codeElement);
                }
            }
        }
        
        console.log("Code block initialized successfully");
        
    } catch (err) {
        console.error("Error initializing code block:", err, block);
    }
}

// Function to initialize all code blocks
function initializeCodeBlocks() {
    console.log("Initializing all code blocks");
    
    // Get all code blocks
    const codeBlocks = document.querySelectorAll('.code-block');
    console.log(`Found ${codeBlocks.length} code blocks to initialize`);
    
    // Initialize each code block
    codeBlocks.forEach(initializeCodeBlock);
} 