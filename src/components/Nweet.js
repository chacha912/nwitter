import { doc, deleteDoc, dbService } from 'fbase';

const Nweet = ({ nweetObj, isOwner }) => {
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      const data = await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
      console.log(data);
    }
  };

  return (
    <div>
      <h4>{nweetObj.text}</h4>
      {isOwner && (
        <>
          <button type='button' onClick={onDeleteClick}>
            Delete Nweet
          </button>
          <button type='button'>Edit Nweet</button>
        </>
      )}
    </div>
  );
};

export default Nweet;
