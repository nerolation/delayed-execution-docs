// Script to ensure all code blocks are properly initialized
document.addEventListener('DOMContentLoaded', function() {
  // Force re-initialize all code blocks
  console.log("Forcing code block initialization");
  
  // Set a timeout to give the page time to load content
  setTimeout(function() {
    var codeBlocks = document.querySelectorAll('.code-block');
    console.log("Found " + codeBlocks.length + " code blocks");
    
    codeBlocks.forEach(function(block) {
      // Ensure the content is visible
      var content = block.querySelector('.code-content');
      if (content) {
        content.style.display = 'block';
      }
      
      // Ensure the toggle button has the right text
      var button = block.querySelector('.toggle-btn');
      if (button) {
        button.textContent = '−';
        
        // Add event listener
        button.addEventListener('click', function(e) {
          window.toggleCodeBlock(this, e);
        });
      }
    });
    
    // Force Prism to highlight all code
    if (window.Prism) {
      console.log("Re-running Prism.highlightAll()");
      Prism.highlightAll();
    }
  }, 500);
});
