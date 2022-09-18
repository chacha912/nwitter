import { useEffect, useState, useRef } from 'react';
import { dbService, collection, addDoc, onSnapshot, storageService, ref, uploadString, getDownloadURL } from 'fbase';
import { Nweet } from 'components';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');
  const inputFileRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let attachmentUrl = '';
      if (attachment !== '') {
        const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        await uploadString(attachmentRef, attachment, 'data_url');
        attachmentUrl = await getDownloadURL(attachmentRef);
      }

      await addDoc(collection(dbService, 'nweets'), {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      });

      setNweet('');
      clearAttachment();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const clearAttachment = () => {
    inputFileRef.current.value = '';
    setAttachment('');
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
            <button type='button' onClick={clearAttachment}>
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
