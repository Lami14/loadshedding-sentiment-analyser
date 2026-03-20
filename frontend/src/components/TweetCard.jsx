export default function TweetCard({ tweet }) {
  const labelIcons = { positive: "😊", negative: "😤", neutral: "😐" };

  return (
    <div className="tweet-card" style={{ borderLeft: `4px solid ${tweet.color}` }}>
      <div className="tweet-header">
        <span className="tweet-label" style={{ backgroundColor: tweet.color }}>
          {labelIcons[tweet.label]} {tweet.label_display.split(" ")[0]}
        </span>
        <span className="tweet-score">{tweet.score}%</span>
      </div>
      <p className="tweet-text">"{tweet.original_text}"</p>
    </div>
  );
}
