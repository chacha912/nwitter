import { doc, deleteDoc, dbService, updateDoc } from 'fbase';
import { useState } from 'react';

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      const data = await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
      console.log(data);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type='text' value={newNweet} onChange={onChange} required />
            <button type='submit'>Update Nweet</button>
            <button type='button' onClick={toggleEditing}>
              Cancel
            </button>
          </form>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width='100px' alt='nweet' />}
          {isOwner && (
            <>
              <button type='button' onClick={onDeleteClick}>
                Delete Nweet
              </button>
              <button type='button' onClick={toggleEditing}>
                Edit Nweet
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
