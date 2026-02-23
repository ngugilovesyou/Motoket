import { Share2 } from "lucide-react";
import { toast } from "react-toastify";
const ShareButton = ({ vehicleSlug }) => {
  const handleShare = async () => {
    const url = `${window.location.origin}/details/${vehicleSlug}/`;

    // Modern browsers support Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this vehicle",
          text: "Check out this vehicle listing!",
          url,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
};

export default ShareButton;
