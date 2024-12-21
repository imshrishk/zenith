export const shareContent = async (title: string, text: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback to copying to clipboard
    const shareText = `${title}\n${text}\n${window.location.href}`;
    await navigator.clipboard.writeText(shareText);
  }
};