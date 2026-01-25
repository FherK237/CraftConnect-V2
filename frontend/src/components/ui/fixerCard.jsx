function fixerCard({ name, job, rating, onChatClick}) {
    return (
        <div className="Card-border">
            <h3>{name}</h3>
            <p className="text-gray">{job}</p>
            <span>{rating}</span>

            <button onClick={onChatClick}>Chatear</button>
        </div>
    )
}

export default fixerCard