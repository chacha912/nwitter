import { useEffect, useState, useRef } from 'react';
import { dbService, collection, addDoc, onSnapshot } from 'fbase';
import { Nweet } from 'components';

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');
  const inputFileRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(dbService, 'nweets'), {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setNweet('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    inputFileRef.current.value = '';
    setAttachment('');
  };

  useEffect(() => {
    onSnapshot(collection(dbService, 'nweets'), (querySnapshot) => {
      const nweetArray = [];
      querySnapshot.forEach((doc) => {
        nweetArray.unshift({ ...doc.data(), id: doc.id });
      });
      setNweets(nweetArray);
    });
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
        <input ref={inputFileRef} type='file' accept='image/*' onChange={onFileChange} />
        <button type='submit'>Nweet</button>
        {attachment && (
          <div>
            <img src={attachment} width='100px' alt='preview' />
            <button type='button' onClick={onClearAttachment}>
              Clear
            </button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </>
  );
};

export default Home;
