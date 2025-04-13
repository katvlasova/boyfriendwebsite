'use client';

interface YouTubeEmbedProps {
  url: string | null;
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    return null;
  }
  return null;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  if (!url) return null;
  
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
} 