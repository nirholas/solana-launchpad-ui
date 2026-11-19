// Copy buttons next to command snippets.
for (const button of document.querySelectorAll('.copy')) {
  button.addEventListener('click', async () => {
    const text = button.previousElementSibling.textContent.trim();
    const label = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Press Ctrl+C';
    }
    setTimeout(() => { button.textContent = label; }, 1400);
  });
}
