export const shareContent = async (title: string, text: string) => {
  const fallbackUrl = "https://zenithmind.vercel.app/";

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: fallbackUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    const shareText = `${title}\n${text}\n${fallbackUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
      console.log("Content copied to clipboard:", shareText);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }
};