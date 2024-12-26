export const shareContent = async (title: string, text: string) => {
  const shareUrl = "https://zenithmind.vercel.app/";
  
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
    } catch (error) {
    }
  } else {
    const shareText = `${title}\n${text}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (error) {
    }
  }
};