const FeedItem = ({ item }) => {
    return (
        <div className="feed-item">
            <b>{item.overs}</b>  <span>{item.comment}</span>
            <hr style={{border:"0.1px solid #ddd"}}/>
        </div>)
}

export default FeedItem;